import { SpinnerStore } from "./core/services/store/spinner.store";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  active = false;
  constructor(public spinner: SpinnerStore, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.spinner.$active.subscribe((value) => {
      this.active = value;
      this.cdr.detectChanges();
    });
  }
}
