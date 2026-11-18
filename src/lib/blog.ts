import { cache } from "react";
import { ARTICULOS_POR_PAGINA } from "@/content/blog";
import { radio } from "@/content/radio";
import { crearClientePublico } from "@/lib/supabase/publico";

export type Articulo = {
  id: string;
  titulo: string;
  slug: string;
  extracto: string;
  contenido: string;
  categoria: string;
  autor: string;
  portadaUrl: string | null;
  portadaAncho: number | null;
  portadaAlto: number | null;
  portadaAlt: string;
  estado: "borrador" | "publicado";
  publicadoEn: string | null;
  actualizadoEn: string;
};

export type FilaArticulo = {
  id: string;
  titulo: string;
  slug: string;
  extracto: string;
  contenido: string;
  categoria: string;
  autor: string;
  portada_url: string | null;
  portada_ancho: number | null;
  portada_alto: number | null;
  portada_alt: string;
  estado: "borrador" | "publicado";
  publicado_en: string | null;
  actualizado_en: string;
};

export const COLUMNAS_ARTICULO =
  "id, titulo, slug, extracto, contenido, categoria, autor, portada_url, portada_ancho, portada_alto, portada_alt, estado, publicado_en, actualizado_en";

/** Para listados: todo menos el texto completo, que puede ser largo. */
const COLUMNAS_LISTADO = COLUMNAS_ARTICULO.replace("contenido, ", "");

export function filaAArticulo(fila: FilaArticulo): Articulo {
  return {
    id: fila.id,
    titulo: fila.titulo,
    slug: fila.slug,
    extracto: fila.extracto,
    contenido: fila.contenido ?? "",
    categoria: fila.categoria,
    autor: fila.autor,
    portadaUrl: fila.portada_url,
    portadaAncho: fila.portada_ancho,
    portadaAlto: fila.portada_alto,
    portadaAlt: fila.portada_alt,
    estado: fila.estado,
    publicadoEn: fila.publicado_en,
    actualizadoEn: fila.actualizado_en,
  };
}

// ---------- Lectura pública ----------

/** Artículos publicados, del más reciente al más antiguo. */
export const obtenerArticulos = cache(
  async (pagina = 1): Promise<{ articulos: Articulo[]; total: number }> => {
    const supabase = crearClientePublico();
    if (!supabase) return { articulos: [], total: 0 };

    const desde = (pagina - 1) * ARTICULOS_POR_PAGINA;
    const { data, error, count } = await supabase
      .from("articulos")
      .select(COLUMNAS_LISTADO, { count: "exact" })
      .eq("estado", "publicado")
      .lte("publicado_en", new Date().toISOString())
      .order("publicado_en", { ascending: false })
      .range(desde, desde + ARTICULOS_POR_PAGINA - 1);

    if (error || !data) {
      if (error) console.error("No se pudieron leer los artículos:", error.message);
      return { articulos: [], total: 0 };
    }
    return { articulos: (data as unknown as FilaArticulo[]).map(filaAArticulo), total: count ?? data.length };
  },
);

export const obtenerUltimosArticulos = cache(async (cantidad: number, excepto?: string): Promise<Articulo[]> => {
  const supabase = crearClientePublico();
  if (!supabase) return [];

  let consulta = supabase
    .from("articulos")
    .select(COLUMNAS_LISTADO)
    .eq("estado", "publicado")
    .lte("publicado_en", new Date().toISOString())
    .order("publicado_en", { ascending: false })
    .limit(cantidad);
  if (excepto) consulta = consulta.neq("slug", excepto);

  const { data, error } = await consulta;
  if (error || !data) return [];
  return (data as unknown as FilaArticulo[]).map(filaAArticulo);
});

export const obtenerArticulo = cache(async (slug: string): Promise<Articulo | null> => {
  const supabase = crearClientePublico();
  if (!supabase || !esSlugValido(slug)) return null;

  const { data, error } = await supabase
    .from("articulos")
    .select(COLUMNAS_ARTICULO)
    .eq("slug", slug)
    .eq("estado", "publicado")
    .lte("publicado_en", new Date().toISOString())
    .maybeSingle();

  if (error || !data) return null;
  return filaAArticulo(data as FilaArticulo);
});

/** Direcciones de todos los artículos publicados, para el mapa del sitio. */
export const obtenerSlugsPublicados = cache(async (): Promise<{ slug: string; actualizadoEn: string }[]> => {
  const supabase = crearClientePublico();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("articulos")
    .select("slug, actualizado_en")
    .eq("estado", "publicado")
    .lte("publicado_en", new Date().toISOString())
    .order("publicado_en", { ascending: false })
    .limit(1000);

  if (error || !data) return [];
  return data.map((fila) => ({ slug: fila.slug as string, actualizadoEn: fila.actualizado_en as string }));
});

// ---------- Utilidades ----------

export const esSlugValido = (slug: string) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) && slug.length <= 100;

/** "¿Cómo orar en familia?" → "como-orar-en-familia" */
export function crearSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/** "17 de noviembre de 2026" */
export function fechaLegible(iso: string): string {
  return new Intl.DateTimeFormat("es-VE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: radio.zonaHoraria,
  }).format(new Date(iso));
}

/** Minutos de lectura, a unas 200 palabras por minuto. */
export function minutosDeLectura(texto: string): number {
  const palabras = texto.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palabras / 200));
}

export type EstadoPublicacion = "borrador" | "programado" | "publicado";

/** Un artículo "publicado" con fecha futura está programado: aún no se ve en la web. */
export function estadoPublicacion(estado: "borrador" | "publicado", publicadoEn: string | null): EstadoPublicacion {
  if (estado === "borrador") return "borrador";
  if (publicadoEn && Date.parse(publicadoEn) > Date.now()) return "programado";
  return "publicado";
}
