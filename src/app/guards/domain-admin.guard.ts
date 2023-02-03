import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DomainAdminGuard implements CanActivate, CanLoad {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(DOCUMENT) document: any
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // const hostname = document.location.hostname;
    const hostname = "admin.eventosec.com";

    if (hostname === "admin.eventosec.com") {
      return true;
    } else {
      this.router.navigateByUrl("/");
      return false;
    }
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    // const hostname = document.location.hostname;
    const hostname = "admin.eventosec.com";

    if (hostname === "admin.eventosec.com") {
      return true;
    } else {
      this.router.navigateByUrl("/");
      return false;
    }
  }
}
