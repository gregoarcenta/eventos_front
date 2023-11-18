import { Route } from "../../interfaces/Direction";
import { DirectionService } from "../api/direction.service";
import { Injectable } from "@angular/core";
import { AnySourceData, LngLat, LngLatBounds, Map, Marker } from "mapbox-gl";

@Injectable({
  providedIn: "root",
})
export class MapStore {
  private map?: Map;
  private marker?: Marker;

  private mapRute?: Map;

  get isReadyMap() {
    return !!this.map;
  }

  setMap(map: Map) {
    this.map = map;
  }

  setRute(map: Map) {
    this.mapRute = map;
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
    if (!this.mapRute)
      throw new Error("Mapa para mostrar la ruta no inicializado 1");

    new Marker({ color: "red" }).setLngLat(startCoords).addTo(this.mapRute!);
    new Marker({ color: "blue" }).setLngLat(endCoords).addTo(this.mapRute!);
  }

  getRouteBetweenPoints(start: [number, number], end: [number, number]) {
    this.directionService.getRuteCoords(start, end).subscribe((resp) => {
      this.createMarkerMapRutes(
        new LngLat(start[0], start[1]),
        new LngLat(end[0], end[1])
      );
      this.drawPolyline(resp.routes[0]);
    });
  }

  private drawPolyline(route: Route) {
    if (!this.mapRute)
      throw new Error("Mapa para mostrar la ruta no inicializado");

    const coords = route.geometry.coordinates;

    const bounds = new LngLatBounds();
    coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));

    this.mapRute.fitBounds(bounds, {
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
    this.mapRute.on("load", () => {
      this.mapRute!.addSource("RouteString", sourceData);
      this.mapRute!.addLayer({
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
      this.mapRute!.resize()
    });
  }
}
