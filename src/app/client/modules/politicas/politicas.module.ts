import { PoliticasComponent } from './politicas.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoliticasRoutingModule } from './politicas-routing.module';


@NgModule({
  declarations: [
    PoliticasComponent
  ],
  imports: [
    CommonModule,
    PoliticasRoutingModule
  ]
})
export class PoliticasModule { }
