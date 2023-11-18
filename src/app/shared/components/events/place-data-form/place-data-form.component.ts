import { IPlace } from './../../../../core/interfaces/Place';
import { ICatalog } from './../../../../core/interfaces/Catalog';
import { IEvent } from '../../../../core/interfaces/Event';
import { PlaceService } from "./../../../../core/services/api/place.service";
import { CatalogStore } from "../../../../core/services/store/catalog.store";
import { PlaceStore } from "../../../../core/services/store/place.store";
import { EventFormStore } from "../../../../core/services/store/event-form.store";
import { CatalogService } from "../../../../core/services/api/catalog.service";
import { FormStore } from "../../../../core/services/store/form.store";
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
  @Input() event: IEvent | null = null;

  private citiesSubject = new BehaviorSubject<ICatalog[]>([]);

  private provinceSubscription?: Subscription;

  private placeTerm$ = new Subject<string>();
  public places: IPlace[] = [];
  public notFoundPlace: boolean = false;

  get place_id(): boolean {
    return !!this.placeDataForm.controls["place_id"].value;
  }

  get editMode(): boolean {
    return this.placeDataForm.controls["customPlace"].value;
  }

  get provinces$() {
    return this.catalog.provinces$;
  }

  get cities$() {
    return this.citiesSubject.asObservable();
  }

  set setCities(cities: ICatalog[]) {
    this.citiesSubject.next(cities);
  }

  get placeDataForm() {
    return this.eventForm.placeDataForm;
  }

  constructor(
    public formStore: FormStore,
    private eventForm: EventFormStore,
    private catalogService: CatalogService,
    private placeService: PlaceService,
    private catalog: CatalogStore,
    private place: PlaceStore
  ) {}

  ngOnDestroy(): void {
    this.provinceSubscription?.unsubscribe();
    this.eventForm.clearPlaceForm();
    this.eventForm.placeDataOriginal = undefined;
    this.place.placeLocation = null;
    this.place.userLocation = null;
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

  setPlace(place: IPlace) {
    setTimeout(() => {
      this.place.setPlaceLocation(place.direction!.lng, place.direction!.lat);
    }, 1000);
    this.eventForm.setPlaceDataForm(place);
    this.placeDataForm.disable();
  }

  setCustomPlace() {
    if (this.editMode) return;
    this.eventForm.clearPlaceForm();
    this.placeDataForm.controls["customPlace"].setValue(true);
    this.place
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
    this.catalogService
      .getCitiesByProvinceId(provinceId)
      .subscribe((response) => {
        this.setCities = response.data;
      });
  }

  onFillPlaceData() {
    if (!this.event) return;

    this.loadCities(this.event.place.direction!.province_id);
    this.setPlace(this.event.place);
    this.eventForm.setPlaceDataOriginal();
  }
}
