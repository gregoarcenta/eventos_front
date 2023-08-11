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

  private eventsSubject = new BehaviorSubject<Event[]>([]);
  public events$: Observable<Event[]> = this.eventsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

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
        this.eventsSubject.next(response.data);
        this.loadingSubject.next(false);
      })
    );
  }

  getAllEventsPublish(): Observable<ResponseEvents> {
    this.loadingSubject.next(true);
    return this.http.get<any>(`${this.url}/events/publish`).pipe(
      tap((response) => {
        this.eventsSubject.next(response.data);
        this.loadingSubject.next(false);
      })
    );
  }

  getFeaturedEvents(): Observable<ResponseEvents> {
    return this.http
      .get<any>(`${this.url}/events/featured`)
      .pipe(tap((response) => (this.setFeatured = response.data)));
  }

  getUpcomingEvents(): Observable<ResponseEvents> {
    return this.http
      .get<any>(`${this.url}/events/upcoming`)
      .pipe(tap((response) => (this.setUpcoming = response.data)));
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
          this.eventsSubject.next(response.data);
        })
      );
  }

  searchEventsPublish(conditions: any): Observable<ResponseEvents> {
    return this.http.post<any>(`${this.url}/events/search/publish`, {
      conditions,
    });
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
