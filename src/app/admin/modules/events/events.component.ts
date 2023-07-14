import { Subject, debounceTime } from "rxjs";
import { environment } from "./../../../../environments/environment";
import { _patterName } from "./../../../utils/regularPatterns";
import { EventService } from "./../../../services/events.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.scss"],
})
export class EventsComponent implements OnInit {
  public url = `${environment.url}/upload/eventos`;
  private searchTerm$ = new Subject<string>();

  get events() {
    return this.eventService.getEvents;
  }

  constructor(
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    if (this.eventService.getEvents.length === 0) {
      this.getAllEvent();
    }

    this.searchTerm$
      .pipe(debounceTime(300)) // Establece el retardo deseado (en milisegundos)
      .subscribe((term) => {
        this.realizarBusqueda(term);
      });
  }

  searchEvents(event: any) {
    const term = event.target.value;
    if (term && term.length >= 3) return this.searchTerm$.next(term);

    this.getAllEvent();
  }

  realizarBusqueda(term: string): void {
    this.eventService.searchEvent(term).subscribe((response) => {
      console.log(response);

      this.eventService.setEvents = response.data;
    });
  }

  getAllEvent() {
    this.eventService.getAllEvents().subscribe((response) => {
      this.eventService.setEvents = response.data;
    });
  }
}
