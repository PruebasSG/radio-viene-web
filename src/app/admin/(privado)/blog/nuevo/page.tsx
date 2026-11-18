import type { Metadata } from "next";
import Link from "next/link";
import { guardarArticulo } from "@/app/admin/acciones";
import { FormArticulo } from "@/components/admin/FormArticulo";
import estilos from "@/components/admin/panel.module.css";
import { SITE_URL } from "@/config/emisora";
import { exigirAdmin } from "@/lib/admin/sesion";

export const metadata: Metadata = { title: "Nuevo artículo" };

export default async function NuevoArticulo() {
  await exigirAdmin();

  return (
    <>
      <p>
        <Link href="/admin/blog" className={estilos.enlace}>
          ← Volver al blog
        </Link>
      </p>
      <div className={estilos.encabezado} style={{ marginTop: "1rem" }}>
        <h1>Nuevo artículo</h1>
      </div>
      <div className={estilos.tarjeta}>
        <FormArticulo accion={guardarArticulo.bind(null, null)} sitio={new URL(SITE_URL).host} />
      </div>
    </>
  );
}
