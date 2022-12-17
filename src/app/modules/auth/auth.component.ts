import { SpinnerService } from "./../../services/spinner.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "./services/auth.service";
import Swal from "sweetalert2";
@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit {
  public authForm = this.fb.group({
    username: ["", [Validators.required]],
    password: ["", [Validators.required]],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: SpinnerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  validInput(name: string) {
    return this.authForm.get(name)?.invalid && this.authForm.get(name)?.touched;
  }

  login() {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }
    this.spinner.setActive(true);
    this.authService.login(this.authForm.value).subscribe({
      next: (response) => {
        this.router.navigateByUrl("/");
        this.spinner.setActive(false);
      },
      error: ({ error }) => {
        this.spinner.setActive(false);
        if (error.status === 422 || error.status === 401) {
          Swal.fire("Error", "Usuario o contraseña incorrectos", "error");
        } else {
          Swal.fire(
            "Error",
            "Ha ocurrido un error inesperado en el sistema, vuelva a intentarlo mas tarde",
            "error"
          );
        }
      },
    });
  }
}
