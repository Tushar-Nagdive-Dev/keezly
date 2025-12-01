import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppStateService } from '../../services/app-state.service';
import { KeezlyApiService } from '../../services/keezly-api.service';
import { CommonModule } from '@angular/common';
import { FeatureCardsComponent } from '../feature-cards.component/feature-cards.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-shell',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './dashboard-shell.html',
  styleUrl: './dashboard-shell.scss',
})
export class DashboardShell implements OnInit{

  protected router = inject(Router);

  private appState = inject(AppStateService);

  private api = inject(KeezlyApiService);

  // UI state
  showSidebar = true;
  searchQuery = '';
  isLocked$ = this.appState.isLocked$;
  // detect bridge for small indicator
  hasBridge = !!( (window as any)?.pywebview?.api );

  ngOnInit(): void {
    console.log('DashboardShell initialized');
  }

  toggleSidebar() { this.showSidebar = !this.showSidebar; }

  async lockApp() {
    // call API (will fallback if dev)
    try {
      await this.api.lock();
    } catch (e) {
      // ignore, still change UI state
    }
    this.appState.setLocked();
    // send to login
    await this.router.navigate(['/login']);
  }

  onSearch() {
    // simple router forward to /vault with query param
    this.router.navigate(['/vault'], { queryParams: { q: this.searchQuery || '' }});
  }
}
