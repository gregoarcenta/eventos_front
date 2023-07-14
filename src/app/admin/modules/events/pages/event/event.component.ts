import { SpinnerService } from "./../../../../../services/spinner.service";
import { Place } from "./../../../../../interfaces/place";
import { Place as EventPlace } from "./../../../../../interfaces/event";
import { PlaceService } from "./../../../../../services/place.service";
import { UploadImageEventService } from "./../../../../../services/upload-image-event.service";
import { environment } from "./../../../../../../environments/environment";
import Swal from "sweetalert2";
import { Event } from "./../../../../../interfaces/event";
import { CustomValidators } from "./../../../../../validations/validations-forms";
import { _patterDescription, _patterName } from "./../../../../../utils/regularPatterns";
import { FormService } from "./../../../../../services/form.service";
import { DataService } from "./../../../../../services/data.service";
import { EventService } from "./../../../../../services/events.service";
import {
  AbstractControlOptions,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { Subject, Subscription, debounceTime } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { MatStepper } from "@angular/material/stepper";

@Component({
  selector: "app-event",
  templateUrl: "./event.component.html",
  styleUrls: ["./event.component.scss"],
})
export class EventComponent implements OnInit {
  @ViewChild(MatStepper) stepper!: MatStepper;
  @HostListener("window:beforeunload", ["$event"])
  beforeUnloadHandler(event: Event) {
    this.deleteImageIfNotSave();
  }
  firstFormGroup: FormGroup = this.fb.group({ firstCtrl: [""] });
  secondFormGroup: FormGroup = this.fb.group({ secondCtrl: [""] });
  private provinceSubscription?: Subscription;
  private checkArtistSubscription?: Subscription;
  private eventId: null | number = null;
  public event: Event | null = null;
  public imageSelected: string | null = null;
  private placeTerm$ = new Subject<string>();
  public places: Place[] = [];
  public place: EventPlace | null = null;
  public notFoundPlace: boolean = false;
  public editMode: boolean = false;

  public eventForm = this.fb.group(
    {
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(_patterName),
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
      organizer: ["", [Validators.required, Validators.pattern(_patterName)]],
      existsArtist: [false, [Validators.required]],
      artist: this.fb.control<string | null>(null, [
        Validators.minLength(3),
        Validators.pattern(_patterName),
      ]),
      start_date: ["", [Validators.required]],
      start_time: ["", [Validators.required]],
      end_date: ["", [Validators.required]],
      end_time: ["", [Validators.required]],
      service_id: [0, [Validators.required, CustomValidators.validNotZero]],
    },
    { validators: this.validarFechas } as AbstractControlOptions
  );

  public placeForm = this.fb.group({
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

  public localitiesForm = this.fb.group({
    localities: this.fb.array<FormGroup>([]),
  });

  get services() {
    return this.dataService.getServices;
  }

  get provinces() {
    return this.dataService.getProvinces;
  }

  get cities() {
    return this.dataService.getCities;
  }

  get localities() {
    return this.dataService.getLocalities;
  }

  get imageURL(): string {
    return `${environment.url}/upload/eventos/${this.imageSelected}`;
  }

  get localitiesArray() {
    return this.localitiesForm.get("localities") as FormArray<FormGroup>;
  }

  constructor(
    private uploadImageEventService: UploadImageEventService,
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private placeService: PlaceService,
    private dataService: DataService,
    public formService: FormService,
    private spinner: SpinnerService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnDestroy(): void {
    this.provinceSubscription?.unsubscribe();
    this.checkArtistSubscription?.unsubscribe();
    this.deleteImageIfNotSave();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.eventId = params["id"];
    });

    if (this.eventId) {
      this.eventService
        .getEventsById(this.eventId as number)
        .subscribe((response) => {
          this.event = response.data;
        });
    }

    // Obtiene lista de servicios
    if (this.dataService.getServices.length === 0) {
      this.dataService
        .getAllServices()
        .subscribe(
          (response) => (this.dataService.setServices = response.data)
        );
    }

    // Obtiene lista de localidades
    if (this.dataService.getLocalities.length === 0) {
      this.dataService
        .getAllLocalities()
        .subscribe(
          (response) => (this.dataService.setLocalities = response.data)
        );
    }

    // Obtiene lista de provincias
    if (this.dataService.getProvinces.length === 0) {
      this.dataService
        .getAllprovinces()
        .subscribe(
          (response) => (this.dataService.setProvinces = response.data)
        );
    }

    // Detecta cuando se cambia el check artist
    this.checkArtistSubscription = this.eventForm
      .get("existsArtist")!
      .valueChanges.subscribe((value) => {
        const inputArtistField = this.eventForm.get("artist");
        inputArtistField!.setValue(null);
        if (value) {
          inputArtistField!.setValidators([
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(_patterName),
          ]);
        } else {
          inputArtistField!.clearValidators();
        }
        inputArtistField!.updateValueAndValidity();
      });

    // Detecta cuando se cambia el select de provincia
    this.provinceSubscription = this.placeForm
      .get("province_id")!
      .valueChanges.subscribe((provinceId) => {
        //Obtiene lista de ciudades por id de provincia
        if (!this.place) this.cargarCiudades(true, Number(provinceId));
      });

    // Para buscar places
    this.placeTerm$
      .pipe(debounceTime(300)) // Establece el retardo deseado (en milisegundos)
      .subscribe((term) => {
        if (term && term.length >= 3) {
          this.placeService.searchPlaces(term).subscribe((response) => {
            this.places = response.data;
            if (response.data.length === 0) {
              this.notFoundPlace = true;
            } else {
              this.notFoundPlace = false;
            }
          });
        } else {
          this.notFoundPlace = false;
          this.places = [];
        }
      });
  }

  deleteImageIfNotSave() {
    if (this.eventForm.value.img) {
      this.uploadImageEventService
        .deleteImgIfNotExists(this.eventForm.value.img)
        .subscribe((_) => {});
    }
  }

  validarFechas(form: FormGroup) {
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

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    const archivos = event.dataTransfer?.files;
    if (archivos && archivos.length > 0) {
      const imagen = archivos[0];
      if (imagen.type.startsWith("image/")) {
        this.cargarImagen(imagen);
      } else {
        Swal.fire("¡Lo sentimos!", "El archivo no es una imagen", "error");
      }
    }
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
  }

  onClickImageBanner(): void {
    const inputArchivo = document.createElement("input");
    inputArchivo.type = "file";
    inputArchivo.accept = "image/*";
    inputArchivo.addEventListener("change", (event) => {
      const archivo = (event.target as HTMLInputElement).files?.[0];
      if (archivo) {
        this.cargarImagen(archivo);
      }
    });
    inputArchivo.click();
  }

  cargarImagen(archivo: File): void {
    const TAMANIO_IDEAL = { ancho: 1280, alto: 800 };
    const RELACION_ASPECTO_DESEADA = 16 / 10;

    if (archivo) {
      const img = new Image();
      img.onload = () => {
        const relacionAspecto = img.width / img.height;
        if (
          img.width < TAMANIO_IDEAL.ancho ||
          img.height < TAMANIO_IDEAL.alto ||
          relacionAspecto !== RELACION_ASPECTO_DESEADA
        ) {
          Swal.fire(
            "¡Lo sentimos!",
            "El tamaño de la imagen no es el correcto",
            "warning"
          );
          return;
        } else {
          this.uploadImageEventService
            .uploadImgEvent(archivo)
            .subscribe((respose) => {
              this.imageSelected = respose.data;
              this.eventForm.patchValue({ img: this.imageSelected });
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "¡Imagen cargada exitosamente!",
                showConfirmButton: false,
                timer: 3000,
              });
            });
        }
      };
      img.src = window.URL.createObjectURL(archivo);
    }
  }

  cargarCiudades(ejecutar = false, provinceId: number, cityId?: number) {
    const controlPorvinceId = Number(this.placeForm.get("province_id")?.value);
    const controlCityId = Number(this.placeForm.get("city_id")?.value);
    if (controlPorvinceId === provinceId && controlCityId === cityId) return;
    this.dataService.getCitiesByProvinceId(provinceId).subscribe((response) => {
      if (controlPorvinceId !== provinceId || ejecutar) {
        this.dataService.setCities = response.data;
      }

      if (this.place) {
        this.placeForm.get("city_id")?.setValue(this.place.direction.city_id);
      }
    });
  }

  validateChangeStepper(e: any) {
    // Paso del step 2 formulario de ubicacion
    if (e.selectedIndex == 2 && !this.place) {
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

    if (placeId && placeId < 10000) return false;

    if (placeId === null && this.placeForm.invalid) {
      this.placeForm.markAllAsTouched();
      return false;
    }

    return this.stepper.next();
  }

  searchPlaces(event: any) {
    const term = event.target.value;
    this.placeTerm$.next(term);
  }

  getPlace(placeId: number) {
    if (this.placeForm.get("place_id")?.value === placeId) return;
    this.places = [];
    this.placeService.getEventsById(placeId).subscribe((response) => {
      this.place = response.data;

      this.placeService.setPlaceLocation(
        this.place.direction.lng,
        this.place.direction.lat
      );

      this.editMode = false;

      this.cargarCiudades(
        false,
        this.place.direction.province_id,
        this.place.direction.city_id
      );

      this.placeForm.get("place_id")?.setValue(this.place.id);
      this.placeForm.get("validCoords")?.setValue(true);
      this.placeForm.get("lat")?.setValue(this.place.direction.lat);
      this.placeForm.get("lng")?.setValue(this.place.direction.lng);

      this.placeForm.get("name")?.setValue(this.place.name);

      this.placeForm
        .get("description")
        ?.setValue(this.place.direction.description);

      this.placeForm.get("reference")?.setValue(this.place.direction.reference);

      this.placeForm
        .get("province_id")
        ?.setValue(this.place.direction.province_id);

      this.placeForm.disable();
      this.placeForm.updateValueAndValidity();
    });
  }

  addPlace() {
    if (this.editMode) return;
    this.placeForm.patchValue({
      name: "",
      description: "",
      reference: "",
      province_id: 0,
      city_id: 0,
      place_id: null,
      lat: "",
      lng: "",
    });
    this.placeService
      .getUserLocation()
      .then(({ lng, lat }) => {
        this.placeForm.get("validCoords")?.setValue(true);
        this.placeForm.patchValue({
          lat: String(lat),
          lng: String(lng),
        });
      })
      .catch((error) => {
        console.log(error);
        this.placeForm.get("validCoords")?.setValue(false);
      });
    this.editMode = true;
    this.placeForm.enable();
    this.placeForm.markAsUntouched();
    this.place = null;
    this.dataService.setCities = [];
  }

  /***
   *
   * Inicio de metodos par agregar localidades
   *
   */

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

  createEvent() {
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

    const newEvent = {
      ...this.eventForm.value,
      place_id: this.placeForm.value.place_id,
      place: this.placeForm.value,
      place_localities: this.localitiesArray.value
    };

    console.log("Evento creado: ", newEvent);

    this.spinner.setActive(true);
    this.eventService.createEvent(newEvent).subscribe((response) => {
      console.log(response);
      this.spinner.setActive(false);
      Swal.fire("¡Listo!", response.message, "success").then((_) => {
        this.router.navigate(["/administrador/eventos"]);
      });
    });
  }

  /*  updateData() {
    if (this.userForm.invalid) return this.userForm.markAllAsTouched();

    this.spinner.setActive(true);
    const document_id = this.userForm.get("document_id")!.value;
    const num_document = this.userForm.get("num_document")!.value;
    this.userService
      .updateUser({
        ...this.userForm.value,
        img: this.authUser?.img,
        document_id,
        num_document,
      })
      .subscribe((response) => {
        Swal.fire("¡Listo!", response.message, "success");
        this.authService.setAuthUser = response.data;
        this.userForm.patchValue(this.authUser as any);
        this.userForm.disable();
        this.userForm.updateValueAndValidity();
        this.spinner.setActive(false);
      });
  } */
}
