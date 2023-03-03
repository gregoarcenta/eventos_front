import { DocumentValidatorService } from "./../../../../../validations/Services/document-validator.service";
import { DataCatalog } from "../../../../../interfaces/catalogs";
import { DataService } from "./../../../../../services/data.service";
import { UserService } from "./../../../../../services/user.service";
import { CustomValidators } from "./../../../../../validations/validations-forms";
import { SpinnerService } from "./../../../../../services/spinner.service";
import { FormService } from "./../../../../../services/form.service";
import { EmailValidatorService } from "./../../../../../validations/Services/email-validator.service";
import { UsernameValidatorService } from "./../../../../../validations/Services/username-validator.service";
import {
  _patterName,
  _patternMail,
  _patterUsername,
  _patternPassword,
  _patternCell,
  _patternAge,
} from "./../../../../../utils/regularPatterns";
import { AuthService } from "./../../../../../services/auth.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { Subscription } from "rxjs";

@Component({
  selector: "app-mis-datos",
  templateUrl: "./mis-datos.component.html",
  styleUrls: ["./mis-datos.component.scss"],
})
export class MisDatosComponent implements OnInit, OnDestroy {
  public documents: DataCatalog[] = [];
  public typeDocumentSubscription?: Subscription;
  public userForm = this.fb.group({
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
    email: [
      "",
      [Validators.required, Validators.pattern(_patternMail)],
      [this.evs],
    ],
    username: [
      "",
      [Validators.required, Validators.pattern(_patterUsername)],
      [this.uvs],
    ],
    img: [""],
    age: [
      "",
      [
        Validators.required,
        Validators.pattern(_patternAge),
        CustomValidators.validAge,
      ],
    ],
    phone: ["", [Validators.required, Validators.pattern(_patternCell)]],
    document_id: [1, [Validators.required]],
    num_document: ["", [Validators.required], [this.dvs]],
    business_name: [null],
  });

  get authUser() {
    return this.authService.getAuthUser;
  }

  get nameTypeDocument() {
    const type: number = Number(this.userForm.controls["document_id"].value);
    switch (type) {
      case 1:
        return "cédula";
      case 2:
        return "RUC";
      case 3:
        return "pasaporte";
      default:
        return "documento";
    }
  }

  constructor(
    private uvs: UsernameValidatorService,
    private dvs: DocumentValidatorService,
    private evs: EmailValidatorService,
    private authService: AuthService,
    private dataService: DataService,
    private userService: UserService,
    public formService: FormService,
    private spinner: SpinnerService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.typeDocumentSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.dataService.getAllDocuments().subscribe({
      next: (response) => {
        this.documents = response.data;
        this.userForm.patchValue(this.authUser as any);
        this.userForm.disable();
        this.changeTypeDocument();
      },
      error: (_) => this.router.navigateByUrl("/"),
    });
  }

  validaNumeros(tecla: any): boolean {
    const charCode = tecla.which ? tecla.which : tecla.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  changeTypeDocument() {
    const typeDocument = this.userForm.controls["document_id"];
    let documentControl = this.userForm.controls["num_document"];
    let businessNameControl = this.userForm.controls["business_name"];

    this.typeDocumentSubscription = typeDocument.valueChanges.subscribe(
      (value) => {
        if (!this.authUser?.document_id) {
          documentControl.enable();
          documentControl.setValue("" as any);
        }
        if (value == 1) {
          documentControl.addValidators([CustomValidators.validCedula]);
          documentControl.removeValidators([CustomValidators.validRuc]);
          businessNameControl.clearValidators();
          businessNameControl.updateValueAndValidity();
        }
        if (value == 2) {
          documentControl.addValidators([CustomValidators.validRuc]);
          documentControl.removeValidators([CustomValidators.validCedula]);
          businessNameControl.addValidators([Validators.required]);
          businessNameControl.updateValueAndValidity();
        }
        if (value == 3) {
          businessNameControl.clearValidators();
          documentControl.clearValidators();
          documentControl.addValidators([Validators.required]);
          businessNameControl.updateValueAndValidity();
          documentControl.updateValueAndValidity();
        }
      }
    );
  }

  enabledForm() {
    this.userForm.enable();
    if (!this.userForm.value.document_id) {
      this.userForm.controls["document_id"].setValue(this.documents[0].id);
    } else {
      this.userForm.controls["document_id"].disable();
      this.userForm.controls["num_document"].disable();
    }
  }

  updateData() {
    if (this.userForm.invalid) return this.userForm.markAllAsTouched();

    this.spinner.setActive(true);
    const document_id = this.userForm.get("document_id")!.value;
    const num_document = this.userForm.get("num_document")!.value;
    this.userService
      .updateUser({ ...this.userForm.value, document_id, num_document })
      .subscribe({
        next: (response) => {
          Swal.fire("¡Listo!", response.message, "success");
          this.authService.setAuthUser = response.data;
          this.userForm.patchValue(this.authUser as any);
          this.userForm.disable();
          this.spinner.setActive(false);
        },
        error: (_) => {},
      });
  }
}
