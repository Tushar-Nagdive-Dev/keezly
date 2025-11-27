This document provides a complete guide for the development and packaging of your application, **Keezly**, into a standalone macOS application bundle (.app) using **py2app**, including all necessary setup, file modifications, and the exact sequence of commands used to resolve compatibility and pathing issues.

---

## 1. ⚙️ Initial Setup and Environment Configuration

The primary roadblock was **Python version incompatibility** (`py2app` breaks on Python 3.12+). This section outlines the required environment setup using **Python 3.11**.

### A. Python Version Management (Using `pyenv`)

To ensure a stable build, we used `pyenv` to isolate and manage the compatible Python version.

| Step | Command | Purpose |
| :--- | :--- | :--- |
| **1. Install Python 3.11** | `pyenv install 3.11.8` | Downloads and compiles the stable version (skip if already installed). |
| **2. Set Local Version** | `pyenv local 3.11.8` | Sets Python 3.11.8 as the default for the current project directory (creates `.python-version` file). |

### B. Environment Cleanup and Dependency Installation

| Step | Command | Purpose |
| :--- | :--- | :--- |
| **1. Cleanup** | `rm -rf venv dist build temp_build` | Removes all previous failed environments and build artifacts. |
| **2. Create Venv** | `python -m venv venv` | Creates a new isolated environment using the 3.11.8 version set by `pyenv`. |
| **3. Activate** | `source venv/bin/activate` | Enters the virtual environment. |
| **4. Install Deps** | `(.venv) pip install pywebview cryptography pyperclip py2app cffi` | Installs application dependencies and the necessary build tool (`py2app`) along with its implicit dependency (`cffi`). |

---

## 2. 📝 Project File Updates (Critical Fixes)

These modifications were necessary to resolve all launch errors encountered during the packaging process.

### A. `keezly/setup.py`

This file was updated to include all packages, disable deprecated macOS features, and correctly instruct `py2app` where to copy the Angular frontend assets.

| Code Section | Fix Implemented | Reason |
| :--- | :--- | :--- |
| `DATA_FILES = [('', ['static'])]` | **Asset Copy Path** | Copies the `static` folder directly to `Contents/Resources/` to prevent the nested path error (`/static/browser/browser/`). |
| `'argv_emulation': False` | **Carbon Framework** | Fixes `OSError: dlopen(...Carbon.framework)` on modern macOS. |
| `'packages': ['...', 'cffi']` | **Cryptography Binding** | Fixes `ModuleNotFoundError: No module named '_cffi_backend'`. |

### B. `keezly/app.py`

The path resolution block was completely overhauled to use Py2App's path structure and direct user data to a writable location.

| Variable/Logic | Fix Implemented | Reason |
| :--- | :--- | :--- |
| `RESOURCES_ROOT` Calculation | **Corrected Path Logic** | Fixes the final launch error by correctly calculating the path as `Keezly.app/Contents/Resources` instead of `Keezly.app/Resources`. |
| `FRONTEND_DIST_FOLDER` | **Removed `sys._MEIPASS`** | Fixes `AttributeError: module 'sys' has no attribute '_MEIPASS'` (PyInstaller structure used in a Py2App build). |
| `DATA_PATH` | **Writable Directory** | Fixes the `[Errno 2] No such file or directory` error by redirecting data storage to the user's writable home directory (`~/.keezly_data`). |

---

## 3. 🚀 Build and Final Verification

### A. The Build Command

After ensuring all file changes were saved, the application was built using the following command:

| Step | Command | Purpose |
| :--- | :--- | :--- |
| **1. Clean Build** | `(.venv) rm -rf dist build` | Removes previous failed artifacts. |
| **2. Build App** | `(.venv) python setup.py py2app` | Executes the build process using the corrected configuration. |

### B. Debugging History and Resolutions

The final successful build was achieved by resolving this sequence of errors:

| Error Type | Trigger | Resolution |
| :--- | :--- | :--- |
| **Python Compatibility** | Python 3.14 used | Downgrade to **Python 3.11.8** using `pyenv`. |
| **Deprecated API** | `argv_emulation: True` | Set `'argv_emulation': False` in `setup.py`. |
| **Missing Module** | `cryptography` binding | Explicitly install and include `'cffi'` in `setup.py` packages. |
| **Path Structure** | `sys._MEIPASS` used | Rewrote `app.py` path logic to use `sys.executable` for resource location. |
| **Permissions** | Data written to bundle | Changed `DATA_PATH` in `app.py` to target the writable user folder (`~/.keezly_data`). |
| **Resource Location** | Miscalculated `Contents` | Corrected `RESOURCES_ROOT` path in `app.py` to properly include the `Contents` folder. |

### C. Final Application

The completed, standalone application bundle is located at: `dist/Keezly.app`. 
