"use client";

import { useFormStatus } from "react-dom";
import estilos from "./panel.module.css";

function Boton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={estilos.botonPeligro} disabled={pending}>
      {pending ? "Eliminando…" : "Eliminar programa"}
    </button>
  );
}

/** Pide confirmación antes de borrar, para evitar accidentes. */
export function BotonEliminar({ accion, nombre }: { accion: () => Promise<void>; nombre: string }) {
  return (
    <form
      action={accion}
      onSubmit={(evento) => {
        if (!window.confirm(`¿Eliminar «${nombre}» de la programación? Esta acción no se puede deshacer.`)) {
          evento.preventDefault();
        }
      }}
    >
      <Boton />
    </form>
  );
}
