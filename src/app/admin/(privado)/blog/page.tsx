import type { Metadata } from "next";
import Link from "next/link";
import { Aviso } from "@/components/admin/Aviso";
import estilos from "@/components/admin/panel.module.css";
import { exigirAdmin } from "@/lib/admin/sesion";
import { estadoPublicacion, fechaLegible } from "@/lib/blog";

export const metadata: Metadata = { title: "Blog" };

type Props = { searchParams: Promise<{ eliminado?: string }> };

type Fila = {
  id: string;
  titulo: string;
  categoria: string;
  estado: "borrador" | "publicado";
  publicado_en: string | null;
  actualizado_en: string;
};

const TEXTO_ESTADO = { borrador: "Borrador", programado: "Programado", publicado: "Publicado" };

export default async function BlogPanel({ searchParams }: Props) {
  const { supabase } = await exigirAdmin();
  const { eliminado } = await searchParams;

  const { data, error } = await supabase
    .from("articulos")
    .select("id, titulo, categoria, estado, publicado_en, actualizado_en")
    .order("creado_en", { ascending: false });

  const articulos = (data ?? []) as Fila[];

  return (
    <>
      <div className={estilos.encabezado}>
        <div>
          <h1>Blog</h1>
          <p className={estilos.intro}>Toca un artículo para editarlo.</p>
        </div>
        <Link href="/admin/blog/nuevo" className={`${estilos.boton} ${estilos.botonDorado}`}>
          + Nuevo artículo
        </Link>
      </div>

      {eliminado && <Aviso tipo="exito">Artículo eliminado.</Aviso>}
      {error && (
        <Aviso tipo="error">
          No se pudo cargar el blog. Si es la primera vez, revisa que se haya ejecutado el archivo blog.sql en
          Supabase.
        </Aviso>
      )}

      {articulos.length === 0 ? (
        <p className={`${estilos.lista} ${estilos.vacio}`}>
          Todavía no hay artículos. Escribe el primero con el botón «Nuevo artículo».
        </p>
      ) : (
        <ul className={estilos.lista}>
          {articulos.map((fila) => {
            const clave = estadoPublicacion(fila.estado, fila.publicado_en);
            return (
              <li key={fila.id}>
                <Link href={`/admin/blog/${fila.id}`} className={`${estilos.fila} ${estilos.filaBlog}`}>
                  <span>
                    <span className={estilos.filaNombre}>
                      {fila.titulo}
                      <span className={estilos.etiquetaEstado} data-estado={clave}>
                        {TEXTO_ESTADO[clave]}
                      </span>
                    </span>
                    <br />
                    <span className={estilos.filaDetalle}>
                      {fila.categoria} ·{" "}
                      {fila.publicado_en && fila.estado === "publicado"
                        ? `${clave === "programado" ? "Se publica el" : "Publicado el"} ${fechaLegible(fila.publicado_en)}`
                        : `Editado el ${fechaLegible(fila.actualizado_en)}`}
                    </span>
                  </span>
                  <span className={estilos.filaEditar} aria-hidden="true">
                    Editar →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
