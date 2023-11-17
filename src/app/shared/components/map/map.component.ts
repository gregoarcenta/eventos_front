import { PlaceStore } from "../../../core/services/store/place.store";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit {
  @Input() editMode: boolean = false;
  @Input() markRoute: Boolean = false;

  get isUserLocationReady(): boolean {
    return this.place.isUserLocationReady;
  }

  get isPlaceLocationReady(): boolean {
    return this.place.isPlaceLocationReady;
  }

  get isGeolocationDenied() {
    return this.place.isGeolocationDenied;
  }

  constructor(private place: PlaceStore) {}

  ngOnInit(): void {}
}
