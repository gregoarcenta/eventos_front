import { environment } from "./../../../../environments/environment";
import { EventService } from "../api/event.service";
import { DataCatalog } from "../../interfaces/catalogs";
import { Event, ResponseEvents } from "../../interfaces/event";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, map, of, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EventStore {
  public totalEvents?: number;
  public currentPage: number = 1;

  private eventsSubject = new BehaviorSubject<Event[]>([]);
  private eventsFeaturedSubject = new BehaviorSubject<Event[]>([]);
  private eventsUpcomingSubject = new BehaviorSubject<Event[]>([]);
  private citiesSubject = new BehaviorSubject<DataCatalog[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private spinnerSubject = new BehaviorSubject<boolean>(false);

  get get$() {
    return this.eventsSubject.asObservable();
  }

  get featured$() {
    return this.eventsFeaturedSubject.asObservable();
  }

  get upcoming$() {
    return this.eventsUpcomingSubject.asObservable();
  }

  get cities$() {
    return this.citiesSubject.asObservable();
  }

  get loading$() {
    return this.loadingSubject.asObservable();
  }

  get spinner$() {
    return this.spinnerSubject.asObservable();
  }

  constructor(private eventService: EventService) {}

  set(events: Event[]) {
    this.eventsSubject.next(events);
  }

  setCities(cities: DataCatalog[]) {
    this.citiesSubject.next(cities);
  }

  setFeatured(featured: Event[]) {
    this.eventsFeaturedSubject.next(featured);
  }

  setUpcoming(upcoming: Event[]) {
    this.eventsUpcomingSubject.next(upcoming);
  }

  getAllEvents(): Observable<ResponseEvents> {
    this.loadingSubject.next(true);
    return this.eventService.getAllEvents().pipe(
      tap((response) => {
        this.eventsSubject.next(response.data.events);
        this.loadingSubject.next(false);
      })
    );
  }

  searchEvents(term: string): Observable<ResponseEvents> {
    return this.eventService.searchEvents(term).pipe(
      tap((response) => {
        this.eventsSubject.next(response.data.events);
      })
    );
  }

  getEventsPublish(): Observable<void> {
    this.loadingSubject.next(true);
    return this.eventService.getEventsPublish((this.currentPage = 1)).pipe(
      map((response) => {
        this.eventsSubject.next(response.data.events);
        this.totalEvents = response.data.total;
        this.loadingSubject.next(false);
      }),
      catchError(() => {
        this.eventsSubject.next([]);
        return of();
      })
    );
  }

  getMoreEventsPublish(): Observable<void> { // TODO: QUITAR SPINNER DE CARGA DEL INTERCEPTOR CUANDO SEA ESTA PETICION
    this.spinnerSubject.next(true);
    return this.eventService.getEventsPublish((this.currentPage += 1)).pipe(
      map((response) => {
        this.eventsSubject.next([
          ...this.eventsSubject.getValue(),
          ...response.data.events,
        ]);
        this.totalEvents = response.data.total;
        this.spinnerSubject.next(false);
      })
    );
  }
}
