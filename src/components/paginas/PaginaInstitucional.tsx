import { ContenidoArticulo } from "@/components/blog/ContenidoArticulo";
import type { ContenidoPagina } from "@/content/paginas";
import estilos from "./paginas.module.css";

type Props = {
  pagina: ContenidoPagina;
  /** Contenido extra antes del texto (por ejemplo, las tarjetas de contacto). */
  antes?: React.ReactNode;
  /** Columna lateral con accesos relacionados. */
  lateral?: React.ReactNode;
};

/** Diseño común de Quiénes somos, Nuestras creencias y Contacto. */
export function PaginaInstitucional({ pagina, antes, lateral }: Props) {
  return (
    <>
      <header className={estilos.cabecera}>
        <div className="contenedor">
          <h1>{pagina.titulo}</h1>
          <p>{pagina.descripcion}</p>
        </div>
      </header>
      <div className={`contenedor ${estilos.cuerpo}`}>
        <div className={estilos.principal}>
          {antes}
          <ContenidoArticulo texto={pagina.contenido} />
        </div>
        {lateral && <aside className={estilos.lateral}>{lateral}</aside>}
      </div>
    </>
  );
}

/** Tarjeta de la columna lateral con enlaces. */
export function TarjetaLateral({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className={estilos.tarjetaLateral}>
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}
