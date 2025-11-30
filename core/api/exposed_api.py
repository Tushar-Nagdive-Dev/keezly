import json
from core.security.lock_manager import unlock_app, lock_app
from core.storage.item_repository import get_all_items, save_item
import secrets, string, pyperclip

class ExposedApi:
    def unlock_app(self, password):
        return unlock_app(password)

    def lock_app(self):
        return lock_app()

    def get_all_items(self):
        return get_all_items()

    def add_or_update_item(self, item_json):
        return save_item(json.loads(item_json))

    def generate_password(self, length=16, complexity="medium"):
        chars = string.ascii_letters + string.digits
        if complexity in ("medium", "high"):
            chars += string.punctuation
        return {"password": "".join(secrets.choice(chars) for _ in range(length))}

    def copy_to_clipboard(self, text):
        try:
            pyperclip.copy(text)
            return {"success": True}
        except:
            return {"success": False}