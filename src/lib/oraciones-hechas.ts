"use client";

import { useSyncExternalStore } from "react";

/**
 * Recuerda, solo en este navegador, por qué peticiones ya oró la persona,
 * para mostrar el botón como «Orando contigo». (El servidor, por su parte,
 * impide que una misma persona sume dos veces aunque borre este registro.)
 */

const CLAVE = "radio-viene:oraciones";
const avisos = new Set<() => void>();

function leer(): string {
  try {
    return localStorage.getItem(CLAVE) ?? "[]";
  } catch {
    return "[]";
  }
}

function suscribir(avisar: () => void) {
  avisos.add(avisar);
  window.addEventListener("storage", avisar);
  return () => {
    avisos.delete(avisar);
    window.removeEventListener("storage", avisar);
  };
}

function lista(texto: string): string[] {
  try {
    const valor: unknown = JSON.parse(texto);
    return Array.isArray(valor) ? valor.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function useOracionesHechas(): string[] {
  return lista(useSyncExternalStore(suscribir, leer, () => "[]"));
}

export function marcarOracion(id: string, hecha: boolean) {
  const actuales = new Set(lista(leer()));
  if (hecha) actuales.add(id);
  else actuales.delete(id);
  try {
    // Guardamos como mucho las 300 más recientes.
    localStorage.setItem(CLAVE, JSON.stringify([...actuales].slice(-300)));
  } catch {
    // Navegación privada o almacenamiento lleno: el botón funciona igual.
  }
  avisos.forEach((avisar) => avisar());
}
