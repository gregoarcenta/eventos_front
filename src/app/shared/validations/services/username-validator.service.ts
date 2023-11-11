import { AuthService } from './../../../core/services/auth.service';
import { UserService } from './../../../core/services/user.service';
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
export class UsernameValidatorService implements AsyncValidator {
  get authUser() {
    return this.authService.getAuthUser;
  }

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const username: string = control.value;

    if (username.trim() === this.authUser?.username.trim()) return of(null);

    return this.userService
      .getUserByUsername(username)
      .pipe(map((valid) => (valid ? null : { exists_username: true })));
  }
}
