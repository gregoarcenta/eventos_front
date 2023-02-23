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
          catchError((_) => of(false))
        );
    }
    return of(false);
  }

  login(data: any): Observable<ResponseUser> {
    return this.http.post<ResponseUser>(`${this.url}/login`, data).pipe(
      tap(({ data }) => {
        this.authUser = data.user;
        localStorage.setItem("token", data.jwt);
      })
    );
  }

  async onLogout() {
    const response = await Swal.fire({
      title: "¿Estas seguro que deseas cerrar sesión?",
      icon: "warning",
      confirmButtonText: "Si, cerrar sesión",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#7460ee",
    });
    if (response.isConfirmed) {
      this.logout();
    }
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
