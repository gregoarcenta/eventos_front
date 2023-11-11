import { SpinnerService } from './core/services/spinner.service';
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {

  constructor(public spinnerService:SpinnerService){}
}
