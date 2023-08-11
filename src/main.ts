import { environment } from "./environments/environment";
import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";

import * as mapboxgl from "mapbox-gl";
import Swal from "sweetalert2";

(mapboxgl.accessToken as any) = "pk.eyJ1IjoiZ3JlZ29hcmNlbnRhIiwiYSI6ImNsMjFhNXFyYzBnMm0zY28zbmdyMXcyZXkifQ.GXo6nIXO1Qbcbyu7SkaQ8g";

if (!navigator.geolocation) {
  throw new Error("El navegador no soporta la geolocalización");
}

const html = `
<p>
  Queremos informarte que actualmente estamos en proceso de prueba de nuestra aplicación y los eventos que se encuentran publicados son parte de este proceso.
</p>

<p>
  Por favor, ten en cuenta que los eventos publicados en este momento no se llevarán a cabo y son únicamente para fines de prueba. Te pedimos disculpas por cualquier confusión que esto pueda generar.
</p>

<p>
  Estamos trabajando arduamente para finalizar nuestro proceso de prueba y pronto podrás disfrutar de una amplia selección de eventos y conciertos reales.
</p>

<p>¡Gracias por ser parte de EventosEC!"</p>
`;

if (environment.production && environment.domain === "eventosec.com") {
  Swal.fire({
    title: "<strong>Información Importante</strong>",
    icon: "info",
    html,
    focusConfirm: false,
    confirmButtonText: "Entendido",
    allowOutsideClick: false,
    width: "50%",
    customClass: {
      container: "custom-swal-modal",
    },
  });
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));
