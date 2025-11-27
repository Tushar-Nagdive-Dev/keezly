import { Component, inject, OnInit } from '@angular/core';
import { KeezlyApiService } from '../../services/keezly-api.service';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-dash-board-component',
  standalone: true,
  imports: [],
  templateUrl: './dash-board-component.html',
  styleUrl: './dash-board-component.scss',
})
export class DashBoardComponent implements OnInit{

  // Assuming KeezlyApiService is injected
  private apiService = inject(KeezlyApiService);
  private appStateService = inject(AppStateService); // Inject the new service

  // This property will be used to notify the main app component to show the login screen
  // You must bind this property to the main app state (e.g., via Output or a Shared State Service)
  isLocked: boolean = false;

  constructor() {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  /**
   * Calls the Python backend to clear the encryption key and locks the app.
   */
  async lockApp(): Promise<void> {
    try {
      // 1. Call the Python API to clear the encryption key
      const result = await this.apiService.lock();

      if (result.success) {
        // 2. Clear local data and notify the app to switch views
        console.log("App successfully locked by Python backend.");
        this.appStateService.setLocked();
        // In a real app, you'd emit an event or update a shared state here.
        this.isLocked = true; 
        
        // OPTIONAL: Reload the window if state management is complex
        // window.location.reload(); 
        
      } else {
        console.error("Lock failed:", result.message);
        // Handle error (e.g., show a toast notification)
      }

    } catch (error) {
      console.error('API communication error during lock:', error);
    }
  }

}
