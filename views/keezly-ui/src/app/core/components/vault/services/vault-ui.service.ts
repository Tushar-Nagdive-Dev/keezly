// src/app/features/vault/services/vault-ui.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { VaultItem } from '../models/vault-item.model';

@Injectable({ providedIn: 'root' })
export class VaultUiService {
  // State streams
  private _items$ = new BehaviorSubject<VaultItem[]>([]);
  items$ = this._items$.asObservable();

  private _active$ = new BehaviorSubject<VaultItem | null>(null);
  active$ = this._active$.asObservable();

  private _editorOpen$ = new BehaviorSubject<boolean>(false);
  editorOpen$ = this._editorOpen$.asObservable();

  private _viewOpen$ = new BehaviorSubject<boolean>(false);
  viewOpen$ = this._viewOpen$.asObservable();

  // Event streams (Subjects so we can emit)
  private _onSaved$ = new Subject<VaultItem>();
  onSaved$ = this._onSaved$.asObservable();

  private _onDeleted$ = new Subject<number>();
  onDeleted$ = this._onDeleted$.asObservable();

  // -----------------------
  // State setters / actions
  // -----------------------
  setItems(items: VaultItem[]) {
    this._items$.next(items);
  }

  setActive(item: VaultItem | null) {
    this._active$.next(item);
  }

  openEditor(open = true) {
    this._editorOpen$.next(open);
  }

  openView(open = true) {
    this._viewOpen$.next(open);
  }

  // --------------------------------
  // Event emitters (public API)
  // --------------------------------

  /**
   * Preferred methods to call from components
   */
  notifySaved(item: VaultItem) {
    this._onSaved$.next(item);
  }

  notifyDeleted(id: number) {
    this._onDeleted$.next(id);
  }

  /**
   * Backwards-compatible aliases (keeps older code working)
   */
  emitSaved(item: VaultItem) {
    this.notifySaved(item);
  }

  emitDeleted(id: number) {
    this.notifyDeleted(id);
  }
}