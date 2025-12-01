import os
from base64 import urlsafe_b64encode
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

from core.config import SALT_PATH

def get_or_create_salt():
    if os.path.exists(SALT_PATH):
        return open(SALT_PATH, 'rb').read()

    salt = os.urandom(16)
    with open(SALT_PATH, 'wb') as f:
        f.write(salt)
    return salt

def derive_key(password: str):
    salt = get_or_create_salt()
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=480000
    )
    return urlsafe_b64encode(kdf.derive(password.encode()))