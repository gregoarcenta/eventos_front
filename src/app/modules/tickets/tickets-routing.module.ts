import { DashboardGuard } from './../../dashboard/guards/dashboard.guard';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TicketsComponent } from "./pages/tickets/tickets.component";

const routes: Routes = [
  {
    path: "",
    component: TicketsComponent,
    canActivate:[DashboardGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsRoutingModule {}
