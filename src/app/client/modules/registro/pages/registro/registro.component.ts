import { UserService } from './../../../../../services/user.service';
import { environment } from './../../../../../../environments/environment';
import { SpinnerService } from './../../../../../services/spinner.service';
import { UsernameValidatorService } from './../../../../../validations/Services/username-validator.service';
import { EmailValidatorService } from './../../../../../validations/Services/email-validator.service';
import { RegisterService } from './../../../../../services/register.service';
import { CustomValidators } from "./../../../../../validations/validations-forms";
import {
  _patternMail,
  _patterUsername,
  _patternPassword,
} from "./../../../../../utils/regularPatterns";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.scss"],
})
export class RegistroComponent implements OnInit {
  public register: boolean = false;

  public registerForm = this.fb.group(
    {
      name: ["", [Validators.required]],
      surname: ["", [Validators.required]],
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

  get getMsgErrorEmail() {
    const controlEmail = this.registerForm.controls["email"];
    if (controlEmail.getError("required")) {
      return "El email es requerido";
    }
    if (controlEmail.getError("pattern")) {
      return "Formato de email invalido";
    }
    if (controlEmail.getError("exists_email")) {
      return "El email ingresado ya existe";
    }
    return "";
  }

  get getMsgErrorUsername() {
    const controlEmail = this.registerForm.controls["username"];
    if (controlEmail.getError("required")) {
      return "El nombre de usuario es requerido";
    }
    if (controlEmail.getError("pattern")) {
      return "Nombre de usuario invalido";
    }
    if (controlEmail.getError("exists_username")) {
      return "El nombre de usuario ingresado ya esta en uso";
    }
    return "";
  }

  get getMsgErrorPass() {
    const controlPass = this.registerForm.controls["password"];
    if (controlPass.getError("required")) {
      return "La contraseña es requerida";
    }
    if (controlPass.getError("pattern")) {
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

  get getMsgErrorConfirm() {
    const controlConfirm = this.registerForm.controls["password2"];
    if (controlConfirm.getError("required")) {
      return "La confirmación de la contraseña es requerida";
    }
    if (controlConfirm.getError("NoPassswordMatch")) {
      return "Las contraseñas deben ser iguales";
    }
    return "";
  }

  constructor(
    private registerService: RegisterService,
    private evs: EmailValidatorService,
    private uvs: UsernameValidatorService,
    private spinner: SpinnerService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {}

  validInput(name: string) {
    return (
      this.registerForm.get(name)?.invalid &&
      this.registerForm.get(name)?.touched
    );
  }

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
          heightAuto: false,
        });
        this.register = true;
        setTimeout(() => {
          this.router.navigateByUrl("login");
        }, 15000);
      },
      error: ({ error }) => {
        this.spinner.setActive(false);
        if (error.status === 400) {
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
      },
    });
  }
}
