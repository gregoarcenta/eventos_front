import { AuthService } from "./../../../../../services/auth.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-mis-datos",
  templateUrl: "./mis-datos.component.html",
  styleUrls: ["./mis-datos.component.scss"],
})
export class MisDatosComponent implements OnInit {
  get authUser() {
    return this.authService.getAuthUser;
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
}
