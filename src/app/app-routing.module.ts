import { DomainAdminGuard } from "./guards/domain-admin.guard";
import { Routes } from "@angular/router";
import { DomainClientGuard } from "./guards/domain-client.guard";

export const Approutes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./client/client.module").then((m) => m.ClientModule),
    canLoad: [DomainClientGuard],
    pathMatch: "full",
  },
  {
    path: "administrador",
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminModule),
    canLoad: [DomainAdminGuard],
  },
  {
    path: "**",
    redirectTo: "",
  },
];
