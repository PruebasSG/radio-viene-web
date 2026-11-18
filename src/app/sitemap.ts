import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/emisora";
import { obtenerSlugsPublicados } from "@/lib/blog";

/** Mapa del sitio para Google. Se actualiza solo al publicar un artículo. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articulos = await obtenerSlugsPublicados();

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    {
      url: `${SITE_URL}/blog`,
      lastModified: articulos[0]?.actualizadoEn,
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...articulos.map(({ slug, actualizadoEn }) => ({
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: actualizadoEn,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
