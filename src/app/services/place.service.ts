import { MapService } from "./map.service";
import { ResponsePlace, ResponsePlaces } from "./../interfaces/place";
import { environment } from "./../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LngLat } from "mapbox-gl";

@Injectable({
  providedIn: "root",
})
export class PlaceService {
  private url: string = environment.url;
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

  constructor(private http: HttpClient, private mapService: MapService) {}

  getUserLocation(): Promise<LngLat> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.setUserLocation(new LngLat(coords.longitude, coords.latitude));
          localStorage.setItem("GEOLOCATION_PERMISSION_DENIED", "0");
          resolve(this.userLocation!);
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
    this.mapService.flyTo(this.userLocation);
    this.mapService.createMarker(this.userLocation);
  }

  setPlaceLocation(lng: any, lat: any) {
    this.userLocation = null;
    this.placeLocation = new LngLat(Number(lng), Number(lat));
    this.mapService.flyTo(this.placeLocation);
    this.mapService.createMarker(this.placeLocation);
  }

  getEventsById(id: number): Observable<ResponsePlace> {
    return this.http.get<any>(`${this.url}/places/${id}`);
  }

  searchPlaces(term: string): Observable<ResponsePlaces> {
    return this.http.get<ResponsePlaces>(`${this.url}/places/search/${term}`);
  }
}
