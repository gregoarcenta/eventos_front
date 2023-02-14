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

  async logout() {
    const response = await Swal.fire({
      title: "¿Estas seguro que deseas cerrar sesión?",
      icon: "warning",
      confirmButtonText: "Si, cerrar sesión",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#7460ee",
    });
    if (response.isConfirmed) {
      this.authService.logout();
    }
  }
}
