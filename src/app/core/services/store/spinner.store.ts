import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SpinnerStore {
  private activeRequests = 0;
  private _active = new BehaviorSubject<boolean>(false);

  get $active() {
    return this._active.asObservable();
  }

  constructor() {}

  show() {
    if (this.activeRequests === 0) {
      setTimeout(() => this._active.next(true));
    }
    this.activeRequests++;
  }

  hide() {
    this.activeRequests--;
    if (this.activeRequests === 0) {
      this._active.next(false);
    }
  }
}
