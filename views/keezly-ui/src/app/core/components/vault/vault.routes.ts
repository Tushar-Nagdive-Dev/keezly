import { Routes } from "@angular/router";
import { VaultList } from "./vault-list/vault-list";

export const VaultRoutes: Routes = [
    {
        path: '',
        component: VaultList
    },
    {
        path: 'new',
        component: VaultList
    },
    {
        path: ':id',
        component: VaultList
    }
];