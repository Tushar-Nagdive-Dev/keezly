// Define the global window object structure that PyWebView creates
declare global {
  interface Window {
    pywebview: {
      // The 'api' object contains all the methods from your Python 'Api' class
      api: {
        // --- Security & Status ---
        // unlock_app(password) -> returns a Promise with an object
        unlock_app(password: string): Promise<{success: boolean, item_count?: number, message?: string}>;
        lock_app(): Promise<{success: boolean}>;
        
        // --- Data Management ---
        // get_all_items() -> returns a Promise that resolves to an array of items
        get_all_items(): Promise<any[]>;
        
        // add_or_update_item(item_json_string) -> Python expects a stringified object
        add_or_update_item(item_json_string: string): Promise<{success: boolean, item?: any, message?: string}>;
        
        // --- Utility ---
        generate_password(length: number, complexity: string): Promise<{password: string}>;
        copy_to_clipboard(text: string): Promise<{success: boolean, message: string}>;
      };
    };
  }
}

// NOTE: This file does not generate any executable JavaScript.
// It only provides type checking and code completion hints for TypeScript.