// src/app/app.routes.ts
import { Routes } from '@angular/router';

// Components (standalone)
import { LoginComponent } from './core/components/login-component/login-component';
import { DashboardShell } from './core/components/dashboard-shell/dashboard-shell';
import { AuthGaurd } from './core/services/auth-guard.service';
import { FeatureCardsComponent } from './core/components/feature-cards.component/feature-cards.component';


export const routes: Routes = [
  // Public login route
  { path: 'login', component: LoginComponent },

  // Shell with child routes (protected by AuthGuard)
  {
    path: '',
    component: DashboardShell,
    canActivate: [AuthGaurd],
    children: [
      { 
        path: '', 
        redirectTo: 'features', 
        pathMatch: 'full' 
    },
      { 
        path: 'features', 
        component: FeatureCardsComponent, 
        canActivate: [AuthGaurd] 
    },
      // Vault list route (create VaultListComponent when ready)
    //   { 
    //     path: 'vault', 
    //     component: VaultListComponent, 
    //     canActivate: [AuthGaurd] 
    // },
      // add additional child routes here (settings, profile, imports, etc.)
    ]
  },

  // Fallbacks
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // default to login if nothing matches
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
