import { DataStore } from "./../../../../core/services/store/data.store";
import { Event } from "./../../../../core/interfaces/event";
import { EventFormService } from "./../../../../core/services/event-form.service";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";

@Component({
  selector: "localities-data-form",
  templateUrl: "./localities-data-form.component.html",
  styleUrls: ["./localities-data-form.component.scss"],
})
export class LocalitiesDataFormComponent implements OnInit, OnDestroy {
  @Input() event: Event | null = null;

  get localities$() {
    return this.dataStore.localities$;
  }

  get localitiesDataForm() {
    return this.eventFormService.localitiesDataForm;
  }

  get localitiesDataArray() {
    return this.localitiesDataForm.controls["localities"];
  }

  constructor(
    private dataStore: DataStore,
    private eventFormService: EventFormService
  ) {}

  ngOnDestroy(): void {
    this.eventFormService.clearLocalitiesForm();
    this.eventFormService.localitiesDataOriginal = undefined;
  }

  ngOnInit(): void {
    this.onFillLocalitiesData();
  }

  addLocality() {
    const fgLocality = this.eventFormService.generateFormGroupLocality();
    this.localitiesDataArray.push(fgLocality);
  }

  removeLocality(index: number) {
    this.localitiesDataArray.removeAt(index);
  }

  onFillLocalitiesData() {
    if (!this.event) return;

    this.eventFormService.setLocalitiesDataForm(this.event.place_localities);
    this.eventFormService.setLocalitiesDataOriginal();
  }
}
