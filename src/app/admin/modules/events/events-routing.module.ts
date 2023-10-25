import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './../../../guards/auth.guard';
import { EventsComponent } from './events.component';
import { CreateEventAdminComponent } from './pages/create-event-admin/create-event-admin.component';
import { EditEventAdminComponent } from './pages/edit-event-admin/edit-event-admin.component';

const routes: Routes = [
  {
    path: "",
    component: EventsComponent,
    canActivate:[AuthGuard]
  },
  {
    path: "agregar",
    component: CreateEventAdminComponent,
    canActivate:[AuthGuard]
  },
  {
    path: ":id",
    component: EditEventAdminComponent,
    canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
