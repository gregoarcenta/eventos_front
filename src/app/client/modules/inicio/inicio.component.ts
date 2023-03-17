import { AfterViewInit, Component, OnInit } from "@angular/core";

@Component({
  selector: "app-inicio",
  templateUrl: "./inicio.component.html",
  styleUrls: ["./inicio.component.scss"],
})
export class InicioComponent implements OnInit, AfterViewInit {
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const headerHeight = document.querySelector(".main-header .navbar")
      ?.clientHeight;

    const buttonHeaderHeight = document.querySelector(
      ".main-header .navbar-toggler"
    )?.clientHeight;

    const slides = document.querySelector(".slides") as HTMLElement;

    if (buttonHeaderHeight && buttonHeaderHeight > 0 ) {
      slides.style.height = `calc(100vh - 52px)`;
    }else{
      slides.style.height = `calc(100vh - ${headerHeight}px)`;
    }

  }
}
