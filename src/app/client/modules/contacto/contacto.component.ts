import { environment } from "./../../../../environments/environment";
import { SpinnerService } from "./../../../services/spinner.service";
import { ContactService } from "./../../../services/contact.service";
import { CustomValidators } from "./../../../validations/validations-forms";
import { DataCatalog } from "../../../interfaces/catalogs";
import { DataService } from "./../../../services/data.service";
import { FormService } from "./../../../services/form.service";
import {
  _patterName,
  _patternCell,
  _patternMail,
} from "./../../../utils/regularPatterns";
import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";

declare const grecaptcha: any;

@Component({
  selector: "app-contacto",
  templateUrl: "./contacto.component.html",
  styleUrls: ["./contacto.component.scss"],
})
export class ContactoComponent implements OnInit, OnDestroy, AfterViewInit {
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

  public services: DataCatalog[] = [];
  public provinces: DataCatalog[] = [];
  public cities: any[] = [];

  private provinceSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private spinner: SpinnerService,
    public formService: FormService,
    private dataService: DataService,
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
    const captcha = document.querySelector(
      ".grecaptcha-badge"
    ) as HTMLInputElement;
    captcha.style.opacity = "1";
  }

  ngOnInit(): void {
    //Obtiene lista de servicios
    this.dataService.getAllServices().subscribe({
      next: (response) => (this.services = response.data),
      error: (_) => {},
    });

    //Obtiene lista de provincias
    this.dataService.getAllprovinces().subscribe({
      next: (response) => (this.provinces = response.data),
      error: (_) => {},
    });

    //detecta cuando se cambia el select de provincia
    this.provinceSubscription = this.contactForm.controls[
      "province"
    ].valueChanges.subscribe((value) => {
      this.cities = [];
      //Obtiene lista de ciudades por id de provincia
      this.dataService.getCitiesByProvinceId(Number(value)).subscribe({
        next: (response) => (this.cities = response.data),
        error: (_) => {},
      });
    });
  }

  submitForm() {
    if (this.contactForm.invalid) return this.contactForm.markAllAsTouched();
    this.spinner.setActive(true);
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
      .subscribe({
        next: (response) => {
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
          this.spinner.setActive(false);
        },
        error: (_) => {},
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
