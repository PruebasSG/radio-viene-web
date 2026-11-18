"use client";

import { IconoCargando, IconoDetener, IconoPlay } from "@/components/iconos";
import { useReproductor, type EstadoReproductor } from "./ReproductorProvider";
import estilos from "./reproductor.module.css";

const TEXTO: Record<EstadoReproductor, string> = {
  detenido: "Escuchar en vivo",
  conectando: "Conectando…",
  sonando: "Detener",
  error: "Intentar de nuevo",
};

/** Botón alargado para escuchar: dorado en el inicio, claro en la cabecera. */
export function BotonPastilla({ variante = "dorada" }: { variante?: "dorada" | "clara" }) {
  const { estado, alternar } = useReproductor();
  const activo = estado === "sonando" || estado === "conectando";

  return (
    <button
      type="button"
      className={estilos.pastilla}
      data-variante={variante}
      data-estado={estado}
      onClick={alternar}
      aria-pressed={activo}
    >
      {estado === "conectando" ? (
        <IconoCargando className={`${estilos.pastillaIcono} ${estilos.girando}`} />
      ) : estado === "sonando" ? (
        <IconoDetener className={estilos.pastillaIcono} />
      ) : variante === "clara" ? (
        <span className={estilos.pastillaPunto} aria-hidden="true" />
      ) : (
        <IconoPlay className={estilos.pastillaIcono} />
      )}
      {TEXTO[estado]}
    </button>
  );
}
