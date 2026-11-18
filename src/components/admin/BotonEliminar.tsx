"use client";

import { useFormStatus } from "react-dom";
import estilos from "./panel.module.css";

function Boton({ etiqueta }: { etiqueta: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={estilos.botonPeligro} disabled={pending}>
      {pending ? "Eliminando…" : etiqueta}
    </button>
  );
}

type Props = {
  accion: () => Promise<void>;
  etiqueta: string;
  confirmacion: string;
};

/** Pide confirmación antes de borrar, para evitar accidentes. */
export function BotonEliminar({ accion, etiqueta, confirmacion }: Props) {
  return (
    <form
      action={accion}
      onSubmit={(evento) => {
        if (!window.confirm(confirmacion)) evento.preventDefault();
      }}
    >
      <Boton etiqueta={etiqueta} />
    </form>
  );
}
