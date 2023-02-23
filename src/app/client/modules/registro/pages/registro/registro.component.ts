import { FormService } from "./../../../../../services/form.service";
import { SpinnerService } from "./../../../../../services/spinner.service";
import { UsernameValidatorService } from "./../../../../../validations/Services/username-validator.service";
import { EmailValidatorService } from "./../../../../../validations/Services/email-validator.service";
import { RegisterService } from "./../../../../../services/register.service";
import { CustomValidators } from "./../../../../../validations/validations-forms";
import {
  _patternMail,
  _patterUsername,
  _patternPassword,
  _patterName,
} from "./../../../../../utils/regularPatterns";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.scss"],
})
export class RegistroComponent implements OnInit {
  public register: boolean = false;

  public registerForm = this.fb.group(
    {
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(_patterName),
        ],
      ],
      surname: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(_patterName),
        ],
      ],
      email: [
        "",
        [Validators.required, Validators.pattern(_patternMail)],
        [this.evs],
      ],
      username: [
        "",
        [Validators.required, Validators.pattern(_patterUsername)],
        [this.uvs],
      ],
      password: [
        "",
        [Validators.required, Validators.pattern(_patternPassword)],
      ],
      password2: ["", [Validators.required]],
      terminos: [false, [Validators.requiredTrue]],
    },
    {
      validator: CustomValidators.passwordMatchValidator,
    }
  );

  constructor(
    private registerService: RegisterService,
    private uvs: UsernameValidatorService,
    private evs: EmailValidatorService,
    public formService: FormService,
    private spinner: SpinnerService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {}

  formSubmit() {
    if (this.registerForm.invalid) return this.registerForm.markAllAsTouched();

    this.onRegister();
  }

  onRegister() {
    this.spinner.setActive(true);
    this.registerService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.spinner.setActive(false);
        Swal.fire({
          title: "Listo!",
          text: response.message,
          icon: "success",
        });
        this.register = true;
        setTimeout(() => {
          this.router.navigateByUrl("login");
        }, 15000);
      },
      error: (_) => {},
    });
  }
}
