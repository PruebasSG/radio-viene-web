"use client";

import { useReproductor } from "@/components/reproductor/ReproductorProvider";
import { programacion } from "@/content/programacion";
import { radio } from "@/content/radio";
import { horaLegible, momentoEnZona, programaActual, programaSiguiente } from "@/lib/horario";
import { useAhora } from "@/lib/reloj";
import estilos from "./inicio.module.css";

export function AhoraYDespues() {
  const ahora = useAhora();
  const { estado, ahoraSuena } = useReproductor();

  // Antes de llegar al navegador no sabemos la hora del oyente: reservamos el espacio.
  if (!ahora) return <div className={estilos.ahoraYDespues} />;

  const momento = momentoEnZona(ahora, radio.zonaHoraria);
  const actual = programaActual(programacion, momento);
  const siguiente = programaSiguiente(programacion, momento);
  const cancion = estado === "sonando" ? ahoraSuena?.cancion : null;

  return (
    <div className={estilos.ahoraYDespues}>
      <div className={estilos.franja}>
        <p className={estilos.franjaEtiqueta}>Ahora</p>
        <p className={estilos.franjaPrograma}>{actual?.nombre ?? "Música continua"}</p>
        <p className={estilos.franjaDetalle}>
          {cancion
            ? `Suena ${[cancion.titulo, cancion.artista].filter(Boolean).join(", de ")}`
            : actual
              ? `De ${horaLegible(actual.inicio)} a ${horaLegible(actual.fin)}`
              : "Himnos y alabanzas entre programas"}
        </p>
      </div>
      {siguiente && (
        <div className={estilos.franja}>
          <p className={estilos.franjaEtiqueta}>Después</p>
          <p className={estilos.franjaPrograma}>{siguiente.nombre}</p>
          <p className={estilos.franjaDetalle}>A las {horaLegible(siguiente.inicio)}</p>
        </div>
      )}
    </div>
  );
}
