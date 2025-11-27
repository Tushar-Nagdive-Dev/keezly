import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// NOTE: I'm assuming the paths to LoginComponent and DashBoardComponent are correct.
import { LoginComponent } from './core/components/login-component/login-component';
import { DashBoardComponent } from './core/components/dash-board-component/dash-board-component';
import { CommonModule, AsyncPipe } from '@angular/common'; // Import AsyncPipe
import { AppStateService } from './core/services/app-state.service';
import { Observable } from 'rxjs'; // Import Observable for type safety

@Component({
  selector: 'app-root',
  standalone: true, // Assuming this is a standalone component, required for imports array
  imports: [
    CommonModule, // For *ngIf
    AsyncPipe,    // For | async
    LoginComponent,
    DashBoardComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Use 'protected' for properties accessed only within the component class or its template
  protected readonly title = signal('keezly-ui');

  private appStateService = inject(AppStateService);
  
  // Property to hold the locked status observable (used with | async in the template)
  // This is correctly typed as an Observable<boolean>
  protected isLocked$: Observable<boolean> = this.appStateService.isLocked$;

  // REMOVED:
  // LoginComponent: any; // UNNECESSARY - Caused the TS(2339) error
  // loginComponent: any; // UNNECESSARY - Caused the TS(2339) error
}