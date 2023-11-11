import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { LayoutModule } from "./layout/layout.module";


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    LayoutModule
  ]
})
export class ClientModule { }
