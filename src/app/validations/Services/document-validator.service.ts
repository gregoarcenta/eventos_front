import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';
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
    return this.userService.getUserByDocument(document).pipe(
      map((valid) => {
        if (valid) return null;

        if (document.trim() === this.authUser?.num_document?.trim()) return null;

        return { exists_document: true };
      })
    );
  }

}
