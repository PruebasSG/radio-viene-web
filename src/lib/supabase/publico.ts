import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL, supabaseConfigurado } from "./config";

/**
 * Cliente sin sesión para leer los datos públicos (programación y datos de la
 * radio). No usa cookies, así la web pública puede guardarse en caché.
 */
export function crearClientePublico(): SupabaseClient | null {
  if (!supabaseConfigurado) return null;
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
