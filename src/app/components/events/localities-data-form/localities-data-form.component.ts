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
  @Input() set _event(event: Event | null) {
    if (!event) return;
    this.event = event;
    this.event.place_localities.forEach((locality) => {
      const newLocalityFormGroup = this.fb.group({
        localityId: [locality.id, Validators.required],
        numeration: [locality.numeration, [Validators.required]],
        price: [locality.price, [Validators.required, Validators.min(0.1)]],
        limit_tickets: [
          locality.limit_tickets,
          [Validators.required, Validators.min(1)],
        ],
        locality_id: [
          locality.locality_id,
          [Validators.required, Validators.min(1)],
        ],
      });

      this.localitiesArray.push(newLocalityFormGroup);
    });
  }

  public event: Event | null = null;

  get localities() {
    return this.dataService.getLocalities;
  }

  get localitiesArray() {
    return this.localitiesForm.get("localities") as FormArray<FormGroup>;
  }

  get localitiesForm() {
    return this.eventFormService.localitiesDataForm;
  }

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private eventFormService: EventFormService
  ) {}

  ngOnDestroy(): void {
    this.localitiesArray.clear()
  }

  ngOnInit(): void {
    // Obtiene lista de localidades
    if (this.dataService.getLocalities.length === 0) {
      this.dataService.getAllLocalities().subscribe((_) => {});
    }
  }

  addLocality() {
    const newLocalityFormGroup = this.fb.group({
      numeration: [false, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0.1)]],
      limit_tickets: [null, [Validators.required, Validators.min(1)]],
      locality_id: [0, [Validators.required, Validators.min(1)]],
    });

    this.localitiesArray.push(newLocalityFormGroup);
  }

  removeLocality(index: number) {
    this.localitiesArray.removeAt(index);
  }
}
