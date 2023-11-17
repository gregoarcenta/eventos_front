import { ResponsePlace, ResponsePlaces } from "./../../interfaces/place";
import { environment } from "./../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PlaceService {
  private url: string = environment.url;

  constructor(private http: HttpClient) {}

  getPlaceById(id: number): Observable<ResponsePlace> {
    return this.http.get<any>(`${this.url}/places/${id}`);
  }

  searchPlaces(term: string): Observable<ResponsePlaces> {
    return this.http.get<ResponsePlaces>(`${this.url}/places/search/${term}`);
  }
}
