import { Injectable } from "@angular/core";
import { LngLat, Map, Marker } from "mapbox-gl";

@Injectable({
  providedIn: "root",
})
export class MapService {
  private map?: Map;
  private marker?: Marker;

  get isReadyMap() {
    return !!this.map;
  }

  setMap(map: Map) {
    this.map = map;
  }
  constructor() {}

  flyTo(coords: LngLat) {
    /* if (!this.isReadyMap) {
      throw new Error("El mapa no esta inicializado");
    } */

    this.map?.flyTo({
      zoom: 16,
      center: coords,
    });
  }

  createMarker(coords: LngLat) {
    this.marker?.remove();
    this.marker = new Marker({ color: "red" })
      .setLngLat(coords)
      .addTo(this.map!);
  }

}
