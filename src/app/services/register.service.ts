import { environment } from "./../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RegisterService {
  private url = environment.url;

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post<any>(`${this.url}/register`, data, {
      headers,
    });
  }

  verifyRegister(token: string): Observable<any> {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("authorization", `bearer ${token}`);
    return this.http.get<any>(`${this.url}/register/verify`, {
      headers,
    });
  }
}
