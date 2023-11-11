import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-account-settings",
  templateUrl: "./account-settings.component.html",
  styleUrls: ["./account-settings.component.scss"],
})
export class AccountSettingsComponent implements OnInit {
  get authUser() {
    return this.authService.getAuthUser;
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
}
