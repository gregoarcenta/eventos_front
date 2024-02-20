import { AuthService } from "../services/api/auth.service";
import { environment } from "../../../environments/environment";
import Swal from "sweetalert2";
import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { catchError, Observable } from "rxjs";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(({ error }) => {
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

          console.log("error: ", error);

          error.emailGoogle
            ? this.authService.logoutGoogle(error.emailGoogle)
            : this.authService.logout();

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
