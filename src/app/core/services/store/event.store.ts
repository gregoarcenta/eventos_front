import { EventService } from "../api/event.service";
import { ICatalog } from "../../interfaces/Catalog";
import { IEvent } from "../../interfaces/Event";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, map, of, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EventStore {
  public totalEvents?: number;
  public currentPage: number = 1;

  private eventsSubject = new BehaviorSubject<IEvent[]>([]);
  private eventsFeaturedSubject = new BehaviorSubject<IEvent[]>([]);
  private eventsUpcomingSubject = new BehaviorSubject<IEvent[]>([]);
  private citiesSubject = new BehaviorSubject<ICatalog[]>([]);
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

  set(events: IEvent[]) {
    this.eventsSubject.next(events);
  }

  setCities(cities: ICatalog[]) {
    this.citiesSubject.next(cities);
  }

  setFeatured(featured: IEvent[]) {
    this.eventsFeaturedSubject.next(featured);
  }

  setUpcoming(upcoming: IEvent[]) {
    this.eventsUpcomingSubject.next(upcoming);
  }

  getAllEvents() {
    this.loadingSubject.next(true);
    return this.eventService.getAllEvents().pipe(
      tap((response) => {
        this.eventsSubject.next(response.data.events);
        this.loadingSubject.next(false);
      })
    );
  }

  searchEvents(term: string) {
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
