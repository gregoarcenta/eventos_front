import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private url: string = environment.url;

  constructor(private http: HttpClient) { }

  submitContact(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}/contact`, data)
  }
}
