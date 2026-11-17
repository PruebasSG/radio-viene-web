import type { Dia, Programa } from "@/content/programacion";

export const DIAS: readonly Dia[] = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

export const NOMBRE_DIA: Record<Dia, { corto: string; largo: string }> = {
  lunes: { corto: "Lun", largo: "Lunes" },
  martes: { corto: "Mar", largo: "Martes" },
  miercoles: { corto: "Mié", largo: "Miércoles" },
  jueves: { corto: "Jue", largo: "Jueves" },
  viernes: { corto: "Vie", largo: "Viernes" },
  sabado: { corto: "Sáb", largo: "Sábado" },
  domingo: { corto: "Dom", largo: "Domingo" },
};

const DIA_EN_INGLES: Record<string, Dia> = {
  Monday: "lunes",
  Tuesday: "martes",
  Wednesday: "miercoles",
  Thursday: "jueves",
  Friday: "viernes",
  Saturday: "sabado",
  Sunday: "domingo",
};

export type Momento = {
  dia: Dia;
  /** Minutos transcurridos desde la medianoche. */
  minutos: number;
};

/** Día y hora actuales en la zona horaria de la radio, sin importar dónde esté el oyente. */
export function momentoEnZona(fecha: Date, zonaHoraria: string): Momento {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: zonaHoraria,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(fecha);

  const valor = (tipo: Intl.DateTimeFormatPartTypes) =>
    partes.find((parte) => parte.type === tipo)?.value ?? "";

  return {
    dia: DIA_EN_INGLES[valor("weekday")] ?? "lunes",
    minutos: Number(valor("hour")) * 60 + Number(valor("minute")),
  };
}

/** Convierte "06:30" en minutos desde la medianoche. */
export function aMinutos(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

/** Convierte "18:30" en "6:30 p. m.", el formato habitual en Venezuela. */
export function horaLegible(hora: string): string {
  const minutos = aMinutos(hora) % (24 * 60);
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  const sufijo = h < 12 ? "a. m." : "p. m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${sufijo}`;
}

/** Programas de un día, ordenados por hora de inicio. */
export function programasDelDia(programas: readonly Programa[], dia: Dia): Programa[] {
  return programas
    .filter((programa) => programa.dias.includes(dia))
    .sort((a, b) => aMinutos(a.inicio) - aMinutos(b.inicio));
}

export function estaAlAire(programa: Programa, momento: Momento): boolean {
  return (
    programa.dias.includes(momento.dia) &&
    momento.minutos >= aMinutos(programa.inicio) &&
    momento.minutos < aMinutos(programa.fin)
  );
}

export function programaActual(programas: readonly Programa[], momento: Momento): Programa | null {
  return programas.find((programa) => estaAlAire(programa, momento)) ?? null;
}

/** El siguiente programa de hoy o, si ya no quedan, el primero de mañana. */
export function programaSiguiente(programas: readonly Programa[], momento: Momento): Programa | null {
  const deHoy = programasDelDia(programas, momento.dia).find(
    (programa) => aMinutos(programa.inicio) > momento.minutos,
  );
  if (deHoy) return deHoy;

  const manana = DIAS[(DIAS.indexOf(momento.dia) + 1) % DIAS.length];
  return programasDelDia(programas, manana)[0] ?? null;
}
