import { environment } from "./../../../../../../environments/environment";
import { Document } from "./../../../../../interfaces/document";
import { DataService } from "./../../../../../services/data.service";
import { User } from "./../../../../../interfaces/user";
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
  public documents: Document[] = [];
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
    num_document: ["", [Validators.required]],
  });

  get authUser() {
    return this.authService.getAuthUser;
  }

  constructor(
    private uvs: UsernameValidatorService,
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
    this.dataService.documents().subscribe({
      next: (response) => {
        this.documents = response.data;
        this.userForm.patchValue(this.authUser as any);
        this.userForm.disable();
        this.changeTypeDocument();
      },
      error: ({ error }) => {
        console.error(error);
        Swal.fire("¡Lo sentimos!", environment.msgErrorDefault, "error");
        this.router.navigateByUrl("/");
      },
    });
  }

  validaNumeros(tecla:any): boolean {
    const charCode = tecla.which ? tecla.which : tecla.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  changeTypeDocument() {
    const typeDocument = this.userForm.controls["document_id"];
    let documentControl = this.userForm.controls["num_document"];

    this.typeDocumentSubscription = typeDocument.valueChanges.subscribe(
      (value) => {
        if (!this.authUser?.document_id) {
          documentControl.enable();
          documentControl.setValue("");
        }
        if (value == 1) {
          documentControl.addValidators([CustomValidators.validCedula]);
          documentControl.removeValidators([CustomValidators.validRuc]);
        }
        if (value == 2) {
          documentControl.addValidators([CustomValidators.validRuc]);
          documentControl.removeValidators([CustomValidators.validCedula]);
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
    const document_id = this.userForm.get("document_id")!.value
    const num_document = this.userForm.get("num_document")!.value
    this.userService
      .updateUser({ ...this.userForm.value, document_id, num_document })
      .subscribe({
        next: (response) => {
          Swal.fire("¡Listo!", response.message, "success")
          this.authService.setAuthUser = response.data
          this.userForm.patchValue(this.authUser as any);
          this.userForm.disable();
          this.spinner.setActive(false);
        },
        error: ({ error }) => {
          this.spinner.setActive(false);
          if (error.status === 400) {
            Swal.fire("¡Lo sentimos!", error.message, "error");
          } else {
            Swal.fire("¡Lo sentimos!", environment.msgErrorDefault, "error");
          }
        },
      });
  }
}
