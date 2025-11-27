import { Injectable } from '@angular/core';

// views/src/app/services/keezly-api.service.ts

// 1. Define the structure of the Python API for internal use
interface PyWebViewApi {
  unlock_app(password: string): Promise<{success: boolean, item_count?: number, message?: string}>;
  lock_app(): Promise<{success: boolean}>;
  get_all_items(): Promise<any[]>;
  add_or_update_item(item_json_string: string): Promise<{success: boolean, item?: any, message?: string}>;
  generate_password(length: number, complexity: string): Promise<{password: string}>;
  copy_to_clipboard(text: string): Promise<{success: boolean, message: string}>;
}

// 2. Define the expected structure of the window object
interface PyWebViewWindow extends Window {
  pywebview?: { // pywebview property is optional as it might not be present
    api: PyWebViewApi;
  };
}

// Cast the global window object to include the PyWebView structure.
// This is the constant that will be used instead of the global 'window'.
const pywebviewWindow = window as PyWebViewWindow;

// Define the shape of a key/password item for clarity
interface KeezlyItem {
  id: number | null;
  title: string;
  username: string;
  password?: string;
  url?: string;
  notes?: string;
}

// Define the standard API response structure
interface ApiResponse {
  success: boolean;
  message?: string;
  item?: KeezlyItem;
  item_count?: number;
  password?: string;
}

@Injectable({
  providedIn: 'root',
})
export class KeezlyApiService {
  
  // A private helper to access the injected PyWebView API object
  private get api() {
    // CRITICAL FIX: Use the 'pywebviewWindow' constant instead of the global 'window'
    const apiObject = pywebviewWindow.pywebview?.api;
    
    // Check for the PyWebView API presence. 
    if (!apiObject) {
      console.error("PyWebView API not available. Running outside the desktop application environment.");
      // Throw an error that stops execution, as the app is unusable without the bridge
      throw new Error("Application environment bridge failed. Cannot connect to Python core.");
    }
    return apiObject;
  }

  // --- 🔒 Security & Access Management ---

  /**
   * Calls Python to derive the encryption key and verify the Master Password.
   */
  async unlock(password: string): Promise<ApiResponse> {
    try {
      // The API call returns a Promise<object>
      // Access via this.api is now correctly typed
      return await this.api.unlock_app(password);
    } catch (e) {
      console.error('Unlock failed:', e);
      return { success: false, message: 'Critical communication error during unlock.' };
    }
  }

  /**
   * Calls Python to clear the active encryption key, locking the application.
   */
  async lock(): Promise<ApiResponse> {
    return await this.api.lock_app();
  }

  // --- 💾 Data Management ---

  /**
   * Fetches all decrypted items from the file storage.
   */
  async getItems(): Promise<KeezlyItem[]> {
    try {
      // The API returns an array of objects
      return await this.api.get_all_items();
    } catch (e) {
      console.error('Failed to retrieve items (App likely locked):', e);
      // Return an empty array on failure (e.g., if app is locked)
      return [];
    }
  }

  /**
   * Adds a new item or updates an existing item.
   * NOTE: Python expects a stringified JSON object for complex data transfer.
   */
  async saveItem(item: KeezlyItem): Promise<ApiResponse> {
    try {
      const jsonString = JSON.stringify(item);
      // Python's API method is add_or_update_item
      return await this.api.add_or_update_item(jsonString);
    } catch (e) {
      console.error('Failed to save item:', e);
      return { success: false, message: 'Failed to save item due to API error.' };
    }
  }

  // --- 🔑 Utility Functions ---

  /**
   * Calls Python's 'secrets' module to generate a strong password.
   */
  async generatePassword(length: number = 16, complexity: string = 'medium'): Promise<ApiResponse> {
      try {
        // 1. The Python API returns { password: string }
        const result = await this.api.generate_password(length, complexity);

        // 2. CRITICAL FIX: Wrap the result with the required 'success: true' property
        return {
          success: true,
          password: result.password,
          // We can also add a message if needed: message: 'Password generated.'
        };
      } catch (e) {
        console.error('Failed to generate password:', e);
        // Ensure failure also returns a valid ApiResponse structure
        return { success: false, message: 'Password generation failed.' };
      }
    }

  /**
   * Calls Python's 'pyperclip' to write text to the system clipboard.
   */
  async copyText(text: string): Promise<ApiResponse> {
    try {
      return await this.api.copy_to_clipboard(text);
    } catch (e) {
      console.error('Failed to copy to clipboard:', e);
      return { success: false, message: 'Clipboard access failed.' };
    }
  }

  async copyToClipboard(text: string): Promise<any> {
    return this.api.copy_to_clipboard(text);
  }
}