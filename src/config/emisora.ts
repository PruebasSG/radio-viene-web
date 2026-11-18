/**
 * Direcciones técnicas de la emisora.
 * Se leen de las variables de entorno (ver .env.example) y, si no existen,
 * se usan las del servidor de pruebas.
 */

const STREAM_POR_DEFECTO = "https://radio.syncrochats.com/listen/radio_viene/radio.mp3";
const AHORA_SUENA_POR_DEFECTO = "https://radio.syncrochats.com/api/nowplaying/radio_viene";

/** Señal en vivo que reproduce el navegador del oyente. */
export const STREAM_URL = process.env.NEXT_PUBLIC_STREAM_URL || STREAM_POR_DEFECTO;

/** API de AzuraCast con el estado de la emisora. Solo se consulta desde el servidor. */
export const AHORA_SUENA_URL = process.env.AZURACAST_NOWPLAYING_URL || AHORA_SUENA_POR_DEFECTO;

/** Dirección pública de la web, usada en los enlaces al compartir. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
