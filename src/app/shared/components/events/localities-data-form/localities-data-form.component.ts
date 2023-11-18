import { CatalogStore } from "../../../../core/services/store/catalog.store";
import { IEvent } from "../../../../core/interfaces/Eventgfds";
import { EventFormStore } from "../../../../core/services/store/event-form.store";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";

@Component({
  selector: "localities-data-form",
  templateUrl: "./localities-data-form.component.html",
  styleUrls: ["./localities-data-form.component.scss"],
})
export class LocalitiesDataFormComponent implements OnInit, OnDestroy {
  @Input() event: IEvent | null = null;

  get localities$() {
    return this.catalog.localities$;
  }

  get localitiesDataForm() {
    return this.eventForm.localitiesDataForm;
  }

  get localitiesDataArray() {
    return this.localitiesDataForm.controls["localities"];
  }

  constructor(
    private catalog: CatalogStore,
    private eventForm: EventFormStore
  ) {}

  ngOnDestroy(): void {
    this.eventForm.clearLocalitiesForm();
    this.eventForm.localitiesDataOriginal = undefined;
  }

  ngOnInit(): void {
    this.onFillLocalitiesData();
  }

  addLocality() {
    const fgLocality = this.eventForm.generateFormGroupLocality();
    this.localitiesDataArray.push(fgLocality);
  }

  removeLocality(index: number) {
    this.localitiesDataArray.removeAt(index);
  }

  onFillLocalitiesData() {
    if (!this.event) return;

    this.eventForm.setLocalitiesDataForm(this.event.place_localities);
    this.eventForm.setLocalitiesDataOriginal();
  }
}
