"use client";

import { useReproductor } from "@/components/reproductor/ReproductorProvider";
import { radio } from "@/content/radio";
import estilos from "./inicio.module.css";

const dial = `${radio.frecuencia} ${radio.banda}`;

/** Explica en palabras sencillas qué pasa con la señal. Lo anuncian los lectores de pantalla. */
export function MensajeSenal() {
  const { estado, ahoraSuena } = useReproductor();

  let mensaje = "";
  if (estado === "error") {
    mensaje = `No pudimos conectar con la señal en línea. Inténtalo de nuevo en unos minutos o sintonízanos en el ${dial}.`;
  } else if (estado === "detenido" && ahoraSuena && !ahoraSuena.enLinea) {
    mensaje = `La señal en línea está en pausa en este momento. Sintonízanos en el ${dial}.`;
  } else if (estado === "sonando" && ahoraSuena?.enVivo) {
    mensaje = "Estás escuchando la emisión en vivo desde nuestra cabina.";
  }

  return (
    <p className={estilos.mensaje} role="status">
      {mensaje}
    </p>
  );
}
