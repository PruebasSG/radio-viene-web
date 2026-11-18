import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Aviso } from "@/components/admin/Aviso";
import { FormIngreso } from "@/components/admin/FormIngreso";
import estilos from "@/components/admin/panel.module.css";
import { radio } from "@/content/radio";
import { obtenerAdmin } from "@/lib/admin/sesion";
import { supabaseConfigurado } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Entrar" };

export default async function PaginaIngreso() {
  if (await obtenerAdmin()) redirect("/admin");

  return (
    <main className={estilos.ingreso}>
      <div className={estilos.ingresoTarjeta}>
        <Logo alto={84} className={estilos.ingresoLogo} prioritario />
        <h1 className={estilos.ingresoMarca}>
          {radio.nombre}
          <span>Panel</span>
        </h1>
        <p className={estilos.intro}>Entra con la cuenta que te dio el responsable de la radio.</p>
        {supabaseConfigurado ? (
          <FormIngreso />
        ) : (
          <Aviso tipo="error">
            El panel todavía no está conectado a la base de datos. Faltan las variables de Supabase en Vercel.
          </Aviso>
        )}
      </div>
    </main>
  );
}
