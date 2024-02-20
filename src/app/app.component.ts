import { Subject } from "rxjs";
import { SpinnerStore } from "./core/services/store/spinner.store";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  active = new Subject<boolean>();
  constructor(public spinner: SpinnerStore, private cdr: ChangeDetectorRef) {
    this.spinner.$active.subscribe((value) => {
      this.active.next(value);
      // this.cdr.detectChanges();
    });
  }
}
