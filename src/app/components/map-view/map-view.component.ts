import { MapService } from "./../../services/map.service";
import { Map } from "mapbox-gl";
import { PlaceService } from "./../../services/place.service";
import {
  AfterViewInit,
  Component,
  ElementRef,
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

  constructor(
    private placeService: PlaceService,
    private mapService: MapService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const coords =
      this.placeService.userLocation || this.placeService.placeLocation;
    const map = new Map({
      container: this.mapViewElement.nativeElement, // container ID
      style: "mapbox://styles/mapbox/streets-v12", // style URL
      center: coords!, // starting position [lng, lat]
      zoom: 16, // starting zoom
    });

    this.mapService.setMap(map);

    this.mapService.createMarker(coords!);

    map.on("click", (event) => {
      this.placeService.setPlaceLocation(event.lngLat.lng, event.lngLat.lat);
    });
  }
}
