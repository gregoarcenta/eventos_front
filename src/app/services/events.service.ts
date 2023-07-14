import { Event, ResponseEvent, ResponseEvents } from './../interfaces/event';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private url: string = environment.url;

  private events: Event[] = [];

  get getEvents() {
    return this.events;
  }

  set setEvents(events: Event[]) {
    this.events = events;
  }

  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<ResponseEvents> {
    return this.http.get<any>(`${this.url}/events`)
  }

  getEventsById(id:number): Observable<ResponseEvent> {
    return this.http.get<any>(`${this.url}/events/${id}`)
  }

  createEvent(event: any): Observable<any> {
    return this.http.post<any>(`${this.url}/events`, event)
  }

  searchEvent(term: string): Observable<ResponseEvents> {
    return this.http.get<any>(`${this.url}/events/search/${term}`)
  }

  /* updateEvent(data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/events`, data)
  }

  deteleEvent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/events`, data)
  } */
}
