// src/app/features/vault/services/vault-storage.service.ts
import { Injectable } from '@angular/core';
import { VaultItem } from '../models/vault-item.model';
import { Observable, from } from 'rxjs';
import { KeezlyApiService } from '../../../services/keezly-api.service';

@Injectable({ providedIn: 'root' })
export class VaultStorageService {
  constructor(private api: KeezlyApiService) {}

  // Returns Promise<VaultItem[]>
  async getAll(): Promise<VaultItem[]> {
    return await this.api.getItems();
  }

  // Save new or update existing
  async save(item: VaultItem): Promise<{ success: boolean; item?: VaultItem; message?: string }> {
    return await this.api.saveItem(item);
  }

  // Delete wrapper - call pywebview delete_item if available, otherwise do local fallback
  async delete(id: number): Promise<{ success: boolean; message?: string }> {
    // Prefer api.deleteItem if implemented on KeezlyApiService
    // We'll attempt to call a method named deleteItem; if not present, fallback to direct window API
    try {
      // If KeezlyApiService has deleteItem, call it
      const asAny = this.api as any;
      if (typeof asAny.deleteItem === 'function') {
        return await asAny.deleteItem(id);
      }

      // Else fallback to window.pywebview.api.delete_item if present
      const api = (window as any)?.pywebview?.api;
      if (api && typeof api.delete_item === 'function') {
        return await api.delete_item(id);
      }

      // Last fallback: emulate delete by reading items and saving filtered list (dev mode)
      const items = await this.api.getItems();
      const newItems = (items || []).filter((it: any) => Number(it.id) !== Number(id));
      // save entire list by calling saveItem for each? We'll use api.saveItem only if it supports saving list.
      // Simpler fallback: call api.saveItem for each remaining item to rewrite storage isn't ideal.
      // Instead, if KeezlyApiService exposes a saveAll method, call it. We'll attempt generic approach:
      if (typeof asAny.saveAll === 'function') {
        await asAny.saveAll(newItems);
        return { success: true };
      }

      // If no safe fallback, return failure
      return { success: false, message: 'Delete unsupported in this environment' };
    } catch (e: any) {
      return { success: false, message: e?.message || String(e) };
    }
  }

  async generatePassword(length = 16, complexity = 'medium'): Promise<string | null> {
    const resp = await this.api.generatePassword(length, complexity);
    return resp.success ? resp.password ?? null : null;
  }

  async copyToClipboard(text: string): Promise<boolean> {
    const r = await this.api.copyText(text);
    return !!r?.success;
  }
}