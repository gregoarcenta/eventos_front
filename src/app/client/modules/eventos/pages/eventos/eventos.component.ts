import { EventService } from "./../../../../../core/services/api/event.service";
import { BannersStore } from "./../../../../../core/services/store/banners.store";
import { CatalogStore } from "../../../../../core/services/store/catalog.store";
import { IEvent } from "../../../../../core/interfaces/event";
import { environment } from "./../../../../../../environments/environment";
import { EventStore } from "../../../../../core/services/store/event.store";
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  Observable,
  Subject,
  Subscription,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  of,
  startWith,
  switchMap,
  take,
} from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-eventos",
  templateUrl: "./eventos.component.html",
  styleUrls: ["./eventos.component.scss"],
})
export class EventosComponent implements OnInit, OnDestroy {
  @ViewChild("lastEvent") lastEvent!: ElementRef;
  public eventsSubscription?: Subscription;
  private url = `${environment.url}/upload/eventos`;
  public skeletonCount = Array(4).fill(0);

  public pageSize: number = environment.pageSizeEvents;

  public termSubject$ = new Subject<string>();
  public termNotFound: string | null = null;
  public notDataFilter: boolean = false;
  public eventsFiltered: IEvent[] = [];
  public conditionsFiltered: any = null;
  public currentPageFilters: number = 1;
  public totalEventFiltereds: number = 0;

  public inputValue: string = "";
  public filters = new FormGroup({
    city: new FormControl<string | null>(null),
    type: new FormControl<string | null>(null),
    start_date: new FormControl<string | null>(null),
    end_date: new FormControl<string | null>(null),
    outstanding: new FormControl<boolean>(false),
  });

  get events$() {
    return this.events.get$;
  }

  get cities$() {
    return this.events.cities$;
  }

  get loading$() {
    return this.events.loading$;
  }

  get spinner$() {
    return this.events.spinner$;
  }

  get services$() {
    return this.catalog.services$;
  }

  get mainImagesUrl$(): Observable<string[]> {
    return this.banners.mainImages$.pipe(
      map((images) => images.map((image) => `${this.url}/${image}`))
    );
  }

  get secondaryImagesUrl$(): Observable<string[]> {
    return this.banners.secondaryImages$.pipe(
      map((images) => images.map((image) => `${this.url}/${image}`))
    );
  }

  constructor(
    private catalog: CatalogStore,
    private eventService: EventService,
    private events: EventStore,
    private banners: BannersStore
  ) {}

  ngOnDestroy(): void {
    this.eventsSubscription?.unsubscribe();
    if (this.events.currentPage > 1) {
      this.events.getEventsPublish().subscribe();
    }
  }

  ngOnInit(): void {
    this.eventsSubscription = forkJoin([
      this.cities$.pipe(
        take(1),
        filter((cities) => cities.length === 0),
        switchMap(() => this.eventService.getCitiesEvents()),
        map((response) => response.data),
        catchError(() => of([]))
      ),
      this.events$.pipe(
        take(1),
        filter((cities) => cities.length === 0),
        switchMap(() => this.events.getEventsPublish())
      ),
    ]).subscribe((response) => {
      const [cities] = response;
      this.events.setCities(cities);
    });

    // Para buscar los eventos por el input
    this.termSubject$
      .pipe(
        filter((term) => !!term && term.length >= 3),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPageFilters = 1;
        this.searchEvents();
      });

    // Para buscar los eventos cuando cambie de ciudad
    this.filters
      .get("city")!
      .valueChanges.pipe(
        startWith(""),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPageFilters = 1;
        this.searchEvents();
      });
  }

  onInputSearch() {
    this.events$.pipe(take(1)).subscribe((events) => {
      if (events.length > 0) this.termSubject$.next(this.inputValue);
    });
  }

  getConditionsFiltereds() {
    this.conditionsFiltered = {
      ...this.filters.value,
      city: this.filters.value.city === "null" ? null : this.filters.value.city,
      term: this.inputValue === "" ? null : this.inputValue,
    };
    if (
      !this.conditionsFiltered.city &&
      !this.conditionsFiltered.end_date &&
      !this.conditionsFiltered.start_date &&
      !this.conditionsFiltered.outstanding &&
      !this.conditionsFiltered.type &&
      !this.conditionsFiltered.term
    ) {
      return null;
    }
    return this.conditionsFiltered;
  }

  searchEvents() {
    const conditions = this.getConditionsFiltereds();
    if (!conditions) return;

    this.eventService
      .searchEventsPublish(this.currentPageFilters, this.conditionsFiltered)
      .subscribe((response) => {
        this.eventsFiltered = [...this.eventsFiltered, ...response.data.events];
        this.totalEventFiltereds = response.data.total ?? 0;
        if (response.data.events.length > 0) {
          this.termNotFound = null;
          this.notDataFilter = false;
          return;
        }
        if (this.inputValue.length > 0) {
          this.termNotFound = this.inputValue;
          this.notDataFilter = false;
          return;
        }
        this.termNotFound = null;
        this.notDataFilter = true;
      });
  }

  cleanFilters() {
    this.eventsFiltered = [];
    this.termNotFound = null;
    this.notDataFilter = false;
    this.conditionsFiltered = null;
    this.currentPageFilters = 1;
    this.totalEventFiltereds = 0;
    this.inputValue = "";
    this.filters.patchValue({
      city: null,
      type: null,
      start_date: null,
      end_date: null,
      outstanding: false,
    });
  }

  getCityNameById(cityId: any): Observable<string> {
    return this.cities$.pipe(
      map((cities) => cities.find((c) => c.id == cityId)),
      map((city) => (city ? city.name : ""))
    );
  }

  getServiceNameById(serviceId: any): Observable<string> {
    return this.services$.pipe(
      map((services) => services.find((service) => service.id == serviceId)),
      map((service) => (service ? service.name : ""))
    );
  }

  hasMoreEvents(): boolean {
    return this.events.currentPage * this.pageSize < this.events.totalEvents!;
  }

  hasMoreEventsFiltereds(): boolean {
    return this.currentPageFilters * this.pageSize < this.totalEventFiltereds;
  }

  getMoreEvents() {
    if (!this.getConditionsFiltereds()) {
      this.events.getMoreEventsPublish().subscribe();
    } else {
      this.currentPageFilters += 1;
      this.searchEvents();
    }
    this.lastEvent.nativeElement.scrollIntoView({ behavior: "smooth" });
  }
}
