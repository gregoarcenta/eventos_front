import { ResponseUploadImage } from "../../interfaces/event";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UploadImageEventService {
  private url: string = environment.url;

  constructor(private http: HttpClient) {}

  uploadImgEvent(img: File): Observable<ResponseUploadImage> {
    let headers = new HttpHeaders().set("Content-Type", "multipart/form-data");
    const formData = new FormData();
    formData.append("imgBannerEvent", img, img.name);
    return this.http.post<ResponseUploadImage>(
      `${this.url}/upload/eventos`,
      formData,
      {
        headers,
      }
    );
  }

  updateImgEvent(img: File, idEvent:number): Observable<ResponseUploadImage> {
    let headers = new HttpHeaders().set("Content-Type", "multipart/form-data");
    const formData = new FormData();
    formData.append("imgBannerEvent", img, img.name);
    return this.http.put<ResponseUploadImage>(
      `${this.url}/upload/eventos/${idEvent}`,
      formData,
      {
        headers,
      }
    );
  }

  deleteImgIfNotExists(nameImage: string): Observable<any> {
    return this.http.post<any>(`${this.url}/upload/eventos/${nameImage}`, {});
  }
}
