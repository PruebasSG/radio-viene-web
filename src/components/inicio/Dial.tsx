"use client";

import { useReproductor } from "@/components/reproductor/ReproductorProvider";
import { radio } from "@/content/radio";
import estilos from "./inicio.module.css";

const MINIMO = 88;
const MAXIMO = 108;
const MARCAS = Array.from({ length: (MAXIMO - MINIMO) / 2 + 1 }, (_, i) => MINIMO + i * 2);

const posicion = (frecuencia: number) => ((frecuencia - MINIMO) / (MAXIMO - MINIMO)) * 100;

/**
 * Escala de sintonía FM. Es decorativa: la frecuencia ya aparece como texto,
 * por eso se oculta a los lectores de pantalla.
 */
export function Dial() {
  const { estado } = useReproductor();
  const frecuencia = Number(radio.frecuencia);

  return (
    <div
      className={estilos.dial}
      data-estado={estado}
      style={{ "--posicion": `${posicion(frecuencia)}%` } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className={estilos.escala}>
        <ol className={estilos.marcas}>
          {MARCAS.map((marca) => (
            <li key={marca} style={{ left: `${posicion(marca)}%` }}>
              <span>{marca}</span>
            </li>
          ))}
        </ol>
        <div className={estilos.aguja}>
          <span className={estilos.agujaFrecuencia}>
            {radio.frecuencia}
            <small>{radio.banda}</small>
          </span>
        </div>
      </div>
    </div>
  );
}
