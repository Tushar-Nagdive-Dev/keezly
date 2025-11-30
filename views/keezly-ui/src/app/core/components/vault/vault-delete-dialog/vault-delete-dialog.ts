import { Component } from '@angular/core';
import { VaultItem } from '../models/vault-item.model';
import { VaultUiService } from '../services/vault-ui.service';
import { VaultStorageService } from '../services/vault-storage.service';

@Component({
  selector: 'app-vault-delete-dialog',
  templateUrl: './vault-delete-dialog.html',
  styleUrls: ['./vault-delete-dialog.scss'],
  standalone: false
})
export class VaultDeleteDialog {
  open = false;
  item: VaultItem | null = null;
  deleting = false;

  constructor(private ui: VaultUiService, private storage: VaultStorageService) {
    this.ui.viewOpen$.subscribe(open => this.open = open); // or use a dedicated dialog flag if you prefer
    this.ui.active$.subscribe(it => this.item = it);
  }

  close() {
    // Close dialog (use editor flag if you created separate one)
    this.ui.openView(false);
  }

  async confirm() {
    if (!this.item || !this.item.id) return;
    this.deleting = true;
    try {
      const r = await this.storage.delete(this.item.id);
      if (r.success) {
        this.ui.emitDeleted(this.item.id);
        this.close();
      } else {
        alert('Delete failed: ' + (r.message || 'unknown'));
      }
    } catch (e) {
      console.error(e);
      alert('Delete error');
    } finally {
      this.deleting = false;
    }
  }
}