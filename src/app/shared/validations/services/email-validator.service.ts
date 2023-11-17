import { AuthService } from "../../../core/services/api/auth.service";
import { UserService } from "../../../core/services/api/user.service";
import { Injectable } from "@angular/core";
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from "@angular/forms";

import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class EmailValidatorService implements AsyncValidator {
  get authUser() {
    return this.authService.getAuthUser;
  }

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const email: string = control.value;

    if (email.trim() === this.authUser?.email.trim()) return of(null);

    return this.userService
      .getUserByEmail(email)
      .pipe(map(({ data }) => (data.valid ? null : { exists_email: true })));
  }
}
