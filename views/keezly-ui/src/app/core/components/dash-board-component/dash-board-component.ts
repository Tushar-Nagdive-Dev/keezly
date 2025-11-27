import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KeezlyApiService } from '../../services/keezly-api.service';
import { AppStateService } from '../../services/app-state.service';
import { KeezlyItem } from '../../models/keezly-item';

@Component({
  selector: 'app-dash-board-component',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './dash-board-component.html',
  styleUrl: './dash-board-component.scss',
})
export class DashBoardComponent implements OnInit {

  private apiService = inject(KeezlyApiService);
  private appStateService = inject(AppStateService);

  // --- Data State ---
  vaultItems: KeezlyItem[] = [];
  filteredItems: KeezlyItem[] = [];
  selectedItem: KeezlyItem | null = null;
  
  // --- UI State ---
  searchQuery: string = '';
  selectedCategory: string = 'All';
  categories: string[] = ['All', 'Finance', 'Social', 'Work', 'Other'];
  isEditing: boolean = false; 

  ngOnInit(): void {
    this.loadVaultData();
  }

  // --- Data Loading and Filtering ---

  async loadVaultData(): Promise<void> {
    try {
      // API call now returns Promise<KeezlyItem[]>
      const result = await this.apiService.getItems(); 

      if (Array.isArray(result)) {
        this.vaultItems = result;
        this.applyFilter();
      } else {
        console.error("Failed to load vault data.");
        this.appStateService.showToast('Vault load failed. Please log in again.', 'error');
        this.lockApp(); 
      }
    } catch (error) {
      console.error("API communication error:", error);
      this.appStateService.showToast('Failed to connect to backend.', 'error');
    }
  }

  applyFilter(): void {
    let filtered = this.vaultItems;
    // ... filtering logic (same as before) ...
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.username.toLowerCase().includes(query)
      );
    }
    this.filteredItems = filtered;
  }

  // --- Item Management ---

  selectItem(item: KeezlyItem): void {
    this.selectedItem = { ...item }; 
    this.isEditing = false;
  }

  addNewItem(): void {
    this.selectedItem = {
      id: null, title: '', username: '', password_encrypted: '', 
      category: this.categories[1], notes: '', last_modified: new Date().toISOString()
    } as KeezlyItem; 
    this.isEditing = true;
  }

  async saveItem(item: KeezlyItem): Promise<void> {
    if (!item.title || !item.username) {
        this.appStateService.showToast('Title and Username are required.', 'warning');
        return;
    }
    
    try {
        const result = await this.apiService.saveItem(item); 
        
        if (result.success && result.item) {
            this.appStateService.showToast('Item saved successfully!', 'success');
            
            const savedItem: KeezlyItem = result.item;
            const index = this.vaultItems.findIndex(i => i.id === savedItem.id);
            
            if (index !== -1) {
                this.vaultItems[index] = savedItem; 
            } else {
                this.vaultItems.push(savedItem); 
            }
            
            this.applyFilter(); 
            this.selectItem(savedItem); 
        } else {
            this.appStateService.showToast(`Save failed: ${result.message}`, 'error');
        }
    } catch (error) {
        this.appStateService.showToast('Error communicating with backend during save.', 'error');
    }
  }

  // --- Utility Actions ---
  
  async copyText(text: string): Promise<void> {
    if (!text) return;
    // Note: Using copyText here since the service has two similarly named functions
    const result = await this.apiService.copyText(text); 
    if (result.success) {
      this.appStateService.showToast('Copied to clipboard!');
    } else {
      this.appStateService.showToast('Copy failed.', 'error');
    }
  }

  async lockApp(): Promise<void> {
    try {
      const result = await this.apiService.lock();
      if (result.success) {
        this.appStateService.setLocked(true); 
      } else {
        this.appStateService.showToast('Lock action failed.', 'error');
      }
    } catch (error) {
      this.appStateService.showToast('Error communicating with backend.', 'error');
    }
  }
}