import { Component } from '@angular/core';
import { VaultUiService } from '../services/vault-ui.service';
import { VaultStorageService } from '../services/vault-storage.service';

@Component({
  selector: 'app-vault-delete-dialog',
  standalone: false,
  templateUrl: './vault-delete-dialog.html',
  styleUrl: './vault-delete-dialog.scss',
})
export class VaultDeleteDialog {
  open = false;
  itemId: number | null = null;

  constructor(
    private ui: VaultUiService, 
    private storage: VaultStorageService
  ) {
    // no built-in trigger yet, call this component manually from view/editor when needed
  }

  async confirmDelete(id: number) {
    if (!confirm('Delete this item?')) return;
    const r = await this.storage.delete(id);
    if (r.success) {
      // reload list via UI service
      this.ui.openView(false);
      // you can emit an event or call a refresh - for now, consumers should call reload on success
    } else {
      alert('Delete failed: ' + (r.message || 'unknown'));
    }
  }
}
