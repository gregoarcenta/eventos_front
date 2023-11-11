import { DataStore } from './../../../../core/services/store/data.store';
import { DataCatalog } from "./../../../../core/interfaces/catalogs";
import { PlaceService } from "../../../../core/services/place.service";
import { EventFormService } from "../../../../core/services/event-form.service";
import { DataService } from "../../../../core/services/data.service";
import { FormService } from "../../../../core/services/form.service";
import { Event } from "../../../../core/interfaces/event";
import { Place } from "../../../../core/interfaces/place";
import { Place as EventPlace } from "../../../../core/interfaces/event";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {
  BehaviorSubject,
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  map,
} from "rxjs";

@Component({
  selector: "place-data-form",
  templateUrl: "./place-data-form.component.html",
  styleUrls: ["./place-data-form.component.scss"],
})
export class PlaceDataFormComponent implements OnInit, OnDestroy {
  @Input() event: Event | null = null;

  private citiesSubject = new BehaviorSubject<DataCatalog[]>([]);

  private provinceSubscription?: Subscription;

  private placeTerm$ = new Subject<string>();
  public places: Place[] = [];
  public notFoundPlace: boolean = false;

  get place_id(): boolean {
    return !!this.placeDataForm.controls["place_id"].value;
  }

  get editMode(): boolean {
    return this.placeDataForm.controls["customPlace"].value;
  }

  get provinces$() {
    return this.dataStore.provinces$;
  }

  get cities$() {
    return this.citiesSubject.asObservable();
  }

  set setCities(cities: DataCatalog[]) {
    this.citiesSubject.next(cities);
  }

  get placeDataForm() {
    return this.eventFormService.placeDataForm;
  }

  constructor(
    public formService: FormService,
    private dataService: DataService,
    private dataStore: DataStore,
    private placeService: PlaceService,
    private eventFormService: EventFormService
  ) {}

  ngOnDestroy(): void {
    this.provinceSubscription?.unsubscribe();
    this.eventFormService.clearPlaceForm();
    this.eventFormService.placeDataOriginal = undefined;
    this.placeService.placeLocation = null;
    this.placeService.userLocation = null;
  }

  ngOnInit(): void {
    this.onFillPlaceData();

    // Detecta cuando se cambia el select de provincia
    this.provinceSubscription = this.placeDataForm.controls[
      "province_id"
    ].valueChanges
      .pipe(
        map((value) => Number(value)),
        distinctUntilChanged()
      )
      .subscribe((provinceId) => {
        this.loadCities(provinceId);
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

  getPlace(placeId: number) {
    if (this.placeDataForm.get("place_id")?.value === placeId) return;

    this.places = [];
    this.placeService.getPlaceById(placeId).subscribe((response) => {
      this.setPlace(response.data);
    });
  }

  setPlace(place: EventPlace) {
    setTimeout(() => {
      this.placeService.setPlaceLocation(
        place.direction.lng,
        place.direction.lat
      );
    }, 1000);
    this.eventFormService.setPlaceDataForm(place);
    this.placeDataForm.disable();
  }

  setCustomPlace() {
    if (this.editMode) return;
    this.eventFormService.clearPlaceForm();
    this.placeDataForm.controls["customPlace"].setValue(true);
    this.placeService
      .getUserLocation()
      .then(({ lng, lat }) => {
        // this.placeDataForm.get("validCoords")?.setValue(true);
        this.placeDataForm.patchValue({
          lat: String(lat),
          lng: String(lng),
        });
      })
      .catch((error) => {
        // this.placeDataForm.get("validCoords")?.setValue(false);
      });
    this.placeDataForm.enable();
    this.placeDataForm.markAsUntouched();
  }

  loadCities(provinceId: number) {
    this.dataService.getCitiesByProvinceId(provinceId).subscribe((response) => {
      this.setCities = response.data;
    });
  }

  onFillPlaceData() {
    if (!this.event) return;

    this.loadCities(this.event.place.direction.province_id);
    this.setPlace(this.event.place);
    this.eventFormService.setPlaceDataOriginal();
  }
}
