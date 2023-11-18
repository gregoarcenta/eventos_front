import { IEvent } from '../../../core/interfaces/Event';
import { environment } from './../../../../environments/environment';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {
  @Input() event?: IEvent
  @Input() marginB:boolean = false;
  public url = `${environment.url}/upload/eventos`;

  constructor() { }

  ngOnInit(): void {
  }

}
