import { AuthGuard } from "./../../../guards/auth.guard";
import { MisDatosComponent } from "./pages/mis-datos/mis-datos.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CuentaLayoutComponent } from "./cuenta-layout.component";
import { MisComprasComponent } from "./pages/mis-compras/mis-compras.component";
import { ChangePasswordComponent } from "./pages/change-password/change-password.component";

const routes: Routes = [
  {
    path: "",
    component: CuentaLayoutComponent,
    children: [
      {
        path: "mis-datos",
        component: MisDatosComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "mis-compras",
        component: MisComprasComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "cambiar-contrasenia",
        component: ChangePasswordComponent,
        canActivate: [AuthGuard],
      },
      { path: "**", redirectTo: "mis-datos" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuentaRoutingModule {}
