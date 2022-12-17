import { Routes } from "@angular/router";
import { DashboardGuard } from "./dashboard/guards/dashboard.guard";

import { FullComponent } from "./layouts/full/full.component";
import { AuthGuard } from "./modules/auth/guards/auth.guard";
import { PageNotFoundComponent } from "./shared/page-not-found/page-not-found.component";

export const Approutes: Routes = [
  {
    path: "",
    component: FullComponent,
    children: [
      { path: "", redirectTo: "/dashboard", pathMatch: "full" },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
        canLoad: [DashboardGuard],
      },
      {
        path: "component",
        loadChildren: () =>
          import("./component/component.module").then(
            (m) => m.ComponentsModule
          ),
        canLoad: [DashboardGuard],
      },
    ],
  },
  {
    path: "login",
    loadChildren: () =>
      import("./modules/auth/auth.module").then((m) => m.AuthModule),
    canLoad: [AuthGuard],
  },
  {
    path: "**",
    redirectTo: "",
    // component: PageNotFoundComponent,
  },
];
