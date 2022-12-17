import { DashboardGuard } from "./../../dashboard/guards/dashboard.guard";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountSettingsComponent } from "./account-settings.component";

const routes: Routes = [
  {
    path: "",
    component: AccountSettingsComponent,
    canActivate: [DashboardGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountSettingsRoutingModule {}
