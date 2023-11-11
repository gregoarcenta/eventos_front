import { environment } from "./../../../../environments/environment";
import { EventService } from "../../../core/services/events.service";
import { AfterViewInit, Component, OnInit } from "@angular/core";

@Component({
  selector: "app-inicio",
  templateUrl: "./inicio.component.html",
  styleUrls: ["./inicio.component.scss"],
})
export class InicioComponent implements OnInit, AfterViewInit {
  get featuredEvents() {
    return this.eventService.getFeatured;
  }

  get upcomingEvents() {
    return this.eventService.getUpcoming;
  }

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    //Obtiene los eventos destacados
    if (this.featuredEvents.length === 0) {
      this.getFeaturedEvents();
    }

    //Obtiene los proximos eventos
    if (this.upcomingEvents.length === 0) {
      this.getUpcomingEvents();
    }
  }

  ngAfterViewInit(): void {
    const headerHeight = document.querySelector(".main-header .navbar")
      ?.clientHeight;

    const buttonHeaderHeight = document.querySelector(
      ".main-header .navbar-toggler"
    )?.clientHeight;

    const slides = document.querySelector(".slides") as HTMLElement;

    if (buttonHeaderHeight && buttonHeaderHeight > 0) {
      slides.style.height = `calc(100vh - 52px)`;
    } else {
      slides.style.height = `calc(100vh - ${headerHeight}px)`;
    }
  }

  getFeaturedEvents() {
    this.eventService.getFeaturedEvents().subscribe((_) => {});
  }

  getUpcomingEvents() {
    this.eventService.getUpcomingEvents().subscribe((_) => {});
  }
}
