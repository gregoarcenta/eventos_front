import { AuthService } from "./../../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit {
  get authUser() {
    return this.authService.getAuthUser;
  }

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  navigateByUrl(url: string) {
    this.hideMenu();
    this.router.navigate([url]);
  }

  hideMenu() {
    const menu = document.querySelector(".menu");
    menu?.classList.remove("show");
  }

  logout() {
    this.hideMenu();
    this.authService.onLogout();
  }
}
