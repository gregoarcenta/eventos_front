import { AuthGuard } from './../../../guards/auth.guard';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TicketsComponent } from "./pages/tickets/tickets.component";

const routes: Routes = [
  {
    path: "",
    component: TicketsComponent,
    canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsRoutingModule {}
