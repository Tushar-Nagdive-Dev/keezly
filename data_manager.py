import os
import json
from base64 import urlsafe_b64encode
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

# --- CONFIGURATION ---
SALT_FILE = 'salt.key'
DATA_PATH = None

# Global variable to hold the active key after successful unlock
ACTIVE_ENCRYPTION_KEY = None

# --- SECURE KEY DERIVATION (PBKDF2) ---

def get_or_create_salt(base_dir):
    """Reads the salt from file or generates a new one."""
    global SALT_FILE
    salt_path = os.path.join(base_dir, SALT_FILE)
    
    if os.path.exists(salt_path):
        with open(salt_path, 'rb') as f:
            return f.read()
    else:
        salt = os.urandom(16)
        with open(salt_path, 'wb') as f:
            f.write(salt)
        return salt

def derive_key(master_password, base_dir):
    """Derives a Fernet encryption key from the user's master password and salt."""
    salt = get_or_create_salt(base_dir)
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=480000,
    )
    key = urlsafe_b64encode(kdf.derive(master_password.encode('utf-8')))
    return key

# --- ENCRYPTION/DECRYPTION ---

def encrypt_data(data):
    """Encrypts data using the ACTIVE_ENCRYPTION_KEY."""
    if ACTIVE_ENCRYPTION_KEY is None:
        raise PermissionError("Application locked. Cannot encrypt.")
        
    f = Fernet(ACTIVE_ENCRYPTION_KEY)
    json_data = json.dumps(data, indent=4).encode('utf-8')
    return f.encrypt(json_data)

def decrypt_data(encrypted_data):
    """Decrypts data using the ACTIVE_ENCRYPTION_KEY."""
    if ACTIVE_ENCRYPTION_KEY is None:
        raise PermissionError("Application locked. Cannot decrypt.")
        
    f = Fernet(ACTIVE_ENCRYPTION_KEY)
    decrypted_bytes = f.decrypt(encrypted_data)
    return json.loads(decrypted_bytes.decode('utf-8'))

# --- SECURE FILE I/O ---

def load_data_secure():
    """Loads, decrypts, and returns all data items."""
    if not DATA_PATH:
        raise RuntimeError("Data path not initialized.")
        
    if not os.path.exists(DATA_PATH):
        return []
    
    with open(DATA_PATH, 'rb') as f:
        encrypted_data = f.read()
    
    # Check if the file is empty (created on first run)
    if not encrypted_data:
        return []
        
    return decrypt_data(encrypted_data)

def save_data_secure(data):
    """Encrypts and writes all data to the local JSON file."""
    if not DATA_PATH:
        raise RuntimeError("Data path not initialized.")
        
    # Standard check: must be unlocked to save encrypted data
    if ACTIVE_ENCRYPTION_KEY is None:
        raise PermissionError("Application locked. Cannot encrypt.")

    encrypted_data = encrypt_data(data)
    with open(DATA_PATH, 'wb') as f:
        f.write(encrypted_data)

# --- PUBLIC FUNCTIONS (Used by Api Class) ---

def initialize_data_path(path):
    """
    Sets the global data path and ensures the file is created.
    FIX: Only create an empty file if it doesn't exist, do not encrypt it here.
    """
    global DATA_PATH
    DATA_PATH = path
    
    if not os.path.exists(DATA_PATH):
        # Create an empty file (zero bytes) on the first run. 
        # load_data_secure will handle reading an empty file as returning [].
        try:
            with open(DATA_PATH, 'wb') as f:
                 f.write(b'') 
        except Exception as e:
            # Raise an error if we can't create the file, but not a permission error related to the key
            raise RuntimeError(f"Could not create data file at {DATA_PATH}: {e}")

def unlock_application(master_password, base_dir):
    """Attempts to derive key, test decryption, and set the active key."""
    global ACTIVE_ENCRYPTION_KEY
    
    try:
        derived_key = derive_key(master_password, base_dir)
        
        # TEMPORARILY set the key to test decryption
        temp_key = ACTIVE_ENCRYPTION_KEY
        ACTIVE_ENCRYPTION_KEY = derived_key
        
        # Test decryption: if it fails, the password was wrong.
        data = load_data_secure() 
        
        # Decryption succeeded. Key is verified.
        print(f"App unlocked. Found {len(data)} items.")
        return {'success': True, 'item_count': len(data)}
        
    except Exception as e:
        # Decryption failed (wrong password or file integrity error)
        ACTIVE_ENCRYPTION_KEY = temp_key 
        print(f"Unlock failed: {e}")
        return {'success': False, 'message': 'Invalid Master Password or Corrupted Data.'}

def lock_application():
    """Clears the encryption key, locking the application."""
    global ACTIVE_ENCRYPTION_KEY
    ACTIVE_ENCRYPTION_KEY = None
    return {'success': True}

def get_items():
    """Fetches all items from storage."""
    return load_data_secure()

def save_items(items):
    """Saves all items back to storage."""
    save_data_secure(items)