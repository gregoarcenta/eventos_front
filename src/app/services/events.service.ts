import { DataCatalog, ResponseCatalog } from "./../interfaces/catalogs";
import { Event, ResponseEvent, ResponseEvents } from "./../interfaces/event";
import { environment } from "./../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EventService {
  private url: string = environment.url;

  public totalEvents?: number;
  public currentPage: number = 1;

  private eventsSubject = new BehaviorSubject<Event[]>([]);
  public events$: Observable<Event[]> = this.eventsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  private spinnerSubject = new BehaviorSubject<boolean>(false);
  public spinner$: Observable<boolean> = this.spinnerSubject.asObservable();

  private cities: DataCatalog[] = [];
  private featured: Event[] = [];
  private upcoming: Event[] = [];

  get getCities() {
    return this.cities;
  }

  set setCities(cities: DataCatalog[]) {
    this.cities = cities;
  }

  get getFeatured() {
    return this.featured;
  }

  set setFeatured(featured: Event[]) {
    this.featured = featured;
  }

  get getUpcoming() {
    return this.upcoming;
  }

  set setUpcoming(upcoming: Event[]) {
    this.upcoming = upcoming;
  }

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<ResponseEvents> {
    this.loadingSubject.next(true);
    return this.http.get<any>(`${this.url}/events`).pipe(
      tap((response) => {
        this.eventsSubject.next(response.data.events);
        this.loadingSubject.next(false);
      })
    );
  }

  getAllEventsPublish(
    currentPage: number,
    pageSize: number
  ): Observable<ResponseEvents> {
    if (currentPage > 1) {
      this.spinnerSubject.next(true);
    } else {
      this.loadingSubject.next(true);
    }
    return this.http
      .get<any>(
        `${this.url}/events/publish?page=${currentPage}&pageSize=${pageSize}`
      )
      .pipe(
        tap((response) => {
          this.eventsSubject.next([
            ...this.eventsSubject.getValue(),
            ...response.data.events,
          ]);
          if (currentPage > 1) {
            this.spinnerSubject.next(false);
          } else {
            this.loadingSubject.next(false);
          }
          this.totalEvents = response.data.total;
        })
      );
  }

  getFeaturedEvents(): Observable<ResponseEvents> {
    return this.http
      .get<any>(`${this.url}/events/featured`)
      .pipe(tap((response) => (this.setFeatured = response.data.events)));
  }

  getUpcomingEvents(): Observable<ResponseEvents> {
    return this.http
      .get<any>(`${this.url}/events/upcoming`)
      .pipe(tap((response) => (this.setUpcoming = response.data.events)));
  }

  getEventById(id: number): Observable<ResponseEvent> {
    return this.http.get<any>(`${this.url}/events/get-event/${id}`);
  }

  getEventPublishById(id: number): Observable<ResponseEvent> {
    return this.http.get<any>(`${this.url}/events/${id}`);
  }

  searchEvents(term: string): Observable<ResponseEvents> {
    return this.http
      .post<any>(`${this.url}/events/search`, { term })
      .pipe(
        tap((response) => {
          this.eventsSubject.next(response.data.events);
        })
      );
  }

  searchEventsPublish(
    currentPage: number,
    pageSize: number,
    conditions: any
  ): Observable<ResponseEvents> {
    return this.http.post<any>(
      `${this.url}/events/search/publish?page=${currentPage}&pageSize=${pageSize}`,
      {
        conditions,
      }
    );
  }

  getCitiesEvents(): Observable<ResponseCatalog> {
    return this.http
      .get<ResponseCatalog>(`${this.url}/events/cities`)
      .pipe(tap((response) => (this.setCities = response.data)));
  }

  createEvent(event: any): Observable<any> {
    return this.http.post<any>(`${this.url}/events`, event);
  }

  updateEvent(event: any, eventId: number): Observable<any> {
    return this.http.put<any>(`${this.url}/events`, { event, eventId });
  }

  // deteleEvent(id: number): Observable<any> {
  //   return this.http.delete<any>(`${this.url}/events`, data)
  // }
}
