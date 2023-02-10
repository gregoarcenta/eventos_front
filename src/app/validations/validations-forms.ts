import {
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
// import { AtiDocumentValidator } from "@devoxs/ati-doc-validator";
// import * as moment from "moment";

export class CustomValidators {
 /*  static validCedula(control: AbstractControl): ValidationErrors | null {
    const cedula = control.value + "";
    const instaceValidator = new AtiDocumentValidator();
    const result = instaceValidator.cedulaValidator(cedula);
    if (result.result) return null;
    else return { error_cedula: true };
  }

  static validRuc(control: AbstractControl): ValidationErrors | null {
    const ruc = control.value + "";
    const instaceValidator = new AtiDocumentValidator();
    const result = instaceValidator.rucValidator(ruc);
    if (result.result) return null;
    else return { error_ruc: true };
  } */

  static validNotZero(control: AbstractControl): ValidationErrors | null {
    let valueSelect = control.value;
    if (valueSelect == 0) return { error_zero: true };
    else return null;
  }

/*   static validBirthDate(control: AbstractControl): ValidationErrors | null {
    //variables que validan los limites de fechas
    const dateMin: Date = new Date("1970-01-01");
    const dateMax: Date = new Date("2018-12-31");
    const date = control.value;

    const dateFormateada = new Date(date);
    moment(dateFormateada).format("YYYY-MM-DD");
    if (dateFormateada >= dateMax) {
      return { error_fecha: true };
    }
    if (dateFormateada < dateMin) {
      return { error_fecha: true };
    }
    if (dateFormateada >= dateMin && dateFormateada <= dateMax) {
      return null;
    }
  } */

  static passwordMatchValidator = (control: AbstractControl) => {
    const password: string = control.get("password")!.value;
    const confirmPassword: string = control.get("password2")!.value;
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get("password2")!.setErrors({ NoPassswordMatch: true });
    }
  };
}
