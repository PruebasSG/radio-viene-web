"use client";

import { useState } from "react";
import { useProgramacion } from "@/components/datos/ProgramacionProvider";
import type { Dia } from "@/content/programacion";
import { radio } from "@/content/radio";
import { DIAS, NOMBRE_DIA, aMinutos, estaAlAire, horaLegible, momentoEnZona, programasDelDia } from "@/lib/horario";
import { useAhora } from "@/lib/reloj";
import estilos from "./programacion.module.css";

export function Programacion() {
  const ahora = useAhora();
  const programacion = useProgramacion();
  const momento = ahora ? momentoEnZona(ahora, radio.zonaHoraria) : null;
  const [elegido, setElegido] = useState<Dia | null>(null);

  // Hasta que el oyente elija otro día, mostramos el de hoy.
  const dia = elegido ?? momento?.dia ?? "lunes";
  const programas = programasDelDia(programacion, dia);

  return (
    <section id="programacion" className={estilos.seccion} aria-labelledby="titulo-programacion">
      <div className="contenedor">
        <div className={`${estilos.encabezado} revelar`}>
          <h2 id="titulo-programacion">Programación</h2>
          <p>Horarios en {radio.nombreZonaHoraria}.</p>
        </div>

        <div className={`${estilos.dias} revelar`} role="group" aria-label="Elige un día">
          {DIAS.map((d) => (
            <button
              key={d}
              type="button"
              className={estilos.dia}
              aria-pressed={d === dia}
              onClick={() => setElegido(d)}
            >
              <span aria-hidden="true">{NOMBRE_DIA[d].corto}</span>
              <span className="solo-lectores">{NOMBRE_DIA[d].largo}</span>
              {momento?.dia === d && <span className={estilos.hoy}>Hoy</span>}
            </button>
          ))}
        </div>

        <h3 className="solo-lectores">Programas del {NOMBRE_DIA[dia].largo.toLowerCase()}</h3>
        <ol className={estilos.lista}>
          {programas.map((programa) => {
            const alAire = momento !== null && momento.dia === dia && estaAlAire(programa, momento);
            const avance =
              alAire && momento
                ? ((momento.minutos - aMinutos(programa.inicio)) /
                    (aMinutos(programa.fin) - aMinutos(programa.inicio))) *
                  100
                : 0;
            return (
              <li
                key={`${programa.nombre}-${programa.inicio}`}
                className={estilos.programa}
                data-al-aire={alAire || undefined}
              >
                {alAire && <span className={estilos.avance} style={{ width: `${avance}%` }} aria-hidden="true" />}
                <p className={estilos.horario}>
                  <time>{horaLegible(programa.inicio)}</time>
                  <span className={estilos.hasta}>
                    a <time>{horaLegible(programa.fin)}</time>
                  </span>
                </p>
                <div>
                  <p className={estilos.nombre}>
                    {programa.nombre}
                    {alAire && <span className={estilos.alAire}>Al aire</span>}
                  </p>
                  <p className={estilos.descripcion}>{programa.descripcion}</p>
                  {programa.conductor && <p className={estilos.conductor}>Con {programa.conductor}</p>}
                </div>
              </li>
            );
          })}
        </ol>
        {programas.length === 0 && (
          <p className={estilos.vacio}>Este día emitimos música continua durante toda la jornada.</p>
        )}
      </div>
    </section>
  );
}
