import { DomainAdminGuard } from "./core/guards/domain-admin.guard";
import { Routes } from "@angular/router";
import { DomainClientGuard } from "./core/guards/domain-client.guard";

export const AppRoutes: Routes = [
  {
    path: "administrador",
    loadChildren: () =>
    import("./admin/admin.module").then((m) => m.AdminModule),
    canLoad: [DomainAdminGuard],
  },
  {
    path: "",
    loadChildren: () =>
      import("./client/client.module").then((m) => m.ClientModule),
    canLoad: [DomainClientGuard],
  },
];
