import { RestoreAccountComponent } from './pages/restore-account/restore-account.component';
import { SendMailRestoreAccountComponent } from './pages/send-mail-restore-account/send-mail-restore-account.component';
import { NoAuthGuard } from './../../../guards/noAuth.guard';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: SendMailRestoreAccountComponent,
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
