import { ApiResponse } from './../../interfaces/Http';
import { ICatalog } from './../../interfaces/Catalog';
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

  getAllDocuments(): Observable<ApiResponse<ICatalog[]>> {
    return this.http.get<ApiResponse<ICatalog[]>>(`${this.url}/documents`);
  }

  getAllServices(): Observable<ApiResponse<ICatalog[]>> {
    return this.http.get<ApiResponse<ICatalog[]>>(`${this.url}/services`);
  }

  getAllLocalities(): Observable<ApiResponse<ICatalog[]>> {
    return this.http.get<ApiResponse<ICatalog[]>>(`${this.url}/localities`);
  }

  getAllProvinces(): Observable<ApiResponse<ICatalog[]>> {
    return this.http.get<ApiResponse<ICatalog[]>>(`${this.url}/provinces`);
  }

  getCitiesByProvinceId(provinceId: number): Observable<ApiResponse<ICatalog[]>> {
    return this.http.get<ApiResponse<ICatalog[]>>(`${this.url}/cities/${provinceId}`);
  }
}
