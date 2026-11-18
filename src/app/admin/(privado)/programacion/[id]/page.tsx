import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eliminarPrograma, guardarPrograma } from "@/app/admin/acciones";
import { Aviso } from "@/components/admin/Aviso";
import { BotonEliminar } from "@/components/admin/BotonEliminar";
import { FormPrograma } from "@/components/admin/FormPrograma";
import estilos from "@/components/admin/panel.module.css";
import { exigirAdmin } from "@/lib/admin/sesion";
import { esIdValido } from "@/lib/admin/validacion";
import { filaAPrograma, type FilaPrograma } from "@/lib/datos";

export const metadata: Metadata = { title: "Editar programa" };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditarPrograma({ params, searchParams }: Props) {
  const { supabase } = await exigirAdmin();
  const { id } = await params;
  const { error: errorAnterior } = await searchParams;
  if (!esIdValido(id)) notFound();

  const { data } = await supabase
    .from("programas")
    .select("id, nombre, descripcion, conductor, dias, inicio, fin, activo")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  const fila = data as FilaPrograma;
  const programa = filaAPrograma(fila);

  return (
    <>
      <p>
        <Link href="/admin/programacion" className={estilos.enlace}>
          ← Volver a la programación
        </Link>
      </p>
      <div className={estilos.encabezado} style={{ marginTop: "1rem" }}>
        <h1>{programa.nombre}</h1>
      </div>

      {errorAnterior === "eliminar" && (
        <Aviso tipo="error">No se pudo eliminar el programa. Inténtalo de nuevo.</Aviso>
      )}

      <div className={estilos.tarjeta}>
        <FormPrograma
          accion={guardarPrograma.bind(null, id)}
          programa={{
            nombre: programa.nombre,
            descripcion: programa.descripcion,
            conductor: programa.conductor ?? "",
            dias: [...programa.dias],
            inicio: programa.inicio,
            // El selector de hora no admite 24:00: medianoche se muestra como 00:00.
            fin: programa.fin === "24:00" ? "00:00" : programa.fin,
            activo: fila.activo,
          }}
        />
      </div>

      <div className={estilos.tarjeta}>
        <h2>Eliminar</h2>
        <p className={estilos.intro} style={{ marginBottom: "1rem" }}>
          Si solo quieres quitarlo por un tiempo, mejor desmarca «Mostrar en la web».
        </p>
        <BotonEliminar
          accion={eliminarPrograma.bind(null, id)}
          etiqueta="Eliminar programa"
          confirmacion={`¿Eliminar «${programa.nombre}» de la programación? Esta acción no se puede deshacer.`}
        />
      </div>
    </>
  );
}
