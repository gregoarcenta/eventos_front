import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string = localStorage.getItem("token") || "";

    if (token) {
      request = request.clone({
        headers: new HttpHeaders()
          .set("Authorization", `Bearer ${token}`)
          .set("Content-Type", "application/json"),
      });
    }
    return next.handle(request);
  }
}
