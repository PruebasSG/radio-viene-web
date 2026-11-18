/**
 * DATOS DE LA RADIO
 *
 * `radio` es la identidad fija de la emisora: cambia muy rara vez y vive en el código.
 *
 * `ajustesRespaldo` son los textos y contactos que se editan desde el panel
 * (/admin/datos). Los valores de aquí solo se usan si la base de datos no
 * responde, para que la web nunca quede vacía.
 */

export type RedSocial = {
  nombre: string;
  url: string;
};

export type Ajustes = {
  /** Titular de la portada, en dos partes: la segunda va destacada en dorado. */
  titular: string;
  titularDestacado: string;
  /** Frases de la cinta dorada que se desplaza bajo la portada. */
  frases: string[];
  lema: string;
  descripcion: string;
  /** Solo dígitos, con código de país. Vacío = sin WhatsApp. */
  whatsapp: string;
  correo: string;
  redes: RedSocial[];
};

export const radio = {
  nombre: "Radio Viene",
  frecuencia: "101.3",
  banda: "FM",
  ubicacion: "Venezuela",

  /** Zona horaria en la que se muestra la programación. */
  zonaHoraria: "America/Caracas",
  nombreZonaHoraria: "hora de Venezuela",
} as const;

export const ajustesRespaldo: Ajustes = {
  titular: "Esperanza que",
  titularDestacado: "se escucha.",
  frases: ["Música que edifica", "La Biblia para cada día", "Oramos contigo", "Esperanza para tu familia", "Jesús viene"],
  lema: "Música, Biblia y esperanza para cada día.",
  descripcion:
    "Somos una radio adventista del séptimo día. Te acompañamos con música cristiana, estudio de la Biblia y mensajes de esperanza para toda la familia.",
  whatsapp: "584126909569",
  correo: "",
  redes: [],
};

/** Redes sociales que se pueden configurar desde el panel. */
export const REDES_DISPONIBLES = ["Instagram", "Facebook", "YouTube", "TikTok"] as const;

/** Mensajes que se escriben solos al abrir WhatsApp desde la web. */
export const mensajesWhatsApp = {
  ubicacion: "¡Hola, Radio Viene! Les escucho desde ",
  cancion: "¡Hola, Radio Viene! Me gustaría escuchar la canción ",
  saludo: "¡Hola, Radio Viene! Quiero enviar un saludo a ",
  oracion: "Hola, Radio Viene. Quisiera pedir oración por ",
} as const;
