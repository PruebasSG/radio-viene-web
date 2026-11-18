import { cache } from "react";
import { programacionRespaldo, type Dia, type Programa } from "@/content/programacion";
import { ajustesRespaldo, type Ajustes, type RedSocial } from "@/content/radio";
import { DIAS } from "@/lib/horario";
import { crearClientePublico } from "@/lib/supabase/publico";

/**
 * Lectura de los datos públicos de la web.
 * Si Supabase no está configurado o falla, se usa el contenido de respaldo:
 * la web pública nunca se cae por culpa de la base de datos.
 */

export type FilaPrograma = {
  id: string;
  nombre: string;
  descripcion: string;
  conductor: string | null;
  dias: string[];
  inicio: string;
  fin: string;
  activo: boolean;
};

/** "18:30:00" → "18:30" */
export const horaCorta = (hora: string) => hora.slice(0, 5);

const esDia = (valor: string): valor is Dia => (DIAS as readonly string[]).includes(valor);

export function filaAPrograma(fila: FilaPrograma): Programa {
  return {
    id: fila.id,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    conductor: fila.conductor,
    dias: fila.dias.filter(esDia),
    inicio: horaCorta(fila.inicio),
    fin: horaCorta(fila.fin),
  };
}

export const obtenerProgramacion = cache(async (): Promise<Programa[]> => {
  const supabase = crearClientePublico();
  if (!supabase) return programacionRespaldo;

  const { data, error } = await supabase
    .from("programas")
    .select("id, nombre, descripcion, conductor, dias, inicio, fin, activo")
    .eq("activo", true)
    .order("inicio");

  if (error || !data) {
    console.error("No se pudo leer la programación:", error?.message);
    return programacionRespaldo;
  }
  return (data as FilaPrograma[]).map(filaAPrograma);
});

function redesValidas(valor: unknown): RedSocial[] {
  if (!Array.isArray(valor)) return [];
  return valor.filter(
    (red): red is RedSocial =>
      typeof red?.nombre === "string" && typeof red?.url === "string" && red.url.startsWith("https://"),
  );
}

const COLUMNAS_BASE = "lema, descripcion, whatsapp, correo, redes";
const COLUMNAS_PORTADA = "titular, titular_destacado, frases";

/** Si aún no se ejecutó fotos.sql, las columnas de la portada no existen: usamos las de respaldo. */
const faltaColumna = (codigo?: string) => codigo === "42703" || codigo === "PGRST204";

function frasesValidas(valor: unknown): string[] {
  if (!Array.isArray(valor)) return ajustesRespaldo.frases;
  return valor.filter((frase): frase is string => typeof frase === "string" && frase.trim() !== "");
}

export const obtenerAjustes = cache(async (): Promise<Ajustes> => {
  const supabase = crearClientePublico();
  if (!supabase) return ajustesRespaldo;

  let respuesta = await supabase
    .from("ajustes")
    .select(`${COLUMNAS_BASE}, ${COLUMNAS_PORTADA}`)
    .eq("id", 1)
    .maybeSingle();
  if (faltaColumna(respuesta.error?.code)) {
    respuesta = await supabase.from("ajustes").select(COLUMNAS_BASE).eq("id", 1).maybeSingle();
  }

  const { data, error } = respuesta;
  if (error || !data) {
    if (error) console.error("No se pudieron leer los datos de la radio:", error.message);
    return ajustesRespaldo;
  }
  const fila = data as Record<string, unknown>;
  return {
    titular: typeof fila.titular === "string" ? fila.titular : ajustesRespaldo.titular,
    titularDestacado:
      typeof fila.titular_destacado === "string" ? fila.titular_destacado : ajustesRespaldo.titularDestacado,
    frases: "frases" in fila ? frasesValidas(fila.frases) : ajustesRespaldo.frases,
    lema: String(fila.lema),
    descripcion: String(fila.descripcion),
    whatsapp: String(fila.whatsapp),
    correo: String(fila.correo),
    redes: redesValidas(fila.redes),
  };
});
