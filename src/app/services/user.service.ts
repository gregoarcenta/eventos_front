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
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http
      .get<any>(`${this.url}/user/find-by-email/${email}`, { headers })
      .pipe(map(({ data }) => data.valid));
  }

  getUserByUsername(username: string): Observable<boolean> {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http
      .get<any>(`${this.url}/user/find-by-username/${username}`, {
        headers,
      })
      .pipe(map(({ data }) => data.valid));
  }

  getUserByDocument(num_document: string): Observable<boolean> {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http
      .get<any>(`${this.url}/user/find-by-document/${num_document}`, {
        headers,
      })
      .pipe(map(({ data }) => data.valid));
  }

  updateUser(user: any): Observable<any> {
    const token = localStorage.getItem("token");
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("authorization", `bearer ${token}`);

    return this.http.put<any>(`${this.url}/user`, user, { headers });
  }
}
