import { RestoreAccountComponent } from "./pages/restore-account/restore-account.component";
import { SendMailrestoreAccountComponent } from "./pages/send-mailrestore-account/send-mailrestore-account.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RestoreAccountRoutingModule } from "./restore-account-routing.module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [RestoreAccountComponent, SendMailrestoreAccountComponent],
  imports: [CommonModule, RestoreAccountRoutingModule, ReactiveFormsModule],
})
export class RestoreAccountModule {}
