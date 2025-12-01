import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {

  private _isLocked = new BehaviorSubject<boolean>(true);
  isLocked$ = this._isLocked.asObservable();

  setUnlocked() {
    console.log("APP UNLOCKED");
    this._isLocked.next(false);
  }

  setLocked() {
    console.log("APP LOCKED");
    this._isLocked.next(true);
  }
}