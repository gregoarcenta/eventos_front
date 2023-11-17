import { AuthService } from "../../../core/services/api/auth.service";
import { FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit {
  public showPassword: boolean = false;
  public loginForm = this.fb.group({
    username: ["", [Validators.required]],
    password: ["", [Validators.required]],
  });

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {}

  validInput(name: string) {
    return (
      this.loginForm.get(name)?.invalid && this.loginForm.get(name)?.touched
    );
  }

  toggleShowPassword(){
    this.showPassword = !this.showPassword
  }

  login() {
    if (this.loginForm.invalid) return this.loginForm.markAllAsTouched();

    this.authService.login(this.loginForm.value).subscribe((_) => {
      this.router.navigateByUrl("/");
    });
  }
}
