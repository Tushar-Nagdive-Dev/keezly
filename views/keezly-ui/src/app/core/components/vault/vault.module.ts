import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { VaultRoutes } from "./vault.routes";
import { VaultList } from "./vault-list/vault-list";
import { FormsModule } from "@angular/forms";
import { VaultItemCard } from "./vault-item-card/vault-item-card";
import { VaultEditor } from "./vault-editor/vault-editor";
import { VaultView } from "./vault-view/vault-view";
import { VaultDeleteDialog } from "./vault-delete-dialog/vault-delete-dialog";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(VaultRoutes)
    ],
    declarations: [
        VaultList,
        VaultItemCard,
        VaultEditor,
        VaultView,
        VaultDeleteDialog
    ]
})

export class VaultModule {}