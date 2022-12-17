import { DashboardGuard } from "./guards/dashboard.guard";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";
import { DashboardComponent } from "./dashboard.component";
import { SalesRatioComponent } from "./components/sales-ratio/sales-ratio.component";
import { FeedsComponent } from "./components/feeds/feeds.component";
import { TopSellingComponent } from "./components/top-selling/top-selling.component";
import { TopCardsComponent } from "./components/top-cards/top-cards.component";
import { BlogCardsComponent } from "./components/blog-cards/blog-cards.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgApexchartsModule,
    DashboardRoutingModule
  ],
  declarations: [
    DashboardComponent,
    SalesRatioComponent,
    FeedsComponent,
    TopSellingComponent,
    TopCardsComponent,
    BlogCardsComponent,
  ],
})
export class DashboardModule {}
