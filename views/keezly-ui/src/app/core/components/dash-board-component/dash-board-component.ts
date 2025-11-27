import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../../services/app-state.service';
import { AlertItem, DashboardData } from '../../models/dashboard.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dash-board-component.html',
  styleUrls: ['./dash-board-component.scss']
})
export class DashboardComponent implements OnInit {
  data: DashboardData | null |any = null;
  loading = true;
  error: string | null = null;

  constructor(private api: AppStateService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;
    this.api.getDashboardData().subscribe({
      next: d => {
        this.data = d;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Failed to load dashboard data';
        this.loading = false;
      }
    });
  }

  // UI helpers
  formatTime(iso: string) {
    try {
      return formatDistanceToNow(new Date(iso), { addSuffix: true });
    } catch {
      return iso;
    }
  }

  severityClass(s: AlertItem['severity']) {
    switch(s) {
      case 'critical': return 'sev-critical';
      case 'high': return 'sev-high';
      case 'medium': return 'sev-medium';
      default: return 'sev-low';
    }
  }

  // Placeholder action handlers
  acknowledge(alert: AlertItem) {
    alert.acknowledged = true;
    // TODO: call ApiService to persist acknowledgment
    // this.api.acknowledgeAlert(alert.id).subscribe(...)
  }

  lockVault() {
    // placeholder for vault lock
    alert('Vault locked (placeholder)');
  }
}
function formatDistanceToNow(arg0: Date, arg1: { addSuffix: boolean; }) {
  throw new Error('Function not implemented.');
}

