import { z } from "zod";
import { REDES_DISPONIBLES } from "@/content/radio";

/**
 * Reglas de validación del panel. Se aplican en el servidor antes de guardar,
 * y la base de datos vuelve a comprobarlas con sus propias restricciones.
 */

export const DIAS_SEMANA = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"] as const;

const hora = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Elige una hora válida.");

export const esquemaIngreso = z.object({
  email: z.email("Escribe un correo válido."),
  password: z.string().min(1, "Escribe tu contraseña.").max(200),
});

export const esquemaPrograma = z.object({
  nombre: z.string().trim().min(1, "Escribe el nombre del programa.").max(80, "Máximo 80 caracteres."),
  descripcion: z.string().trim().max(300, "Máximo 300 caracteres."),
  conductor: z.string().trim().max(80, "Máximo 80 caracteres."),
  dias: z.array(z.enum(DIAS_SEMANA)).min(1, "Elige al menos un día."),
  inicio: hora,
  fin: hora,
  activo: z.boolean(),
});

const urlRed = z
  .string()
  .trim()
  .max(300, "El enlace es demasiado largo.")
  .refine((valor) => valor === "" || /^https:\/\/[^\s]+\.[^\s]+$/.test(valor), {
    message: "Pega el enlace completo, empezando por https://",
  });

export const esquemaAjustes = z.object({
  lema: z.string().trim().min(1, "Escribe el lema.").max(120, "Máximo 120 caracteres."),
  descripcion: z.string().trim().min(1, "Escribe la descripción.").max(400, "Máximo 400 caracteres."),
  whatsapp: z
    .string()
    .transform((valor) => valor.replace(/\D/g, ""))
    .refine((valor) => valor === "" || (valor.length >= 8 && valor.length <= 15), {
      message: "Escribe el número completo con código de país, por ejemplo 58 412 690 9569.",
    }),
  correo: z
    .string()
    .trim()
    .max(120)
    .refine((valor) => valor === "" || z.email().safeParse(valor).success, {
      message: "Escribe un correo válido o déjalo vacío.",
    }),
  redes: z.object(Object.fromEntries(REDES_DISPONIBLES.map((red) => [red, urlRed])) as Record<
    (typeof REDES_DISPONIBLES)[number],
    typeof urlRed
  >),
});

export const esIdValido = (id: string) => z.uuid().safeParse(id).success;

/** Convierte los errores de Zod en { campo: "mensaje" }. */
export function erroresPorCampo(error: z.ZodError): Record<string, string> {
  const errores: Record<string, string> = {};
  for (const problema of error.issues) {
    const campo = problema.path.join(".");
    errores[campo] ??= problema.message;
  }
  return errores;
}
