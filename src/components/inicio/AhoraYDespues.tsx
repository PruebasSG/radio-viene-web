"use client";

import { useProgramacion } from "@/components/datos/ProgramacionProvider";
import { useReproductor } from "@/components/reproductor/ReproductorProvider";
import { radio } from "@/content/radio";
import { aMinutos, horaLegible, momentoEnZona, programaActual, programaSiguiente } from "@/lib/horario";
import { useAhora } from "@/lib/reloj";
import { Ecualizador } from "./Ecualizador";
import estilos from "./inicio.module.css";

/** "1 h 20 min" o "25 min" */
function duracion(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  if (horas === 0) return `${resto} min`;
  return resto === 0 ? `${horas} h` : `${horas} h ${resto} min`;
}

/**
 * Tarjeta «Al aire»: qué programa suena, cuánto le falta, la canción en curso
 * y qué viene después. Se actualiza sola cada minuto.
 */
export function AhoraYDespues() {
  const ahora = useAhora();
  const programacion = useProgramacion();
  const { estado, ahoraSuena } = useReproductor();
  const sonando = estado === "sonando";

  // Antes de llegar al navegador no sabemos la hora del oyente: reservamos el espacio.
  if (!ahora) return <aside className={estilos.alAire} aria-label="Al aire ahora" />;

  const momento = momentoEnZona(ahora, radio.zonaHoraria);
  const actual = programaActual(programacion, momento);
  const siguiente = programaSiguiente(programacion, momento);
  const cancion = ahoraSuena?.cancion;
  const oyentes = ahoraSuena?.enLinea ? (ahoraSuena.oyentes ?? 0) : 0;

  const inicio = actual ? aMinutos(actual.inicio) : 0;
  const fin = actual ? aMinutos(actual.fin) : 0;
  const progreso = actual ? Math.min(100, Math.max(0, ((momento.minutos - inicio) / (fin - inicio)) * 100)) : 0;
  const restante = actual ? fin - momento.minutos : 0;

  return (
    <aside className={estilos.alAire} aria-label="Al aire ahora">
      <p className={estilos.alAireEstado}>
        <Ecualizador activo={sonando} />
        {ahoraSuena?.enVivo ? "En vivo desde cabina" : "Al aire ahora"}
      </p>

      <p className={estilos.alAirePrograma}>{actual?.nombre ?? "Música continua"}</p>
      {actual?.conductor && <p className={estilos.alAireDetalle}>Con {actual.conductor}</p>}

      {actual ? (
        <div className={estilos.progreso}>
          <div
            className={estilos.progresoBarra}
            role="progressbar"
            aria-label="Avance del programa"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progreso)}
          >
            <span style={{ width: `${progreso}%` }} />
          </div>
          <p className={estilos.progresoTextos}>
            <span>{horaLegible(actual.inicio)}</span>
            <span className={estilos.progresoRestante}>Termina en {duracion(restante)}</span>
            <span>{horaLegible(actual.fin)}</span>
          </p>
        </div>
      ) : (
        <p className={estilos.alAireDetalle}>Himnos y alabanzas entre programas.</p>
      )}

      {cancion && sonando && (
        <p className={estilos.cancion}>
          <span aria-hidden="true">♪</span> {[cancion.titulo, cancion.artista].filter(Boolean).join(" · ")}
        </p>
      )}

      {siguiente && (
        <p className={estilos.despues}>
          <span>Después</span>
          <strong>{siguiente.nombre}</strong>
          <span>a las {horaLegible(siguiente.inicio)}</span>
        </p>
      )}

      {oyentes > 0 && (
        <p className={estilos.oyentes}>
          {oyentes === 1 ? "1 persona escucha" : `${oyentes} personas escuchan`} ahora por internet
        </p>
      )}
    </aside>
  );
}
