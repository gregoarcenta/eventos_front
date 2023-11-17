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
  validatePassword(password: string): Observable<any> {
    this.validating = true;
    return this.http
      .post<any>(`${this.url}/change-password`, { password })
      .pipe(
        map(({ data }) => {
          this.validating = false;
          return data.valid;
        })
      );
  }

  changePassword(passwordObj: any): Observable<any> {
    return this.http.put(`${this.url}/change-password`, passwordObj);
  }
}
