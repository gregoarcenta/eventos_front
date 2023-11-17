import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  BehaviorSubject,
  EMPTY,
  catchError,
  filter,
  forkJoin,
  map,
  switchMap,
  take,
} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BannersStore {
  private mainImagesSubject = new BehaviorSubject<string[]>([]);
  private secondaryImagesSubject = new BehaviorSubject<string[]>([]);

  get mainImages$() {
    return this.mainImagesSubject.asObservable();
  }

  get secondaryImages$() {
    return this.secondaryImagesSubject.asObservable();
  }

  constructor(private router: Router) {
    forkJoin([
      this.mainImages$.pipe(
        take(1),
        filter((images) => images.length === 0),
        // switchMap(() => this.catalogService.getAllServices()),
        // map((response) => response.data)
        map((response: string[]) => ["main-banner-1.jpg", "main-banner-2.jpg"])
      ),
      this.secondaryImages$.pipe(
        take(1),
        filter((images) => images.length === 0),
        // switchMap(() => this.catalogService.getAllDocuments()),
        // map((response) => response.data)
        map((response: string[]) => [
          "secondary-banner-1.jpg",
          "secondary-banner-2.jpg",
        ])
      ),
    ])
      .pipe(
        catchError(() => {
          this.router.navigateByUrl("/");
          return EMPTY;
        })
      )
      .subscribe((response) => {
        const [mainImages, secondaryImages] = response;
        this.setMainImages(mainImages);
        this.setSecondaryImages(secondaryImages);
      });
  }

  setMainImages(mainImages: string[]) {
    this.mainImagesSubject.next(mainImages);
  }

  setSecondaryImages(secondaryImages: string[]) {
    this.secondaryImagesSubject.next(secondaryImages);
  }
}
