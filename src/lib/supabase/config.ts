/**
 * Conexión con Supabase. Las claves solo existen en el servidor de la web:
 * nunca llegan al navegador de los visitantes.
 */
export const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";

/** Falso mientras no se configuren las variables en Vercel. */
export const supabaseConfigurado = SUPABASE_URL !== "" && SUPABASE_KEY !== "";
