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

  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.url}/user`, user);
  }

  updateImgProfileUser(img: string): Observable<any> {
    return this.http.put<any>(`${this.url}/user/update-img-profile`, { img });
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.url}/user/find-by-email/${email}`);
  }

  getUserByDocument(document: string): Observable<any> {
    return this.http.get<any>(`${this.url}/user/find-by-document/${document}`);
  }

  getUserByUsername(username: string): Observable<any> {
    return this.http.get<any>(`${this.url}/user/find-by-username/${username}`);
  }

  // getUsersByUsernameOrName(term: string): Observable<User[]> {
  getUsersByUsernameOrName(term: string): Observable<any> {
    return this.http.post<any>(`${this.url}/user`, { term });
  }
}
