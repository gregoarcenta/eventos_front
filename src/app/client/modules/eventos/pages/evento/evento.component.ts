import { EventService } from "./../../../../../core/services/api/event.service";
import { MapStore } from "../../../../../core/services/store/map.store";
import { PlaceStore } from "../../../../../core/services/store/place.store";
import { environment } from "./../../../../../../environments/environment";

import { IEvent } from "../../../../../core/interfaces/Event";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";

@Component({
  selector: "app-evento",
  templateUrl: "./evento.component.html",
  styleUrls: ["./evento.component.scss"],
})
export class EventoComponent implements OnInit {
  public eventId: number | null = null;
  public event: IEvent | null = null;
  ev = new Subject<IEvent>();

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
    private map: MapStore,
    private place: PlaceStore,
    private eventService: EventService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(
      (params) => (this.eventId = params["evento"])
    );
    this.eventService.getEventPublishById(this.eventId!).subscribe({
      next: (response) => {
        this.ev.next(response.data);
        this.event = response.data;
        this.place.setPlaceLocation(
          this.event.place.direction!.lng,
          this.event.place.direction!.lat
        );
      },
      error: (error) => {
        this.router.navigateByUrl("/");
      },
    });
  }

  ngOnInit(): void {}

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
    this.place.getUserLocation(true).then(({ lng, lat }) => {
      const lng_ = this.event!.place.direction!.lng;
      const lat_ = this.event!.place.direction!.lat;
      this.map.getRouteBetweenPoints([lng, lat], [Number(lng_), Number(lat_)]);
    });
    this.modalService.open(map, { fullscreen: true });
  }
}
