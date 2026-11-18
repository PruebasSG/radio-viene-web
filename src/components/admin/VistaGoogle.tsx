import estilos from "./panel.module.css";

type Props = {
  sitio: string;
  slug: string;
  titulo: string;
  extracto: string;
};

const recortar = (texto: string, maximo: number) =>
  texto.length > maximo ? `${texto.slice(0, maximo - 1).trimEnd()}…` : texto;

/** Muestra, aproximadamente, cómo aparecerá el artículo en los resultados de Google. */
export function VistaGoogle({ sitio, slug, titulo, extracto }: Props) {
  const largoTitulo = titulo.length;
  const largoExtracto = extracto.length;

  return (
    <div className={estilos.google}>
      <p className={estilos.etiqueta}>Así se verá en Google</p>
      <div className={estilos.googleTarjeta}>
        <p className={estilos.googleSitio}>
          {sitio} › blog › {slug || "direccion-del-articulo"}
        </p>
        <p className={estilos.googleTitulo}>{recortar(titulo || "Título del artículo", 60)} | Radio Viene</p>
        <p className={estilos.googleTexto}>
          {recortar(extracto || "Escribe un extracto: es el resumen que la gente lee antes de entrar.", 160)}
        </p>
      </div>
      <ul className={estilos.googleConsejos}>
        <li data-ok={largoTitulo > 0 && largoTitulo <= 60}>
          Título: {largoTitulo} caracteres {largoTitulo > 60 ? "(Google lo cortará; ideal hasta 60)" : "(ideal hasta 60)"}
        </li>
        <li data-ok={largoExtracto >= 110 && largoExtracto <= 160}>
          Extracto: {largoExtracto} caracteres (ideal entre 110 y 160)
        </li>
      </ul>
    </div>
  );
}
