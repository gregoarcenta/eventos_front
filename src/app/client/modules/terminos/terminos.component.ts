import { Component } from "@angular/core";

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
        "Al utilizar el aplicativo web y móvil de EventosEC, aceptas cumplir con los siguientes términos y condiciones.",
      ],
    },
    {
      title: "Uso del aplicativol:",
      description: [
        "El aplicativo de EventosEC está diseñada para proporcionar información sobre eventos y conciertos, así como para permitir la compra de boletos y la gestión de asistencias.",
        "Eres responsable de utilizar el aplicativo de manera adecuada y solo para los fines previstos",
      ],
    },
    {
      title: "Compra de boletos:",
      description: [
        "Al comprar boletos a través del aplicativo, aceptas los términos y condiciones establecidos por el organizador del evento.",
        "Los pagos se procesarán de acuerdo con los métodos de pago disponibles y estarán sujetos a las políticas de reembolso del organizador.",
      ],
    },
    {
      title: "Responsabilidad del usuario",
      description: [
        "Eres responsable de mantener la confidencialidad de tu cuenta y cualquier información de inicio de sesión asociada con el aplicativo de EventosEC.",
        "Debes utilizar el aplicativo de manera responsable y cumplir con todas las leyes y regulaciones aplicables.",
      ],
    },
    {
      title: "Responsabilidad de EventosEC:",
      description: [
        "EventosEC se esforzará por proporcionar información precisa y actualizada sobre eventos y conciertos a través del aplicativo.",
        "No nos hacemos responsables de cambios, cancelaciones o problemas relacionados con los eventos o conciertos que son responsabilidad de los organizadores.",
      ],
    },
    {
      title: "Privacidad:",
      description: [
        "EventosEC recopilará y utilizará información personal de acuerdo con su política de privacidad. Al utilizar el aplicativo, aceptas la recopilación y el uso de tus datos personales de acuerdo con dicha política.",
      ],
    },
    {
      title: "Modificaciones y cancelaciones:",
      description: [
        "EventosEC se reserva el derecho de realizar cambios en el aplicativo, incluyendo la funcionalidad y los servicios ofrecidos.",
        "También nos reservamos el derecho de suspender o cancelar el aplicativo en cualquier momento, sin previo aviso.",
      ],
    },
    {
      title: "Propiedad intelectual:",
      description: [
        "Todos los derechos de propiedad intelectual del aplicativo EventosEC, incluidos los logotipos, marcas registradas y contenido, pertenecen a la empresa.",
      ],
    },
    {
      title: "Limitación de responsabilidad:",
      description: [
        "EventosEC no se hace responsable de ningún daño, pérdida o lesión que pueda surgir del uso del aplicativo o la asistencia a eventos o conciertos anunciados a través de la misma.",
      ],
    },
    {
      title: "Ley aplicable",
      description: [
        "Estos términos y condiciones se rigen por las leyes de la Republica del Ecuador.",
      ],
    },
  ];
}
