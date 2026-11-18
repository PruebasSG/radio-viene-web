import { cache } from "react";
import { crearClientePublico } from "@/lib/supabase/publico";

export const SECCIONES_FOTOS = ["portada", "cabina", "comunidad"] as const;
export type SeccionFoto = (typeof SECCIONES_FOTOS)[number];

export const NOMBRE_SECCION: Record<SeccionFoto, string> = {
  portada: "Portada",
  cabina: "En cabina",
  comunidad: "Comunidad",
};

export type Foto = {
  id: string;
  url: string;
  urlMini: string;
  ancho: number;
  alto: number;
  alt: string;
  seccion: SeccionFoto;
  orden: number;
  activo: boolean;
};

export type FilaFoto = {
  id: string;
  url: string;
  url_mini: string;
  ancho: number;
  alto: number;
  alt: string;
  seccion: SeccionFoto;
  orden: number;
  activo: boolean;
};

export const COLUMNAS_FOTO = "id, url, url_mini, ancho, alto, alt, seccion, orden, activo";

export const filaAFoto = (fila: FilaFoto): Foto => ({
  id: fila.id,
  url: fila.url,
  urlMini: fila.url_mini,
  ancho: fila.ancho,
  alto: fila.alto,
  alt: fila.alt,
  seccion: fila.seccion,
  orden: fila.orden,
  activo: fila.activo,
});

/** Fotos visibles de una sección, en el orden elegido en el panel. Sin base de datos: ninguna. */
export const obtenerFotos = cache(async (seccion: SeccionFoto): Promise<Foto[]> => {
  const supabase = crearClientePublico();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("fotos")
    .select(COLUMNAS_FOTO)
    .eq("seccion", seccion)
    .eq("activo", true)
    .order("orden")
    .limit(40);

  if (error || !data) return [];
  return (data as FilaFoto[]).map(filaAFoto);
});
