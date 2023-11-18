import { IUser } from '../../interfaces/User';
import { ApiResponse } from '../../interfaces/Http';
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RestoreAccountService {
  private url: string = environment.url;

  constructor(private http: HttpClient) {}

  sendMailRestoreAccount(email: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.url}/recover`, { email });
  }

  isValidTokenRestoreAccount(token: string): Observable<ApiResponse<IUser>> {
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("authorization", `bearer ${token}`);

    return this.http.get<ApiResponse<IUser>>(`${this.url}/recover`, {
      headers,
    });
  }

  restoreAccount(
    token: string,
    password: string
  ): Observable<ApiResponse<{ token: string }>> {
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("authorization", `bearer ${token}`);

    return this.http.put<ApiResponse<{ token: string }>>(
      `${this.url}/recover`,
      { password },
      { headers }
    );
  }
}
