from setuptools import setup
import os

APP = ['app.py']

DATA_FILES = [
    ('static', ['static/browser'])
]

OPTIONS = {
    'argv_emulation': False,
    'iconfile': 'assets/keezly.icns',

    # IMPORTANT
    'packages': ['core', 'webview', 'cryptography', 'pyperclip', 'cffi'],

    # 'package_dir': {'core': 'core'},
    # 'include_package_data': True,

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
    setup_requires=['py2app']
)