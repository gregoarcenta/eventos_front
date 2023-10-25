import { SpinnerService } from "./../services/spinner.service";
import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from "@angular/common/http";
import { Observable, finalize } from "rxjs";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private spinner: SpinnerService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinner.show();

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
    return next.handle(request).pipe(
      finalize(() => {
        this.spinner.hide();
      })
    );
  }
}
