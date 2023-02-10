import { NoAuthGuard } from "./../guards/noAuth.guard";
import { AuthGuard } from "./../guards/auth.guard";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";

const routes: Routes = [
  {
    path: "login",
    loadChildren: () =>
      import("./modules/auth/auth.module").then((m) => m.AuthModule),
    pathMatch: "full",
    canLoad: [NoAuthGuard],
  },
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("./modules/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
        canLoad: [AuthGuard],
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
        canLoad: [AuthGuard],
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
        canLoad: [AuthGuard],

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
        canLoad: [AuthGuard],
      },
      { path: "**", redirectTo: "dashboard" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
