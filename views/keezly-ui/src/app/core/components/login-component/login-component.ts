import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  private router = inject(Router);

  // Component State
  masterPassword: string = '';
  errorMessage: string | null = null;
  isLoading: boolean = false;
  isLoggedIn: boolean = false;

  /**
   * If true: we're running inside the PyWebView desktop environment and
   * the bridge `window.pywebview.api` is available. If false: dev mode (no bridge).
   */
  hasBridge = false;

  constructor() {}

  ngOnInit(): void {
    // Detect pywebview bridge presence early
    try {
      // safe check for global window.pywebview.api
      this.hasBridge = !!( (window as any)?.pywebview?.api );
    } catch (e) {
      this.hasBridge = false;
    }
  }

  /**
   * Standard unlock path used in both desktop and dev fallback.
   * KeezlyApiService.unlock() already handles bridge vs dev storage fallback,
   * but we keep an explicit check to show helpful UI and optionally use a Quick Unlock.
   */
  async unlock(): Promise<void> {
    if (!this.masterPassword) {
      this.errorMessage = 'Please enter your Master Password.';
      return;
    }

    this.errorMessage = null;
    this.isLoading = true;

    try {
      // Call the service (bridge-first, will fallback to dev storage if no bridge)
      const result = await this.apiService.unlock(this.masterPassword);

      if (result.success) {
        // Successful unlock
        console.log(`App unlocked successfully! Found ${result.item_count} items.`);
        this.appStateService.setUnlocked();

        // Clear sensitive value quickly
        this.masterPassword = '';

        // Mark UI flag and navigate to features
        this.isLoggedIn = true;
        try {
          await this.router.navigate(['/features']);
        } catch (navErr) {
          console.error('Navigation error after unlock:', navErr);
        }

      } else {
        // Unlock failed (wrong pw or corrupted data)
        this.errorMessage = result.message || 'Unlock failed. Check your Master Password.';
      }

    } catch (error) {
      console.error('API communication error:', error);
      this.errorMessage = 'A critical error occurred while communicating with the application core.';
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Quick Unlock (Dev convenience)
   * This bypasses the password check in UI dev mode and just flips the unlocked state.
   * Use only for UI development — the real storage behavior is still controlled by KeezlyApiService.
   */
  async quickUnlockDev(): Promise<void> {
    // Only allow quick unlock when bridge is not available (development)
    if (this.hasBridge) {
      console.warn('quickUnlockDev called while bridge is present — ignoring.');
      return;
    }

    // Optional: seed dev store (KeezlyApiService has a seed helper when unlocking)
    this.appStateService.setUnlocked();
    this.masterPassword = '';
    this.isLoggedIn = true;
    try {
      await this.router.navigate(['/features']);
    } catch (e) {
      // ignore nav errors
    }
  }

  /**
   * Backwards-compatible dev helper used elsewhere
   */
  async unlockServe(): Promise<void> {
    this.appStateService.setUnlocked();
    this.isLoggedIn = true;
    this.masterPassword = '';
    try {
      await this.router.navigate(['/features']);
    } catch (e) {}
  }
}
