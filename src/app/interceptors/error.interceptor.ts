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
  constructor(private router: Router, private spinner: SpinnerService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string = localStorage.getItem("token") || "";
    return next.handle(request).pipe(
      catchError(({ error }) => {
        this.spinner.setActive(false);
        console.error(error);

        if (error.status === 401) {
          // this.router.navigateByUrl("/login");
          Swal.fire("¡Lo sentimos!", environment.msgErrorSession, "error");
          throw error;
        }

        if (error.status === 500) {
          Swal.fire("¡Lo sentimos!", environment.msgErrorDefault, "error");
          // this.router.navigateByUrl("/");
        }
        return next.handle(request);
      })
    );
  }
}
