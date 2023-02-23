import { environment } from "./../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private url: string = environment.url;

  constructor(private http: HttpClient) {}

  getUserByEmail(email: string): Observable<boolean> {
    return this.http
      .get<any>(`${this.url}/user/find-by-email/${email}`)
      .pipe(map(({ data }) => data.valid));
  }

  getUserByUsername(username: string): Observable<boolean> {
    return this.http
      .get<any>(`${this.url}/user/find-by-username/${username}`)
      .pipe(map(({ data }) => data.valid));
  }

  getUserByDocument(num_document: string): Observable<boolean> {
    return this.http
      .get<any>(`${this.url}/user/find-by-document/${num_document}`)
      .pipe(map(({ data }) => data.valid));
  }

  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.url}/user`, user);
  }
}
