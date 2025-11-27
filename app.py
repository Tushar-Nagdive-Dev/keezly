# keezly/app.py (Corrected Path Resolution for Py2App)

import os
import sys
import json
import webview
import secrets
import string
import pyperclip 
# Ensure data_manager.py is in the same directory or accessible via PYTHONPATH
from data_manager import (
    initialize_data_path, 
    unlock_application, 
    lock_application, 
    get_items, 
    save_items
)

# --- CONFIGURATION ---
APP_NAME = 'Keezly'
DATA_FILE = 'data.json'
STATIC_ROOT = 'static'
FRONTEND_DIST_NAME = 'browser' 
DATA_MANAGER_BASE_DIR = None 

# --- PATH RESOLUTION (CRITICAL FIX) ---
if getattr(sys, 'frozen', False):
    # This block executes when bundled by py2app.
    # The executable is located at Contents/MacOS/Keezly
    
    exe_dir = os.path.dirname(sys.executable) # Path is .../Keezly.app/Contents/MacOS
    
    # 1. Go up one level to the 'Contents' folder:
    CONTENTS_ROOT = os.path.dirname(exe_dir) # Path is .../Keezly.app/Contents
    
    # 2. Append 'Resources' to the Contents path:
    RESOURCES_ROOT = os.path.join(CONTENTS_ROOT, 'Resources') 
    
    # Now, RESOURCES_ROOT is correctly set to: .../Keezly.app/Contents/Resources
    
    # Data file path (e.g., in Contents/Resources/data.json)
    DATA_PATH = os.path.join(RESOURCES_ROOT, DATA_FILE)
    DATA_MANAGER_BASE_DIR = RESOURCES_ROOT
    
    # Path to Angular assets bundled inside Resources/static/browser
    FRONTEND_DIST_FOLDER = os.path.join(RESOURCES_ROOT, STATIC_ROOT, FRONTEND_DIST_NAME)    
    # 2. CRITICAL CHANGE: PATH TO WRITABLE USER DATA
    # Use the standard user path for application data (~/Library/Application Support/APP_NAME)
    # This location is writable and specific to the user.
    # We will use the user's home folder for simplicity here.
    home_dir = os.path.expanduser("~")
    # A cleaner path is typically ~/Library/Application Support/Keezly/data.json
    # For simplicity, we use the user's home directory for now, but Application Support is preferred.
    
    # A simplified, reliable path for writable files:
    WRITABLE_DATA_DIR = os.path.join(home_dir, '.keezly_data') # Hidden folder in home directory
    
    # Check if the writable folder exists, and create it if not
    if not os.path.exists(WRITABLE_DATA_DIR):
        os.makedirs(WRITABLE_DATA_DIR)
        
    DATA_PATH = os.path.join(WRITABLE_DATA_DIR, DATA_FILE)
    DATA_MANAGER_BASE_DIR = WRITABLE_DATA_DIR 
    

else:
    # Development environment
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATA_MANAGER_BASE_DIR = BASE_DIR
    DATA_PATH = os.path.join(BASE_DIR, DATA_FILE)
    FRONTEND_DIST_FOLDER = os.path.join(BASE_DIR, STATIC_ROOT, FRONTEND_DIST_NAME)


# --- PYTHON API CLASS (Exposed to Angular via PyWebView) ---
class Api:
    
    def unlock_app(self, password):
        return unlock_application(password, DATA_MANAGER_BASE_DIR)

    def lock_app(self):
        return lock_application()

    def get_all_items(self):
        return get_items()

    def add_or_update_item(self, item_json_string):
        try:
            new_item = json.loads(item_json_string)
            data = get_items()
            
            # Simple ID management
            if 'id' not in new_item or new_item['id'] is None:
                new_item['id'] = max([item.get('id', 0) for item in data]) + 1 if data else 1
                data.append(new_item)
            else:
                # Update existing item
                for i, item in enumerate(data):
                    if item['id'] == new_item['id']:
                        data[i] = new_item
                        break
                
            save_items(data)
            return {'success': True, 'item': new_item}
        except PermissionError:
            return {'success': False, 'message': 'Application is locked.'}
        except Exception as e:
            return {'success': False, 'message': str(e)}

    def generate_password(self, length=16, complexity='medium'):
        characters = string.ascii_letters + string.digits 
        if complexity == 'medium':
            characters += string.punctuation
        elif complexity == 'high':
            characters += string.punctuation + "!@#$%^&*" 
            
        password = ''.join(secrets.choice(characters) for _ in range(length))
        return {'password': password}

    def copy_to_clipboard(self, text):
        try:
            pyperclip.copy(text)
            return {'success': True, 'message': 'Copied to clipboard.'}
        except Exception:
            return {'success': False, 'message': 'Clipboard access failed.'}

# --- APPLICATION STARTUP ---
def start_app():
    # 1. Initialize data manager with the correct path 
    try:
        initialize_data_path(DATA_PATH) 
    except Exception as e:
        print(f"FATAL: Could not initialize data path: {e}")
        sys.exit(1)

    # 2. Get the path to the main index.html file
    html_file = os.path.join(FRONTEND_DIST_FOLDER, 'index.html')
    
    if not os.path.exists(html_file):
        print(f"ERROR: Cannot find Angular 'index.html' at {html_file}")
        print("Please build Angular assets into the 'static/browser' folder.")
        sys.exit(1)

    # 3. Create and start the PyWebView window
    api = Api()
    webview.create_window(
        APP_NAME, 
        url=f'file://{html_file}', 
        js_api=api,
        width=1000,
        height=700,
        min_size=(600, 400),
        resizable=True
    )
    
    webview.start()

if __name__ == '__main__':
    start_app()