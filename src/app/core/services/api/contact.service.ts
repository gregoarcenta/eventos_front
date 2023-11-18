import { ApiResponse } from '../../interfaces/Http';
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ContactService {
  private url: string = environment.url;

  constructor(private http: HttpClient) {}

  submitContact(data: any): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.url}/contact`, data);
  }
}
