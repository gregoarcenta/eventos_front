import { LayoutModule } from './layout/layout.module';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AdminRoutingModule } from "./admin-routing.module";

@NgModule({
  declarations: [],
  imports: [CommonModule, AdminRoutingModule, LayoutModule],
})
export class AdminModule {}
