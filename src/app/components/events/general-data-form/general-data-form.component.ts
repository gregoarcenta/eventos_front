import { Event } from "./../../../interfaces/event";
import { AuthService } from "./../../../services/auth.service";
import { UserService } from "./../../../services/user.service";
import { User } from "./../../../interfaces/user";
import { DataService } from "./../../../services/data.service";
import { FormService } from "./../../../services/form.service";
import { environment } from "./../../../../environments/environment";
import { UploadImageEventService } from "./../../../services/upload-image-event.service";
import { _patterName } from "./../../../utils/regularPatterns";
import { EventFormService } from "./../../../services/event-form.service";
import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { Validators } from "@angular/forms";
import {
  Observable,
  Subject,
  Subscription,
  catchError,
  concat,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: "general-data-form",
  templateUrl: "./general-data-form.component.html",
  styleUrls: ["./general-data-form.component.scss"],
})
export class GeneralDataFormComponent implements OnInit, OnDestroy {
  @HostListener("window:beforeunload", ["$event"])
  beforeUnloadHandler(event: Event) {
    this.deleteImageIfNotSave();
  }
  @Input() event: Event | null = null;

  private checkArtistSubscription?: Subscription;

  public imagesForDelete: string[] = [];

  public organizers$?: Observable<User[]>;
  public organizerTerm$ = new Subject<string>();
  public organizerLoading: boolean = false;

  get existsImg(): boolean {
    return this.generalDataForm.controls["img"].value ? true : false;
  }

  get img() {
    return this.generalDataForm.controls["img"].value;
  }

  get imageURL(): string {
    return `${environment.url}/upload/eventos/${this.img}`;
  }

  get services() {
    return this.dataService.getServices;
  }

  get placeHolderOrganizer() {
    if (!this.generalDataForm.value.organizer) {
      return "Ingrese nombre o usuario";
    }
    return "";
  }

  get generalDataForm() {
    return this.eventFormService.generalDataForm;
  }

  get generalDataOriginal() {
    return this.eventFormService.generalDataOriginal;
  }

  constructor(
    public formService: FormService,
    private dataService: DataService,
    private userService: UserService,
    private authService: AuthService,
    private eventFormService: EventFormService,
    private uploadImageEventService: UploadImageEventService
  ) {}

  ngOnDestroy(): void {
    this.checkArtistSubscription?.unsubscribe();
    this.eventFormService.clearEventForm();
    this.eventFormService.generalDataOriginal = undefined;
    this.deleteImageIfNotSave();
  }

  ngOnInit(): void {
    this.onFillEventData();

    // Obtiene lista de servicios
    if (this.dataService.getServices.length === 0) {
      this.dataService.getAllServices().subscribe((_) => {});
    }

    // Detecta cuando se cambia el check artist
    this.checkArtistSubscription = this.generalDataForm
      .get("existsArtist")!
      .valueChanges.subscribe((value) => {
        const artistControl = this.generalDataForm.controls["artist"];
        artistControl!.setValue(null);
        if (value) {
          artistControl!.setValidators([
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(_patterName),
          ]);
        } else {
          artistControl!.clearValidators();
        }
        artistControl!.updateValueAndValidity();
      });

    //Para la busqueda de usuarios, seleccion del organizador
    this.loadUsers();
  }

  deleteImageIfNotSave() {
    if (!this.authService.getAuthUser) return;
    this.imagesForDelete.forEach((image) => {
      this.uploadImageEventService
        .deleteImgIfNotExists(image)
        .subscribe((_) => {});
    });
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
        }
        if (this.event) {
          this.uploadImageEventService
            .updateImgEvent(archivo, this.event.id)
            .subscribe((response) => this.newImageSelected(response));
        } else {
          this.uploadImageEventService
            .uploadImgEvent(archivo)
            .subscribe((response) => this.newImageSelected(response));
        }
      };
      img.src = window.URL.createObjectURL(archivo);
    }
  }

  newImageSelected(response: any) {
    if (!this.event) this.imagesForDelete.push(response.data);
    this.generalDataForm.controls["img"].setValue(response.data);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: response.message,
      showConfirmButton: false,
      timer: 4000,
    });
  }

  getImageProfile(img: string) {
    return img || "assets/images/default-image-profile.png";
  }

  loadUsers() {
    this.organizers$ = concat(
      of([]), // default items
      this.organizerTerm$.pipe(
        distinctUntilChanged(),
        tap(() => (this.organizerLoading = true)),
        switchMap((term) =>
          this.userService.getUsersByUsernameOrName(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.organizerLoading = false))
          )
        )
      )
    );
  }

  onFillEventData() {
    if (!this.event) return;

    this.eventFormService.setGeneralDataForm(this.event);
    this.eventFormService.setGeneralDataOriginal();
  }
}
