import { ChangePasswordService } from './../../../core/services/api/change-password.service';
import { Injectable } from "@angular/core";
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from "@angular/forms";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PasswordValidatorService implements AsyncValidator {

  constructor(
    private changePasswordService: ChangePasswordService,
  ) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const password: string = control.value;

    return this.changePasswordService.validatePassword(password)
      .pipe(map((valid) => (valid ? null : { password_invalid: true })));
  }
}
