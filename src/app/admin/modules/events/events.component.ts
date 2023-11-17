import { Subject, debounceTime, switchMap, take } from "rxjs";
import { environment } from "./../../../../environments/environment";
import { _patterName } from "../../../shared/utils/regularPatterns";
import { EventStore } from "../../../core/services/store/event.store";
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
    return this.events.get$;
  }

  get loading$() {
    return this.events.loading$;
  }

  constructor(private events: EventStore) {}

  ngOnInit(): void {
    this.events$.pipe(take(1)).subscribe((events) => {
      if (events.length === 0) this.getAllEvent();
    });

    this.searchTerm$.pipe(debounceTime(300)).subscribe((term) => {
      this.events.searchEvents(term).subscribe();
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
    this.events.getAllEvents().subscribe();
  }
}
