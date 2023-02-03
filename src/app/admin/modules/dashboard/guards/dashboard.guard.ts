import { AuthService } from "./../../modules/auth/services/auth.service";
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
export class DashboardGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.authService.isAuthenticate().pipe(
      tap((auth) => {
        if (!auth) {
          this.router.navigateByUrl("/login");
        }
      })
    );
  }
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | boolean {
    return this.authService.isAuthenticate().pipe(
      tap((auth) => {
        if (!auth) {
          this.router.navigateByUrl("/login");
        }
      })
    );
  }
}
