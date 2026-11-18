/**
 * CATEGORÍAS DEL BLOG
 * Para añadir o cambiar una categoría, edita esta lista.
 */
export const CATEGORIAS_BLOG = [
  "Reflexiones",
  "Estudio bíblico",
  "Salud integral",
  "Familia",
  "Música",
  "Noticias de la radio",
] as const;

export type CategoriaBlog = (typeof CATEGORIAS_BLOG)[number];

/** Artículos por página en /blog. */
export const ARTICULOS_POR_PAGINA = 12;
