import { PlaceService } from "./../../../services/place.service";
import { EventFormService } from "./../../../services/event-form.service";
import { DataService } from "./../../../services/data.service";
import { FormService } from "./../../../services/form.service";
import { Event } from "./../../../interfaces/event";
import { Place } from "./../../../interfaces/place";
import { Place as EventPlace } from "./../../../interfaces/event";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subject, Subscription, debounceTime } from "rxjs";

@Component({
  selector: "place-data-form",
  templateUrl: "./place-data-form.component.html",
  styleUrls: ["./place-data-form.component.scss"],
})
export class PlaceDataFormComponent implements OnInit, OnDestroy {
  @Input() set _event(event: Event | null) {
    if (!event) return;
    this.event = event;
    this.getPlace(this.event.place.id);
  }

  private provinceSubscription?: Subscription;

  public event: Event | null = null;

  private placeTerm$ = new Subject<string>();
  public places: Place[] = [];
  public place: EventPlace | null = null;
  public notFoundPlace: boolean = false;
  public editMode: boolean = false;

  get provinces() {
    return this.dataService.getProvinces;
  }

  get cities() {
    return this.dataService.getCities;
  }

  get placeForm() {
    return this.eventFormService.placeDataForm;
  }

  constructor(
    public formService: FormService,
    private dataService: DataService,
    private placeService: PlaceService,
    private eventFormService: EventFormService
  ) {}

  ngOnDestroy(): void {
    this.provinceSubscription?.unsubscribe();
    this.eventFormService.clearPlaceForm();
    this.dataService.setCities = [];
  }

  ngOnInit(): void {
    // Obtiene lista de provincias
    if (this.dataService.getProvinces.length === 0) {
      this.dataService.getAllprovinces().subscribe((_) => {});
    }

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

  searchPlaces(event: any) {
    const term = event.target.value;
    this.placeTerm$.next(term);
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
        this.placeForm.get("validCoords")?.setValue(false);
      });
    this.editMode = true;
    this.placeForm.enable();
    this.placeForm.markAsUntouched();
    this.place = null;
    this.dataService.setCities = [];
  }

  getPlace(placeId: number) {
    if (this.placeForm.get("place_id")?.value === placeId) return;
    this.places = [];
    this.placeService.getPlaceById(placeId).subscribe((response) => {
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

  cargarCiudades(ejecutar = false, provinceId: number, cityId?: number) {
    const controlProvinceId = Number(this.placeForm.get("province_id")?.value);
    const controlCityId = Number(this.placeForm.get("city_id")?.value);

    if (controlProvinceId === provinceId && controlCityId === cityId) return;
    this.dataService.getCitiesByProvinceId(provinceId).subscribe((response) => {
      if (controlProvinceId !== provinceId || ejecutar) {
        this.dataService.setCities = response.data;
      }

      if (this.place) {
        this.placeForm.get("city_id")?.setValue(this.place.direction.city_id);
      }
    });
  }
}
