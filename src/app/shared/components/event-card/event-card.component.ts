import { Event } from '../../../core/interfaces/event';
import { environment } from './../../../../environments/environment';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {
  @Input() event?: Event
  @Input() marginB:boolean = false;
  public url = `${environment.url}/upload/eventos`;

  constructor() { }

  ngOnInit(): void {
  }

}
