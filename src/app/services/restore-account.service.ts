import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestoreAccountService {
  private url: string = environment.url;

  constructor(private http: HttpClient) {}

  sendMailRestoreAccount(email: string): Observable<any> {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(`${this.url}/recover`, { email }, { headers });
  }

  isValidTokenRestoreAccount(token: string):Observable<any>  {
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("authorization", `bearer ${token}`);

    return this.http.get(`${this.url}/recover`, { headers });
  }

  restoreAccount(token: string, password: string): Observable<any>  {
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("authorization", `bearer ${token}`);

    return this.http.put(`${this.url}/recover`, { password }, { headers });
  }
}
