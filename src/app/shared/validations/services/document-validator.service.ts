import { AuthService } from "../../../core/services/api/auth.service";
import { UserService } from "../../../core/services/api/user.service";
import { Injectable } from "@angular/core";
import {
  AbstractControl,
  AsyncValidator,
  AsyncValidatorFn,
  ValidationErrors,
} from "@angular/forms";
import { map, Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DocumentValidatorService implements AsyncValidator {
  get authUser() {
    return this.authService.getAuthUser;
  }

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const document: string = control.value;

    if (document.trim() === this.authUser?.num_document?.trim())
      return of(null);

    return this.userService
      .getUserByDocument(document)
      .pipe(map(({ data }) => (data.valid ? null : { exists_document: true })));
  }
}
