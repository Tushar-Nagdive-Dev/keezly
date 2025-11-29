// src/app/core/components/login-component/login-component.ts
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

  private apiService = inject(KeezlyApiService);
  private appStateService = inject(AppStateService);
  private router = inject(Router);

  masterPassword: string = '';
  errorMessage: string | null = null;
  isLoading: boolean = false;
  isLoggedIn: boolean = false;
  hasBridge = false;

  constructor() {}

  ngOnInit(): void {
    try {
      this.hasBridge = !!((window as any)?.pywebview?.api);
    } catch (e) {
      this.hasBridge = false;
    }
  }

  async unlock(): Promise<void> {
    if (!this.masterPassword) {
      this.errorMessage = 'Please enter your Master Password.';
      return;
    }

    this.errorMessage = null;
    this.isLoading = true;

    try {
      const result = await this.apiService.unlock(this.masterPassword);

      if (result.success) {
        console.log(`App unlocked successfully! Found ${result.item_count} items.`);
        this.appStateService.setUnlocked();

        // Clear sensitive value quickly
        this.masterPassword = '';
        this.isLoggedIn = true;

        // Navigate to post-unlock landing
        try {
          await this.router.navigate(['/features']);
        } catch (navErr) {
          console.error('Navigation error after unlock:', navErr);
        }
      } else {
        this.errorMessage = result.message || 'Unlock failed. Check your Master Password.';
      }
    } catch (error) {
      console.error('API communication error:', error);
      this.errorMessage = 'A critical error occurred while communicating with the application core.';
    } finally {
      this.isLoading = false;
    }
  }

  async quickUnlockDev(): Promise<void> {
    if (this.hasBridge) {
      console.warn('Quick unlock ignored: bridge detected.');
      return;
    }
    this.appStateService.setUnlocked();
    this.masterPassword = '';
    this.isLoggedIn = true;
    try {
      await this.router.navigate(['/features']);
    } catch (e) { /* ignore */ }
  }

  async unlockServe(): Promise<void> {
    this.appStateService.setUnlocked();
    this.masterPassword = '';
    this.isLoggedIn = true;
    try {
      await this.router.navigate(['/features']);
    } catch (e) {}
  }
}
