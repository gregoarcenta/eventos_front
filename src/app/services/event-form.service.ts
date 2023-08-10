import { CustomValidators } from "./../validations/validations-forms";
import { _patterDescription, _patterName } from "./../utils/regularPatterns";
import { Injectable } from "@angular/core";
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class EventFormService {
  private eventForm = this.fb.group(
    {
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(_patterDescription),
        ],
      ],
      description: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(_patterDescription),
        ],
      ],
      img: ["", [Validators.required]],
      outstanding: [false, [Validators.required]],
      publish: [false, [Validators.required]],
      organizer: this.fb.control<string | null>(null, [Validators.required]),
      existsArtist: [false, [Validators.required]],
      artist: this.fb.control<string | null>(null),
      start_date: ["", [Validators.required]],
      start_time: ["", [Validators.required]],
      end_date: ["", [Validators.required]],
      end_time: ["", [Validators.required]],
      service_id: [0, [Validators.required, CustomValidators.validNotZero]],
    },
    { validators: this.validarFechas } as AbstractControlOptions
  );

  private placeForm = this.fb.group({
    name: [
      "",
      [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(_patterName),
      ],
    ],
    description: ["", [Validators.required, Validators.minLength(3)]],
    reference: ["", [Validators.required, Validators.minLength(3)]],
    province_id: [0, [Validators.required, CustomValidators.validNotZero]],
    city_id: [0, [Validators.required, CustomValidators.validNotZero]],
    place_id: [-1],
    validCoords: [false, [Validators.requiredTrue]],
    lat: [""],
    lng: [""],
  });

  private localitiesForm = this.fb.group({
    localities: this.fb.array<FormGroup>([]),
  });

  get generalDataForm() {
    return this.eventForm;
  }

  get placeDataForm() {
    return this.placeForm;
  }

  get localitiesDataForm() {
    return this.localitiesForm;
  }

  constructor(private fb: FormBuilder) {}

  private validarFechas(form: FormGroup) {
    let fechaHoraInicio: Date | null = null;
    const fechaInicio = form.get("start_date")!.value;
    const horaInicio = form.get("start_time")!.value;
    const fechaFin = form.get("end_date")!.value;
    const horaFin = form.get("end_time")!.value;

    if (fechaInicio && horaInicio) {
      fechaHoraInicio = new Date(`${fechaInicio}T${horaInicio}`);

      if (fechaHoraInicio <= new Date()) {
        return { fechaInicioInvalida: true };
      }
    }

    if (fechaFin && horaFin) {
      const fechaHoraFin = new Date(`${fechaFin}T${horaFin}`);

      if (fechaHoraFin <= fechaHoraInicio!) {
        return { fechaFinInvalida: true };
      }
    }

    return null;
  }

  clearEventForm() {
    this.eventForm.reset({
      name: "",
      description: "",
      img: "",
      outstanding: false,
      publish: false,
      organizer: null,
      existsArtist: false,
      artist: null,
      start_date: "",
      start_time: "",
      end_date: "",
      end_time: "",
      service_id: 0,
    });
    this.eventForm.controls["artist"].clearValidators()
  }

  clearPlaceForm() {
    this.placeForm.reset({
      name: "",
      description: "",
      reference: "",
      province_id: 0,
      city_id: 0,
      place_id: -1,
      validCoords: false,
      lat: "",
      lng: "",
    });
  }
}
