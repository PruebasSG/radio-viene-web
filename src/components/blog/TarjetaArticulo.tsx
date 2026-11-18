import Link from "next/link";
import { fechaLegible, type Articulo } from "@/lib/blog";
import estilos from "./blog.module.css";

type Props = {
  articulo: Articulo;
  destacado?: boolean;
  /** Nivel del título según dónde aparezca la tarjeta. */
  nivel?: "h2" | "h3";
};

export function TarjetaArticulo({ articulo, destacado = false, nivel = "h2" }: Props) {
  const Titulo = nivel;

  return (
    <article className={`${estilos.tarjeta} revelar`} data-destacado={destacado || undefined}>
      <Link href={`/blog/${articulo.slug}`} className={estilos.tarjetaEnlace}>
        <div className={estilos.tarjetaImagen}>
          {articulo.portadaUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={articulo.portadaUrl}
              alt=""
              width={articulo.portadaAncho ?? undefined}
              height={articulo.portadaAlto ?? undefined}
              loading={destacado ? "eager" : "lazy"}
              decoding="async"
            />
          ) : (
            <span className={estilos.tarjetaSinImagen} aria-hidden="true">
              {articulo.categoria}
            </span>
          )}
        </div>
        <div className={estilos.tarjetaTexto}>
          <p className={estilos.categoria}>{articulo.categoria}</p>
          <Titulo className={estilos.tarjetaTitulo}>{articulo.titulo}</Titulo>
          {articulo.extracto && <p className={estilos.tarjetaExtracto}>{articulo.extracto}</p>}
          {articulo.publicadoEn && (
            <p className={estilos.fecha}>
              <time dateTime={articulo.publicadoEn}>{fechaLegible(articulo.publicadoEn)}</time>
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
