import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { SUPABASE_KEY, SUPABASE_URL, supabaseConfigurado } from "./config";

/**
 * Cliente con la sesión del administrador, guardada en cookies seguras.
 * Se crea uno nuevo en cada petición: nunca se comparte entre usuarios.
 */
export async function crearClienteServidor(): Promise<SupabaseClient | null> {
  if (!supabaseConfigurado) return null;
  const almacen = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => almacen.getAll(),
      setAll: (lista) => {
        try {
          lista.forEach(({ name, value, options }) => almacen.set(name, value, options));
        } catch {
          // Las páginas no pueden escribir cookies; el proxy (src/proxy.ts) renueva la sesión.
        }
      },
    },
  });
}
