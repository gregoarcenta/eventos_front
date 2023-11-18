import { DirectionsResponse } from "../../interfaces/Direction";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DirectionService {
  private url: string = "https://api.mapbox.com/directions/v5/mapbox/driving";
  private accessToken = environment.tokenMapbox;

  constructor(private http: HttpClient) {}

  getRuteCoords(
    start: [number, number],
    end: [number, number]
  ): Observable<DirectionsResponse> {
    return this.http.get<any>(
      `${this.url}/${start.join(',')};${end.join(',')}?alternatives=false&geometries=geojson&language=es&overview=simplified&steps=false&access_token=${this.accessToken}`
    );
  }
}
