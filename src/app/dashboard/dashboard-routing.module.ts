import { DashboardComponent } from "./dashboard.component";

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardGuard } from "./guards/dashboard.guard";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: DashboardComponent,
        data: {
          title: "Dashboard",
        },
        canActivate: [DashboardGuard],
      },
      {
        path: "ajustes",
        loadChildren: () =>
          import("../modules/account-settings/account-settings.module").then(
            (m) => m.AccountSettingsModule
          ),
        data: {
          title: "Ajustes",
        },
        canLoad: [DashboardGuard],
      },
      {
        path: "boletos",
        loadChildren: () =>
          import("../modules/tickets/tickets.module").then(
            (m) => m.TicketsModule
          ),
        data: {
          title: "Boletos",
        },
        canLoad: [DashboardGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
