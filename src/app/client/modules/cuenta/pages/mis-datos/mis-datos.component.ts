import { CatalogStore } from "../../../../../core/services/store/catalog.store";
import { EmailValidatorService } from "./../../../../../shared/validations/services/email-validator.service";
import { DocumentValidatorService } from "./../../../../../shared/validations/services/document-validator.service";
import { UsernameValidatorService } from "./../../../../../shared/validations/services/username-validator.service";
import { CustomValidators } from "./../../../../../shared/validations/validations-forms";

import { UserService } from "../../../../../core/services/api/user.service";
import { FormStore } from "../../../../../core/services/store/form.store";

import {
  _patterName,
  _patternMail,
  _patterUsername,
  _patternPassword,
  _patternCell,
  _patternAge,
} from "../../../../../shared/utils/regularPatterns";
import { AuthService } from "../../../../../core/services/api/auth.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Subscription, take } from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: "app-mis-datos",
  templateUrl: "./mis-datos.component.html",
  styleUrls: ["./mis-datos.component.scss"],
})
export class MisDatosComponent implements OnInit, OnDestroy {
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

  get documents$() {
    return this.catalog.documents$;
  }

  get getImgUser() {
    return this.authUser?.img || "assets/images/default-image-profile.png";
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
    private userService: UserService,
    private catalog: CatalogStore,
    public formStore: FormStore,
    private fb: FormBuilder
  ) {}

  ngOnDestroy(): void {
    this.typeDocumentSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.userForm.patchValue(this.authUser as any);
    this.userForm.disable();
    this.changeTypeDocument();
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
          documentControl.setValue("" as any);
        }
        if (value == 1) {
          businessNameControl.clearValidators();

          documentControl.addValidators([CustomValidators.validCedula]);
          documentControl.removeValidators([CustomValidators.validRuc]);

          businessNameControl.updateValueAndValidity();
          documentControl.updateValueAndValidity();
        }
        if (value == 2) {
          businessNameControl.addValidators([Validators.required]);

          documentControl.addValidators([CustomValidators.validRuc]);
          documentControl.removeValidators([CustomValidators.validCedula]);

          businessNameControl.updateValueAndValidity();
          documentControl.updateValueAndValidity();
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
      this.documents$.pipe(take(1)).subscribe((documents) => {
        this.userForm.controls["document_id"].setValue(documents[0].id);
      });
    } else {
      this.userForm.controls["document_id"].disable();
      this.userForm.controls["num_document"].disable();
      this.userForm.controls["business_name"].disable();
    }
  }

  updateData() {
    if (this.userForm.invalid) return this.userForm.markAllAsTouched();

    const document_id = this.userForm.get("document_id")!.value;
    const num_document = this.userForm.get("num_document")!.value;
    const business_name = this.userForm.get("business_name")!.value;
    this.userService
      .updateUser({
        ...this.userForm.value,
        img: this.authUser?.img,
        document_id,
        num_document,
        business_name,
      })
      .subscribe((response) => {
        Swal.fire("¡Listo!", response.message, "success");
        this.authService.setAuthUser = response.data;
        this.userForm.patchValue(this.authUser as any);
        this.userForm.disable();
        this.userForm.updateValueAndValidity();
      });
  }
}
