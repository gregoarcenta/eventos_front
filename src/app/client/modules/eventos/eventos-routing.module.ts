import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EventosComponent } from "./pages/eventos/eventos.component";
import { EventoComponent } from "./pages/evento/evento.component";

const routes: Routes = [
  { path: "", component: EventosComponent },
  { path: ":evento", component: EventoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventosRoutingModule {}
