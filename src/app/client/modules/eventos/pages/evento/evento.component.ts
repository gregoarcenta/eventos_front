import { environment } from "./../../../../../../environments/environment";
import { SpinnerService } from "./../../../../../services/spinner.service";
import { Event } from "./../../../../../interfaces/event";
import { EventService } from "./../../../../../services/events.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-evento",
  templateUrl: "./evento.component.html",
  styleUrls: ["./evento.component.scss"],
})
export class EventoComponent implements OnInit {
  public eventId: number | null = null;
  public event: Event | null = null;

  get imageURL(): string {
    return `${environment.url}/upload/eventos/${this.event!.img}`;
  }

  get userImageURL(): string {
    return this.event!.user.img || "assets/images/default-image-profile.png";
  }

  get startDateTime() {
    return new Date(this.event!.start_date + "T" + this.event!.start_time);
  }

  get endDateTime() {
    return new Date(this.event!.end_date + "T" + this.event!.end_time);
  }

  constructor(
    private router: Router,
    private spinner: SpinnerService,
    private eventService: EventService,
    private activatedRoute: ActivatedRoute
  ) {
    this.spinner.setActive(true);
    this.activatedRoute.params.subscribe(
      (params) => (this.eventId = params["evento"])
    );
  }

  ngOnInit(): void {
    this.eventService.getEventPublishById(this.eventId!).subscribe({
      next: (response) => {
        this.event = response.data;
        this.spinner.setActive(false);
      },
      error: (error) => {
        this.spinner.setActive(false);
        this.router.navigateByUrl("/");
      },
    });
  }

  addToCalendar() {
    const eventTitle = encodeURIComponent("Evento: " + this.event!.name);
    const eventLocation = encodeURIComponent(this.event!.place.name);
    const eventDescription = encodeURIComponent(this.event!.description);

    const startDate = this.startDateTime;
    const endDate = this.endDateTime;


    const eventStartDate = startDate.toISOString().replace(/-|:|\.\d{3}/g, '');
    const eventEndDate = endDate.toISOString().replace(/-|:|\.\d{3}/g, '');

    const calendarURL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${eventStartDate}/${eventEndDate}&location=${eventLocation}&details=${eventDescription}`;

    window.open(calendarURL, '_blank');
  }
}
