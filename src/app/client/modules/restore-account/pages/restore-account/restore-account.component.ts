import { User } from "./../../../../../interfaces/user";
import { environment } from "./../../../../../../environments/environment";
import { SpinnerService } from "./../../../../../services/spinner.service";
import { RestoreAccountService } from "./../../../../../services/restore-account.service";
import { _patternPassword } from "./../../../../../utils/regularPatterns";
import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-restore-account",
  templateUrl: "./restore-account.component.html",
  styleUrls: ["./restore-account.component.scss"],
})
export class RestoreAccountComponent implements OnInit {
  public token!: string;
  public user!: User;
  public password = new FormControl("", [
    Validators.required,
    Validators.pattern(_patternPassword),
  ]);

  get getMsgErrorPass() {
    if (this.password.getError("required")) {
      return "La contraseña es requerida";
    }
    if (this.password.getError("pattern")) {
      return `
      <small class="form-text text-danger little-alert d-block"
      >Ingrese una contraseña válida. Esta debe contener al
      menos:</small
    >
    <small class="form-text text-muted little-alert d-block"
      >- Entre 8 y 16 caracteres</small
    >
    <small class="form-text text-muted little-alert d-block"
      >- Una letra mayúscula</small
    >
    <small class="form-text text-muted little-alert d-block"
      >- Una letra minúscula</small
    >
    <small class="form-text text-muted little-alert d-block"
      >- Un número</small
    >
    <small class="form-text text-muted little-alert d-block"
      >- Puede contener caracteres especiales (-&*@/.)</small
    >
      `;
    }
    return "";
  }

  constructor(
    private restoreAccountService: RestoreAccountService,
    private spinner: SpinnerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get("token") || "";

    if (!this.token) {
      this.router.navigateByUrl("/");
      return;
    }
    this.restoreAccountService
      .isValidTokenRestoreAccount(this.token)
      .subscribe({
        next: (response) => {
          this.user = response.data;
        },
        error: ({ error }) => {
          console.error(error);
          if (error.status === 404) {
            Swal.fire({
              title: "Lo sentimos!",
              text: error.message,
              icon: "error",
              heightAuto: false,
            });
          } else if (error.message === "jwt expired") {
            Swal.fire({
              title: "Lo sentimos!",
              text: "El token ha exiprado, intentelo nuevamente",
              icon: "error",
              heightAuto: false,
            });
          } else {
            Swal.fire({
              title: "Lo sentimos!",
              text: environment.msgErrorDefault,
              icon: "error",
              heightAuto: false,
            });
          }
          this.router.navigateByUrl("/");
        },
      });
  }

  validInput() {
    return this.password.errors && this.password.touched;
  }

  restorePassword() {
    if (this.password.invalid) return this.password.markAllAsTouched();

    this.spinner.setActive(true);
    this.restoreAccountService
      .restoreAccount(this.token, this.password.value!)
      .subscribe({
        next: (response) => {
          this.spinner.setActive(false);
          Swal.fire({
            title: "Listo!",
            text: response.message,
            icon: "success",
            heightAuto: false,
          });
          localStorage.setItem("token", response.data.token);
          location.reload();
        },
        error: ({ error }) => {
          this.spinner.setActive(false);
          if (error.message === "jwt expired") {
            Swal.fire({
              title: "Lo sentimos!",
              text: "El token ha exiprado, intentelo nuevamente",
              icon: "error",
              heightAuto: false,
            });
          } else if (error.status === 401) {
            Swal.fire({
              title: "Lo sentimos!",
              text: error.message,
              icon: "error",
              heightAuto: false,
            });
          } else {
            Swal.fire({
              title: "Lo sentimos!",
              text: environment.msgErrorDefault,
              icon: "error",
              heightAuto: false,
            });
          }
          this.router.navigateByUrl("/");
        },
      });
  }
}
