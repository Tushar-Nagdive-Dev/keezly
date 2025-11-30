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
    await this.storage.copyToClipboard(this.item.password || '');
    // you can trigger a toast here
  }

  onEdit() {
    this.edit.emit();
  }

  onView() {
    this.view.emit();
  }
}
