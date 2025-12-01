from cryptography.fernet import Fernet

ACTIVE_KEY = None

def set_active_key(key: bytes):
    global ACTIVE_KEY
    ACTIVE_KEY = key

def clear_active_key():
    global ACTIVE_KEY
    ACTIVE_KEY = None

def encrypt(data: bytes) -> bytes:
    if ACTIVE_KEY is None:
        raise PermissionError("App locked")
    return Fernet(ACTIVE_KEY).encrypt(data)

def decrypt(data: bytes) -> bytes:
    if ACTIVE_KEY is None:
        raise PermissionError("App locked")
    return Fernet(ACTIVE_KEY).decrypt(data)