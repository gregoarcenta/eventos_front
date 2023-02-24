import { AuthGuard } from "./../guards/auth.guard";
import { AuthUserGuard } from "./../guards/auth-user.guard";
import { NoAuthGuard } from "./../guards/noAuth.guard";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";

const routes: Routes = [
  {
    path: "login",
    loadChildren: () =>
      import("./modules/auth/auth.module").then((m) => m.AuthModule),
    canLoad: [NoAuthGuard],
  },
  {
    path: "registro",
    loadChildren: () =>
      import("./modules/registro/registro.module").then(
        (m) => m.RegistroModule
      ),
    canLoad: [NoAuthGuard],
  },
  {
    path: "",
    component: LayoutComponent,
    canActivate: [AuthUserGuard],
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./modules/inicio/inicio.module").then((m) => m.InicioModule),
        pathMatch: "full",
      },
      {
        path: "eventos",
        loadChildren: () =>
          import("./modules/eventos/eventos.module").then(
            (m) => m.EventosModule
          ),
      },
      {
        path: "contactanos",
        loadChildren: () =>
          import("./modules/contacto/contacto.module").then(
            (m) => m.ContactoModule
          ),
      },
      {
        path: "terminos",
        loadChildren: () =>
          import("./modules/terminos/terminos.module").then(
            (m) => m.TerminosModule
          ),
      },
      {
        path: "politicas",
        loadChildren: () =>
          import("./modules/politicas/politicas.module").then(
            (m) => m.PoliticasModule
          ),
      },
      {
        path: "cuenta",
        loadChildren: () =>
          import("./modules/cuenta/cuenta.module").then((m) => m.CuentaModule),
        canLoad: [AuthGuard],
      },
      {
        path: "recuperar-cuenta",
        loadChildren: () =>
          import("./modules/restore-account/restore-account.module").then(
            (m) => m.RestoreAccountModule
          ),
        canLoad: [NoAuthGuard],
      },
      {
        path: "**",
        redirectTo: "",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
