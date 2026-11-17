/**
 * DATOS DE LA RADIO
 *
 * Para cambiar un texto o un enlace de la web, edita este archivo y sube el
 * cambio a GitHub. Vercel publicará la versión nueva en uno o dos minutos.
 */

export type RedSocial = {
  nombre: string;
  url: string;
};

export const radio = {
  nombre: "Radio Viene",
  frecuencia: "101.3",
  banda: "FM",
  lema: "Música, Biblia y esperanza para cada día.",
  descripcion:
    "Somos una radio adventista del séptimo día. Te acompañamos con música cristiana, estudio de la Biblia y mensajes de esperanza para toda la familia.",
  ubicacion: "Venezuela",

  /** Zona horaria en la que se muestra la programación. */
  zonaHoraria: "America/Caracas",
  nombreZonaHoraria: "hora de Venezuela",

  /**
   * Número de WhatsApp con código de país, solo dígitos.
   * Ejemplo: "584121234567". Mientras esté vacío, los botones de WhatsApp
   * se muestran como "muy pronto".
   */
  whatsapp: "",

  /** Correo de contacto. Déjalo vacío para no mostrarlo. */
  correo: "",

  /** Redes sociales. Ejemplo: { nombre: "Instagram", url: "https://instagram.com/radioviene" } */
  redes: [] as RedSocial[],
} as const;

/** Mensajes que se escriben solos al abrir WhatsApp desde la web. */
export const mensajesWhatsApp = {
  ubicacion: "¡Hola, Radio Viene! Les escucho desde ",
  cancion: "¡Hola, Radio Viene! Me gustaría escuchar la canción ",
  saludo: "¡Hola, Radio Viene! Quiero enviar un saludo a ",
  oracion: "Hola, Radio Viene. Quisiera pedir oración por ",
} as const;
