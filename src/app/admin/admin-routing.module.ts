import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("./modules/dashboard/dashboard.module").then((m) => m.DashboardModule),
        data: {
          title: "Dashboard",
        },
      },
      {
        path: "ajustes",
        loadChildren: () =>
          import("./modules/account-settings/account-settings.module").then(
            (m) => m.AccountSettingsModule
          ),
        data: {
          title: "Ajustes",
        },
      },
      {
        path: "boletos",
        loadChildren: () =>
          import("./modules/tickets/tickets.module").then(
            (m) => m.TicketsModule
          ),
        data: {
          title: "Boletos",
        },
      },
      {
        path: "component",
        loadChildren: () =>
          import("./component/component.module").then(
            (m) => m.ComponentsModule
          ),
      },
      { path: "**", redirectTo: "dashboard" },
    ],
  },
  {
    path: "login",
    loadChildren: () =>
      import("./modules/auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "**",
    redirectTo: "",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
