import type { Metadata } from "next";
import Link from "next/link";
import estilos from "@/components/admin/panel.module.css";
import { exigirAdmin } from "@/lib/admin/sesion";

export const metadata: Metadata = { title: "Inicio" };

export default async function InicioPanel() {
  const { supabase, email } = await exigirAdmin();
  const [{ data: programas }, { data: articulos }] = await Promise.all([
    supabase.from("programas").select("activo"),
    supabase.from("articulos").select("estado"),
  ]);

  const visibles = programas?.filter((p) => p.activo).length ?? 0;
  const ocultos = (programas?.length ?? 0) - visibles;
  const publicados = articulos?.filter((a) => a.estado === "publicado").length ?? 0;
  const borradores = (articulos?.length ?? 0) - publicados;

  return (
    <>
      <div className={estilos.encabezado}>
        <div>
          <h1>Hola 👋</h1>
          <p className={estilos.intro}>Has entrado como {email}. ¿Qué quieres actualizar hoy?</p>
        </div>
      </div>

      <div className={estilos.accesos} data-tres>
        <Link href="/admin/programacion" className={estilos.acceso}>
          <h2>Programación</h2>
          <p>
            {visibles} {visibles === 1 ? "programa visible" : "programas visibles"}
            {ocultos > 0 && `, ${ocultos} ${ocultos === 1 ? "oculto" : "ocultos"}`}. Añade, cambia horarios u
            oculta programas.
          </p>
          <span className={estilos.accesoIr}>Editar programación →</span>
        </Link>
        <Link href="/admin/blog" className={estilos.acceso}>
          <h2>Blog</h2>
          <p>
            {publicados} {publicados === 1 ? "artículo publicado" : "artículos publicados"}
            {borradores > 0 && `, ${borradores} ${borradores === 1 ? "borrador" : "borradores"}`}. Escribe y
            publica contenido.
          </p>
          <span className={estilos.accesoIr}>Ir al blog →</span>
        </Link>
        <Link href="/admin/datos" className={estilos.acceso}>
          <h2>Datos de la radio</h2>
          <p>Lema, texto de presentación, WhatsApp, correo y redes sociales.</p>
          <span className={estilos.accesoIr}>Editar datos →</span>
        </Link>
      </div>

      <p className={estilos.intro} style={{ marginTop: "1.5rem" }}>
        Los cambios que guardes se ven en la web en unos segundos.
      </p>
    </>
  );
}
