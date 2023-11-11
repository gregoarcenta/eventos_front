import { Subject, debounceTime, switchMap, take } from "rxjs";
import { environment } from "./../../../../environments/environment";
import { _patterName } from "../../../shared/utils/regularPatterns";
import { EventService } from "../../../core/services/events.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.scss"],
})
export class EventsComponent implements OnInit {
  public url = `${environment.url}/upload/eventos`;
  private searchTerm$ = new Subject<string>();

  public skeletonCount = Array(8).fill(0);

  get events$() {
    return this.eventService.events$;
  }

  get loading$() {
    return this.eventService.loading$;
  }

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.events$.pipe(take(1)).subscribe((events) => {
      if (events.length === 0) this.getAllEvent();
    });

    this.searchTerm$.pipe(debounceTime(300)).subscribe((term) => {
      this.eventService.searchEvents(term).subscribe((_) => {});
    });
  }

  searchEvents(event: any) {
    const term = event.target.value;
    if (term && term.length >= 3) {
      this.searchTerm$.next(term);
      return;
    }
  }

  getAllEvent() {
    this.eventService.getAllEvents().subscribe((_) => {});
  }
}
