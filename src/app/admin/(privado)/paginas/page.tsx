import type { Metadata } from "next";
import Link from "next/link";
import { Aviso } from "@/components/admin/Aviso";
import estilos from "@/components/admin/panel.module.css";
import { BORRADORES, SLUGS_PAGINAS } from "@/content/paginas";
import { exigirAdmin } from "@/lib/admin/sesion";
import { fechaLegible } from "@/lib/blog";

export const metadata: Metadata = { title: "Páginas" };

export default async function PaginasPanel() {
  const { supabase } = await exigirAdmin();
  const { data, error } = await supabase.from("paginas").select("slug, titulo, contenido, actualizado_en");
  const filas = new Map((data ?? []).map((fila) => [fila.slug as string, fila]));

  return (
    <>
      <div className={estilos.encabezado}>
        <div>
          <h1>Páginas</h1>
          <p className={estilos.intro}>Los textos de Quiénes somos, Nuestras creencias y Contacto.</p>
        </div>
      </div>

      {error && (
        <Aviso tipo="error">
          No se pudieron cargar las páginas. Si es la primera vez, ejecuta el archivo paginas.sql en Supabase.
        </Aviso>
      )}

      <ul className={estilos.lista}>
        {SLUGS_PAGINAS.map((slug) => {
          const fila = filas.get(slug);
          const editada = Boolean(fila?.contenido && String(fila.contenido).trim());
          return (
            <li key={slug}>
              <Link href={`/admin/paginas/${slug}`} className={`${estilos.fila} ${estilos.filaBlog}`}>
                <span>
                  <span className={estilos.filaNombre}>
                    {(fila?.titulo as string) || BORRADORES[slug].titulo}
                    <span className={estilos.etiquetaEstado} data-estado={editada ? "publicado" : "borrador"}>
                      {editada ? "Editada" : "Borrador inicial"}
                    </span>
                  </span>
                  <br />
                  <span className={estilos.filaDetalle}>
                    radioviene.net/{slug}
                    {editada && fila?.actualizado_en ? ` · Editada el ${fechaLegible(String(fila.actualizado_en))}` : ""}
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
    </>
  );
}
