import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-terminos",
  templateUrl: "./terminos.component.html",
  styleUrls: ["./terminos.component.scss"],
})
export class TerminosComponent {
  public content = [
    {
      title: "Aceptación de los términos y condiciones:",
      description: [
        "Al utilizar nuestro sitio web y aplicación móvil de EventosEC, aceptas cumplir con los siguientes términos y condiciones.",
      ],
    },
    {
      title: "Uso del sitio web y la aplicación movil:",
      description: [
        "La aplicación EventosEC está diseñada para proporcionar información sobre eventos y conciertos, así como para permitir la compra de boletos y la gestión de asistencias.",
        "Eres responsable de utilizar la aplicación de manera adecuada y solo para los fines previstos.",
      ],
    },
    {
      title: "Compra de boletos:",
      description: [
        "Al comprar boletos a través de la aplicación, aceptas los términos y condiciones establecidos por el organizador del evento.",
        "Los pagos se procesarán de acuerdo con los métodos de pago disponibles y estarán sujetos a las políticas de reembolso del organizador.",
      ],
    },
    {
      title: "Responsabilidad del usuario",
      description: [
        "Eres responsable de mantener la confidencialidad de tu cuenta y cualquier información de inicio de sesión asociada con la aplicación EventosEC.",
        "Debes utilizar la aplicación de manera responsable y cumplir con todas las leyes y regulaciones aplicables.",
      ],
    },
    {
      title: "Responsabilidad de EventosEC:",
      description: [
        "EventosEC se esforzará por proporcionar información precisa y actualizada sobre eventos y conciertos a través de la aplicación.",
        "No nos hacemos responsables de cambios, cancelaciones o problemas relacionados con los eventos o conciertos que son responsabilidad de los organizadores.",
      ],
    },
    {
      title: "Privacidad:",
      description: [
        "EventosEC recopilará y utilizará información personal de acuerdo con su política de privacidad. Al utilizar la aplicación, aceptas la recopilación y el uso de tus datos personales de acuerdo con dicha política",
      ],
    },
    {
      title: "Modificaciones y cancelaciones:",
      description: [
        "EventosEC se reserva el derecho de realizar cambios en la aplicación, incluyendo la funcionalidad y los servicios ofrecidos.",
        "También nos reservamos el derecho de suspender o cancelar la aplicación en cualquier momento, sin previo aviso.",
      ],
    },
    {
      title: "Propiedad intelectual:",
      description: [
        "Todos los derechos de propiedad intelectual de la aplicación EventosEC, incluidos los logotipos, marcas registradas y contenido, pertenecen a la empresa.",
      ],
    },
    {
      title: "Limitación de responsabilidad:",
      description: [
        "EventosEC no se hace responsable de ningún daño, pérdida o lesión que pueda surgir del uso de la aplicación o la asistencia a eventos o conciertos anunciados a través de la misma.",
      ],
    },
    {
      title: "Ley aplicable y jurisdicción",
      description: [
        "Estos términos y condiciones se rigen por las leyes de la Republica del Ecuador.",
        "Cualquier disputa relacionada con estos términos y condiciones estará sujeta a la jurisdicción de los tribunales de Ecuador.",
      ],
    },
  ];
}
