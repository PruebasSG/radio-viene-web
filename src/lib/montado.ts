"use client";

import { useSyncExternalStore } from "react";

const sinSuscripcion = () => () => {};

/** Falso en el servidor y verdadero en el navegador: para lo que depende del reloj o la zona horaria local. */
export function useMontado(): boolean {
  return useSyncExternalStore(
    sinSuscripcion,
    () => true,
    () => false,
  );
}
