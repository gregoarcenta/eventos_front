import { AuthService } from "./../../services/auth.service";
import { UserService } from "./../../services/user.service";
import { environment } from "./../../../environments/environment";
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
export class UsernameValidatorService implements AsyncValidator {
  public url = environment.url;

  get authUser() {
    return this.authService.getAuthUser;
  }

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const username: string = control.value;
    return this.userService.getUserByUsername(username).pipe(
      map((valid) => {
        if (valid) return null;

        if (username.trim() === this.authUser?.username.trim()) return null;

        return { exists_username: true };
      })
    );
  }
}
