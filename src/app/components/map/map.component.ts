import { PlaceService } from "./../../services/place.service";
import {

  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit {
  @Input() editMode:boolean = false

  get isUserLocationReady(): boolean {
    return this.placeService.isUserLocationReady;
  }

  get isPlaceLocationReady(): boolean {
    return this.placeService.isPlaceLocationReady;
  }

  get isGeolocationDenied() {
    return this.placeService.isGeolocationDenied;
  }

  constructor(private placeService: PlaceService) {}

  ngOnInit(): void {}
}