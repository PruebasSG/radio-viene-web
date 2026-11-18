import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Compartir } from "@/components/blog/Compartir";
import { ContenidoArticulo, textoPlano } from "@/components/blog/ContenidoArticulo";
import { TarjetaArticulo } from "@/components/blog/TarjetaArticulo";
import estilos from "@/components/blog/blog.module.css";
import { BotonEscuchar } from "@/components/reproductor/BotonEscuchar";
import { IMAGEN_COMPARTIR, SITE_URL } from "@/config/emisora";
import { radio } from "@/content/radio";
import {
  fechaLegible,
  minutosDeLectura,
  obtenerArticulo,
  obtenerSlugsPublicados,
  obtenerUltimosArticulos,
  type Articulo,
} from "@/lib/blog";

export const revalidate = 300;

/** Los artículos existentes se preparan al publicar la web; los nuevos, en su primera visita. */
export async function generateStaticParams() {
  const publicados = await obtenerSlugsPublicados();
  return publicados.map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

/** Resumen para Google: el extracto o, si falta, el comienzo del texto. */
function descripcion(articulo: Articulo): string {
  if (articulo.extracto) return articulo.extracto;
  const texto = textoPlano(articulo.contenido);
  return texto.length > 155 ? `${texto.slice(0, 152).trimEnd()}…` : texto;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const articulo = await obtenerArticulo((await params).slug);
  if (!articulo) return { title: "Artículo no encontrado" };

  const ruta = `/blog/${articulo.slug}`;
  // Sin foto de portada, el artículo se comparte con la imagen de la radio.
  const imagen = articulo.portadaUrl
    ? {
        url: articulo.portadaUrl,
        width: articulo.portadaAncho ?? undefined,
        height: articulo.portadaAlto ?? undefined,
        alt: articulo.portadaAlt,
      }
    : IMAGEN_COMPARTIR;

  return {
    title: articulo.titulo,
    description: descripcion(articulo),
    alternates: { canonical: ruta },
    openGraph: {
      type: "article",
      url: ruta,
      title: articulo.titulo,
      description: descripcion(articulo),
      images: [imagen],
      publishedTime: articulo.publicadoEn ?? undefined,
      modifiedTime: articulo.actualizadoEn,
      section: articulo.categoria,
      authors: articulo.autor ? [articulo.autor] : undefined,
    },
    twitter: { card: "summary_large_image" },
  };
}

/** Datos estructurados: le dicen a Google, sin ambigüedad, que esto es un artículo y quién lo publica. */
function datosEstructurados(articulo: Articulo, url: string) {
  const editor = {
    "@type": "Organization",
    name: `${radio.nombre} ${radio.frecuencia} ${radio.banda}`,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/iconos/icono-512.png`, width: 512, height: 512 },
  };
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: articulo.titulo,
    description: descripcion(articulo),
    image: articulo.portadaUrl ? [articulo.portadaUrl] : undefined,
    datePublished: articulo.publicadoEn,
    dateModified: articulo.actualizadoEn,
    author: articulo.autor ? { "@type": "Person", name: articulo.autor } : editor,
    publisher: editor,
    mainEntityOfPage: url,
    articleSection: articulo.categoria,
    inLanguage: "es",
  };
}

export default async function PaginaArticulo({ params }: Props) {
  const { slug } = await params;
  const articulo = await obtenerArticulo(slug);
  if (!articulo) notFound();

  const url = `${SITE_URL}/blog/${articulo.slug}`;
  const relacionados = await obtenerUltimosArticulos(3, articulo.slug);
  // Escapamos "<" para que el texto nunca pueda cerrar la etiqueta <script>.
  const jsonLd = JSON.stringify(datosEstructurados(articulo, url)).replace(/</g, "\\u003c");

  return (
    <>
      <article className={estilos.articulo}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

        <header className={`contenedor ${estilos.columna}`}>
          <nav aria-label="Estás en" className={estilos.migas}>
            <Link href="/blog">Blog</Link>
            <span aria-hidden="true">/</span>
            <span>{articulo.categoria}</span>
          </nav>
          <h1 className={estilos.titulo}>{articulo.titulo}</h1>
          {articulo.extracto && <p className={estilos.entradilla}>{articulo.extracto}</p>}
          <p className={estilos.meta}>
            {articulo.autor && <>Por {articulo.autor} · </>}
            {articulo.publicadoEn && (
              <time dateTime={articulo.publicadoEn}>{fechaLegible(articulo.publicadoEn)}</time>
            )}
            {" · "}
            {minutosDeLectura(articulo.contenido)} min de lectura
          </p>
        </header>

        {articulo.portadaUrl && (
          <figure className={`contenedor ${estilos.portada}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={articulo.portadaUrl}
              alt={articulo.portadaAlt}
              width={articulo.portadaAncho ?? undefined}
              height={articulo.portadaAlto ?? undefined}
              fetchPriority="high"
            />
          </figure>
        )}

        <div className={`contenedor ${estilos.columna} ${estilos.cuerpo}`}>
          <ContenidoArticulo texto={articulo.contenido} />
          <Compartir titulo={articulo.titulo} url={url} />
          <aside className={estilos.escuchar} aria-label="Escuchar la radio">
            <p>
              Acompaña tu día con {radio.nombre}, en vivo en el {radio.frecuencia} {radio.banda} y aquí mismo.
            </p>
            <BotonEscuchar />
          </aside>
        </div>
      </article>

      {relacionados.length > 0 && (
        <section className={estilos.relacionados} aria-labelledby="titulo-relacionados">
          <div className="contenedor">
            <h2 id="titulo-relacionados">Sigue leyendo</h2>
            <div className={estilos.rejilla}>
              {relacionados.map((otro) => (
                <TarjetaArticulo key={otro.id} articulo={otro} nivel="h3" />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
