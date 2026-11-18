"use client";

import { useReproductor } from "@/components/reproductor/ReproductorProvider";
import { radio } from "@/content/radio";
import estilos from "./inicio.module.css";

/** «En vivo ahora» solo cuando la señal en línea realmente está emitiendo. */
export function EstadoSenal() {
  const { ahoraSuena } = useReproductor();
  const enLinea = ahoraSuena?.enLinea === true;

  return (
    <p className={estilos.estado} data-en-linea={enLinea || undefined}>
      <span className={estilos.estadoPunto} aria-hidden="true" />
      {enLinea && <span>En vivo ahora</span>}
      {enLinea && <span aria-hidden="true">·</span>}
      <strong>
        {radio.frecuencia} {radio.banda}
      </strong>
      <span aria-hidden="true">·</span>
      <span>{radio.ubicacion}</span>
    </p>
  );
}
