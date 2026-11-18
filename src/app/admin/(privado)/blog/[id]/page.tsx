import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eliminarArticulo, guardarArticulo } from "@/app/admin/acciones";
import { Aviso } from "@/components/admin/Aviso";
import { BotonEliminar } from "@/components/admin/BotonEliminar";
import { FormArticulo } from "@/components/admin/FormArticulo";
import estilos from "@/components/admin/panel.module.css";
import { SITE_URL } from "@/config/emisora";
import { exigirAdmin } from "@/lib/admin/sesion";
import { esIdValido } from "@/lib/admin/validacion";
import { COLUMNAS_ARTICULO, estadoPublicacion, filaAArticulo, type FilaArticulo } from "@/lib/blog";

export const metadata: Metadata = { title: "Editar artículo" };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ guardado?: string; error?: string }>;
};

export default async function EditarArticulo({ params, searchParams }: Props) {
  const { supabase } = await exigirAdmin();
  const { id } = await params;
  const { guardado, error } = await searchParams;
  if (!esIdValido(id)) notFound();

  const { data } = await supabase.from("articulos").select(COLUMNAS_ARTICULO).eq("id", id).maybeSingle();
  if (!data) notFound();
  const articulo = filaAArticulo(data as FilaArticulo);

  const visible = estadoPublicacion(articulo.estado, articulo.publicadoEn) === "publicado";

  return (
    <>
      <p>
        <Link href="/admin/blog" className={estilos.enlace}>
          ← Volver al blog
        </Link>
      </p>
      <div className={estilos.encabezado} style={{ marginTop: "1rem" }}>
        <h1>Editar artículo</h1>
        {visible && (
          <a href={`/blog/${articulo.slug}`} target="_blank" rel="noopener noreferrer" className={estilos.enlace}>
            Ver en la web ↗
          </a>
        )}
      </div>

      {guardado && (
        <Aviso tipo="exito">
          {articulo.estado === "borrador"
            ? "Borrador guardado. Solo lo ven los administradores."
            : visible
              ? "Artículo guardado y publicado. Ya se ve en la web."
              : "Artículo guardado. Se publicará automáticamente en la fecha elegida."}
        </Aviso>
      )}
      {error === "eliminar" && <Aviso tipo="error">No se pudo eliminar el artículo. Inténtalo de nuevo.</Aviso>}

      <div className={estilos.tarjeta}>
        <FormArticulo
          key={articulo.actualizadoEn}
          accion={guardarArticulo.bind(null, id)}
          sitio={new URL(SITE_URL).host}
          articulo={{
            titulo: articulo.titulo,
            slug: articulo.slug,
            extracto: articulo.extracto,
            contenido: articulo.contenido,
            categoria: articulo.categoria,
            autor: articulo.autor,
            portada: {
              url: articulo.portadaUrl ?? "",
              ancho: articulo.portadaAncho ?? 0,
              alto: articulo.portadaAlto ?? 0,
              alt: articulo.portadaAlt,
            },
            estado: articulo.estado,
            publicadoEn: articulo.publicadoEn,
          }}
        />
      </div>

      <div className={estilos.tarjeta}>
        <h2>Eliminar</h2>
        <p className={estilos.intro} style={{ marginBottom: "1rem" }}>
          Si solo quieres retirarlo un tiempo, mejor pásalo a «Borrador».
        </p>
        <BotonEliminar
          accion={eliminarArticulo.bind(null, id)}
          etiqueta="Eliminar artículo"
          confirmacion={`¿Eliminar «${articulo.titulo}»? Esta acción no se puede deshacer.`}
        />
      </div>
    </>
  );
}
