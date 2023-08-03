import { environment } from "./../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RestoreAccountService {
  private url: string = environment.url;
  public validating: boolean = false;

  constructor(private http: HttpClient) {}

  sendMailRestoreAccount(email: string): Observable<any> {
    return this.http.post(`${this.url}/recover`, { email });
  }

  isValidTokenRestoreAccount(token: string): Observable<any> {
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("authorization", `bearer ${token}`);

    return this.http.get(`${this.url}/recover`, { headers });
  }

  restoreAccount(token: string, password: string): Observable<any> {
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("authorization", `bearer ${token}`);

    return this.http.put(`${this.url}/recover`, { password }, { headers });
  }

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
