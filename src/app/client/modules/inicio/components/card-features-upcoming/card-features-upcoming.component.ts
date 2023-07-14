import { environment } from './../../../../../../environments/environment';
import { Event } from './../../../../../interfaces/event';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-features-upcoming',
  templateUrl: './card-features-upcoming.component.html',
  styleUrls: ['./card-features-upcoming.component.scss']
})
export class CardFeaturesUpcomingComponent implements OnInit {

  @Input() dataEvents:Event[] = []

  public url = `${environment.url}/upload/eventos`;

  constructor() { }

  ngOnInit(): void {
  }

}
