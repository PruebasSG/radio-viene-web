import { cache } from "react";
import { BORRADORES, SLUGS_PAGINAS, type ContenidoPagina, type SlugPagina } from "@/content/paginas";
import { crearClientePublico } from "@/lib/supabase/publico";

export const esSlugPagina = (valor: string): valor is SlugPagina =>
  (SLUGS_PAGINAS as readonly string[]).includes(valor);

/** Combina lo guardado en la base de datos con el borrador: lo que esté vacío se completa con el borrador. */
export function conBorrador(slug: SlugPagina, fila?: Partial<ContenidoPagina> | null): ContenidoPagina {
  const borrador = BORRADORES[slug];
  return {
    titulo: fila?.titulo?.trim() || borrador.titulo,
    descripcion: fila?.descripcion?.trim() || borrador.descripcion,
    contenido: fila?.contenido?.trim() || borrador.contenido,
  };
}

/** Texto de una página institucional. Sin base de datos: el borrador. */
export const obtenerPagina = cache(async (slug: SlugPagina): Promise<ContenidoPagina> => {
  const supabase = crearClientePublico();
  if (!supabase) return conBorrador(slug);

  const { data, error } = await supabase
    .from("paginas")
    .select("titulo, descripcion, contenido")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return conBorrador(slug);
  return conBorrador(slug, data as ContenidoPagina);
});
