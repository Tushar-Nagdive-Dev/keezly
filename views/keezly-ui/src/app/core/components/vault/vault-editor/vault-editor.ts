// src/app/features/vault/components/vault-editor/vault-editor.component.ts
import { Component } from '@angular/core';
import { VaultItem } from '../models/vault-item.model';
import { VaultStorageService } from '../services/vault-storage.service';
import { VaultUiService } from '../services/vault-ui.service';


@Component({
  selector: 'app-vault-editor',
  standalone: false,
  templateUrl: './vault-editor.html',
  styleUrls: ['./vault-editor.scss']
})
export class VaultEditor {
  open = false;
  item: VaultItem | null = null;
  saving = false;

  constructor(
    private ui: VaultUiService, 
    private storage: VaultStorageService
  ) {
    this.ui.editorOpen$.subscribe(open => this.open = open);
    this.ui.active$.subscribe(it => this.item = it ? { ...it } : { id: null, title: '', username: '', password: '', url: '', notes: '' });
  }

  close() { this.ui.openEditor(false); }

  async save() {
    if (!this.item) return;
    this.saving = true;
    const resp = await this.storage.save(this.item);
    this.saving = false;
    if (resp.success) {
      this.ui.openEditor(false);
      // optionally notify success
    } else {
      alert('Save failed: ' + (resp.message || 'unknown'));
    }
  }

  async generate() {
    const pwd = await this.storage.generatePassword(16, 'medium');
    if (this.item) this.item.password = pwd ?? this.item.password;
  }
}