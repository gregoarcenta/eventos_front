import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


// COMPONENTS
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { EditEventComponent } from './components/events/edit-event/edit-event.component';
import { LocalitiesDataFormComponent } from './components/events/localities-data-form/localities-data-form.component';
import { PlaceDataFormComponent } from './components/events/place-data-form/place-data-form.component';
import { GeneralDataFormComponent } from './components/events/general-data-form/general-data-form.component';
import { CreateEventComponent } from './components/events/create-event/create-event.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { MapSpinnerComponent } from './components/map-spinner/map-spinner.component';
import { MapComponent } from './components/map/map.component';

//PIPES
import { CapitalizeFirstLetterPipe } from './pipes/capitalize-first-letter.pipe';

// LIBRARIES
import { NgxMaskModule } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';


@NgModule({
  declarations: [
    SpinnerComponent,
    MapComponent,
    MapSpinnerComponent,
    MapViewComponent,
    EventCardComponent,
    CreateEventComponent,
    GeneralDataFormComponent,
    PlaceDataFormComponent,
    LocalitiesDataFormComponent,
    EditEventComponent,
    CapitalizeFirstLetterPipe
  ],
  exports: [
    SpinnerComponent,
    MapComponent,
    EventCardComponent,
    CreateEventComponent,
    EditEventComponent,
    CapitalizeFirstLetterPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatStepperModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgSelectModule,
    MatTabsModule,
    NgxMaskModule.forRoot(),
  ]
})
export class SharedModule { }
