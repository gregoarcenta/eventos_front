import { MainComponent } from "./main/main.component";
import {
  NgbDropdownModule,
  NgbCollapseModule,
} from "@ng-bootstrap/ng-bootstrap";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { NavigationComponent } from "./navigation/navigation.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [MainComponent, NavigationComponent, SidebarComponent],
  imports: [CommonModule, RouterModule, NgbCollapseModule, NgbDropdownModule],
})
export class LayoutModule {}
