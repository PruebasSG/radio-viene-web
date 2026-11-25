import { cache } from "react";
import { crearClientePublico } from "@/lib/supabase/publico";

export type Peticion = {
  id: string;
  /** null = anónima */
  nombre: string | null;
  texto: string;
  oraciones: number;
  publicadaEn: string | null;
};

export type FilaPeticion = {
  id: string;
  nombre: string | null;
  texto: string;
  oraciones: number;
  publicada_en: string | null;
};

export const filaAPeticion = (fila: FilaPeticion): Peticion => ({
  id: fila.id,
  nombre: fila.nombre,
  texto: fila.texto,
  oraciones: fila.oraciones,
  publicadaEn: fila.publicada_en,
});

/** Cuántas peticiones muestra el muro (las más recientes). */
export const PETICIONES_EN_MURO = 30;

/** Peticiones publicadas, de la más reciente a la más antigua. Sin base de datos: ninguna. */
export const obtenerPeticiones = cache(async (cantidad: number = PETICIONES_EN_MURO): Promise<Peticion[]> => {
  const supabase = crearClientePublico();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("peticiones")
    .select("id, nombre, texto, oraciones, publicada_en")
    .eq("estado", "publicada")
    .order("publicada_en", { ascending: false })
    .limit(cantidad);

  if (error || !data) return [];
  return (data as FilaPeticion[]).map(filaAPeticion);
});

/** Respuesta al pulsar «Estoy orando por ti». */
export type ResultadoOracion = { oraciones: number } | { error: string };
