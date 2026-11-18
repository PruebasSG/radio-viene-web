/** Respuesta de las acciones del panel a sus formularios. */
export type EstadoFormulario = {
  ok?: boolean;
  mensaje?: string;
  /** Error de cada campo, por nombre del campo. */
  errores?: Partial<Record<string, string>>;
  /** Lo que escribió la persona, para no perderlo si hay un error. */
  valores?: Record<string, string | string[] | boolean>;
};

export const ESTADO_INICIAL: EstadoFormulario = {};

/** Respuesta al subir una imagen del blog. */
export type ResultadoImagen = { url: string } | { error: string };

/** Respuesta de las acciones de fotos. */
export type ResultadoFoto = { ok: true } | { error: string };
