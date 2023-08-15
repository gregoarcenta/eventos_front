import { ComponentsModule } from "./../../../components/components.module";
import { NgModule } from "@angular/core";
import { CommonModule, registerLocaleData } from "@angular/common";

import { EventosRoutingModule } from "./eventos-routing.module";
import { EventosComponent } from "./pages/eventos/eventos.component";
import { EventoComponent } from "./pages/evento/evento.component";
import { NgbCarouselModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule } from "@angular/forms";
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

// Registra la localización en español
import localeEs from '@angular/common/locales/es-EC';
import { MatButtonModule } from "@angular/material/button";
registerLocaleData(localeEs);

@NgModule({
  declarations: [EventosComponent, EventoComponent],
  imports: [
    CommonModule,
    EventosRoutingModule,
    NgbCarouselModule,
    ComponentsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    NgbTooltipModule,
    MatButtonModule
  ],
})
export class EventosModule {}
