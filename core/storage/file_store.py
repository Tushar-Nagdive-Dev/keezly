import json
import os
from core.config import DATA_PATH
from core.security.crypto_engine import encrypt, decrypt

def load_file_raw():
    if not os.path.exists(DATA_PATH):
        return b''
    return open(DATA_PATH, 'rb').read()

def load_file_decrypted():
    raw = load_file_raw()
    if not raw:
        return []
    decrypted = decrypt(raw)
    return json.loads(decrypted.decode())

def save_file_encrypted(items: list):
    encrypted = encrypt(json.dumps(items).encode())
    with open(DATA_PATH, 'wb') as f:
        f.write(encrypted)