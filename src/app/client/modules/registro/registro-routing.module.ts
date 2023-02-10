import { RegistroComponent } from './pages/registro/registro.component';
import { VerifyRegisterComponent } from './pages/verify-register/verify-register.component';
import { NoAuthGuard } from "./../../../guards/noAuth.guard";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", component: RegistroComponent, canActivate: [NoAuthGuard] },
  {
    path: "verificacion/:token",
    component:VerifyRegisterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroRoutingModule {}
