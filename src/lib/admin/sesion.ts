import { redirect } from "next/navigation";
import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { crearClienteServidor } from "@/lib/supabase/servidor";

export type Admin = {
  supabase: SupabaseClient;
  email: string;
};

/**
 * Verifica la sesión contra Supabase (no solo la cookie) y que la persona
 * figure como administradora. Devuelve null si no tiene acceso.
 */
export const obtenerAdmin = cache(async (): Promise<Admin | null> => {
  const supabase = await crearClienteServidor();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: esAdmin, error } = await supabase.rpc("es_admin");
  if (error || esAdmin !== true) return null;

  return { supabase, email: user.email ?? "" };
});

/** Para páginas y acciones del panel: si no hay acceso, envía al inicio de sesión. */
export async function exigirAdmin(): Promise<Admin> {
  const admin = await obtenerAdmin();
  if (!admin) redirect("/admin/ingresar");
  return admin;
}
