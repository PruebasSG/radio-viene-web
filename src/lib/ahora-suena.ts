/**
 * Estado de la emisora, simplificado a partir de la API de AzuraCast.
 * La web solo usa estos campos; así, si cambiamos de servidor, basta con
 * adaptar la función `desdeAzuraCast`.
 */
export type AhoraSuena = {
  /** La señal en línea está emitiendo. */
  enLinea: boolean;
  /** La cabina está conectada en vivo (si no, suena el AutoDJ). */
  enVivo: boolean;
  cancion: { titulo: string; artista: string | null } | null;
  oyentes: number | null;
};

export const SIN_SENAL: AhoraSuena = {
  enLinea: false,
  enVivo: false,
  cancion: null,
  oyentes: null,
};

type Objeto = Record<string, unknown>;

const objeto = (valor: unknown): Objeto =>
  typeof valor === "object" && valor !== null ? (valor as Objeto) : {};

const texto = (valor: unknown): string | null =>
  typeof valor === "string" && valor.trim() !== "" ? valor.trim() : null;

/** Lee la respuesta de AzuraCast sin confiar en su forma: cualquier dato raro se ignora. */
export function desdeAzuraCast(datos: unknown): AhoraSuena {
  const raiz = objeto(datos);
  const cancion = objeto(objeto(raiz.now_playing).song);
  const titulo = texto(cancion.title) ?? texto(cancion.text);
  const oyentes = objeto(raiz.listeners);
  // "total" es el campo oficial; "current" es su nombre antiguo, que AzuraCast podría retirar.
  const cantidad = typeof oyentes.total === "number" ? oyentes.total : oyentes.current;

  return {
    enLinea: raiz.is_online === true,
    enVivo: objeto(raiz.live).is_live === true,
    cancion: titulo ? { titulo, artista: texto(cancion.artist) } : null,
    oyentes: typeof cantidad === "number" && cantidad >= 0 ? cantidad : null,
  };
}
