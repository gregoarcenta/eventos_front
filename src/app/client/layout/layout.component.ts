import { AfterViewInit, Component } from "@angular/core";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit(): void {
    const headerHeight = document.querySelector(".main-header .navbar")
      ?.clientHeight;

    const buttonHeaderHeight = document.querySelector(
      ".main-header .navbar-toggler"
    )?.clientHeight;

    const mainContent = document.querySelector(".main-content") as HTMLElement;

    if (buttonHeaderHeight && buttonHeaderHeight > 0 ) {
      mainContent.style.marginTop = `52px`;
    }else{
      mainContent.style.marginTop = `${headerHeight}px`;
    }

  }
}
