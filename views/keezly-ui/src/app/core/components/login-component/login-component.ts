import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeezlyApiService } from '../../services/keezly-api.service';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent implements OnInit {

  // Inject the API Service using the modern inject() function
  private apiService = inject(KeezlyApiService);
  private appStateService = inject(AppStateService); // Inject the new service

  // Component State
  masterPassword: string = '';
  errorMessage: string | null = null;
  isLoading: boolean = false;
  
  // You'd typically have an AuthService or AppState service to manage the global login status
  // For simplicity, we'll use a property to track if the dashboard should be shown.
  isLoggedIn: boolean = false;

  constructor(
    
  ) {}

  ngOnInit(): void {
    
  }

  /**
   * Called when the user submits the Master Password form.
   * This calls the Python backend's unlock_app function.
   */
  async unlock(): Promise<void> {
    if (!this.masterPassword) {
      this.errorMessage = 'Please enter your Master Password.';
      return;
    }

    this.errorMessage = null;
    this.isLoading = true;

    try {
      // 1. Call the Python API via the service
      const result = await this.apiService.unlock(this.masterPassword);

      if (result.success) {
        // 2. Unlock successful (Python verified the key by decrypting data)
        console.log(`App unlocked successfully! Found ${result.item_count} items.`);
        this.appStateService.setUnlocked();
        
        // --- TRANSITION LOGIC ---
        this.isLoggedIn = true; // Set state to show the Dashboard component
        // In a real app, you would navigate to the dashboard route here.
        
      } else {
        // 3. Unlock failed (Decryption failed or other API error)
        this.errorMessage = result.message || 'Unlock failed. Check your Master Password.';
      }

    } catch (error) {
      // Catch errors during the API call itself (e.g., PyWebView not available)
      console.error('API communication error:', error);
      this.errorMessage = 'A critical error occurred while communicating with the application core.';
    } finally {
      this.isLoading = false;
    }
  }

  async unlockServe(): Promise<void> {
    this.appStateService.setUnlocked();
    this.isLoggedIn = true;
  }

}
