import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { VaultItem } from '../models/vault-item.model';
import { VaultUiService } from '../services/vault-ui.service';
import { VaultStorageService } from '../services/vault-storage.service';

@Component({
  selector: 'app-vault-editor',
  standalone: false,
  templateUrl: './vault-editor.html',
  styleUrls: ['./vault-editor.scss']
})
export class VaultEditor implements OnDestroy {
  open = false;
  item: VaultItem | null = null;
  saving = false;

  private subs = new Subscription();

  constructor(
    private ui: VaultUiService,
    private storage: VaultStorageService
  ) {
    this.subs.add(this.ui.editorOpen$.subscribe(open => this.open = open));
    this.subs.add(this.ui.active$.subscribe(it => {
      // clone so changes are local to editor until saved
      this.item = it ? { ...it } : { id: null, title: '', username: '', password: '', url: '', notes: '' };
    }));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  close() { this.ui.openEditor(false); }

  async save() {
    if (!this.item) return;
    if (!this.item.title || this.item.title.trim().length === 0) {
      alert('Title is required.');
      return;
    }

    try {
      this.saving = true;
      const resp = await this.storage.save(this.item);
      this.saving = false;

      if (resp.success && resp.item) {
        // notify UI that item saved
        this.ui.notifySaved(resp.item);
        this.ui.openEditor(false);
      } else {
        alert('Save failed: ' + (resp.message || 'unknown'));
      }
    } catch (e) {
      this.saving = false;
      console.error(e);
      alert('Save failed: ' + (e as any)?.message || 'unknown');
    }
  }

  async generate() {
    const pw = await this.storage.generatePassword(12, 'hard');
    if (pw && this.item) this.item.password = pw;
  }
}