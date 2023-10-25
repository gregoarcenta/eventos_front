import { DataService } from "./../../../../../services/data.service";
import { SpinnerService } from "./../../../../../services/spinner.service";
import { Event } from "./../../../../../interfaces/event";
import { UploadImageEventService } from "./../../../../../services/upload-image-event.service";
import { environment } from "./../../../../../../environments/environment";
import { EventService } from "./../../../../../services/events.service";
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  BehaviorSubject,
  Subscription,
  debounceTime,
  pairwise,
  startWith,
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
  private url = `${environment.url}/upload/eventos`;
  private inputSearchSubscription?: Subscription;
  private filtersSubscription?: Subscription;

  public skeletonCount = Array(4).fill(0);

  public pageSize: number = 12;

  private eventTerm$ = new BehaviorSubject<string>("");
  public termNotFound: string | null = null;
  public notDataFilter: boolean = false;
  public eventsFiltered: Event[] = [];
  public conditionsFiltered: any = null;
  public currentPageFilters: number = 1;
  public totalEventFiltereds: number = 0;

  public inputSearchControl = new FormControl<string | null>(null);

  public filters = new FormGroup({
    city: new FormControl<string | null>(null),
    type: new FormControl<string | null>(null),
    start_date: new FormControl<string | null>(null),
    end_date: new FormControl<string | null>(null),
    outstanding: new FormControl<boolean>(false),
  });

  get events$() {
    return this.eventService.events$;
  }

  get loading$() {
    return this.eventService.loading$;
  }

  get spinner$() {
    return this.eventService.spinner$;
  }

  get currentPage() {
    return this.eventService.currentPage;
  }

  get cities() {
    return this.eventService.getCities;
  }

  get services() {
    return this.dataService.getServices;
  }

  get mainImagesUrl(): string[] {
    return this.uploadImageEventService.getMainImages.map(
      (image) => `${this.url}/${image}`
    );
  }

  get secondariesImagesUrl(): string[] {
    return this.uploadImageEventService.getSecondariesImages.map(
      (image) => `${this.url}/${image}`
    );
  }

  constructor(
    private spinner: SpinnerService,
    private dataService: DataService,
    private eventService: EventService,
    private uploadImageEventService: UploadImageEventService
  ) {}

  ngOnDestroy(): void {
    this.filtersSubscription?.unsubscribe();
    this.inputSearchSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    //Obtiene todos los eventos
    this.events$.pipe(take(1)).subscribe((events) => {
      if (events.length === 0) this.getEvents();
    });

    //Obtiene las ciudades de los eventos
    if (this.cities.length === 0) this.getCities();

    //Obtiene las lista de servicios
    if (this.services.length === 0) this.getServices();

    //Obtiene las imagenes principales para el slider del header
    if (this.mainImagesUrl.length === 0) this.getMainImages();

    //Obtiene las imagenes secundarias del header
    if (this.secondariesImagesUrl.length === 0) this.getSecondariesImages();

    // Para buscar los eventos por el input
    this.inputSearchSubscription = this.eventTerm$
      .pipe(pairwise())
      .subscribe(([oldValue, newValue]) => {
        if (oldValue !== newValue) {
          this.currentPageFilters = 1;
          this.searchEvents();
        }
      });

    // Para buscar los eventos cuando cambie de ciudad
    this.filtersSubscription = this.filters
      .get("city")!
      .valueChanges.pipe(startWith(""), debounceTime(300), pairwise())
      .subscribe(([oldValue, newValue]) => {
        if (oldValue !== newValue) {
          this.currentPageFilters = 1;
          this.searchEvents();
        }
      });
  }

  getEvents() {
    this.eventService
      .getAllEventsPublish(this.currentPage, this.pageSize)
      .subscribe((_) => {});
  }

  getCities() {
    this.eventService.getCitiesEvents().subscribe((_) => {});
  }

  getServices() {
    this.dataService.getAllServices().subscribe((_) => {});
  }

  getMainImages() {
    /*  this.eventService.getMainImages().subscribe((response) => {
      this.uploadImageEventService.setMainImages = response.data;
    }); */
    this.uploadImageEventService.setMainImages = [
      "green.jpg",
      "16-8.jpg",
      "20086cb5-928d-4cd1-b5a2-ab1c81d5b0d1.jpg",
    ];
  }

  getSecondariesImages() {
    /* this.eventService.getSecondariesImages().subscribe((response) => {
      this.uploadImageEventService.setSecondariesImages = response.data;
    }); */
    this.uploadImageEventService.setSecondariesImages = [
      "green.jpg",
      "16-8.jpg",
    ];
  }

  onClickInputSearch() {
    const term = this.inputSearchControl.value;
    this.events$.pipe(take(1)).subscribe((events) => {
      if (term && term.length >= 3 && events.length > 0) {
        this.eventTerm$.next(term);
      }
    });
  }

  getConditionsFiltereds() {
    this.conditionsFiltered = {
      ...this.filters.value,
      city: this.filters.value.city === "null" ? null : this.filters.value.city,
      term:
        this.inputSearchControl.value === ""
          ? null
          : this.inputSearchControl.value,
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
    // //this.spinner.setActive(true);
    this.eventService
      .searchEventsPublish(
        this.currentPageFilters,
        this.pageSize,
        this.conditionsFiltered
      )
      .subscribe((response) => {
        if (this.currentPageFilters === 1) {
          this.eventsFiltered = response.data.events;
        } else {
          this.eventsFiltered = [
            ...this.eventsFiltered,
            ...response.data.events,
          ];
        }
        this.totalEventFiltereds = response.data.total ?? 0;
        // //this.spinner.setActive(false);
        if (response.data.events.length > 0) {
          this.termNotFound = null;
          this.notDataFilter = false;
          return;
        }
        if (
          this.inputSearchControl.value &&
          this.inputSearchControl.value.length > 0
        ) {
          this.termNotFound = this.inputSearchControl.value;
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
    this.inputSearchControl.setValue(null);
    this.filters.patchValue({
      city: null,
      type: null,
      start_date: null,
      end_date: null,
      outstanding: false,
    });
  }

  getCityNameById(cityId: any): string {
    const city = this.cities.find((c) => c.id == cityId);
    return city ? city.name : "";
  }

  getServiceNameById(serviceId: any): string {
    const service = this.services.find((s) => s.id == serviceId);
    return service ? service.name : "";
  }

  hasMoreEvents(): boolean {
    return this.currentPage * this.pageSize < this.eventService.totalEvents!;
  }

  hasMoreEventsFiltereds(): boolean {
    return this.currentPageFilters * this.pageSize < this.totalEventFiltereds;
  }

  getMoreEvents() {
    const conditions = this.getConditionsFiltereds();
    if (!conditions) {
      this.eventService.currentPage += 1;
      this.getEvents();
    } else {
      this.currentPageFilters += 1;
      this.searchEvents();
    }
    this.lastEvent.nativeElement.scrollIntoView({ behavior: "smooth" });
  }
}
