import { SpinnerService } from "./../../../services/spinner.service";
import { AuthService } from "./../../../services/auth.service";
import { FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit {
  public loginForm = this.fb.group({
    username: ["", [Validators.required]],
    password: ["", [Validators.required]],
  });

  constructor(
    private authService: AuthService,
    private spinner: SpinnerService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {}

  validInput(name: string) {
    return (
      this.loginForm.get(name)?.invalid && this.loginForm.get(name)?.touched
    );
  }

  login() {
    if (this.loginForm.invalid) return this.loginForm.markAllAsTouched();

    this.spinner.setActive(true);
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.router.navigateByUrl("/");
        this.spinner.setActive(false);
      },
      error: (_) => {},
    });
  }
}
