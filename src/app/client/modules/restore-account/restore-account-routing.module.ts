import { RestoreAccountComponent } from './pages/restore-account/restore-account.component';
import { SendMailrestoreAccountComponent } from './pages/send-mailrestore-account/send-mailrestore-account.component';
import { NoAuthGuard } from './../../../guards/noAuth.guard';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: SendMailrestoreAccountComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: ":token",
    component: RestoreAccountComponent,
    canActivate: [NoAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestoreAccountRoutingModule {}
