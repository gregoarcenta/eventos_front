import { ChangePasswordService } from "./../../../../../core/services/api/change-password.service";
import { PasswordValidatorService } from "./../../../../../shared/validations/services/passwordValidator.service";
import { CustomValidators } from "./../../../../../shared/validations/validations-forms";
import { FormStore } from "../../../../../core/services/store/form.store";
import { _patternPassword } from "../../../../../shared/utils/regularPatterns";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  public showPassword: boolean = false;
  public showNewPassword: boolean = false;
  public showNewPasswordRepeat: boolean = false;

  public passwordForm = this.fb.group(
    {
      oldPassword: new FormControl("", {
        validators: [Validators.required],
        asyncValidators: [this.pvs.validate.bind(this.pvs)],
      }),
      password: new FormControl("", [
        Validators.required,
        Validators.pattern(_patternPassword),
      ]),
      password2: new FormControl("", [Validators.required]),
    },
    {
      validator: CustomValidators.passwordMatchValidator,
    }
  );

  get getMsgErrorPass() {
    const controlPassword = this.passwordForm.controls["oldPassword"];
    /*     if (controlPassword.getError("required")) {
      return "La contraseña actual es requerida";
    } */
    if (controlPassword.getError("password_invalid")) {
      return "La contraseña ingresada no es la correcta";
    }
    return "";
  }

  get validating() {
    return this.changePasswordService.validating;
  }

  constructor(
    private fb: FormBuilder,
    public formStore: FormStore,
    private pvs: PasswordValidatorService,
    public changePasswordService: ChangePasswordService
  ) {}

  ngOnInit(): void {}

  changePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    //this.spinner.setActive(true);
    this.changePasswordService
      .changePassword(this.passwordForm.value)
      .subscribe((response) => {
        this.passwordForm.reset();
        //this.spinner.setActive(false);
        Swal.fire("¡Listo!", response.message, "success");
      });
  }
}
