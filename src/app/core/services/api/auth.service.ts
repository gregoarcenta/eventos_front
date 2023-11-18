import { IUser, IUserAuth } from '../../interfaces/User';
import { environment } from "../../../../environments/environment";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, of, tap } from "rxjs";
import { ApiResponse } from '../../interfaces/Http';
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private authUser?: IUser;
  private url: string = environment.url;

  get getAuthUser() {
    return this.authUser;
  }

  set setAuthUser(user: IUser) {
    this.authUser = user;
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  isAuthenticate(): Observable<boolean> {
    const token: string = localStorage.getItem("token") || "";

    if (!token) return of(false);

    if (this.authUser) return of(true);

    return this.http.get<ApiResponse<IUserAuth>>(`${this.url}/login/renew`).pipe(
      map(({ data }) => {
        localStorage.setItem("token", data.jwt);
        this.authUser = data.user;
        return true;
      }),
      catchError((_) => of(false))
    );
  }

  login(data: any): Observable<ApiResponse<IUserAuth>> {
    return this.http.post<ApiResponse<IUserAuth>>(`${this.url}/login`, data).pipe(
      tap(({ data }) => {
        this.authUser = data.user;
        localStorage.setItem("token", data.jwt);
      })
    );
  }

  async onLogout() {
    const response = await Swal.fire({
      title: "¿Estás seguro que deseas cerrar sesión?",
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
