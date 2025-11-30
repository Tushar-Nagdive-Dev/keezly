// src/app/features/vault/components/vault-view/vault-view.component.ts
import { Component } from '@angular/core';
import { VaultItem } from '../models/vault-item.model';
import { VaultUiService } from '../services/vault-ui.service';
import { VaultStorageService } from '../services/vault-storage.service';

@Component({
  selector: 'app-vault-view',
  standalone: false,
  templateUrl: './vault-view.html',
  styleUrls: ['./vault-view.scss']
})
export class VaultView {
  open = false;
  item: VaultItem | null = null;
  revealing = false;

  constructor(private ui: VaultUiService, private storage: VaultStorageService) {
    this.ui.viewOpen$.subscribe(v => this.open = v);
    this.ui.active$.subscribe(it => this.item = it ? it : null);
  }

  close() { this.ui.openView(false); }

  toggleReveal() { this.revealing = !this.revealing; if (this.revealing) setTimeout(()=> this.revealing = false, 12000); }
  copy() { if (this.item) this.storage.copyToClipboard(this.item.password || ''); }
  edit() { if (this.item) this.ui.openEditor(true); this.ui.openView(false); }
}