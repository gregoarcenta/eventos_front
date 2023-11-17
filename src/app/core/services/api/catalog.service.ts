import { ResponseCatalog } from "../../interfaces/catalogs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CatalogService {
  private url: string = environment.url;

  constructor(private http: HttpClient) {}

  getAllDocuments(): Observable<ResponseCatalog> {
    return this.http.get<ResponseCatalog>(`${this.url}/documents`);
  }

  getAllServices(): Observable<ResponseCatalog> {
    return this.http.get<ResponseCatalog>(`${this.url}/services`);
  }

  getAllLocalities(): Observable<ResponseCatalog> {
    return this.http.get<ResponseCatalog>(`${this.url}/localities`);
  }

  getAllProvinces(): Observable<ResponseCatalog> {
    return this.http.get<ResponseCatalog>(`${this.url}/provinces`);
  }

  getCitiesByProvinceId(provinceId: number): Observable<ResponseCatalog> {
    return this.http.get<ResponseCatalog>(`${this.url}/cities/${provinceId}`);
  }
}
