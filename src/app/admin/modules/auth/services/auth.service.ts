import { environment } from './../../../../../environments/environment';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, of, tap } from "rxjs";
import { Auth, User } from "../interfaces/user";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private authUser?: User;
  private url: string = environment.url;

  get getAuthUser() {
    return this.authUser;
  }

  set setAuthUser(user: User) {
    this.authUser = user;
  }

  constructor(private http: HttpClient, private router: Router) {}

  isAuthenticate(): Observable<boolean> {
    const token: string = localStorage.getItem("token") || "";

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    if (token) headers = headers.set("authorization", `bearer ${token}`);

    return this.http
      .get<Auth>(`${this.url}/login/renew`, {
        headers,
      })
      .pipe(
        map(({ data }) => {
          localStorage.setItem("token", data.jwt);
          this.authUser = data.user;
          return true;
        }),
        catchError(({ error }) => {
          return of(false);
        })
      );
  }

  login(data: any): Observable<Auth> {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http
      .post<Auth>(`${this.url}/login`, data, {
        headers,
      })
      .pipe(tap(({ data }) => localStorage.setItem("token", data.jwt)));
  }

  logout() {
    localStorage.removeItem("token");
    this.authUser = undefined;
    this.router.navigateByUrl("/login");
  }
}
