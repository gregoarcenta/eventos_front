import { ComponentsModule } from "./../../../components/components.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EventsRoutingModule } from "./events-routing.module";

import { EventsComponent } from "./events.component";
import { ReactiveFormsModule } from "@angular/forms";
import { EventComponent } from "./pages/event/event.component";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";

@NgModule({
  declarations: [EventsComponent, EventComponent],
  imports: [
    CommonModule,
    EventsRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
  ],
})
export class EventsModule {}
