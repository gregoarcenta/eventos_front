import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventosRoutingModule } from './eventos-routing.module';
import { EventosComponent } from './pages/eventos/eventos.component';
import { EventoComponent } from './pages/evento/evento.component';


@NgModule({
  declarations: [
    EventosComponent,
    EventoComponent
  ],
  imports: [
    CommonModule,
    EventosRoutingModule
  ]
})
export class EventosModule { }
