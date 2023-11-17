import { ResponseEvent, ResponseEvents } from "./../../interfaces/event";
import { ResponseCatalog } from "./../../interfaces/catalogs";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EventService {
  private url: string = environment.url;

  constructor(private http: HttpClient) {}

  searchEvents(term: string): Observable<ResponseEvents> {
    return this.http.post<any>(`${this.url}/events/search`, { term });
  }

  searchEventsPublish(
    currentPage: number,
    conditions: any
  ): Observable<ResponseEvents> {
    const pageSize: number = environment.pageSizeEvents;
    return this.http.post<any>(
      `${this.url}/events/search/publish?page=${currentPage}&pageSize=${pageSize}`,
      {
        conditions,
      }
    );
  }

  getAllEvents(): Observable<ResponseEvents> {
    return this.http.get<any>(`${this.url}/events`);
  }

  getEventsPublish(currentPage: number): Observable<ResponseEvents> {
    const pageSize: number = environment.pageSizeEvents;
    return this.http.get<any>(
      `${this.url}/events/publish?page=${currentPage}&pageSize=${pageSize}` // TODO: Refactor query params
    );
  }

  getFeaturedEvents(): Observable<ResponseEvents> {
    return this.http.get<any>(`${this.url}/events/featured`);
  }

  getUpcomingEvents(): Observable<ResponseEvents> {
    return this.http.get<any>(`${this.url}/events/upcoming`);
  }

  getEventById(id: number): Observable<ResponseEvent> {
    return this.http.get<any>(`${this.url}/events/get-event/${id}`);
  }

  getEventPublishById(id: number): Observable<ResponseEvent> {
    return this.http.get<any>(`${this.url}/events/${id}`);
  }

  getCitiesEvents(): Observable<ResponseCatalog> {
    return this.http.get<ResponseCatalog>(`${this.url}/events/cities`);
  }

  createEvent(event: any): Observable<any> {
    return this.http.post<any>(`${this.url}/events`, event);
  }

  updateDataGeneralEvent(event: any, eventId: number): Observable<any> {
    return this.http.put<any>(`${this.url}/events/general`, { event, eventId });
  }

  updateDataPlaceEvent(event: any, eventId: number): Observable<any> {
    return this.http.put<any>(`${this.url}/events/place`, { event, eventId });
  }

  updateDataLocalitiesEvent(event: any, eventId: number): Observable<any> {
    return this.http.put<any>(`${this.url}/events/localities`, {
      event,
      eventId,
    });
  }

  // deteleEvent(id: number): Observable<any> {
  //   return this.http.delete<any>(`${this.url}/events`, data)
  // }
}
