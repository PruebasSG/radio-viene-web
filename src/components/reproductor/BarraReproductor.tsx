"use client";

import { useProgramacion } from "@/components/datos/ProgramacionProvider";
import { Ecualizador } from "@/components/inicio/Ecualizador";
import { IconoAuriculares } from "@/components/iconos";
import { Logo } from "@/components/Logo";
import { radio } from "@/content/radio";
import { aMinutos, momentoEnZona, programaActual } from "@/lib/horario";
import { useAhora } from "@/lib/reloj";
import { BotonEscuchar } from "./BotonEscuchar";
import { useReproductor } from "./ReproductorProvider";
import estilos from "./reproductor.module.css";

/**
 * Reproductor fijo en la parte inferior, siempre a mano: qué suena, el avance
 * del programa (la línea dorada de arriba) y cuántas personas escuchan.
 */
export function BarraReproductor() {
  const { estado, ahoraSuena } = useReproductor();
  const ahora = useAhora();
  const programacion = useProgramacion();

  const momento = ahora ? momentoEnZona(ahora, radio.zonaHoraria) : null;
  const programa = momento ? programaActual(programacion, momento) : null;
  const avance =
    programa && momento
      ? ((momento.minutos - aMinutos(programa.inicio)) / (aMinutos(programa.fin) - aMinutos(programa.inicio))) * 100
      : 0;

  const sonando = estado === "sonando";
  const enLinea = ahoraSuena?.enLinea === true;
  const cancion = ahoraSuena?.cancion;
  const oyentes = ahoraSuena?.oyentes ?? 0;
  const etiqueta = enLinea ? "En vivo" : "Al aire";

  const detalle =
    estado === "error"
      ? "Sin conexión con la señal en línea"
      : estado === "conectando"
        ? "Conectando…"
        : sonando && cancion
          ? [cancion.titulo, cancion.artista].filter(Boolean).join(" · ")
          : `${etiqueta} · ${programa?.nombre ?? "Música continua"}`;

  return (
    <>
      <div className={estilos.espacioBarra} aria-hidden="true" />
      <section className={estilos.barra} aria-label="Reproductor" data-estado={estado}>
        <span className={estilos.barraAvance} style={{ width: `${avance}%` }} aria-hidden="true" />
        <div className={`contenedor ${estilos.barraInterior}`}>
          <div className={estilos.barraInfo}>
            <Logo alto={40} className={estilos.barraLogo} />
            <div className={estilos.barraTextos}>
              <p className={estilos.barraTitulo}>
                {radio.nombre} {radio.frecuencia} {radio.banda}
              </p>
              <p className={estilos.barraDetalle} data-en-vivo={enLinea || undefined}>
                {detalle}
              </p>
            </div>
          </div>

          <div className={estilos.barraControl}>
            <Ecualizador activo={sonando} barras={6} className={estilos.barraOndas} />
            <BotonEscuchar tamano="chico" conTexto={false} />
            <Ecualizador activo={sonando} barras={6} className={estilos.barraOndas} />
          </div>

          <p className={estilos.barraOyentes}>
            {oyentes > 0 && (
              <>
                <IconoAuriculares className={estilos.barraOyentesIcono} />
                {oyentes}
                <span className={estilos.barraOyentesTexto}> {oyentes === 1 ? "oyente" : "oyentes"}</span>
              </>
            )}
          </p>
        </div>
      </section>
    </>
  );
}
