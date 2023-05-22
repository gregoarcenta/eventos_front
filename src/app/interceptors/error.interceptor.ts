import { AuthService } from "./../services/auth.service";
import { environment } from "./../../environments/environment";
import { SpinnerService } from "./../services/spinner.service";
import Swal from "sweetalert2";
import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private spinner: SpinnerService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(({ error }) => {
        this.spinner.setActive(false);
        if (
          error.message === "jwt expired" ||
          error.message === "invalid token" ||
          error.message === "invalid signature"
        ) {
          Swal.fire({
            title: "Sesión expirada",
            text: "Tu sesión expiró, inicia sesión nuevamente",
            icon: "info",
          });
          this.authService.logout();
          throw { error };
        } else if (error.status === 500) {
          Swal.fire("¡Lo sentimos!", environment.msgErrorDefault, "error");
        } else {
          Swal.fire("¡Lo sentimos!", error.message, "error");
        }
        return next.handle(request);
      })
    );
  }
}
