import { ResponseDocuments } from "./../interfaces/document";
import { environment } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private url: string = environment.url;

  constructor(private http: HttpClient) {}

  documents(): Observable<ResponseDocuments> {
    let headers = new HttpHeaders().set("Content-Type", "application/json");

    return this.http.get<ResponseDocuments>(`${this.url}/documents`, {
      headers,
    });
  }
}
