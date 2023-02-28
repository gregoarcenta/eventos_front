import { RestoreAccountComponent } from "./pages/restore-account/restore-account.component";
import { SendMailRestoreAccountComponent } from "./pages/send-mail-restore-account/send-mail-restore-account.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RestoreAccountRoutingModule } from "./restore-account-routing.module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [RestoreAccountComponent, SendMailRestoreAccountComponent],
  imports: [CommonModule, RestoreAccountRoutingModule, ReactiveFormsModule],
})
export class RestoreAccountModule {}
