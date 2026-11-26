import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guardarPagina } from "@/app/admin/acciones";
import { Aviso } from "@/components/admin/Aviso";
import { FormPagina } from "@/components/admin/FormPagina";
import estilos from "@/components/admin/panel.module.css";
import type { ContenidoPagina } from "@/content/paginas";
import { exigirAdmin } from "@/lib/admin/sesion";
import { conBorrador, esSlugPagina } from "@/lib/paginas";

export const metadata: Metadata = { title: "Editar página" };

type Props = { params: Promise<{ slug: string }> };

export default async function EditarPagina({ params }: Props) {
  const { supabase } = await exigirAdmin();
  const { slug } = await params;
  if (!esSlugPagina(slug)) notFound();

  const { data } = await supabase
    .from("paginas")
    .select("titulo, descripcion, contenido")
    .eq("slug", slug)
    .maybeSingle();
  const pagina = conBorrador(slug, data as ContenidoPagina | null);
  const esBorrador = !(data?.contenido as string | undefined)?.trim();

  return (
    <>
      <p>
        <Link href="/admin/paginas" className={estilos.enlace}>
          ← Volver a las páginas
        </Link>
      </p>
      <div className={estilos.encabezado} style={{ marginTop: "1rem" }}>
        <h1>{pagina.titulo}</h1>
        <a href={`/${slug}`} target="_blank" rel="noopener noreferrer" className={estilos.enlace}>
          Ver en la web ↗
        </a>
      </div>
      {esBorrador && (
        <Aviso>
          Esta página muestra el borrador inicial. Revísalo, ajústalo a la realidad de la radio y pulsa «Guardar
          página».
          {slug === "nuestras-creencias" &&
            " Por ser un texto doctrinal, conviene que lo revise un pastor o un anciano de iglesia."}
        </Aviso>
      )}
      <div className={estilos.tarjeta}>
        <FormPagina accion={guardarPagina.bind(null, slug)} pagina={pagina} />
      </div>
    </>
  );
}
