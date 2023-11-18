import { IUser } from '../../interfaces/User';
import { ApiResponse } from '../../interfaces/Http';
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private url: string = environment.url;

  constructor(private http: HttpClient) {}

  updateUser(user: any): Observable<ApiResponse<IUser>> {
    return this.http.put<ApiResponse<IUser>>(`${this.url}/user`, user);
  }

  updateImgProfileUser(img: string): Observable<ApiResponse<IUser>> {
    return this.http.put<ApiResponse<IUser>>(
      `${this.url}/user/update-img-profile`,
      { img }
    );
  }

  getUserByEmail(email: string): Observable<ApiResponse<{ valid: boolean }>> {
    return this.http.get<ApiResponse<{ valid: boolean }>>(
      `${this.url}/user/find-by-email/${email}`
    );
  }

  getUserByDocument(
    document: string
  ): Observable<ApiResponse<{ valid: boolean }>> {
    return this.http.get<ApiResponse<{ valid: boolean }>>(
      `${this.url}/user/find-by-document/${document}`
    );
  }

  getUserByUsername(
    username: string
  ): Observable<ApiResponse<{ valid: boolean }>> {
    return this.http.get<ApiResponse<{ valid: boolean }>>(
      `${this.url}/user/find-by-username/${username}`
    );
  }

  // getUsersByUsernameOrName(term: string): Observable<User[]> {
  getUsersByUsernameOrName(term: string): Observable<ApiResponse<IUser[]>> {
    return this.http.post<ApiResponse<IUser[]>>(`${this.url}/user`, { term });
  }
}
