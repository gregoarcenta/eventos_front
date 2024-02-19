import { AuthService } from "../../../core/services/api/auth.service";
import { FormBuilder, Validators } from "@angular/forms";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";

declare const google: any;

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements AfterViewInit {
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

  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: environment.client_id,
      callback: this.handleCredentialResponse.bind(this),
    });
    google.accounts.id.renderButton(document.getElementById("buttonDiv"), {
      theme: "outline",
      size: "large",
      // type: "icon",
      // shape: "circle",
      text: "continue_with",
    });
    // google.accounts.id.prompt();
  }

  validInput(name: string) {
    return (
      this.loginForm.get(name)?.invalid && this.loginForm.get(name)?.touched
    );
  }

  handleCredentialResponse(response: any) {
    // console.log("Encoded JWT ID token: " + response.credential);
    this.authService.loginGoogle(response.credential).subscribe((_) => {
      this.router.navigateByUrl("/");
    });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.loginForm.invalid) return this.loginForm.markAllAsTouched();

    this.authService.login(this.loginForm.value).subscribe((_) => {
      this.router.navigateByUrl("/");
    });
  }
}
