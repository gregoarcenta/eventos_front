import { environment } from './../../../../../../environments/environment';
import { EventService } from './../../../../../services/events.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  public url = `${environment.url}/upload/eventos`;

  get events() {
    return this.eventService.getEvents;
  }

  get mainImagesUrl():string[] {
    return [
      `${this.url}/896d3794-bb1d-4055-97a9-e9d96fd54df0.jpg`,
      `${this.url}/20086cb5-928d-4cd1-b5a2-ab1c81d5b0d1.jpg`,
      `${this.url}/363889e8-3a71-4572-9d35-b08da7631cd8.jpg`
    ]
  }

  constructor(private eventService:EventService) { }

  ngOnInit(): void {
     //Obtiene todos los eventos
     if (this.events.length === 0) {
      this.getEvents();
    }
  }

  getEvents() {
    this.eventService.getAllEventsPublish().subscribe((response) => {
      this.eventService.setEvents = response.data;
    });
  }

}
