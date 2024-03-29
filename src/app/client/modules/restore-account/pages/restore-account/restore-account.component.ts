import { IUser } from "../../../../../core/interfaces/User";
import { RestoreAccountService } from "../../../../../core/services/api/restore-account.service";
import { _patternPassword } from "../../../../../shared/utils/regularPatterns";
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
  public user!: IUser;
  public showPassword: boolean = false;
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
        error: (_) => this.router.navigateByUrl("/"),
      });
  }

  validInput() {
    return this.password.errors && this.password.touched;
  }

  restorePassword() {
    if (this.password.invalid) return this.password.markAllAsTouched();

    this.restoreAccountService
      .restoreAccount(this.token, this.password.value!)
      .subscribe({
        next: (response) => {
          Swal.fire({
            title: "Listo!",
            text: response.message,
            icon: "success",
          });
          localStorage.setItem("token", response.data.token);
          location.reload();
        },
        error: (_) => this.router.navigateByUrl("/"),
      });
  }
}
