import { ICatalog } from '../../interfaces/Catalog';
import { ApiResponse } from '../../interfaces/Http';
import { IEvent, IEventList, ILocality } from '../../interfaces/Eventgfds';
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

  searchEvents(term: string): Observable<ApiResponse<IEventList>> {
    return this.http.post<ApiResponse<IEventList>>(
      `${this.url}/events/search`,
      { term }
    );
  }

  searchEventsPublish(
    currentPage: number,
    conditions: any
  ): Observable<ApiResponse<IEventList>> {
    const pageSize: number = environment.pageSizeEvents;
    return this.http.post<ApiResponse<IEventList>>(
      `${this.url}/events/search/publish?page=${currentPage}&pageSize=${pageSize}`,
      {
        conditions,
      }
    );
  }

  getAllEvents(): Observable<ApiResponse<IEventList>> {
    return this.http.get<ApiResponse<IEventList>>(`${this.url}/events`);
  }

  getEventsPublish(currentPage: number): Observable<ApiResponse<IEventList>> {
    const pageSize: number = environment.pageSizeEvents;
    return this.http.get<ApiResponse<IEventList>>(
      `${this.url}/events/publish?page=${currentPage}&pageSize=${pageSize}` // TODO: Refactor query params
    );
  }

  getFeaturedEvents(): Observable<ApiResponse<IEventList>> {
    return this.http.get<ApiResponse<IEventList>>(`${this.url}/events/featured`);
  }

  getUpcomingEvents(): Observable<ApiResponse<IEventList>> {
    return this.http.get<ApiResponse<IEventList>>(`${this.url}/events/upcoming`);
  }

  getEventById(id: number): Observable<ApiResponse<IEvent>> {
    return this.http.get<ApiResponse<IEvent>>(`${this.url}/events/get-event/${id}`);
  }

  getEventPublishById(id: number): Observable<ApiResponse<IEvent>> {
    return this.http.get<ApiResponse<IEvent>>(`${this.url}/events/${id}`);
  }

  getCitiesEvents(): Observable<ApiResponse<ICatalog[]>> {
    return this.http.get<ApiResponse<ICatalog[]>>(`${this.url}/events/cities`);
  }

  createEvent(event: any): Observable<ApiResponse<null>> {
    return this.http.post<any>(`${this.url}/events`, event);
  }

  updateDataGeneralEvent(event: any, eventId: number): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.url}/events/general`, { event, eventId });
  }

  updateDataPlaceEvent(event: any, eventId: number): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.url}/events/place`, { event, eventId });
  }

  updateDataLocalitiesEvent(event: any, eventId: number): Observable<ApiResponse<ILocality[]>> {
    return this.http.put<ApiResponse<ILocality[]>>(`${this.url}/events/localities`, {
      event,
      eventId,
    });
  }

  // deteleEvent(id: number): Observable<any> {
  //   return this.http.delete<any>(`${this.url}/events`, data)
  // }
}
