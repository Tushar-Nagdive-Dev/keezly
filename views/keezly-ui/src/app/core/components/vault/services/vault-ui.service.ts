import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
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

  // Events for other components to react
  private _onSaved$ = new Subject<VaultItem>();
  onSaved$ = this._onSaved$.asObservable();

  private _onDeleted$ = new Subject<number>();
  onDeleted$ = this._onDeleted$.asObservable();

  setItems(items: VaultItem[]) { this._items$.next(items); }
  setActive(item: VaultItem | null) { this._active$.next(item); }
  openEditor(open = true) { this._editorOpen$.next(open); }
  openView(open = true) { this._viewOpen$.next(open); }

  // Emitters
  notifySaved(item: VaultItem) { this._onSaved$.next(item); }
  notifyDeleted(id: number) { this._onDeleted$.next(id); }
}