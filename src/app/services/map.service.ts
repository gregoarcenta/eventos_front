import { Route } from "./../interfaces/Directions";
import { DirectionService } from "./direction.service";
import { Injectable } from "@angular/core";
import { AnySourceData, LngLat, LngLatBounds, Map, Marker } from "mapbox-gl";

@Injectable({
  providedIn: "root",
})
export class MapService {
  private map?: Map;
  private marker?: Marker;

  private mapRutes?: Map;

  get isReadyMap() {
    return !!this.map;
  }

  setMap(map: Map) {
    this.map = map;
  }

  setMapRutes(map: Map) {
    this.mapRutes = map;
  }

  constructor(private directionService: DirectionService) {}

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

  createMarkerMapRutes(startCoords: LngLat, endCoords: LngLat) {
    new Marker({ color: "red" }).setLngLat(startCoords).addTo(this.mapRutes!);
    new Marker({ color: "blue" }).setLngLat(endCoords).addTo(this.mapRutes!);
  }

  getRouteBetweenPoints(start: [number, number], end: [number, number]) {
    this.directionService.getRuteCoords(start, end).subscribe((resp) => {
      this.drawPolyline(resp.routes[0]);
    });
  }

  private drawPolyline(route: Route) {
    if (!this.mapRutes)
      throw new Error("Mapa para mostrar la ruta no inicializado");

    const coords = route.geometry.coordinates;

    const bounds = new LngLatBounds();
    coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));

    this.mapRutes.fitBounds(bounds, {
      padding: 20,
    });

    //polyline
    const sourceData: AnySourceData = {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coords,
            },
          },
        ],
      },
    };

    //todo: Limpiar ruta previa
    this.mapRutes.on("style.load", () => {
      this.mapRutes!.addSource("RouteString", sourceData);
      this.mapRutes!.addLayer({
        id: "RouteString",
        type: "line",
        source: "RouteString",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "black",
          "line-width": 3,
        },
      });
    })
  }
}
