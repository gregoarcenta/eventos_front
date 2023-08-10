import { EventFormService } from "./../../services/event-form.service";
import { Event } from "./../../interfaces/event";
import { _patterDescription, _patterName } from "./../../utils/regularPatterns";
import { SpinnerService } from "./../../services/spinner.service";
import { EventService } from "./../../services/events.service";
import { PlaceService } from "./../../services/place.service";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "create-or-edit-event",
  templateUrl: "./create-or-edit-event.component.html",
  styleUrls: ["./create-or-edit-event.component.scss"],
})
export class CreateOrEditEventComponent implements OnInit {
  @Input() isAdmin!: boolean;
  @ViewChild(MatStepper) stepper!: MatStepper;

  public eventId: null | number = null;
  public event: Event | null = null;

  get eventForm() {
    return this.eventFormService.generalDataForm;
  }

  get placeForm() {
    return this.eventFormService.placeDataForm;
  }

  get localitiesForm() {
    return this.eventFormService.localitiesDataForm;
  }

  get localitiesArray() {
    return this.localitiesForm.get("localities") as FormArray<FormGroup>;
  }

  constructor(
    private eventFormService: EventFormService,
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private placeService: PlaceService,
    private spinner: SpinnerService,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.eventId = params["id"] || null;
      if (this.eventId) this.spinner.setActive(true);
    });
  }

  ngOnInit(): void {
    if (!this.eventId) return;
    this.eventService.getEventById(this.eventId as number).subscribe({
      next: (response) => {
        this.event = response.data;
        this.spinner.setActive(false);
      },
      error: (error) => {
        this.spinner.setActive(false);
        this.router.navigateByUrl("/");
      },
    });
  }

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
      //&& !this.place -> quite esto aqui
      const lng =
        this.placeService.placeLocation?.lng ||
        this.placeService.userLocation?.lng;
      const lat =
        this.placeService.placeLocation?.lat ||
        this.placeService.userLocation?.lat;

      this.placeForm.get("lng")?.setValue(lng + "");
      this.placeForm.get("lat")?.setValue(lat + "");
    }
  }

  validateEventForm() {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return false;
    }
    return this.stepper.next();
  }

  validatePlaceForm() {
    const placeId = this.placeForm.get("place_id")?.value || null;

    if (placeId && placeId === -1) {
      Swal.fire(
        "¡Lo sentimo!",
        "Tiene que seleccionar una ubicación para el evento",
        "info"
      );
      return false;
    }

    // if (placeId && placeId < 10000) return false;

    if (placeId === null && this.placeForm.invalid) {
      this.placeForm.markAllAsTouched();
      return false;
    }

    return this.stepper.next();
  }

  onSubmit() {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      this.stepper.previous();
      this.stepper.previous();
      return;
    }

    if (this.placeForm.invalid) {
      this.eventForm.markAllAsTouched();
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

    const event = {
      ...this.eventForm.value,
      place_id: this.placeForm.value.place_id,
      place: this.placeForm.value,
      place_localities: this.localitiesArray.value,
    };
    if (this.eventId) {
      this.updateEvent(event);
    } else {
      this.createEvent(event);
    }
  }

  createEvent(event: any) {
    this.spinner.setActive(true);
    this.eventService.createEvent(event).subscribe((response) => {
      this.spinner.setActive(false);
      Swal.fire("¡Listo!", response.message, "success").then((_) => {
        this.router.navigate(["/administrador/eventos"]);
      });
    });
  }

  updateEvent(event: any) {
    this.spinner.setActive(true);
    this.eventService
      .updateEvent(event, this.eventId!)
      .subscribe((response) => {
        this.spinner.setActive(false);
        Swal.fire("¡Listo!", response.message, "success").then((_) => {
          this.router.navigate(["/administrador/eventos"]);
        });
      });
  }
}
