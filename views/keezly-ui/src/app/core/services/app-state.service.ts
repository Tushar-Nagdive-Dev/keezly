import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {

  // Use a BehaviorSubject to hold the current state (default: locked)
  private _isLocked = new BehaviorSubject<boolean>(true);

  // Expose the state as an Observable for components to subscribe to
  isLocked$ = this._isLocked.asObservable();

  constructor() { }

  /** Unlocks the app and switches state (called by LoginComponent) */
  setUnlocked(): void {
    this._isLocked.next(false);
  }
  
  /** Locks the app and switches state (called by DashboardComponent) */
  setLocked(): void {
    this._isLocked.next(true);
  }
}
