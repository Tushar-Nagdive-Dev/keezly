// src/app/features/vault/components/vault-item-card/vault-item-card.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VaultItem } from '../models/vault-item.model';
import { VaultStorageService } from '../services/vault-storage.service';

@Component({
  selector: 'app-vault-item-card',
  standalone: false,
  templateUrl: './vault-item-card.html',
  styleUrls: ['./vault-item-card.scss']
})
export class VaultItemCard {
  @Input() item!: VaultItem;
  @Output() edit = new EventEmitter<VaultItem>();
  @Output() view = new EventEmitter<VaultItem>();
  revealing = false;

  constructor(private storage: VaultStorageService) {}

  toggleReveal() {
    this.revealing = !this.revealing;
    if (this.revealing) setTimeout(() => this.revealing = false, 10000);
  }

  async copyPassword() {
    const pwd = this.item?.password ?? '';
    try {
      const r = await this.storage.copyText(pwd); // ensure storage.copy() exists
      // optionally show toast
    } catch (e) { console.error('copy failed', e); }
  }

  onEdit() { this.edit.emit(this.item); }
  onView() { this.view.emit(this.item); }
}