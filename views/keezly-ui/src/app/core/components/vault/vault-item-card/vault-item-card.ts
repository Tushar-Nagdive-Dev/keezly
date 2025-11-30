import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VaultItem } from '../models/vault-item.model';
import { VaultStorageService } from '../services/vault-storage.service';

@Component({
  selector: 'app-vault-item-card',
  standalone: false,
  templateUrl: './vault-item-card.html',
  styleUrl: './vault-item-card.scss',
})
export class VaultItemCard implements OnInit{

  @Input() 
  item!: VaultItem;

  @Output()
  edit = new EventEmitter<void>();

  @Output() 
  view = new EventEmitter<void>();

  revealing = false;

  deleting = false;

  constructor(
    private storage: VaultStorageService
  ) {}

  ngOnInit(): void {
    console.log('VaultItemCard initialized');
  }

  toggleReveal() { 
    this.revealing = !this.revealing; 
  }

  async copyPassword() {
    if (!this.item?.password) return;

    const resp = await this.storage.copyText(this.item.password);

    if (resp?.success) {
      console.log('Copied!');
    } else {
      console.warn('Copy failed');
    }
  }

  onEdit() {
    this.edit.emit();
  }

  onView() {
    this.view.emit();
  }
}
