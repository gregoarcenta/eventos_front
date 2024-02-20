import { IUser, IUserAuth } from "../../interfaces/User";
import { environment } from "../../../../environments/environment";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { catchError, map, Observable, of, tap } from "rxjs";
import { ApiResponse } from "../../interfaces/Http";
import Swal from "sweetalert2";

declare const google: any;

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
    private router: Router,
    private zone: NgZone
  ) {
    this.cargarScript()
      .then(() => {
        google.accounts.id.initialize({
          client_id: environment.client_id,
          callback: this.handleCredentialResponse.bind(this),
        });
      })
      .catch((err) =>
        console.error("Error al cargar el script de google:", err)
      );
  }

  isAuthenticate(): Observable<boolean> {
    const token: string = localStorage.getItem("token") || "";

    if (!token) return of(false);

    if (this.authUser) return of(true);

    return this.http
      .get<ApiResponse<IUserAuth>>(`${this.url}/login/renew`)
      .pipe(
        map(({ data }) => {
          localStorage.setItem("token", data.jwt);
          this.authUser = data.user;
          return true;
        }),
        catchError((_) => of(false))
      );
  }

  login(data: any): Observable<ApiResponse<IUserAuth>> {
    return this.http
      .post<ApiResponse<IUserAuth>>(`${this.url}/login`, data)
      .pipe(
        tap(({ data }) => {
          this.authUser = data.user;
          localStorage.setItem("token", data.jwt);
        })
      );
  }

  loginGoogle(tokenGoogle: string): Observable<ApiResponse<IUserAuth>> {
    return this.http
      .post<ApiResponse<IUserAuth>>(`${this.url}/login/google`, { tokenGoogle })
      .pipe(
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
      const { google: isGoogleAccount, email } = this.getAuthUser!;

      isGoogleAccount ? this.logoutGoogle(email) : this.logout();
    }
  }

  logoutGoogle(email: string) {
    google.accounts.id.revoke(email, () => {
      this.authUser = undefined;
      localStorage.removeItem("token");
      this.router.navigate(["/login"]);
    });
  }

  logout() {
    this.authUser = undefined;
    localStorage.removeItem("token");

    if (environment.domain === "eventosec.com") {
      this.router.navigate(["/login"]);
    } else {
      this.router.navigate(["/administrador/login"]);
    }
  }

  handleCredentialResponse(response: any) {
    // console.log("Encoded JWT ID token: " + response.credential);
    this.loginGoogle(response.credential).subscribe({
      next: (_) => {
        this.zone.run(() => this.router.navigateByUrl("/"));
      },
      error: ({ error }) => {
        if (error.status === 403) {
          google.accounts.id.revoke("gregoarcenta@gmail.com", () => {
            this.zone.run(() => this.router.navigateByUrl("/login"));
          });
        }
      },
    });
  }

  public cargarScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => {
        // Script cargado exitosamente
        resolve();
      };
      script.onerror = (error) => {
        // Hubo un error al cargar el script
        reject(error);
      };

      // Agrega el script al DOM.
      document.head.appendChild(script);
    });
  }
}
