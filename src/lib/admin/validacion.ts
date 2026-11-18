import { z } from "zod";
import { CATEGORIAS_BLOG } from "@/content/blog";
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

// ---------- Blog ----------

/** Direcciones que no puede usar un artículo porque ya las usa la web. */
const SLUGS_RESERVADOS = ["pagina"];

export const esquemaArticulo = z
  .object({
    titulo: z.string().trim().min(1, "Escribe el título.").max(120, "Máximo 120 caracteres."),
    slug: z
      .string()
      .trim()
      .min(1, "Escribe la dirección del artículo.")
      .max(100, "Máximo 100 caracteres.")
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Usa solo minúsculas sin tildes, números y guiones.")
      .refine((slug) => !SLUGS_RESERVADOS.includes(slug), "Esa dirección está reservada. Elige otra."),
    extracto: z.string().trim().max(300, "Máximo 300 caracteres."),
    contenido: z.string().max(100_000, "El artículo es demasiado largo."),
    categoria: z.enum(CATEGORIAS_BLOG, { message: "Elige una categoría." }),
    autor: z.string().trim().max(80, "Máximo 80 caracteres."),
    portadaUrl: z.string().trim().max(500),
    portadaAncho: z.coerce.number().int().min(0).max(4000),
    portadaAlto: z.coerce.number().int().min(0).max(4000),
    portadaAlt: z.string().trim().max(200, "Máximo 200 caracteres."),
    estado: z.enum(["borrador", "publicado"]),
    publicadoEn: z
      .string()
      .trim()
      .refine((valor) => valor === "" || !Number.isNaN(Date.parse(valor)), "Elige una fecha válida."),
  })
  .superRefine((datos, contexto) => {
    if (datos.estado === "publicado") {
      if (datos.extracto === "") {
        contexto.addIssue({
          code: "custom",
          path: ["extracto"],
          message: "Escribe un extracto antes de publicar: es el texto que muestra Google.",
        });
      }
      if (datos.contenido.trim() === "") {
        contexto.addIssue({ code: "custom", path: ["contenido"], message: "El artículo está vacío." });
      }
    }
    if (datos.portadaUrl !== "" && datos.portadaAlt === "") {
      contexto.addIssue({
        code: "custom",
        path: ["portadaAlt"],
        message: "Describe la imagen en pocas palabras. Ayuda a Google y a las personas ciegas.",
      });
    }
  });

/** Comprueba por sus primeros bytes que el archivo de verdad es una imagen JPG, PNG o WebP. */
export function esImagenReal(bytes: Uint8Array): boolean {
  const empiezaCon = (...firma: number[]) => firma.every((byte, i) => bytes[i] === byte);
  const jpg = empiezaCon(0xff, 0xd8, 0xff);
  const png = empiezaCon(0x89, 0x50, 0x4e, 0x47);
  const webp =
    empiezaCon(0x52, 0x49, 0x46, 0x46) && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  return jpg || png || webp;
}
