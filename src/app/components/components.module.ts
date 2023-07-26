import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SpinnerComponent } from "./spinner/spinner.component";
import { MapComponent } from "./map/map.component";
import { MapSpinnerComponent } from "./map-spinner/map-spinner.component";
import { MapViewComponent } from "./map-view/map-view.component";
import { EventCardComponent } from "./event-card/event-card.component";
import { RouterModule } from "@angular/router";
import { CreateOrEditEventComponent } from "./create-or-edit-event/create-or-edit-event.component";
import { MatStepperModule } from "@angular/material/stepper";
import { ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxMaskModule } from 'ngx-mask'

@NgModule({
  declarations: [
    SpinnerComponent,
    MapComponent,
    MapSpinnerComponent,
    MapViewComponent,
    EventCardComponent,
    CreateOrEditEventComponent,
  ],
  exports: [
    SpinnerComponent,
    MapComponent,
    EventCardComponent,
    CreateOrEditEventComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatStepperModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxMaskModule.forRoot(),
  ],
})
export class ComponentsModule {}
