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
  // DEV fallback storage keys & optional seed file path
  private readonly DEV_STORAGE_KEY = 'keezly:dev:items';
  private readonly DEV_UNLOCK_KEY = 'keezly:dev:unlocked';
  private readonly DEV_SEED_PATH = '/assets/keezly-dev.json'; // optional seed JSON

  // A private helper to access the injected PyWebView API object
  private get api(): PyWebViewApi {
    // CRITICAL FIX: Use the 'pywebviewWindow' constant instead of the global 'window'
    const apiObject = pywebviewWindow.pywebview?.api;

    // When the bridge exists, return it (normal production / desktop mode)
    if (apiObject) return apiObject;

    // If the bridge is missing, we *do not* throw — we will fallback to dev storage.
    // But keep a console warning so devs know what's happening.
    console.warn('PyWebView API not available — using local dev fallback within KeezlyApiService.');
    // The rest of the service methods check `this.hasBridge()` before calling `this.api`.
    // We throw here only if code accidentally tries to use `this.api` when bridge is absent.
    throw new Error('PyWebView bridge is not available.');
  }

  constructor() {}

  // ---------- Bridge detection ----------
  private hasBridge(): boolean {
    return !!pywebviewWindow.pywebview?.api;
  }

  // ---------- Local dev helpers ----------
  private readDevItems(): KeezlyItem[] {
    try {
      const raw = localStorage.getItem(this.DEV_STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as KeezlyItem[];
    } catch (e) {
      console.error('Failed to read dev items from localStorage', e);
      return [];
    }
  }

  private writeDevItems(items: KeezlyItem[]) {
    try {
      localStorage.setItem(this.DEV_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to write dev items to localStorage', e);
    }
  }

  private isDevUnlocked(): boolean {
    return localStorage.getItem(this.DEV_UNLOCK_KEY) === '1';
  }

  private setDevUnlocked(on: boolean) {
    localStorage.setItem(this.DEV_UNLOCK_KEY, on ? '1' : '0');
  }

  private async seedFromAssetIfNeeded(): Promise<void> {
    const already = localStorage.getItem(this.DEV_STORAGE_KEY);
    if (already) return;
    try {
      const resp = await fetch(this.DEV_SEED_PATH, { cache: 'no-cache' });
      if (!resp.ok) return;
      const items = await resp.json();
      if (Array.isArray(items)) {
        // ensure ids exist
        const normalized = items.map((it: any, idx: number) => ({ id: it.id ?? idx + 1, ...it }));
        this.writeDevItems(normalized);
        console.info('Keezly dev storage seeded from', this.DEV_SEED_PATH);
      }
    } catch (e) {
      // silent — seed is optional
    }
  }

  // --- 🔒 Security & Access Management ---

  /**
   * Calls Python to derive the encryption key and verify the Master Password.
   * Fallback: dev localStorage mode (accept any non-empty password)
   */
  async unlock(password: string): Promise<ApiResponse> {
    if (this.hasBridge()) {
      try {
        return await this.api.unlock_app(password);
      } catch (e) {
        console.error('Unlock failed (bridge):', e);
        return { success: false, message: 'Critical communication error during unlock.' };
      }
    }

    // Dev fallback
    await this.seedFromAssetIfNeeded();
    if (!password || password.length === 0) {
      return { success: false, message: 'Master password required (dev).' };
    }
    this.setDevUnlocked(true);
    const items = this.readDevItems();
    return { success: true, item_count: items.length, message: 'Unlocked (dev).' };
  }

  /**
   * Calls Python to clear the active encryption key, locking the application.
   * Fallback: dev localStorage mode.
   */
  async lock(): Promise<ApiResponse> {
    if (this.hasBridge()) {
      try {
        return await this.api.lock_app();
      } catch (e) {
        console.error('Bridge lock failed:', e);
        return { success: false, message: 'Bridge lock failed.' };
      }
    }
    // Dev fallback
    this.setDevUnlocked(false);
    return { success: true, message: 'Locked (dev).' };
  }

  // --- 💾 Data Management ---

  /**
   * Fetches all decrypted items from the file storage.
   * Fallback: dev localStorage mode (requires unlocked)
   */
  async getItems(): Promise<KeezlyItem[]> {
    if (this.hasBridge()) {
      try {
        return await this.api.get_all_items();
      } catch (e) {
        console.error('Failed to retrieve items (bridge):', e);
        return [];
      }
    }

    // Dev fallback
    if (!this.isDevUnlocked()) {
      console.warn('Attempted to get items while locked (dev). Returning empty list.');
      return [];
    }
    return this.readDevItems();
  }

  /**
   * Adds a new item or updates an existing item.
   * NOTE: Python expects a stringified JSON object for complex data transfer.
   * Fallback: dev localStorage mode.
   */
  async saveItem(item: KeezlyItem): Promise<ApiResponse> {
    if (this.hasBridge()) {
      try {
        const jsonString = JSON.stringify(item);
        return await this.api.add_or_update_item(jsonString);
      } catch (e) {
        console.error('Failed to save item (bridge):', e);
        return { success: false, message: 'Failed to save item due to API error.' };
      }
    }

    // Dev fallback
    if (!this.isDevUnlocked()) {
      return { success: false, message: 'App locked (dev).' };
    }

    const items = this.readDevItems();
    if (item?.id) {
      const idx = items.findIndex(it => it.id === item.id);
      if (idx >= 0) {
        items[idx] = { ...items[idx], ...item, updated_at: new Date().toISOString() } as any;
        this.writeDevItems(items);
        return { success: true, item: items[idx] };
      } else {
        // ID provided but not found — append
        const newItem = { ...item, created_at: new Date().toISOString() } as any;
        items.push(newItem);
        this.writeDevItems(items);
        return { success: true, item: newItem };
      }
    } else {
      // create new ID
      const maxId = items.reduce((m, it) => Math.max(m, Number(it.id) || 0), 0);
      const newItem = { ...item, id: maxId + 1, created_at: new Date().toISOString() } as any;
      items.push(newItem);
      this.writeDevItems(items);
      return { success: true, item: newItem };
    }
  }

  // --- 🔑 Utility Functions ---

  /**
   * Calls Python's 'secrets' module to generate a strong password.
   * Fallback: in-browser generator for dev.
   */
  async generatePassword(length: number = 16, complexity: string = 'medium'): Promise<ApiResponse> {
    if (this.hasBridge()) {
      try {
        const result = await this.api.generate_password(length, complexity);
        return { success: true, password: result.password };
      } catch (e) {
        console.error('Failed to generate password (bridge):', e);
        return { success: false, message: 'Password generation failed.' };
      }
    }

    // Dev fallback: simple secure generation using crypto
    try {
      const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_';
      const arr = new Uint32Array(length);
      window.crypto.getRandomValues(arr);
      const chars = Array.from(arr).map(n => alphabet[n % alphabet.length]).join('');
      return { success: true, password: chars };
    } catch (e) {
      console.error('Dev password generation failed:', e);
      return { success: false, message: 'Dev password generation failed.' };
    }
  }

  /**
   * Calls Python's 'pyperclip' to write text to the system clipboard.
   * Fallback: browser clipboard API.
   */
  async copyText(text: string): Promise<ApiResponse> {
    if (this.hasBridge()) {
      try {
        return await this.api.copy_to_clipboard(text);
      } catch (e) {
        console.error('Failed to copy to clipboard (bridge):', e);
        return { success: false, message: 'Clipboard access failed.' };
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      return { success: true, message: 'Copied to clipboard (dev).' };
    } catch (e) {
      console.error('Clipboard API error (dev):', e);
      return { success: false, message: 'Clipboard API unavailable' };
    }
  }

  // Keep existing helper for any code calling copyToClipboard directly
  async copyToClipboard(text: string): Promise<any> {
    if (this.hasBridge()) {
      return await this.api.copy_to_clipboard(text);
    } else {
      try {
        await navigator.clipboard.writeText(text);
        return { success: true, message: 'Copied to clipboard (dev).' };
      } catch (e) {
        return { success: false, message: 'Clipboard API unavailable' };
      }
    }
  }
}
