import { RestoreAccountService } from './../../services/restore-account.service';
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
    private restoreAccountService: RestoreAccountService,
  ) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const password: string = control.value;

    return this.restoreAccountService.validatePassword(password)
      .pipe(map((valid) => (valid ? null : { password_invalid: true })));
  }
}
