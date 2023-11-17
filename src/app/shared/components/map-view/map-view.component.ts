import { MapStore } from "../../../core/services/store/map.store";
import { Map } from "mapbox-gl";
import { PlaceStore } from "../../../core/services/store/place.store";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "app-map-view",
  templateUrl: "./map-view.component.html",
  styleUrls: ["./map-view.component.scss"],
})
export class MapViewComponent implements OnInit, AfterViewInit {
  @ViewChild("mapDiv") mapViewElement!: ElementRef;
  @Input() markRoute: Boolean = false;

  constructor(
    private place: PlaceStore,
    private map: MapStore
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const coords =
      this.place.userLocation || this.place.placeLocation;
    if (this.markRoute) {
      const map = new Map({
        container: this.mapViewElement.nativeElement, // container ID
        style: "mapbox://styles/mapbox/streets-v12", // style URL
        center: coords!,
        zoom: 16, // starting zoom
      });
      this.map.setRute(map);
    } else {
      setTimeout(() => {
        const map = new Map({
          container: this.mapViewElement.nativeElement, // container ID
          style: "mapbox://styles/mapbox/streets-v12", // style URL
          center: coords!, // starting position [lng, lat]
          zoom: 16, // starting zoom
        });

        this.map.setMap(map);

        this.map.createMarker(coords!);

        map.on("click", (event) => {
          this.place.setPlaceLocation(
            event.lngLat.lng,
            event.lngLat.lat
          );
        });
      });
    }
  }
}
