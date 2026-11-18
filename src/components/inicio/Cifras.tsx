"use client";

import { useReproductor } from "@/components/reproductor/ReproductorProvider";
import { radio } from "@/content/radio";
import estilos from "./inicio.module.css";

/** Datos rápidos bajo los botones. Los oyentes salen de AzuraCast en tiempo real. */
export function Cifras({ totalProgramas }: { totalProgramas: number }) {
  const { ahoraSuena } = useReproductor();
  const oyentes = ahoraSuena?.enLinea ? (ahoraSuena.oyentes ?? 0) : 0;

  const cifras = [
    { valor: "24/7", etiqueta: "al aire" },
    oyentes > 0
      ? { valor: String(oyentes), etiqueta: "escuchando ahora" }
      : { valor: radio.frecuencia, etiqueta: `${radio.banda} en ${radio.ubicacion}` },
    ...(totalProgramas > 0 ? [{ valor: String(totalProgramas), etiqueta: "programas" }] : []),
  ];

  return (
    <dl className={estilos.cifras}>
      {cifras.map((cifra) => (
        <div key={cifra.etiqueta}>
          <dt>{cifra.etiqueta}</dt>
          <dd>{cifra.valor}</dd>
        </div>
      ))}
    </dl>
  );
}
