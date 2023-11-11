import { MapService } from "../../../core/services/map.service";
import { Map } from "mapbox-gl";
import { PlaceService } from "../../../core/services/place.service";
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
    private placeService: PlaceService,
    private mapService: MapService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const coords =
      this.placeService.userLocation || this.placeService.placeLocation;
    if (this.markRoute) {
      const map = new Map({
        container: this.mapViewElement.nativeElement, // container ID
        style: "mapbox://styles/mapbox/streets-v12", // style URL
        center: coords!,
        zoom: 16, // starting zoom
      });
      this.mapService.setMapRutes(map);
    } else {
      setTimeout(() => {
        const map = new Map({
          container: this.mapViewElement.nativeElement, // container ID
          style: "mapbox://styles/mapbox/streets-v12", // style URL
          center: coords!, // starting position [lng, lat]
          zoom: 16, // starting zoom
        });

        this.mapService.setMap(map);

        this.mapService.createMarker(coords!);

        map.on("click", (event) => {
          this.placeService.setPlaceLocation(
            event.lngLat.lng,
            event.lngLat.lat
          );
        });
      });
    }
  }
}
