import { SpinnerStore } from './core/services/store/spinner.store';
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {

  constructor(public spinner:SpinnerStore){}
}
