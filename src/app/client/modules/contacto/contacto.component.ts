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

  get services() {
    return this.dataService.getServices;
  }

  get provinces() {
    return this.dataService.getProvinces;
  }

  get cities() {
    return this.dataService.getCities;
  }

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
    //Para hacer aparecer el captcha
    const captcha = document.querySelector(
      ".grecaptcha-badge"
    ) as HTMLInputElement;
    captcha.style.opacity = "1";

    //Para hacer que el height este en 100% de su alto
    let headerHeight = document.querySelector(".main-header .navbar")
      ?.clientHeight;
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
    //Obtiene lista de servicios
    if (this.dataService.getServices.length === 0) {
      this.dataService.getAllServices().subscribe((_) => {});
    }

    //Obtiene lista de provincias
    if (this.dataService.getProvinces.length === 0) {
      this.dataService.getAllprovinces().subscribe((_) => {});
    }

    //detecta cuando se cambia el select de provincia
    this.provinceSubscription = this.contactForm
      .get("province")!
      .valueChanges.subscribe((value) => {
        //Obtiene lista de ciudades por id de provincia
        this.dataService
          .getCitiesByProvinceId(Number(value))
          .subscribe(
            (response) => (this.dataService.setCities = response.data)
          );
      });
  }

  submitForm() {
    if (this.contactForm.invalid) return this.contactForm.markAllAsTouched();
    //this.spinner.setActive(true);
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
        //this.spinner.setActive(false);
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
