import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { InicioComponent } from './inicio.component';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CardFeaturesUpcomingComponent } from './components/card-features-upcoming/card-features-upcoming.component'

@NgModule({
  declarations: [
    InicioComponent,
    CardFeaturesUpcomingComponent
  ],
  imports: [
    CommonModule,
    InicioRoutingModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InicioModule { }
