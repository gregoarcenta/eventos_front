import { ComponentsModule } from "./../../../components/components.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EventsRoutingModule } from "./events-routing.module";

import { EventsComponent } from "./events.component";
import { ReactiveFormsModule } from "@angular/forms";
import { CreateEventAdminComponent } from "./pages/create-event-admin/create-event-admin.component";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { EditEventAdminComponent } from './pages/edit-event-admin/edit-event-admin.component';

@NgModule({
  declarations: [EventsComponent, CreateEventAdminComponent, EditEventAdminComponent],
  imports: [
    CommonModule,
    EventsRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    NgbTooltipModule,
  ],
})
export class EventsModule {}
