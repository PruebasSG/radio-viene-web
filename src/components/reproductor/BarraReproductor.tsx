"use client";

import { useProgramacion } from "@/components/datos/ProgramacionProvider";
import { radio } from "@/content/radio";
import { momentoEnZona, programaActual } from "@/lib/horario";
import { useAhora } from "@/lib/reloj";
import { BotonEscuchar } from "./BotonEscuchar";
import { useReproductor } from "./ReproductorProvider";
import estilos from "./reproductor.module.css";

/**
 * Barra fija inferior. Aparece cuando el oyente pulsa "Escuchar" por primera vez
 * y permanece mientras navega, para que siempre tenga el control a mano.
 */
export function BarraReproductor() {
  const { usado, estado, ahoraSuena } = useReproductor();
  const ahora = useAhora();
  const programacion = useProgramacion();

  if (!usado) return null;

  const programa = ahora ? programaActual(programacion, momentoEnZona(ahora, radio.zonaHoraria)) : null;
  const cancion = ahoraSuena?.cancion;

  return (
    <>
      <div className={estilos.espacioBarra} aria-hidden="true" />
      <section className={estilos.barra} aria-label="Reproductor">
        <div className={`contenedor ${estilos.barraInterior}`}>
          <BotonEscuchar tamano="chico" conTexto={false} />
          <div className={estilos.barraInfo}>
            <p className={estilos.barraTitulo}>
              {estado === "sonando" && <span className={estilos.punto} aria-hidden="true" />}
              {programa?.nombre ?? `${radio.nombre} ${radio.frecuencia} ${radio.banda}`}
            </p>
            <p className={estilos.barraDetalle}>
              {estado === "error"
                ? "Sin conexión con la señal en línea"
                : cancion
                  ? [cancion.titulo, cancion.artista].filter(Boolean).join(", de ")
                  : estado === "sonando"
                    ? "En vivo"
                    : `${radio.nombre} ${radio.frecuencia} ${radio.banda}`}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
