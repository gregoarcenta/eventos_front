import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './../../../guards/auth.guard';
import { EventsComponent } from './events.component';
import { EventComponent } from './pages/event/event.component';

const routes: Routes = [
  {
    path: "",
    component: EventsComponent,
    canActivate:[AuthGuard]
  },
  {
    path: "agregar",
    component: EventComponent,
    canActivate:[AuthGuard]
  },
  {
    path: ":id",
    component: EventComponent,
    canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
