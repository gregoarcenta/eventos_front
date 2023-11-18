import { EventFormStore } from "../../../../core/services/store/event-form.store";
import { IEvent } from "../../../../core/interfaces/Event";
import { PlaceStore } from "../../../../core/services/store/place.store";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatStepper } from "@angular/material/stepper";
import Swal from "sweetalert2";

@Component({
  selector: "create-event",
  templateUrl: "./create-event.component.html",
  styleUrls: ["./create-event.component.scss"],
})
export class CreateEventComponent implements OnInit {
  @Input() isAdmin: boolean = false;
  @ViewChild(MatStepper) stepper!: MatStepper;
  @Output() onCreateEvent = new EventEmitter<IEvent>();

  get generalForm() {
    return this.eventForm.generalDataForm;
  }

  get placeForm() {
    return this.eventForm.placeDataForm;
  }

  get localitiesForm() {
    return this.eventForm.localitiesDataForm;
  }

  get localitiesArray() {
    return this.localitiesForm.controls["localities"];
  }

  constructor(
    private eventForm: EventFormStore,
    private place: PlaceStore
  ) {}

  ngOnInit(): void {}

  validateChangeStepper(e: any) {
    const steps = document.querySelectorAll(".mat-step");
    const iconTemplate = `
      <mat-icon role="img" aria-hidden="true" class="mat-icon notranslate material-icons mat-ligature-font mat-icon-no-color ng-star-inserted" data-mat-icon-type="font">
      create
      </mat-icon>
    `;

    const numTemplate = `<span aria-hidden="true" class="ng-star-inserted">2</span>`;

    const editIconContainer = steps[1].querySelector(
      ".mat-step-icon :first-child"
    );

    if (e.selectedIndex == 2 || e.selectedIndex == 0) {
      editIconContainer!.innerHTML = iconTemplate;
      steps[1].classList.add("step2CustomClass");
    } else {
      editIconContainer!.innerHTML = numTemplate;
      steps[1].classList.remove("step2CustomClass");
    }

    // Paso del step 2 formulario de ubicacion
    if (e.selectedIndex == 2) {
      const lng =
        this.place.placeLocation?.lng ||
        this.place.userLocation?.lng;
      const lat =
        this.place.placeLocation?.lat ||
        this.place.userLocation?.lat;

      this.placeForm.get("lng")?.setValue(lng + "");
      this.placeForm.get("lat")?.setValue(lat + "");
    }
  }

  validateEventForm() {
    if (this.generalForm.invalid) {
      this.generalForm.markAllAsTouched();
      return false;
    }
    return this.stepper.next();
  }

  validatePlaceForm() {
    const placeId = this.placeForm.controls["place_id"].value;
    const customPlace = this.placeForm.controls["customPlace"].value;

    if (!placeId && !customPlace) {
      Swal.fire(
        "¡Lo sentimo!",
        "Tiene que seleccionar una ubicación para el evento",
        "info"
      );
      return false;
    }

    if (this.placeForm.invalid) {
      this.placeForm.markAllAsTouched();
      return false;
    }

    return this.stepper.next();
  }

  onSubmit() {
    if (this.generalForm.invalid) {
      this.generalForm.markAllAsTouched();
      this.stepper.previous();
      this.stepper.previous();
      return;
    }

    if (this.placeForm.invalid) {
      this.placeForm.markAllAsTouched();
      this.stepper.previous();
      return;
    }

    if (this.localitiesArray.value.length === 0) {
      Swal.fire(
        "¡Lo sentimos!",
        "Tienes que tener al menos una localidad",
        "info"
      );
      return;
    }

    if (this.localitiesForm.invalid) {
      Swal.fire(
        "¡Lo sentimos!",
        "¡Los datos de las localidades están incompletos!\nRecuerda elegir el nombre de la localidad, precio y un límite de entradas",
        "info"
      );
      return;
    }

    const place_localities = this.localitiesArray.value.map((locality) => {
      const { id, ...data } = locality;
      return data;
    });

    const event: any = {
      ...this.generalForm.value,
      place_id: this.placeForm.value.place_id,
      place: this.placeForm.value,
      place_localities,
    };

    this.onCreateEvent.emit(event);
  }
}
