import { UploadImageEventService } from "./../../../../../services/upload-image-event.service";
import { environment } from "./../../../../../../environments/environment";
import { EventService } from "./../../../../../services/events.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-eventos",
  templateUrl: "./eventos.component.html",
  styleUrls: ["./eventos.component.scss"],
})
export class EventosComponent implements OnInit {
  private url = `${environment.url}/upload/eventos`;

  get events() {
    return this.eventService.getEvents;
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
    private eventService: EventService,
    private uploadImageEventService: UploadImageEventService
  ) {}

  ngOnInit(): void {
    //Obtiene todos los eventos
    if (this.events.length === 0) {
      this.getEvents();
    }

    //Obtiene las imagenes principales para el slider del header
    if (this.mainImagesUrl.length === 0) {
      this.getMainImages();
    }

    //Obtiene las imagenes secundariasdel header
    if (this.secondariesImagesUrl.length === 0) {
      this.getSecondariesImages();
    }
  }

  getEvents() {
    this.eventService.getAllEventsPublish().subscribe((response) => {
      this.eventService.setEvents = response.data;
    });
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
}
