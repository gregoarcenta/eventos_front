import { Component } from "@angular/core";

@Component({
  selector: "app-politicas",
  templateUrl: "./politicas.component.html",
  styleUrls: ["./politicas.component.scss"],
})
export class PoliticasComponent {
  public content = [
    {
      title: "Recopilación de información personal:",
      description: [
        "EventosEC recopilará información personal de los usuarios, como nombre, dirección de correo electrónico, número de teléfono, dirección y otros datos relevantes necesarios para el funcionamiento y la personalización del aplicativo.",
        "La información personal se recopila de forma voluntaria y se proporciona directamente por los usuarios al registrarse o utilizar del aplicativo.",
      ],
    },
    {
      title: "Uso de la información personal:",
      description: [
        "Procesar la compra de entradas y enviar confirmaciones.",
        "Enviar actualizaciones y comunicaciones relacionadas con eventos y conciertos.",
        "Personalizar la experiencia del usuario dentro del aplicativo.",
        "Mejorar y optimizar nuestros servicios y la experiencia del usuario.",
        "Cumplir con las obligaciones legales y reglamentarias.",
      ],
    },
    {
      title: "Compartir información personal:",
      description: [
        "EventosEC no venderá, alquilará ni compartirá información personal de los usuarios con terceros sin su consentimiento, a menos que sea necesario para el funcionamiento del aplicativo o se requiera por ley.",
        "EventosEC puede compartir información personal con proveedores de servicios de confianza que ayuden en el procesamiento de pagos, envío de boletos u otros servicios relacionados.",
      ],
    },
    {
      title: "Seguridad de la información:",
      description: [
        "EventosEC toma medidas razonables para proteger la información personal de los usuarios contra el acceso no autorizado, el uso indebido o la divulgación.",
        "Se utilizan medidas de seguridad físicas, técnicas y administrativas para proteger la información personal recopilada.",
      ],
    },
    {
      title: "Cookies y tecnologías similares:",
      description: [
        "EventosEC puede utilizar cookies u otras tecnologías similares para mejorar la experiencia del usuario y recopilar información no personal.",
        "Los usuarios pueden ajustar la configuración de su navegador para rechazar las cookies, aunque esto puede afectar la funcionalidad de la aplicación.",
      ],
    },
    {
      title: "Derechos del usuario:",
      description: [
        "Los usuarios tienen derecho a acceder, corregir y eliminar su información personal.",
        "Pueden ejercer estos derechos enviando una solicitud por correo electrónico a la dirección de contacto proporcionada.",
      ],
    },
    {
      title: "Menores de edad:",
      description: [
        "El aplicativo de EventosEC no está dirigida a menores de edad sin el consentimiento de sus padres o tutores legales.",
        "Si se descubre que se ha recopilado información personal de un menor sin el consentimiento adecuado, se eliminará de forma inmediata.",
      ],
    },
    {
      title: "Información de ubicación:",
      description: [
        "EventosEC puede recopilar y utilizar información de ubicación del usuario para ofrecer servicios basados en la ubicación, como proporcionar información sobre eventos cercanos.",
        "Los usuarios pueden controlar la configuración de privacidad de su dispositivo electrónico para permitir o denegar el acceso a la información de ubicación.",
      ],
    },
    {
      title: "Contacto y preguntas:",
      description: [
        "Los usuarios pueden ponerse en contacto con EventosEC para cualquier pregunta, inquietud o solicitud relacionada con la privacidad y las políticas de la aplicación mediante la información de contacto proporcionada en la aplicación.",
      ],
    },
    {
      title: "Cambios en la política de privacidad:",
      description: [
        "EventosEC se reserva el derecho de modificar o actualizar esta política de privacidad en cualquier momento.",
        "Se notificará a los usuarios sobre los cambios importantes a través de la aplicación o por otros medios apropiados.",
      ],
    },
  ];
}
