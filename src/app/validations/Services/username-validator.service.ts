import { Injectable } from "@angular/core";
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from "@angular/forms";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UserService } from "src/app/services/user.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsernameValidatorService implements AsyncValidator {
  public url = environment.url;

  constructor(private userService: UserService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const username = control.value;
    return this.userService.getUserByUsername(username).pipe(
      map((valid) => {
        if (valid) return null;

        return { exists_username: true };
      })
    );
  }
}
