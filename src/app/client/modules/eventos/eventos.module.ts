import { ComponentsModule } from "./../../../components/components.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EventosRoutingModule } from "./eventos-routing.module";
import { EventosComponent } from "./pages/eventos/eventos.component";
import { EventoComponent } from "./pages/evento/evento.component";
import { NgbCarouselModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [EventosComponent, EventoComponent],
  imports: [
    CommonModule,
    EventosRoutingModule,
    NgbCarouselModule,
    ComponentsModule,
    ReactiveFormsModule,
    NgbTooltipModule
  ],
})
export class EventosModule {}
