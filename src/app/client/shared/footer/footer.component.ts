import { AuthService } from "./../../../services/auth.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
  get authUser() {
    return this.authService.getAuthUser;
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
}
