import { DataService } from "./../../../../../services/data.service";
import { SpinnerService } from "./../../../../../services/spinner.service";
import { Event } from "./../../../../../interfaces/event";
import { UploadImageEventService } from "./../../../../../services/upload-image-event.service";
import { environment } from "./../../../../../../environments/environment";
import { EventService } from "./../../../../../services/events.service";
import { Component, OnInit } from "@angular/core";
import { Subject, pairwise, startWith } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-eventos",
  templateUrl: "./eventos.component.html",
  styleUrls: ["./eventos.component.scss"],
})
export class EventosComponent implements OnInit {
  private url = `${environment.url}/upload/eventos`;
  private eventTerm$ = new Subject<string>();
  public termNotFound: string | null = null;
  public eventsFiltered: Event[] = [];

  public inputSearchControl = new FormControl("", [
    Validators.required,
    Validators.minLength(3),
  ]);

  public filters = new FormGroup({
    city: new FormControl(null,[]),
    type: new FormControl(null,[]),
    date: new FormControl(null,[]),
    outstanding: new FormControl(null,[])
  });

  get events() {
    return this.eventService.getEvents;
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

  ngOnInit(): void {
    //Obtiene todos los eventos
    if (this.events.length === 0) {
      this.getEvents();
    }

    //Obtiene las ciudades de los eventos
    if (this.cities.length === 0) {
      this.getCities();
    }

    //Obtiene las lista de servicios
    if (this.services.length === 0) {
      this.getServices();
    }

    //Obtiene las imagenes principales para el slider del header
    if (this.mainImagesUrl.length === 0) {
      this.getMainImages();
    }

    //Obtiene las imagenes secundarias del header
    if (this.secondariesImagesUrl.length === 0) {
      this.getSecondariesImages();
    }

    // Para buscar los eventos
    this.eventTerm$
      .pipe(startWith(""), pairwise())
      .subscribe(([oldValue, newValue]) => {
        if (oldValue !== newValue) {
          this.spinner.setActive(true);
          this.eventService
            .searchEventsPublish(newValue)
            .subscribe((response) => {
              this.eventsFiltered = response.data;
              this.spinner.setActive(false);
              if (response.data.length === 0) {
                this.termNotFound = newValue;
              } else {
                this.termNotFound = null;
              }
            });
        }
      });
  }

  getEvents() {
    this.eventService.getAllEventsPublish().subscribe((_) => {});
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
      "896d3794-bb1d-4055-97a9-e9d96fd54df0.jpg",
      "20086cb5-928d-4cd1-b5a2-ab1c81d5b0d1.jpg",
      "363889e8-3a71-4572-9d35-b08da7631cd8.jpg",
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

  searchEvents() {
    const term = this.inputSearchControl.value;
    if (term && term.length >= 3 && this.events.length > 0) {
      this.eventTerm$.next(term);
    }
  }

  cleanFilters() {
    this.eventsFiltered = [];
    this.termNotFound = null;
    this.inputSearchControl.setValue("");
  }
}
