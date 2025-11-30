import { Component, OnInit } from '@angular/core';
import { VaultItem } from '../models/vault-item.model';
import { VaultStorageService } from '../services/vault-storage.service';
import { VaultUiService } from '../services/vault-ui.service';

@Component({
  selector: 'app-vault-list',
  standalone: false,
  templateUrl: './vault-list.html',
  styleUrl: './vault-list.scss',
})
export class VaultList implements OnInit {

  items: VaultItem[] = [];
  filtered: VaultItem[] = [];
  loading = true;
  q = '';

  constructor(
    private storage: VaultStorageService,
    private ui: VaultUiService
  ) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  async reload() {
    this.loading = true;
    try {
      this.items = await this.storage.getAll();
      this.filtered = [...this.items];
      this.ui.setItems(this.items);
    } catch (e) {
      console.error(e);
      this.items = [];
      this.filtered = [];
    } finally {
      this.loading = false;
    }
  }

  search() {
    const qq = (this.q || '').trim().toLowerCase();
    if (!qq) { this.filtered = [...this.items]; return; }
    this.filtered = this.items.filter(it =>
      (it.title||'').toLowerCase().includes(qq) ||
      (it.username||'').toLowerCase().includes(qq) ||
      (it.url||'').toLowerCase().includes(qq)
    );
  }

  openNew() {
    this.ui.setActive(null);
    this.ui.openEditor(true);
  }

  editItem(item: VaultItem) {
    this.ui.setActive(item);
    this.ui.openEditor(true);
  }

  viewItem(item: VaultItem) {
    this.ui.setActive(item);
    this.ui.openView(true);
  }
}
