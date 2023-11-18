import { ApiResponse } from '../../interfaces/Http';
import { IPlace } from '../../interfaces/Placefgfds';
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

  getPlaceById(id: number): Observable<ApiResponse<IPlace>> {
    return this.http.get<ApiResponse<IPlace>>(`${this.url}/places/${id}`);
  }

  searchPlaces(term: string): Observable<ApiResponse<IPlace[]>> {
    return this.http.get<ApiResponse<IPlace[]>>(`${this.url}/places/search/${term}`);
  }
}
