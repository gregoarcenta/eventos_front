import { AuthService } from "./../../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  public isCollapsed = true;

  get authUser() {
    return this.authService.getAuthUser;
  }

  get getImgUser() {
    if (this.authUser?.img) return this.authUser?.img;

    return "assets/images/default-image-profile.png";
  }

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  navigateByUrl(url: string) {
    this.isCollapsed = true;
    this.router.navigate([url]);
  }

  logout() {
    this.authService.onLogout();
  }
}
