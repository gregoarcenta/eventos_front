import { PlaceDataFormComponent } from "./../place-data-form/place-data-form.component";
import {
  EventFormStore,
  ILocalitiesDataArr,
} from "../../../../core/services/store/event-form.store";
import { IEvent } from "../../../../core/interfaces/Event";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatTabGroup } from "@angular/material/tabs";
import Swal from "sweetalert2";
import { FormArray, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "edit-event",
  templateUrl: "./edit-event.component.html",
  styleUrls: ["./edit-event.component.scss"],
})
export class EditEventComponent implements OnInit, OnDestroy {
  @ViewChild("tabGroup") matTabGroup!: MatTabGroup;
  @ViewChild(PlaceDataFormComponent) placeFormChild!: PlaceDataFormComponent;
  @Input() isAdmin: boolean = false;
  @Input() event!: IEvent;

  @Output() onDataGeneralUpdate = new EventEmitter<IEvent>();
  @Output() onDataPlaceUpdate = new EventEmitter<IEvent>();
  @Output() onDataLocalitiesUpdate = new EventEmitter<IEvent>();

  private actualTab: number = 0;
  public loadMap: boolean = false;
  public changesMade: boolean = false;

  private subscriptionChangeTab?: Subscription;

  // General
  get generalDataForm() {
    return this.eventForm.generalDataForm;
  }
  get generalDataOriginal() {
    return this.eventForm.generalDataOriginal;
  }

  // Place
  get placeDataForm() {
    return this.eventForm.placeDataForm;
  }
  get placeDataOriginal() {
    return this.eventForm.placeDataOriginal;
  }

  // Localidades
  get localitiesDataForm() {
    return this.eventForm.localitiesDataForm;
  }
  get localitiesDataOriginal() {
    return this.eventForm.localitiesDataOriginal;
  }
  get localitiesDataArray() {
    return this.localitiesDataForm.controls["localities"];
  }

  constructor(private eventForm: EventFormStore) {}

  ngOnDestroy(): void {
    this.subscriptionChangeTab?.unsubscribe();
  }

  ngOnInit(): void {
    this.enableSubscribeChangeFormTab(this.actualTab);
  }

  async onTabChange(tab: number) {
    if (this.actualTab === tab) return;

    this.matTabGroup.selectedIndex = this.actualTab;

    // Cambia de tab si no ha realizado ningun cambio
    if (!this.changesMade) return this.changeTab(tab);

    // Si ha realizado cambios pregunta si quiere cambiar de tab
    const response = await Swal.fire({
      title: "¿Cambiar de pestaña?",
      text: "'Si cambias de pestaña, se perderán los cambios no guardados",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar de pestaña",
      cancelButtonText: "No, quedarse en esta pestaña",
    });

    // Si tiene cambios y aun asi cambia, resetear el #tab (los cambios realizados se anulan)
    if (response.isConfirmed) {
      this.resetChangesTab(this.actualTab);
      this.changeTab(tab);
    }
  }

  changeTab(tab: number) {
    if (tab === 1) this.loadMap = true;

    this.actualTab = tab;
    this.matTabGroup.selectedIndex = tab;

    this.changesMade = false;
    this.enableSubscribeChangeFormTab(tab);
  }

  resetChangesTab(tab: number) {
    switch (tab) {
      case 0: //Valida el formulario data general
        this.eventForm.setGeneralDataForm(this.generalDataOriginal);
        break;
      case 1: //Valida el formulario data place
        this.placeFormChild.setPlace(this.placeDataOriginal);

        break;
      case 2: //Valida el formulario data localities
        this.eventForm.setLocalitiesDataForm(
          this.localitiesDataOriginal
        );
        break;

      default:
        break;
    }
  }

