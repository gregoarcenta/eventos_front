import { environment } from "../../../environments/environment";
import { AuthService } from "../services/api/auth.service";
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

import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.authService.isAuthenticate().pipe(
      tap((auth) => {
        if (!auth) {
          if (environment.domain === "admin.eventosec.com") {
            this.router.navigate(["/administrador/login"]);
          } else {
            this.router.navigate(["/login"]);
          }
        }
      })
    );
  }
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | boolean {
    return this.authService.isAuthenticate().pipe(
      tap((auth) => {
        if (!auth) {
          if (environment.domain === "admin.eventosec.com") {
            this.router.navigate(["/administrador/login"]);
          } else {
            this.router.navigate(["/login"]);
          }
        }
      })
    );
  }
}
