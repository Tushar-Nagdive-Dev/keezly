import os
import sys

APP_NAME = "Keezly"
DATA_FILE = "data.json"
SALT_FILE = "salt.key"

def get_data_directory():
    if getattr(sys, 'frozen', False):
        home = os.path.expanduser("~")
        user_dir = os.path.join(home, ".keezly_data")
        os.makedirs(user_dir, exist_ok=True)
        return user_dir
    else:
        return os.path.dirname(os.path.abspath(__file__))

DATA_DIR = get_data_directory()
DATA_PATH = os.path.join(DATA_DIR, DATA_FILE)
SALT_PATH = os.path.join(DATA_DIR, SALT_FILE)