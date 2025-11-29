import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AppStateService } from "./app-state.service";
import { firstValueFrom } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthGaurd implements CanActivate {
    constructor(
        private appState: AppStateService,
        private router: Router
    ) {}

    async canActivate(): Promise<boolean> {
        const locked = await firstValueFrom(this.appState.isLocked$);
        if (locked) {
            this.router.navigate(['/lock']);
            return false;
        }
        return true;
    };
}