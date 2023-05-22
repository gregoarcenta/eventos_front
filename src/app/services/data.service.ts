import { DataCatalog, ResponseCatalog } from "../interfaces/catalogs";
import { environment } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private url: string = environment.url;
  private documents: DataCatalog[] = [];

  get getDocuments() {
    return this.documents;
  }

  set setDocuments(documents: DataCatalog[]) {
    this.documents = documents;
  }

  constructor(private http: HttpClient) {}

  getAllDocuments(): Observable<ResponseCatalog> {
    return this.http.get<ResponseCatalog>(`${this.url}/documents`);
  }

  getAllServices(): Observable<ResponseCatalog> {
    return this.http.get<ResponseCatalog>(`${this.url}/services`);
  }

  getAllprovinces(): Observable<ResponseCatalog> {
    return this.http.get<ResponseCatalog>(`${this.url}/provinces`);
  }

  getCitiesByProvinceId(provinceId: number): Observable<ResponseCatalog> {
    return this.http.get<ResponseCatalog>(`${this.url}/cities/${provinceId}`);
  }
}
