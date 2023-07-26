import { User } from "./../interfaces/user";
import { environment } from "./../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private url: string = environment.url;

  constructor(private http: HttpClient) {}

  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.url}/user`, user);
  }

  updateImgProfileUser(img: string): Observable<any> {
    return this.http.put<any>(`${this.url}/user/update-img-profile`, { img });
  }

  getUserByEmail(email: string): Observable<boolean> {
    return this.http
      .get<any>(`${this.url}/user/find-by-email/${email}`)
      .pipe(map(({ data }) => data.valid));
  }

  getUserByDocument(num_document: string): Observable<boolean> {
    return this.http
      .get<any>(`${this.url}/user/find-by-document/${num_document}`)
      .pipe(map(({ data }) => data.valid));
  }

  getUserByUsername(username: string): Observable<boolean> {
    return this.http
      .get<any>(`${this.url}/user/find-by-username/${username}`)
      .pipe(map(({ data }) => data.valid));
  }

  getUsersByUsernameOrName(term: string): Observable<User[]> {
    return this.http
      .post<any>(`${this.url}/user`, { term })
      .pipe(map(({ data }) => data));
  }
}
