import type { Metadata } from "next";
import Link from "next/link";
import { guardarPrograma } from "@/app/admin/acciones";
import { FormPrograma } from "@/components/admin/FormPrograma";
import estilos from "@/components/admin/panel.module.css";
import { exigirAdmin } from "@/lib/admin/sesion";

export const metadata: Metadata = { title: "Nuevo programa" };

export default async function NuevoPrograma() {
  await exigirAdmin();

  return (
    <>
      <p>
        <Link href="/admin/programacion" className={estilos.enlace}>
          ← Volver a la programación
        </Link>
      </p>
      <div className={estilos.encabezado} style={{ marginTop: "1rem" }}>
        <h1>Nuevo programa</h1>
      </div>
      <div className={estilos.tarjeta}>
        <FormPrograma accion={guardarPrograma.bind(null, null)} />
      </div>
    </>
  );
}
