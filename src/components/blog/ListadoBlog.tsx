import Link from "next/link";
import { ARTICULOS_POR_PAGINA } from "@/content/blog";
import type { Articulo } from "@/lib/blog";
import { TarjetaArticulo } from "./TarjetaArticulo";
import estilos from "./blog.module.css";

type Props = {
  articulos: Articulo[];
  total: number;
  pagina: number;
};

const enlacePagina = (pagina: number) => (pagina <= 1 ? "/blog" : `/blog/pagina/${pagina}`);

export function ListadoBlog({ articulos, total, pagina }: Props) {
  const paginas = Math.max(1, Math.ceil(total / ARTICULOS_POR_PAGINA));

  return (
    <>
      <header className={estilos.cabecera}>
        <div className="contenedor">
          <h1>Blog</h1>
          <p>Reflexiones, estudio de la Biblia, salud y vida en familia, desde Radio Viene.</p>
        </div>
      </header>

      <div className={`contenedor ${estilos.listado}`}>
        {articulos.length === 0 ? (
          <p className={estilos.vacio}>Muy pronto publicaremos los primeros artículos. ¡Vuelve a visitarnos!</p>
        ) : (
          <div className={estilos.rejilla}>
            {articulos.map((articulo, indice) => (
              <TarjetaArticulo key={articulo.id} articulo={articulo} destacado={pagina === 1 && indice === 0} />
            ))}
          </div>
        )}

        {paginas > 1 && (
          <nav className={estilos.paginacion} aria-label="Páginas del blog">
            {pagina > 1 ? <Link href={enlacePagina(pagina - 1)}>← Más recientes</Link> : <span />}
            <span>
              Página {pagina} de {paginas}
            </span>
            {pagina < paginas ? <Link href={enlacePagina(pagina + 1)}>Anteriores →</Link> : <span />}
          </nav>
        )}
      </div>
    </>
  );
}
