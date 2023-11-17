import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class FormStore {
  validInput(formGroup: FormGroup, name: string) {
    return formGroup.get(name)?.invalid && formGroup.get(name)?.touched;
  }

  getErrorName(formGroup: FormGroup) {
    const controlEmail = formGroup.controls["name"];
    if (controlEmail.getError("required")) {
      return "El nombre es requerido";
    }
    if (controlEmail.getError("minlength")) {
      return "El nombre debe tener 3 o mas caracteres";
    }
    if (controlEmail.getError("pattern")) {
      return "El formato del nombre no es valido";
    }
    return "";
  }

  getErrorSurname(formGroup: FormGroup) {
    const controlEmail = formGroup.controls["surname"];
    if (controlEmail.getError("required")) {
      return "El apellido es requerido";
    }
    if (controlEmail.getError("minlength")) {
      return "El apellido debe tener 3 o mas caracteres";
    }
    if (controlEmail.getError("pattern")) {
      return "El apellido solo puede contener letras";
    }
    return "";
  }

  getErrorEmail(formGroup: FormGroup) {
    const controlEmail = formGroup.controls["email"];
    if (controlEmail.getError("required")) {
      return "El email es requerido";
    }
    if (controlEmail.getError("pattern")) {
      return "Formato de email invalido";
    }
    if (controlEmail.getError("exists_email")) {
      return "El email ingresado ya existe";
    }
    return "";
  }

  getErrorUsername(formGroup: FormGroup) {
    const controlEmail = formGroup.controls["username"];
    if (controlEmail.getError("required")) {
      return "El nombre de usuario es requerido";
    }
    if (controlEmail.getError("pattern")) {
      return "Nombre de usuario invalido";
    }
    if (controlEmail.getError("exists_username")) {
      return "El nombre de usuario ingresado ya esta en uso";
    }
    return "";
  }

  getErrorAge(formGroup: FormGroup) {
    const controlAge = formGroup.controls["age"];
    if (controlAge.getError("required")) {
      return "La edad es requerida";
    }
    if (controlAge.getError("pattern")) {
      return "La edad ingresada no es valida";
    }
    if (controlAge.getError("not_valid_age")) {
      return "La edad ingresada no puede ser menor a 18";
    }
    return "";
  }

  getErrorPhone(formGroup: FormGroup) {
    const controlPhone = formGroup.controls["phone"];
    if (controlPhone.getError("required")) {
      return "El numero de teléfono es requerido";
    }
    if (controlPhone.getError("pattern")) {
      return "El numero de teléfono ingresado no es valido";
    }
    return "";
  }

  getErrorNumDocument(formGroup: FormGroup) {
    const controlNumDocument = formGroup.controls["num_document"];
    if (controlNumDocument.getError("required"))
      return "El documento es requerido";

    if (controlNumDocument.getError("error_cedula"))
      return "La cedula ingresada no es valida";

    if (controlNumDocument.getError("error_ruc"))
      return "El RUC ingresado no es valido";

    if (controlNumDocument.getError("exists_document"))
      return "El documento ya existe";

    return "";
  }

  getErrorBusinessName(formGroup: FormGroup) {
    const controlEmail = formGroup.controls["business_name"];
    if (controlEmail.getError("required")) {
      return "La razón social es requerida";
    }
    return "";
  }

  getErrorPass(formGroup: FormGroup) {
    const controlPass = formGroup.controls["password"];
    if (controlPass.getError("required")) {
      return "La contraseña es requerida";
    }
    if (controlPass.getError("pattern")) {
      return `
      <small class="form-text text-danger little-alert d-block"
      >Ingrese una contraseña válida. Esta debe contener al
      menos:</small
    >
    <small class="form-text text-muted little-alert d-block"
      >- Entre 8 y 16 caracteres</small
    >
    <small class="form-text text-muted little-alert d-block"
      >- Una letra mayúscula</small
    >
    <small class="form-text text-muted little-alert d-block"
      >- Una letra minúscula</small
    >
    <small class="form-text text-muted little-alert d-block"
      >- Un número</small
    >
    <small class="form-text text-muted little-alert d-block"
      >- Puede contener caracteres especiales (-&*@/.)</small
    >
      `;
    }
    return "";
  }

  getErrorPass2(formGroup: FormGroup) {
    const controlConfirm = formGroup.controls["password2"];
    if (controlConfirm.getError("required")) {
      return "La confirmación de la contraseña es requerida";
    }
    if (controlConfirm.getError("NoPassswordMatch")) {
      return "Las contraseñas deben ser iguales";
    }
    return "";
  }

  getErrorSelect(formGroup: FormGroup, validate: string) {
    const controlConfirm = formGroup.controls[validate];
    if (!controlConfirm.getError("error_zero")) return "";

    if(validate === "service" || validate === "service_id"){
      return "Tiene que seleccionar un servicio";
    }
    if(validate === "province" || validate === "province_id"){
      return "Tiene que seleccionar una provincia";
    }
    if(validate === "city" || validate === "city_id"){
      return "Tiene que seleccionar una ciudad";
    }
    return "";
  }

  // Para el registro del evento
  getErrorDescription(formGroup: FormGroup) {
    const controlEmail = formGroup.controls["description"];
    if (controlEmail.getError("required")) {
      return "La descripción es requerida";
    }
    if (controlEmail.getError("minlength")) {
      return "La descripción debe tener 3 o mas caracteres";
    }
    if (controlEmail.getError("pattern")) {
      return "El formato de la descripción no es valido";
    }
    return "";
  }
  // Para el registro del evento
  getErrorReference(formGroup: FormGroup) {
    const controlEmail = formGroup.controls["reference"];
    if (controlEmail.getError("required")) {
      return "La referencia es requerida";
    }
    if (controlEmail.getError("minlength")) {
      return "La referencia debe tener 3 o mas caracteres";
    }
    return "";
  }

  getErrorArtist(formGroup: FormGroup) {
    const controlEmail = formGroup.controls["artist"];
    if (controlEmail.getError("required")) {
      return "El nombre del artista es requerido";
    }
    if (controlEmail.getError("minlength")) {
      return "El nombre del artista debe tener 3 o mas caracteres";
    }
    if (controlEmail.getError("pattern")) {
      return "El nombre del artista solo puede contener letras";
    }
    return "";
  }

  getErrorOrganizer(formGroup: FormGroup) {
    const controlEmail = formGroup.controls["organizer"];
    if (controlEmail.getError("required")) {
      return "El nombre del organizador es requerido";
    }
    if (controlEmail.getError("pattern")) {
      return "El nombre del organizador solo puede contener letras";
    }
    return "";
  }

  getErrorFechaInicio(formGroup: FormGroup) {
    const controlEmail = formGroup.controls["start_date"];
    if (controlEmail.getError("required")) {
      return "La fecha de inicio es requerida";
    }
    return "";
  }

  getErrorHoraInicio(formGroup: FormGroup) {
    const controlEmail = formGroup.controls["start_time"];
    if (controlEmail.getError("required")) {
      return "La hora de inicio es requerida";
    }
    return "";
  }

  getErrorFechaFin(formGroup: FormGroup) {
    const controlEmail = formGroup.controls["end_date"];
    if (controlEmail.getError("required")) {
      return "La fecha de finalización es requerida";
    }
    return "";
  }

  getErrorHoraFin(formGroup: FormGroup) {
    const controlEmail = formGroup.controls["end_time"];
    if (controlEmail.getError("required")) {
      return "La hora de finalización es requerida";
    }
    return "";
  }

  getErrorSelectService(formGroup: FormGroup) {
    const controlConfirm = formGroup.controls["service_id"];
    if (!controlConfirm.getError("error_zero")) return "";
    return "Tiene que seleccionar un tipo de evento";
  }
}
