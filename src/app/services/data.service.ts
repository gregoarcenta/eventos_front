import { DataCatalog, ResponseCatalog } from "../interfaces/catalogs";
import { environment } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, map, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private url: string = environment.url;
  private documents: DataCatalog[] = [];
  private services: DataCatalog[] = [];
  private localities: DataCatalog[] = [];
  private provinces: DataCatalog[] = [];
  private cities: DataCatalog[] = []; //TODO: Eliminar eso my utilizar el del observable

  private citiesSubject = new BehaviorSubject<DataCatalog[]>([]);
  public cities$ = this.citiesSubject.asObservable();

  set setCitiesObsevable(cities:DataCatalog[]){
    this.citiesSubject.next(cities)
  }

  get getDocuments() {
    return this.documents;
  }

  set setDocuments(documents: DataCatalog[]) {
    this.documents = documents;
  }

  get getServices() {
    return this.services;
  }

  set setServices(services: DataCatalog[]) {
    this.services = services;
  }

  get getLocalities() {
    return this.localities;
  }

  set setLocalities(localities: DataCatalog[]) {
    this.localities = localities;
  }

  get getProvinces() {
    return this.provinces;
  }

  set setProvinces(provinces: DataCatalog[]) {
    this.provinces = provinces;
  }

  get getCities() {
    return this.cities;
  }

  set setCities(cities: DataCatalog[]) {
    this.cities = cities;
  }

  constructor(private http: HttpClient) {}

  getAllDocuments(): Observable<ResponseCatalog> {
    return this.http
      .get<ResponseCatalog>(`${this.url}/documents`)
      .pipe(tap((response) => (this.setDocuments = response.data)));
  }

  getAllServices(): Observable<ResponseCatalog> {
    return this.http
      .get<ResponseCatalog>(`${this.url}/services`)
      .pipe(tap((response) => (this.setServices = response.data)));
  }

  getAllLocalities(): Observable<ResponseCatalog> {
    return this.http
      .get<ResponseCatalog>(`${this.url}/localities`)
      .pipe(tap((response) => (this.setLocalities = response.data)));
  }

  getAllprovinces(): Observable<ResponseCatalog> {
    return this.http
      .get<ResponseCatalog>(`${this.url}/provinces`)
      .pipe(tap((response) => (this.setProvinces = response.data)));
  }

  getCitiesByProvinceId(provinceId: number): Observable<ResponseCatalog> {
    return this.http.get<ResponseCatalog>(`${this.url}/cities/${provinceId}`);
  }
}
