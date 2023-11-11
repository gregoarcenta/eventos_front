import { environment } from '../../../environments/environment';
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from "@angular/router";
import { Observable, tap, map } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class NoAuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.authService.isAuthenticate().pipe(
      tap((auth) => {
        if (auth) {
          if (environment.domain === "admin.eventosec.com") {
            this.router.navigate(["/administrador/dashboard"]);
          } else {
            this.router.navigate(["/"]);
          }
        }
      }),
      map((value) => {
        return !value;
      })
    );
  }
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | boolean {
    return this.authService.isAuthenticate().pipe(
      tap((auth) => {
        if (auth) {
          if (environment.domain === "admin.eventosec.com") {
            this.router.navigate(["/administrador/dashboard"]);
          } else {
            this.router.navigate(["/"]);
          }
        }
      }),
      map((value) => {
        return !value;
      })
    );
  }
}
