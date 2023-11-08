import { EventFormService } from "./../../../services/event-form.service";
import { Event } from "./../../../interfaces/event";
import { DataService } from "./../../../services/data.service";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "localities-data-form",
  templateUrl: "./localities-data-form.component.html",
  styleUrls: ["./localities-data-form.component.scss"],
})
export class LocalitiesDataFormComponent implements OnInit, OnDestroy {
  @Input() event: Event | null = null;

  get localities() {
    return this.dataService.getLocalities;
  }

  get localitiesDataForm() {
    return this.eventFormService.localitiesDataForm;
  }

  get localitiesDataArray() {
    return this.localitiesDataForm.controls["localities"];
  }

  constructor(
    private dataService: DataService,
    private eventFormService: EventFormService
  ) {}

  ngOnDestroy(): void {
    this.eventFormService.clearLocalitiesForm();
    this.eventFormService.localitiesDataOriginal = undefined;
  }

  ngOnInit(): void {
    this.onFillLocalitiesData();

    // Obtiene lista de localidades
    if (this.dataService.getLocalities.length === 0) {
      this.dataService.getAllLocalities().subscribe((_) => {});
    }
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
