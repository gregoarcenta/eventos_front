import { DataService } from './../data.service';
import { DataCatalog } from "./../../interfaces/catalogs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, EMPTY, catchError, filter, forkJoin, map, switchMap, take } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataStore {
  private servicesSubject = new BehaviorSubject<DataCatalog[]>([]);
  private documentsSubject = new BehaviorSubject<DataCatalog[]>([]);
  private provincesSubject = new BehaviorSubject<DataCatalog[]>([]);
  private localitiesSubject = new BehaviorSubject<DataCatalog[]>([]);

  get services$() {
    return this.servicesSubject.asObservable();
  }

  get documents$() {
    return this.documentsSubject.asObservable();
  }

  get provinces$() {
    return this.provincesSubject.asObservable();
  }

  get localities$() {
    return this.localitiesSubject.asObservable();
  }

  constructor(private dataService: DataService, private router: Router) {
    forkJoin([
      this.services$.pipe(
        take(1),
        filter((services) => services.length === 0),
        switchMap(() => this.dataService.getAllServices()),
        map((response) => response.data)
      ),
      this.documents$.pipe(
        take(1),
        filter((documents) => documents.length === 0),
        switchMap(() => this.dataService.getAllDocuments()),
        map((response) => response.data)
      ),
      this.provinces$.pipe(
        take(1),
        filter((provinces) => provinces.length === 0),
        switchMap(() => this.dataService.getAllProvinces()),
        map((response) => response.data)
      ),
      this.localities$.pipe(
        take(1),
        filter((localities) => localities.length === 0),
        switchMap(() => this.dataService.getAllLocalities()),
        map((response) => response.data)
      ),
    ])
      .pipe(
        catchError(() => {
          this.router.navigateByUrl("/");
          return EMPTY;
        })
      )
      .subscribe((response) => {
        const [services, documents, provinces, localities] = response;
        this.setServices(services);
        this.setDocuments(documents);
        this.setProvinces(provinces);
        this.setLocalities(localities);
      });
  }

  setServices(services: DataCatalog[]) {
    this.servicesSubject.next(services);
  }

  setDocuments(documents: DataCatalog[]) {
    this.documentsSubject.next(documents);
  }

  setProvinces(provinces: DataCatalog[]) {
    this.provincesSubject.next(provinces);
  }

  setLocalities(localities: DataCatalog[]) {
    this.localitiesSubject.next(localities);
  }
}
