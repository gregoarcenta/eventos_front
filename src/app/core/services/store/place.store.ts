import { MapStore } from "./map.store";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LngLat } from "mapbox-gl";

@Injectable({
  providedIn: "root",
})
export class PlaceStore {
  public userLocation: LngLat | null = null;
  public placeLocation: LngLat | null = null;

  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }

  get isPlaceLocationReady(): boolean {
    return !!this.placeLocation;
  }

  get isGeolocationDenied() {
    const result = localStorage.getItem("GEOLOCATION_PERMISSION_DENIED");
    if (result == "1") return true;
    return false;
  }

  constructor(private http: HttpClient, private map: MapStore) {}

  getUserLocation(forRoute: boolean = false): Promise<LngLat> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = new LngLat(coords.longitude, coords.latitude);
          if (!forRoute) this.setUserLocation(this.userLocation);

          localStorage.setItem("GEOLOCATION_PERMISSION_DENIED", "0");
          resolve(this.userLocation);
        },
        (error) => {
          this.placeLocation = null;
          if (error.code === error.PERMISSION_DENIED) {
            localStorage.setItem("GEOLOCATION_PERMISSION_DENIED", "1");
            reject("Permiso de geolocalización denegado");
          } else {
            reject("Error al obtener la geolocalización");
          }
        }
      );
    });
  }

  setUserLocation(coords: LngLat) {
    this.placeLocation = null;
    this.userLocation = coords;
    this.map.flyTo(this.userLocation);
    this.map.createMarker(this.userLocation);
  }

  setPlaceLocation(lng: any, lat: any) {
    this.userLocation = null;
    this.placeLocation = new LngLat(Number(lng), Number(lat));
    this.map.flyTo(this.placeLocation);
    this.map.createMarker(this.placeLocation);
  }
}
