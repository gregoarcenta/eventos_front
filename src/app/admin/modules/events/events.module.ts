import { ComponentsModule } from './../../../components/components.module';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EventsRoutingModule } from "./events-routing.module";

import { EventsComponent } from "./events.component";
import { ReactiveFormsModule } from "@angular/forms";
import { EventComponent } from "./pages/event/event.component";
import { ImageCropperModule } from "ngx-image-cropper";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatStepperModule } from "@angular/material/stepper";
import { NgxMaskModule } from 'ngx-mask'

@NgModule({
  declarations: [EventsComponent, EventComponent],
  imports: [
    NgxMaskModule.forRoot(),
    CommonModule,
    EventsRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule
  ],
})
export class EventsModule {}
