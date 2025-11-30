// src/app/features/vault/services/vault-ui.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VaultItem } from '../models/vault-item.model';

@Injectable({ providedIn: 'root' })
export class VaultUiService {
  private _items$ = new BehaviorSubject<VaultItem[]>([]);
  items$ = this._items$.asObservable();

  private _active$ = new BehaviorSubject<VaultItem | null>(null);
  active$ = this._active$.asObservable();

  private _editorOpen$ = new BehaviorSubject<boolean>(false);
  editorOpen$ = this._editorOpen$.asObservable();

  private _viewOpen$ = new BehaviorSubject<boolean>(false);
  viewOpen$ = this._viewOpen$.asObservable();

  setItems(items: VaultItem[]) { this._items$.next(items); }
  setActive(item: VaultItem | null) { this._active$.next(item); }
  openEditor(open = true) { this._editorOpen$.next(open); }
  openView(open = true) { this._viewOpen$.next(open); }
}