import { Routes } from '@angular/router';
import { LoginComponent } from './core/components/login-component/login-component';
import { DashboardComponent } from './core/components/dash-board-component/dash-board-component';
import { FeatureCardsComponent } from './core/components/feature-cards.component/feature-cards.component';
import { AuthGaurd } from './core/services/auth-guard.service';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'vault',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'vault',
        component: DashboardComponent
    },
    { 
        path: 'features', 
        component: FeatureCardsComponent ,
        canActivate: [AuthGaurd]
    },
    { 
        path: '**', 
        redirectTo: 'login', 
        pathMatch: 'full' 
    }
];
