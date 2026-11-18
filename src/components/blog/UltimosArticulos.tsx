import Link from "next/link";
import type { Articulo } from "@/lib/blog";
import { TarjetaArticulo } from "./TarjetaArticulo";
import estilos from "./blog.module.css";

/** Sección de la portada con los artículos más recientes. Si no hay, no se muestra. */
export function UltimosArticulos({ articulos }: { articulos: Articulo[] }) {
  if (articulos.length === 0) return null;

  return (
    <section id="blog" className={estilos.seccionPortada} aria-labelledby="titulo-blog">
      <div className="contenedor">
        <div className={`${estilos.encabezadoPortada} revelar`}>
          <h2 id="titulo-blog">Para leer con calma</h2>
          <Link href="/blog" className={estilos.verTodo}>
            Ver todo el blog →
          </Link>
        </div>
        {/* En el móvil, las tarjetas se deslizan de lado en lugar de apilarse */}
        <div className={`${estilos.rejilla} ${estilos.carrusel}`}>
          {articulos.map((articulo) => (
            <TarjetaArticulo key={articulo.id} articulo={articulo} nivel="h3" />
          ))}
        </div>
      </div>
    </section>
  );
}
