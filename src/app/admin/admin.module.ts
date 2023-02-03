import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { NavigationComponent } from './shared/navigation/navigation.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    LayoutComponent,
    NavigationComponent,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgbModule,
  ]
})
export class AdminModule { }
