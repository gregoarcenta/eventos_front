import { FormStore } from "../../../core/services/store/form.store";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../core/services/api/auth.service";
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
    public formStore: FormStore,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {}

  login() {
    if (this.loginForm.invalid) return this.loginForm.markAllAsTouched();

    //this.spinner.setActive(true);
    this.authService.login(this.loginForm.value).subscribe((_) => {
      this.router.navigate(["/administrador/dashboard"]);
      //this.spinner.setActive(false);
    });
  }
}
