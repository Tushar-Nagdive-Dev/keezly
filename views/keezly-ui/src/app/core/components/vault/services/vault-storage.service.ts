import { Injectable } from '@angular/core';
import { VaultItem } from '../models/vault-item.model';
import { KeezlyApiService } from '../../../services/keezly-api.service';

@Injectable({ providedIn: 'root' })
export class VaultStorageService {
  constructor(private api: KeezlyApiService) {}

  /** Returns array of items (dev or bridge) */
  async getAll(): Promise<VaultItem[]> {
    try {
      const items = await this.api.getItems();
      return Array.isArray(items) ? items : [];
    } catch (e) {
      console.error('VaultStorageService.getAll error', e);
      return [];
    }
  }

  /**
   * Save (add or update) an item.
   * Returns { success, item?, message? }
   */
  async save(item: VaultItem): Promise<{ success: boolean; item?: VaultItem; message?: string }> {
    try {
      const resp = await this.api.saveItem(item);
      // KeezlyApiService.saveItem returns ApiResponse with success and item
      return {
        success: !!resp.success,
        item: resp.item,
        message: resp.message
      };
    } catch (e) {
      console.error('VaultStorageService.save error', e);
      return { success: false, message: (e as any)?.message || 'Save failed' };
    }
  }

  /** Delete item by id. If backend doesn't expose delete, mutate dev-store here. */
  async delete(id: number): Promise<{ success: boolean; message?: string }> {
    // Prefer api.deleteItem if exists; KeezlyApiService currently doesn't expose deleteItem.
    try {
      // Try calling window.pywebview.api.delete_item (safe-check)
      const apiObj = (window as any)?.pywebview?.api;
      if (apiObj && typeof apiObj.delete_item === 'function') {
        const resp = await apiObj.delete_item(Number(id));
        return { success: !!resp?.success, message: resp?.message };
      }

      // Fallback: dev-mode localStorage mutation (matching KeezlyApiService dev storage keys)
      const DEV_STORAGE_KEY = 'keezly:dev:items';
      const raw = localStorage.getItem(DEV_STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) as VaultItem[] : [];
      const newArr = arr.filter(it => Number(it.id) !== Number(id));
      localStorage.setItem(DEV_STORAGE_KEY, JSON.stringify(newArr));
      return { success: true };

    } catch (e) {
      console.error('VaultStorageService.delete error', e);
      return { success: false, message: (e as any)?.message || 'Delete failed' };
    }
  }

  /** Generate a password via backend or client fallback */
  async generatePassword(length = 16, complexity = 'medium'): Promise<string | null> {
    try {
      const resp = await this.api.generatePassword(length, complexity);
      if (resp && resp.success && typeof resp.password === 'string') return resp.password;
    } catch (e) {
      console.error('generatePassword (bridge) failed', e);
    }

    // Dev fallback: in-browser generator
    try {
      const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_';
      const arr = new Uint32Array(length);
      window.crypto.getRandomValues(arr);
      const pw = Array.from(arr).map(n => alphabet[n % alphabet.length]).join('');
      return pw;
    } catch (e) {
      return null;
    }
  }

  /** Copy text to clipboard via backend or browser */
  async copyText(text: string): Promise<{ success: boolean; message?: string }> {
    try {
      const resp = await this.api.copyText(text);
      if (resp && resp.success) return { success: true, message: resp.message };
    } catch (e) { /* ignore, fallback */ }

    try {
      await navigator.clipboard.writeText(text);
      return { success: true, message: 'Copied (browser)' };
    } catch (e) {
      return { success: false, message: 'Clipboard failed' };
    }
  }
}