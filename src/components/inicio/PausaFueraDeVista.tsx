"use client";

import { useEffect } from "react";

/**
 * Detiene el movimiento del mosaico y de la cinta cuando no se ven en pantalla,
 * para no gastar batería ni procesador en algo que la persona no está mirando.
 */
export function PausaFueraDeVista({ selectores }: { selectores: string[] }) {
  const clave = selectores.join(",");

  useEffect(() => {
    const elementos = clave
      .split(",")
      .map((selector) => document.querySelector<HTMLElement>(selector))
      .filter((elemento): elemento is HTMLElement => elemento !== null);

    const observador = new IntersectionObserver((entradas) => {
      for (const entrada of entradas) {
        entrada.target.toggleAttribute("data-pausado", !entrada.isIntersecting);
      }
    });
    elementos.forEach((elemento) => observador.observe(elemento));
    return () => observador.disconnect();
  }, [clave]);

  return null;
}
