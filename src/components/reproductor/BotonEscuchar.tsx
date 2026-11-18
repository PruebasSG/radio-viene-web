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

type Props = {
  tamano?: "grande" | "chico" | "mini";
  /** En la barra inferior solo se ve el ícono; el texto queda para lectores de pantalla. */
  conTexto?: boolean;
};

export function BotonEscuchar({ tamano = "grande", conTexto = true }: Props) {
  const { estado, alternar } = useReproductor();
  const sonando = estado === "sonando" || estado === "conectando";

  return (
    <button
      type="button"
      className={estilos.boton}
      data-tamano={tamano}
      data-estado={estado}
      onClick={alternar}
      aria-pressed={sonando}
    >
      <span className={estilos.circulo}>
        {estado === "conectando" ? (
          <IconoCargando className={`${estilos.icono} ${estilos.girando}`} />
        ) : estado === "sonando" ? (
          <IconoDetener className={estilos.icono} />
        ) : (
          <IconoPlay className={`${estilos.icono} ${estilos.iconoPlay}`} />
        )}
      </span>
      <span className={conTexto ? estilos.texto : "solo-lectores"}>{TEXTO[estado]}</span>
    </button>
  );
}
