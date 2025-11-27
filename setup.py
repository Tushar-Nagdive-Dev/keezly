# keezly/setup.py

from setuptools import setup
import os

# --- PATH DEFINITIONS ---
# BASE_DIR is the root of the Keezly project
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# The main Python script that starts the application
APP = ['app.py']

# Data files to include: your Angular build output folder
DATA_FILES = [
    # Include the entire 'static' folder containing your Angular assets
    ('static', [os.path.join(BASE_DIR, 'static', 'browser')]),
]

# Options for the py2app tool
OPTIONS = {
    'argv_emulation': True,
    'iconfile': 'assets/key.icns',  # OPTIONAL: Path to your application icon file (create one!)
    'packages': ['webview', 'cryptography', 'pyperclip', 'setuptools'], # Include necessary Python dependencies
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