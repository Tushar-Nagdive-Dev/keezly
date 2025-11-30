import json
from core.security.key_derivation import derive_key
from core.security.crypto_engine import set_active_key, clear_active_key
from core.storage.file_store import load_file_decrypted

def unlock_app(password: str):
    key = derive_key(password)
    set_active_key(key)

    try:
        items = load_file_decrypted()
        return {"success": True, "item_count": len(items)}
    except Exception:
        clear_active_key()
        return {"success": False, "message": "Invalid password or corrupted data"}

def lock_app():
    clear_active_key()
    return {"success": True}