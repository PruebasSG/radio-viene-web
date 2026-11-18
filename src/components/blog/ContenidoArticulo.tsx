import Markdown, { type Components } from "react-markdown";
import estilos from "./blog.module.css";

/**
 * Muestra el texto de un artículo escrito en formato Markdown.
 * Es seguro: no permite HTML ni código incrustado, y descarta enlaces peligrosos.
 */

const componentes: Components = {
  // El título del artículo ya es el único h1 de la página.
  h1: ({ children }) => <h2>{children}</h2>,
  a: ({ href, children }) => {
    const externo = href?.startsWith("http") ?? false;
    return (
      <a href={href} {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  },
  img: ({ src, alt }) =>
    typeof src === "string" ? (
      // Las imágenes ya llegan optimizadas desde el panel.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" />
    ) : null,
};

export function ContenidoArticulo({ texto }: { texto: string }) {
  return (
    <div className={estilos.prosa}>
      <Markdown components={componentes}>{texto}</Markdown>
    </div>
  );
}

/** Quita las marcas de formato para usar el texto como resumen. */
export function textoPlano(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
