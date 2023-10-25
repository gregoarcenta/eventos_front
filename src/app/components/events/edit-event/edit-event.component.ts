import { Event } from "./../../../interfaces/event";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "edit-event",
  templateUrl: "./edit-event.component.html",
  styleUrls: ["./edit-event.component.scss"],
})
export class EditEventComponent implements OnInit {
  @Input() isAdmin: boolean = false;
  @Input() event!: Event;

  @Output() onDataGeneralUpdate = new EventEmitter<Event>();
  @Output() onDataPlaceUpdate = new EventEmitter<Event>();
  @Output() onDataLocalitiesUpdate = new EventEmitter<Event>();

  constructor() {}

  ngOnInit(): void {}

  updateDataGeneral() {
    this.onDataGeneralUpdate.emit()
  }
  updateDataPlace() {
    this.onDataPlaceUpdate.emit()
  }
  updateDataLocalities() {
    this.onDataLocalitiesUpdate.emit()
  }
}
