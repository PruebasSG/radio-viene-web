"use client";

import { useActionState } from "react";
import { ingresar } from "@/app/admin/acciones";
import { ESTADO_INICIAL } from "@/lib/admin/tipos";
import { Aviso } from "./Aviso";
import estilos from "./panel.module.css";

export function FormIngreso() {
  const [estado, enviar, enviando] = useActionState(ingresar, ESTADO_INICIAL);

  return (
    <form action={enviar} className={estilos.formulario}>
      {estado.mensaje && <Aviso tipo="error">{estado.mensaje}</Aviso>}

      <div className={estilos.campo}>
        <label htmlFor="email" className={estilos.etiqueta}>
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={estilos.entrada}
          defaultValue={(estado.valores?.email as string) ?? ""}
        />
      </div>

      <div className={estilos.campo}>
        <label htmlFor="password" className={estilos.etiqueta}>
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={estilos.entrada}
        />
      </div>

      <button type="submit" className={estilos.boton} disabled={enviando}>
        {enviando ? "Entrando…" : "Entrar al panel"}
      </button>
    </form>
  );
}
