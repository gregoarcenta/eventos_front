import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuentaRoutingModule } from './cuenta-routing.module';
import { MisDatosComponent } from './pages/mis-datos/mis-datos.component';
import { MisComprasComponent } from './pages/mis-compras/mis-compras.component';
import { CuentaLayoutComponent } from './cuenta-layout.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';


@NgModule({
  declarations: [
    MisDatosComponent,
    MisComprasComponent,
    CuentaLayoutComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    CuentaRoutingModule,
    ReactiveFormsModule,
    ImageCropperModule
  ]
})
export class CuentaModule { }
