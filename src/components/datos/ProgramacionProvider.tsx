"use client";

import { createContext, useContext } from "react";
import type { Programa } from "@/content/programacion";

const ProgramacionContext = createContext<readonly Programa[]>([]);

/** Comparte la programación (leída en el servidor) con las partes interactivas de la web. */
export function ProgramacionProvider({
  programas,
  children,
}: {
  programas: readonly Programa[];
  children: React.ReactNode;
}) {
  return <ProgramacionContext.Provider value={programas}>{children}</ProgramacionContext.Provider>;
}

export function useProgramacion(): readonly Programa[] {
  return useContext(ProgramacionContext);
}
