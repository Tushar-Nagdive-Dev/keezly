import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import AsyncPipe
import { AppStateService } from './core/services/app-state.service';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true, // Assuming this is a standalone component, required for imports array
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy{
  protected readonly title = signal('Keezly UI Application');

  private appState = inject(AppStateService);

  private router = inject(Router);

  private sub = new Subscription();

  ngOnInit(): void {
    const s = this.appState.isLocked$.subscribe(locked => {
      if(locked) {
        if(!this.router.url.startsWith('/lock')) {
          this.router.navigate(['/lock']);
        }
      } else {
        if(!this.router.url.startsWith('/vault')) {
          this.router.navigate(['/vault']);
        }
      }
    });

    this.sub.add(s);
  }
  ngOnDestroy(): void {
   this.sub.unsubscribe();
  }


}