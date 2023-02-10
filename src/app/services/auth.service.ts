import { SpinnerService } from "./spinner.service";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, of, tap } from "rxjs";
import { ResponseUser, User } from "../interfaces/user";
import Swal from "sweetalert2";

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

  constructor(
    private spinner: SpinnerService,
    private http: HttpClient,
    private router: Router
  ) {}

  isAuthenticate(): Observable<boolean> {
    const token: string = localStorage.getItem("token") || "";

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    if (token && this.authUser) return of(true);

    if (token) {
      this.spinner.setActive(true);
      headers = headers.set("authorization", `bearer ${token}`);
      return this.http
        .get<ResponseUser>(`${this.url}/login/renew`, {
          headers,
        })
        .pipe(
          map(({ data }) => {
            localStorage.setItem("token", data.jwt);
            this.authUser = data.user;
            this.spinner.setActive(false);
            return true;
          }),
          catchError(({ error }) => {
            if (error.message === "jwt expired") {
              Swal.fire({
                title: "Sesión expirada",
                text: "Tu sesión expiró, inicia sesión nuevamente",
                icon: "info",
                heightAuto: false,
              });
            }
            this.spinner.setActive(false);
            this.logout();
            return of(false);
          })
        );
    }
    return of(false);
  }

  login(data: any): Observable<ResponseUser> {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http
      .post<ResponseUser>(`${this.url}/login`, data, {
        headers,
      })
      .pipe(
        tap(({ data }) => {
          this.authUser = data.user;
          localStorage.setItem("token", data.jwt);
        })
      );
  }

  logout() {
    localStorage.removeItem("token");
    this.authUser = undefined;
    if (environment.domain === "eventosec.com") {
      this.router.navigate(["/login"]);
    } else {
      this.router.navigate(["/administrador/login"]);
    }
  }
}
