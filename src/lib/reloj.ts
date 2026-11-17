"use client";

import { useSyncExternalStore } from "react";

/**
 * Reloj compartido que se actualiza cada minuto.
 * En el servidor devuelve null, así la página no muestra una hora equivocada
 * antes de llegar al navegador del oyente.
 */

const suscriptores = new Set<() => void>();
let instante = minutoActual();
let temporizador: ReturnType<typeof setInterval> | undefined;

function minutoActual(): number {
  return Math.floor(Date.now() / 60_000) * 60_000;
}

function revisar() {
  const nuevo = minutoActual();
  if (nuevo !== instante) {
    instante = nuevo;
    suscriptores.forEach((avisar) => avisar());
  }
}

function suscribir(avisar: () => void) {
  suscriptores.add(avisar);
  revisar();
  temporizador ??= setInterval(revisar, 15_000);
  return () => {
    suscriptores.delete(avisar);
    if (suscriptores.size === 0 && temporizador) {
      clearInterval(temporizador);
      temporizador = undefined;
    }
  };
}

/** Fecha actual (redondeada al minuto), o null mientras la página se prepara. */
export function useAhora(): Date | null {
  const valor = useSyncExternalStore(
    suscribir,
    () => instante,
    () => null,
  );
  return valor === null ? null : new Date(valor);
}
