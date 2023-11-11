import { MapService } from "../../../../../core/services/map.service";
import { PlaceService } from "../../../../../core/services/place.service";
import { environment } from "./../../../../../../environments/environment";

import { Event } from "../../../../../core/interfaces/event";
import { EventService } from "../../../../../core/services/events.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

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

  get localities() {
    return this.event?.place_localities.filter((locality) => {
      return locality.sold_tickets < locality.limit_tickets;
    });
  }

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private mapService: MapService,
    private placeService: PlaceService,
    private eventService: EventService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(
      (params) => (this.eventId = params["evento"])
    );
  }

  ngOnInit(): void {
    this.eventService.getEventPublishById(this.eventId!).subscribe({
      next: (response) => {
        this.event = response.data;
        this.placeService.setPlaceLocation(
          this.event.place.direction.lng,
          this.event.place.direction.lat
        );

      },
      error: (error) => {
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

    const eventStartDate = startDate.toISOString().replace(/-|:|\.\d{3}/g, "");
    const eventEndDate = endDate.toISOString().replace(/-|:|\.\d{3}/g, "");

    const calendarURL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${eventStartDate}/${eventEndDate}&location=${eventLocation}&details=${eventDescription}`;

    window.open(calendarURL, "_blank");
  }

  openMapFullscreen(map: any) {
    this.placeService.getUserLocation(true).then(({ lng, lat }) => {
      const lng_ = this.event!.place.direction.lng;
      const lat_ = this.event!.place.direction.lat;
      this.mapService.getRouteBetweenPoints([lng, lat],[Number(lng_), Number(lat_)])
    });
    this.modalService.open(map, { fullscreen: true });
  }
}
