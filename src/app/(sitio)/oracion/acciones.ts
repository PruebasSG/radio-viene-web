"use server";

import type { EstadoFormulario } from "@/lib/admin/tipos";
import { erroresPorCampo, esIdValido, esquemaPeticion } from "@/lib/admin/validacion";
import { calcularHuella } from "@/lib/huella";
import type { ResultadoOracion } from "@/lib/oracion";
import { crearClientePublico } from "@/lib/supabase/publico";

/**
 * Acciones públicas del muro de oración. Cualquiera puede usarlas, por eso:
 * validan todo en el servidor, frenan robots y solo usan las dos funciones
 * controladas de la base de datos (nunca escriben directamente en las tablas).
 */

const texto = (datos: FormData, campo: string) => String(datos.get(campo) ?? "");

/** Segundos mínimos para completar el formulario: una persona tarda más que esto; un robot, no. */
const SEGUNDOS_MINIMOS = 3;

const GRACIAS =
  "¡Gracias por confiarnos tu petición! Nuestro equipo la revisará y, en cuanto la aprobemos, aparecerá en el muro para que otros oren contigo.";

export async function enviarPeticion(_: EstadoFormulario, datos: FormData): Promise<EstadoFormulario> {
  const valores = {
    anonima: datos.get("anonima") === "on",
    nombre: texto(datos, "nombre"),
    texto: texto(datos, "texto"),
    consentimiento: datos.get("consentimiento") === "on",
  };

  // Trampas para robots: el campo invisible debe llegar vacío y el envío no puede ser instantáneo.
  // A un robot le respondemos como si todo hubiera ido bien, para no darle pistas.
  const cargado = Number(texto(datos, "cargado"));
  if (texto(datos, "sitio_web") !== "" || !cargado || Date.now() - cargado < SEGUNDOS_MINIMOS * 1000) {
    return { ok: true, mensaje: GRACIAS };
  }

  const resultado = esquemaPeticion.safeParse(valores);
  if (!resultado.success) {
    return { mensaje: "Revisa los campos marcados.", errores: erroresPorCampo(resultado.error), valores };
  }

  const supabase = crearClientePublico();
  if (!supabase) return { mensaje: "El muro de oración todavía no está disponible. Inténtalo más tarde.", valores };

  const { anonima, nombre, texto: peticion } = resultado.data;
  const { error } = await supabase.rpc("crear_peticion", {
    // Si elige el anonimato, el nombre no se envía ni se guarda.
    p_nombre: anonima ? null : nombre,
    p_texto: peticion,
    p_huella: await calcularHuella("peticion"),
  });

  if (error) {
    if (error.message.includes("demasiadas_peticiones")) {
      return {
        mensaje:
          "Ya enviaste varias peticiones en la última hora. Por favor, inténtalo más tarde o escríbenos por WhatsApp.",
        valores,
      };
    }
    console.error("Error al enviar la petición:", error.message);
    return { mensaje: "No pudimos enviar tu petición. Inténtalo de nuevo en unos minutos.", valores };
  }

  return { ok: true, mensaje: GRACIAS };
}

/** Suma «Estoy orando por ti». Una sola vez por persona y petición. */
export async function orar(peticionId: string): Promise<ResultadoOracion> {
  if (!esIdValido(peticionId)) return { error: "Petición no válida." };
  const supabase = crearClientePublico();
  if (!supabase) return { error: "No disponible en este momento." };

  const { data, error } = await supabase.rpc("orar_por", {
    p_peticion: peticionId,
    p_huella: await calcularHuella("oracion"),
  });
  if (error || typeof data !== "number") return { error: "No se pudo registrar. Inténtalo de nuevo." };
  return { oraciones: data };
}
