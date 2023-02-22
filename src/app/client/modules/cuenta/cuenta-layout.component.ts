import { AuthService } from "./../../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";

@Component({
  selector: "app-cuenta-layout",
  templateUrl: "./cuenta-layout.component.html",
  styleUrls: ["./cuenta-layout.component.scss"],
})
export class CuentaLayoutComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
  }
}
