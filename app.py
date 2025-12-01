import os
import webview
from core.api.exposed_api import ExposedApi

def start_app():
    frontend_path = os.path.join(os.getcwd(), "static/browser/index.html")

    if not os.path.exists(frontend_path):
        raise FileNotFoundError(f"Cannot find UI at: {frontend_path}")

    api = ExposedApi()

    webview.create_window(
        "Keezly",
        url="file://" + frontend_path,
        js_api=api,
        width=1000,
        height=700,
        min_size=(600, 400),
        resizable=True
    )

    webview.start()

if __name__ == "__main__":
    start_app()