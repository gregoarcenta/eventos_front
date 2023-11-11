import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from "@angular/core";
import { CommonModule, registerLocaleData } from "@angular/common";

import { EventosRoutingModule } from "./eventos-routing.module";
import { EventosComponent } from "./pages/eventos/eventos.component";
import { EventoComponent } from "./pages/evento/evento.component";
import { NgbCarouselModule, NgbPopoverModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
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
    ReactiveFormsModule,
    SharedModule,
    NgxSkeletonLoaderModule,
    NgbPopoverModule,
    NgbCarouselModule,
    NgbTooltipModule,
    MatButtonModule
  ],
})
export class EventosModule {}
