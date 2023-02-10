import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RegistroRoutingModule } from "./registro-routing.module";
import { RegistroComponent } from "./pages/registro/registro.component";
import { VerifyRegisterComponent } from "./pages/verify-register/verify-register.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [RegistroComponent, VerifyRegisterComponent],
  imports: [CommonModule, RegistroRoutingModule, ReactiveFormsModule],
})
export class RegistroModule {}
