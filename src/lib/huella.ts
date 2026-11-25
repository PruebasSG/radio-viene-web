import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { SUPABASE_URL } from "@/lib/supabase/config";

/**
 * «Huella» anónima de quien visita la web: un código cifrado a partir de su
 * conexión, su navegador y una clave secreta. No se guarda la IP, y con la
 * huella no se puede saber quién es la persona; solo sirve para que nadie
 * envíe spam ni sume dos veces la misma oración.
 *
 * La clave secreta se define en Vercel como ORACION_SECRETO (un texto largo
 * cualquiera). Sin ella se usa una de respaldo, menos segura.
 */
const SECRETO = process.env.ORACION_SECRETO || `respaldo:${SUPABASE_URL}`;

export async function calcularHuella(contexto: string): Promise<string> {
  const encabezados = await headers();
  const ip =
    encabezados.get("x-forwarded-for")?.split(",")[0]?.trim() || encabezados.get("x-real-ip") || "desconocida";
  const navegador = encabezados.get("user-agent") ?? "";
  return createHash("sha256").update(`${SECRETO}|${contexto}|${ip}|${navegador}`).digest("hex");
}
