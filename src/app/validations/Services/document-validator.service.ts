import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from "@angular/forms";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class DocumentValidatorService implements AsyncValidator {
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    throw new Error("Method not implemented.");
    /* const document = control.value + "";
    if (document.length > 0) {
      return this.authService.getUserByDocument(document).pipe(
        map((resp) => {
          if (
            !resp?.user ||
            this.authService.getAuthUser.document_ === resp.user.document_
          ) {
            return null;
          }
          return { exists_document: true };
        })
      );
    }
    return of({ required: true }); */
  }

  // constructor(private authService: AuthService) {}
}
