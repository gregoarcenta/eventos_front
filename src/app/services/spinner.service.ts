import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SpinnerService {
  private _active: boolean = false;

  get active() {
    return this._active;
  }

  setActive(value: boolean) {
    this._active = value;
  }
  constructor() {}
}
