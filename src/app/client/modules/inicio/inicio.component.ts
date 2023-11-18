import { EventService } from "./../../../core/services/api/event.service";
import { TypeEvents } from "../../../core/interfaces/event";
import { EventStore } from "../../../core/services/store/event.store";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import {
  EMPTY,
  catchError,
  filter,
  forkJoin,
  map,
  of,
  switchMap,
  take,
} from "rxjs";

@Component({
  selector: "app-inicio",
  templateUrl: "./inicio.component.html",
  styleUrls: ["./inicio.component.scss"],
})
export class InicioComponent implements OnInit, AfterViewInit {
  public typeFeatured = TypeEvents.Feature;
  public typeUpcoming = TypeEvents.upcoming;
  get featuredEvents$() {
    return this.events.featured$;
  }

  get upcomingEvents$() {
    return this.events.upcoming$;
  }

  constructor(private events: EventStore, private eventService: EventService) {}

  ngOnInit(): void {
    forkJoin([
      this.featuredEvents$.pipe(
        take(1),
        filter((featured) => featured.length === 0),
        switchMap(() => this.eventService.getFeaturedEvents()),
        map((response) => response.data.events),
        catchError(() => of([]))
      ),
      this.upcomingEvents$.pipe(
        take(1),
        filter((upcoming) => upcoming.length === 0),
        switchMap(() => this.eventService.getUpcomingEvents()),
        map((response) => response.data.events),
        catchError(() => of([]))
      ),
    ]).subscribe((response) => {
      const [featured, upcoming] = response;
      this.events.setFeatured(featured);
      this.events.setUpcoming(upcoming);
    });
  }

  ngAfterViewInit(): void {
    const headerHeight = document.querySelector(
      ".main-header .navbar"
    )?.clientHeight;

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
}
