# keezly/setup.py (Final Fix: Simplification)

from setuptools import setup
import os

# --- PATH DEFINITIONS ---
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

APP = ['app.py']

# Data files to include: your Angular build output folder
DATA_FILES = [
    # CRITICAL FIX: Explicitly list the folder path that app.py expects 
    # and use the simple (Target, Source) format. This is the last variation 
    # to guarantee the static/browser folder is placed in the Resources root.
   ('static', ['static/browser'])
]

# Options for the py2app tool
OPTIONS = {
    'argv_emulation': False,
    'iconfile': 'assets/key.icns',
    'packages': ['webview', 'cryptography', 'pyperclip', 'setuptools', 'cffi'], 
    'plist': {
        'CFBundleName': 'Keezly',
        'CFBundleDisplayName': 'Keezly Password Manager',
        'CFBundleIdentifier': 'com.yourcompany.keezly',
        'CFBundleVersion': '1.0.0',
        'CFBundleShortVersionString': '1.0',
        'NSRequiresAquaTermination': True,
        'NSHighResolutionCapable': 'True'
    },
}

setup(
    app=APP,
    data_files=DATA_FILES,
    options={'py2app': OPTIONS},
    setup_requires=['py2app'],
)