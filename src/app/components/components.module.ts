import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SpinnerComponent } from "./spinner/spinner.component";
import { MapComponent } from './map/map.component';
import { MapSpinnerComponent } from './map-spinner/map-spinner.component';
import { MapViewComponent } from './map-view/map-view.component';

@NgModule({
  declarations: [SpinnerComponent, MapComponent, MapSpinnerComponent, MapViewComponent],
  imports: [CommonModule],
  exports: [SpinnerComponent, MapComponent],
})
export class ComponentsModule {}