  enableSubscribeChangeFormTab(tab: number) {
    this.subscriptionChangeTab?.unsubscribe();
    switch (tab) {
      case 0: //Valida el formulario data general
        this.subscriptionChangeTab =
          this.generalDataForm.valueChanges.subscribe(() => {
            this.changesMade = this.haveFormChanges(
              this.generalDataForm,
              this.generalDataOriginal
            );
          });

        break;
      case 1: //Valida el formulario data place
        this.subscriptionChangeTab = this.placeDataForm.valueChanges.subscribe(
          () => {
            this.changesMade = this.haveFormChanges(
              this.placeDataForm,
              this.placeDataOriginal
            );
          }
        );
        break;
      case 2: //Valida el formulario data localities
        this.subscriptionChangeTab =
          this.localitiesDataForm.valueChanges.subscribe(() => {
            this.changesMade = this.haveFormChangesArrLocalities(
              this.localitiesDataArray,
              this.localitiesDataOriginal
            );
          });
        break;

      default:
        break;
    }
  }

  haveFormChangesArrLocalities(
    localitiesArr: FormArray<FormGroup<ILocalitiesDataArr>>,
    localitiesArrOriginal: any[]
  ): boolean {
    let changes: boolean = false;
    // Si hay un FormGroup sin id es que se creo uno por lo tanto existen cambios
    const newLocality = localitiesArr.controls.some(
      (formGroup) => !formGroup.controls["id"].value
    );

    if (newLocality) return true;

    // obtengo todos los FormGroup que tiene id
    const localitiesGroupArr = localitiesArr.controls.filter(
      (formGroup) => formGroup.controls["id"]
    );

    for (const localityOriginal of localitiesArrOriginal) {
      const localityGroup = localitiesGroupArr.find(
        (formGroup) => formGroup.controls["id"].value === localityOriginal.id
      );

      // Si no existe un formGroup significa que se elimino por lo tanto existen cambios
      if (!localityGroup) return true;

      // Compara con el objeto original, si son distintos retorna true y se acaba el ciclo
      changes = this.haveFormChanges(localityGroup, localityOriginal);
      if (changes) break;
    }
    return changes;
  }

  haveFormChanges(form: FormGroup, dataOriginal: any): boolean {
    if (!dataOriginal) return false;

    let dataOriginalCopy = structuredClone(dataOriginal);

    if ("direction" in dataOriginal) {
      dataOriginalCopy = { ...dataOriginalCopy, ...dataOriginalCopy.direction };
    }

    for (const controlName in form.controls) {
      if (controlName in dataOriginalCopy) {
        // console.log("Evaluando: ", controlName);

        const controlValue = form.controls[controlName]?.value;
        const originalValue = dataOriginalCopy[controlName];

        if (controlValue != originalValue) {
          /* console.log(
            "control: ",
            controlValue + " / Original: " + dataOriginalCopy[controlName]
          ); */
          // console.log(`FIN - El valor de '${controlName}' ha cambiado`);
          return true;
        }
      }
    }
    // console.log(`FIN - Todos los valores son correctos`);
    return false;
  }

  onUpdateData() {
    switch (this.actualTab) {
      case 0: //data general
        if (this.generalDataForm.invalid) {
          this.generalDataForm.markAllAsTouched();
          return;
        }
        this.onDataGeneralUpdate.emit(this.generalDataForm.value as any);
        break;
      case 1: //  Lugar
        if (this.placeDataForm.invalid) {
          this.placeDataForm.markAllAsTouched();
          return;
        }
        this.onDataPlaceUpdate.emit({
          place_id: this.placeDataForm.value.place_id,
          place: this.placeDataForm.value,
          start_date: this.generalDataForm.value.start_date,
          start_time: this.generalDataForm.value.start_time,
          end_date: this.generalDataForm.value.end_date,
          end_time: this.generalDataForm.value.end_time,
        } as any);
        break;
      case 2: // Localidades
        if (this.localitiesDataArray.value.length === 0) {
          Swal.fire(
            "¡Lo sentimos!",
            "Tienes que tener al menos una localidad",
            "info"
          );
          return;
        }

        if (this.localitiesDataForm.invalid) {
          Swal.fire(
            "¡Lo sentimos!",
            "¡Los datos de las localidades están incompletos!\nRecuerda elegir el nombre de la localidad, precio y un límite de entradas",
            "info"
          );
          return;
        }
        this.onDataLocalitiesUpdate.emit({
          place_localities: this.localitiesDataArray.value,
        } as any);
        break;
      default:
        break;
    }
  }
}
