import { CustomValidators } from './../../shared/validations/validations-forms';
import { Event, Place, PlaceLocality } from "../interfaces/event";
import { _patterDescription, _patterName } from "../../shared/utils/regularPatterns";
import { Injectable } from "@angular/core";
import {
  AbstractControlOptions,
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from "@angular/forms";

interface IEventData {
  name: FormControl<string>;
  description: FormControl<string>;
  img: FormControl<string | null>;
  outstanding: FormControl<boolean>;
  publish: FormControl<boolean>;
  organizer: FormControl<string | null>;
  existsArtist: FormControl<boolean>;
  artist: FormControl<string | null>;
  start_date: FormControl<string>;
  start_time: FormControl<string>;
  end_date: FormControl<string>;
  end_time: FormControl<string>;
  service_id: FormControl<number>;
}

interface IPlaceData {
  name: FormControl<string>;
  description: FormControl<string>;
  reference: FormControl<string>;
  province_id: FormControl<number>;
  city_id: FormControl<number>;
  place_id: FormControl<number | null>;
  customPlace: FormControl<boolean>;
  // validCoords: FormControl<boolean>;
  lat: FormControl<string>;
  lng: FormControl<string>;
}

export interface ILocalitiesDataArr {
  id: FormControl<number | null>;
  numeration: FormControl<boolean>;
  locality_id: FormControl<number>;
  price: FormControl<number | null>;
  limit_tickets: FormControl<number | null>;
}

interface ILocalitiesData {
  localities: FormArray<FormGroup<ILocalitiesDataArr>>;
}

@Injectable({
  providedIn: "root",
})
export class EventFormService {
  public generalDataOriginal?: any;
  public generalDataForm = this.nnfb.group<IEventData>(
    {
      name: this.nnfb.control("", [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(_patterDescription),
      ]),
      description: this.nnfb.control("", [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(_patterDescription),
      ]),
      img: this.nnfb.control(null, [Validators.required]),
      outstanding: this.nnfb.control(false, [Validators.required]),
      publish: this.nnfb.control(false, [Validators.required]),
      organizer: this.nnfb.control(null, [Validators.required]),
      existsArtist: this.nnfb.control(false, [Validators.required]),
      artist: this.nnfb.control(null),
      start_date: this.nnfb.control("", [Validators.required]),
      start_time: this.nnfb.control("", [Validators.required]),
      end_date: this.nnfb.control("", [Validators.required]),
      end_time: this.nnfb.control("", [Validators.required]),
      service_id: this.nnfb.control(0, [
        Validators.required,
        CustomValidators.validNotZero,
      ]),
    },
    { validators: this.validarFechas } as AbstractControlOptions
  );

  public placeDataOriginal?: any;
  public placeDataForm = this.nnfb.group<IPlaceData>({
    name: this.nnfb.control("", [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(_patterName),
    ]),
    description: this.nnfb.control("", [
      Validators.required,
      Validators.minLength(3),
    ]),
    reference: this.nnfb.control("", [
      Validators.required,
      Validators.minLength(3),
    ]),
    customPlace: this.nnfb.control(false),
    province_id: this.nnfb.control(0, [
      Validators.required,
      CustomValidators.validNotZero,
    ]),
    city_id: this.nnfb.control(0, [
      Validators.required,
      CustomValidators.validNotZero,
    ]),
    place_id: this.nnfb.control(null),
    // validCoords: this.nnfb.control(false, [Validators.requiredTrue]),
    lat: this.nnfb.control("", [Validators.required]),
    lng: this.nnfb.control("", Validators.required),
  });

  public localitiesDataOriginal?: any;
  public localitiesDataForm = this.nnfb.group<ILocalitiesData>({
    localities: this.nnfb.array<FormGroup<ILocalitiesDataArr>>([]),
  });
  get localitiesDataArray() {
    return this.localitiesDataForm.controls["localities"];
  }

  constructor(private nnfb: NonNullableFormBuilder) {}

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
    this.generalDataForm.reset({
      name: "",
      description: "",
      img: "",
      outstanding: false,
      publish: false,
      organizer: "",
      existsArtist: false,
      artist: null,
      start_date: "",
      start_time: "",
      end_date: "",
      end_time: "",
      service_id: 0,
    });
    this.generalDataForm.controls["artist"].clearValidators();
  }
  clearPlaceForm() {
    this.placeDataForm.reset({
      name: "",
      description: "",
      reference: "",
      province_id: 0,
      city_id: 0,
      place_id: null,
      // validCoords: false,
      customPlace: false,
      lat: "",
      lng: "",
    });
  }

  clearLocalitiesForm() {
    this.localitiesDataForm.controls["localities"].clear();
  }

  setGeneralDataForm(event: Event) {
    this.generalDataForm.setValue({
      name: event.name,
      description: event.description,
      img: event.img,
      outstanding: event.outstanding,
      publish: event.publish,
      organizer: event.organizer,
      existsArtist: event.artist ? true : false,
      artist: event.artist,
      start_date: String(event.start_date),
      start_time: event.start_time,
      end_date: String(event.end_date),
      end_time: event.end_time,
      service_id: event.service_id,
    });
  }
  setGeneralDataOriginal() {
    this.generalDataOriginal = structuredClone(this.generalDataForm.value);
  }

  setPlaceDataForm(place: Place) {
    this.placeDataForm.setValue({
      place_id: place.direction.place_id,
      name: place.name,
      description: place.direction.description,
      reference: place.direction.reference,
      province_id: place.direction.province_id,
      city_id: place.direction.city_id,
      lat: place.direction.lat,
      lng: place.direction.lng,
      // validCoords: true,
      customPlace: false,
    });
  }
  setPlaceDataOriginal() {
    this.placeDataOriginal = {
      name: this.placeDataForm.value.name,
      direction: {
        place_id: this.placeDataForm.value.place_id,
        description: this.placeDataForm.value.description,
        reference: this.placeDataForm.value.reference,
        province_id: this.placeDataForm.value.province_id,
        city_id: this.placeDataForm.value.city_id,
        lat: this.placeDataForm.value.lat,
        lng: this.placeDataForm.value.lng,
      },
    };
  }

  setLocalitiesDataForm(localities: PlaceLocality[]) {
    this.clearLocalitiesForm();

    localities.forEach((locality) => {
      const newLocalityFormGroup = this.generateFormGroupLocality()

      newLocalityFormGroup.setValue({
        id: locality.id,
        numeration: locality.numeration,
        locality_id: locality.locality_id,
        limit_tickets: locality.limit_tickets,
        price: locality.price,
      });

      this.localitiesDataArray.push(newLocalityFormGroup);
    });
  }
  setLocalitiesDataOriginal() {
    this.localitiesDataOriginal = structuredClone(
      this.localitiesDataForm.value.localities
    );
  }

  generateFormGroupLocality(): FormGroup<ILocalitiesDataArr> {
    return this.nnfb.group<ILocalitiesDataArr>({
      id: this.nnfb.control(null),
      numeration: this.nnfb.control(false, [Validators.required]),
      locality_id: this.nnfb.control(0, [
        Validators.required,
        Validators.min(1),
      ]),
      limit_tickets: this.nnfb.control(null, [
        Validators.required,
        Validators.min(1),
      ]),
      price: this.nnfb.control(null, [
        Validators.required,
        Validators.min(0.1),
      ]),
    });
  }
}
