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

export const obtenerAjustes = cache(async (): Promise<Ajustes> => {
  const supabase = crearClientePublico();
  if (!supabase) return ajustesRespaldo;

  const { data, error } = await supabase
    .from("ajustes")
    .select("lema, descripcion, whatsapp, correo, redes")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("No se pudieron leer los datos de la radio:", error.message);
    return ajustesRespaldo;
  }
  return {
    lema: data.lema,
    descripcion: data.descripcion,
    whatsapp: data.whatsapp,
    correo: data.correo,
    redes: redesValidas(data.redes),
  };
});
