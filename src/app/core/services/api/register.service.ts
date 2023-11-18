import { ApiResponse } from '../../interfaces/http';
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RegisterService {
  private url = environment.url;

  constructor(private http: HttpClient) {}

  register(data: any): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.url}/register`, data);
  }

  verifyRegister(token: string): Observable<ApiResponse<{ token: string }>> {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("authorization", `bearer ${token}`);
    return this.http.get<ApiResponse<{ token: string }>>(
      `${this.url}/register/verify`,
      {
        headers,
      }
    );
  }
}
