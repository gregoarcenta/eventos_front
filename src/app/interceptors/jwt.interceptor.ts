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
      const contentType =
        request.headers.get("Content-Type") === "multipart/form-data"
          ? null
          : "application/json";

      let objRequest: any = { Authorization: `Bearer ${token}` };

      if (contentType)
        objRequest = { ...objRequest, "Content-Type": contentType };

      request = request.clone({
        headers: new HttpHeaders(objRequest),
      });
    }
    return next.handle(request);
  }
}
