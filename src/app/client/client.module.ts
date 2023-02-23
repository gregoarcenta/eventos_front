import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuComponent } from './shared/menu/menu.component';


@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    NgbCollapseModule
  ]
})
export class ClientModule { }
