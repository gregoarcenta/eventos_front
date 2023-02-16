import { AuthService } from "./../../services/auth.service";
import { UserService } from "./../../services/user.service";
import { Injectable } from "@angular/core";
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from "@angular/forms";

import { Observable } from "rxjs";
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
    return this.userService.getUserByEmail(email).pipe(
      map((valid) => {
        if (valid) return null;

        if (email.trim() === this.authUser?.email.trim()) return null;

        return { exists_email: true };
      })
    );
  }
}
