import { MainComponent } from './layout/main/main.component';
import { NoAuthGuard } from "../core/guards/noAuth.guard";
import { AuthGuard } from "../core/guards/auth.guard";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

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
    component: MainComponent,
    children: [
      // Dashboard rute
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
      // Ajustes rute
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
      // Eventos rute
      {
        path: "eventos",
        loadChildren: () =>
          import("./modules/events/events.module").then(
            (m) => m.EventsModule
          ),
        canLoad: [AuthGuard],

        data: {
          title: "Eventos",
        },
      },
      // Boletos rute
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
      /* {
        path: "component",
        loadChildren: () =>
          import("./component/component.module").then(
            (m) => m.ComponentsModule
          ),
        canLoad: [AuthGuard],
      }, */
      { path: "**", redirectTo: "dashboard" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
