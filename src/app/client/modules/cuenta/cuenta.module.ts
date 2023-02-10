import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuentaRoutingModule } from './cuenta-routing.module';
import { MisDatosComponent } from './pages/mis-datos/mis-datos.component';
import { MisComprasComponent } from './pages/mis-compras/mis-compras.component';


@NgModule({
  declarations: [
    MisDatosComponent,
    MisComprasComponent
  ],
  imports: [
    CommonModule,
    CuentaRoutingModule
  ]
})
export class CuentaModule { }
