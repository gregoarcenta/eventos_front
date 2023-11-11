import { DataStore } from './../../../core/services/store/data.store';
import { DataCatalog } from './../../../core/interfaces/catalogs';
import { CustomValidators } from "./../../../shared/validations/validations-forms";
import { environment } from "./../../../../environments/environment";
import { ContactService } from "../../../core/services/contact.service";
import { DataService } from "../../../core/services/data.service";
import { FormService } from "../../../core/services/form.service";
import {
  _patterName,
  _patternCell,
  _patternMail,
} from "../../../shared/utils/regularPatterns";
import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { BehaviorSubject, Subscription } from "rxjs";
import Swal from "sweetalert2";

declare const grecaptcha: any;

@Component({
  selector: "app-contacto",
  templateUrl: "./contacto.component.html",
  styleUrls: ["./contacto.component.scss"],
})
export class ContactoComponent implements OnInit, OnDestroy, AfterViewInit {
  private citiesSubject = new BehaviorSubject<DataCatalog[]>([]);

  public contactForm = this.fb.group({
    name: [
      "",
      [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(_patterName),
      ],
    ],
    surname: [
      "",
      [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(_patterName),
      ],
    ],
    email: ["", [Validators.required, Validators.pattern(_patternMail)]],
    phone: ["", [Validators.required, Validators.pattern(_patternCell)]],
    service: [0, [Validators.required, CustomValidators.validNotZero]],
    province: [0, [Validators.required, CustomValidators.validNotZero]],
    city: [0, [Validators.required, CustomValidators.validNotZero]],
  });

  get services$() {
    return this.dataStore.services$;
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

  private provinceSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    public formService: FormService,
    private dataService: DataService,
    private dataStore: DataStore,
    private contactService: ContactService
  ) {}

  ngOnDestroy(): void {
    this.provinceSubscription?.unsubscribe();
    const captcha = document.querySelector(
      ".grecaptcha-badge"
    ) as HTMLInputElement;
    captcha.style.opacity = "0";
  }

  ngAfterViewInit(): void {
    //Para hacer aparecer el captcha
    const captcha = document.querySelector(
      ".grecaptcha-badge"
    ) as HTMLInputElement;
    captcha.style.opacity = "1";

    //Para hacer que el height este en 100% de su alto
    let headerHeight = document.querySelector(
      ".main-header .navbar"
    )?.clientHeight;
    const buttonHeaderHeight = document.querySelector(
      ".main-header .navbar-toggler"
    )?.clientHeight;
    const footerHeight = document.querySelector(".main-footer")?.clientHeight;
    const mainContact = document.querySelector(".main-contact") as HTMLElement;

    if (buttonHeaderHeight && buttonHeaderHeight > 0) {
      headerHeight = buttonHeaderHeight;
    }

    if (headerHeight && footerHeight) {
      mainContact.style.minHeight = `calc(100vh - ${
        headerHeight + footerHeight
      }px)`;
    }
  }

  ngOnInit(): void {
    //detecta cuando se cambia el select de provincia
    this.provinceSubscription = this.contactForm
      .get("province")!
      .valueChanges.subscribe((value) => {
        //Obtiene lista de ciudades por id de provincia
        this.dataService
          .getCitiesByProvinceId(Number(value))
          .subscribe(
            (response) => (this.setCities = response.data)
          );
      });
  }

  submitForm() {
    if (this.contactForm.invalid) return this.contactForm.markAllAsTouched();
    grecaptcha.ready(() => {
      grecaptcha
        .execute(environment.captchaClientKey, {
          action: "submit",
        })
        .then((token: any) => {
          this.submitContactForm(token);
        });
    });
  }

  submitContactForm(token: string) {
    this.contactService
      .submitContact({
        ...this.contactForm.value,
        city_id: this.contactForm.value.city,
        service_id: this.contactForm.value.service,
        captcha_token: token,
      })
      .subscribe((response) => {
        Swal.fire("Formulario enviado!", response.message, "success");
        this.contactForm.patchValue({
          name: "",
          surname: "",
          email: "",
          phone: "",
          service: 0,
          province: 0,
          city: 0,
        });
        this.contactForm.markAsUntouched();
      });
  }

  validaNumeros(tecla: any): boolean {
    const charCode = tecla.which ? tecla.which : tecla.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
