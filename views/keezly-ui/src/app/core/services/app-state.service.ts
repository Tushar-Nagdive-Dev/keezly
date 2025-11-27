import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { DashboardData } from '../models/dashboard.models';
import { DUMMY_DASHBOARD } from '../data/dummy-data';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {

  private _isLocked = new BehaviorSubject<boolean>(true);
  isLocked$ = this._isLocked.asObservable();
  private readonly API_BASE = '/api'; 

  constructor() { }

  /** Unlocks the app and switches state (called by LoginComponent) */
  setUnlocked(): void {
    this._isLocked.next(false);
  }
  
  /** Locks the app and switches state (called by DashboardComponent) */
  setLocked(isLocked: boolean = true): void { // Added optional parameter for clarity
    this._isLocked.next(isLocked);
  }
  
  // ⭐️ FIX: Added the missing showToast method
  showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success'): void {
    console.log(`[TOAST] ${type.toUpperCase()}: ${message}`);
    // *** Actual implementation would trigger a visual notification component here ***
  }

  getDashboardData(): Observable<DashboardData> {
    // Simulate network delay for a more realistic dev experience
    return of(DUMMY_DASHBOARD).pipe(delay(400));
  }
}