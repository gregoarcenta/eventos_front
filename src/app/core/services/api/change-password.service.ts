import { ApiResponse } from '../../interfaces/Http';
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChangePasswordService {
  private url: string = environment.url;
  public validating: boolean = false;

  constructor(private http: HttpClient) {}

  // Pantalla cambiar contrasena
  validatePassword(password: string): Observable<boolean> {
    this.validating = true;
    return this.http
      .post<ApiResponse<{ valid: boolean }>>(`${this.url}/change-password`, {
        password,
      })
      .pipe(
        map(({ data }) => {
          this.validating = false;
          return data.valid;
        })
      );
  }

  changePassword(passwordObj: any): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.url}/change-password`, passwordObj);
  }
}
