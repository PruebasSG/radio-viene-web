"use client";

import { useState, useTransition } from "react";
import { orar } from "@/app/(sitio)/oracion/acciones";
import { marcarOracion, useOracionesHechas } from "@/lib/oraciones-hechas";
import estilos from "./muro.module.css";

/** «🙏 Estoy orando»: un toque por persona y petición, sin registrarse. */
export function BotonOrar({ id, inicial }: { id: string; inicial: number }) {
  const hechas = useOracionesHechas();
  const [total, setTotal] = useState(inicial);
  const [pendiente, iniciar] = useTransition();
  const orando = hechas.includes(id);
  // La página puede venir de la caché con un número algo anterior: si ya oró, cuenta al menos su oración.
  const mostrado = orando ? Math.max(total, 1) : total;

  const pulsar = () => {
    if (orando) return;
    // Respuesta inmediata en pantalla; luego confirmamos con el servidor.
    marcarOracion(id, true);
    setTotal((actual) => actual + 1);
    iniciar(async () => {
      const resultado = await orar(id);
      if ("error" in resultado) {
        marcarOracion(id, false);
        setTotal((actual) => Math.max(0, actual - 1));
      } else {
        setTotal(resultado.oraciones);
      }
    });
  };

  return (
    <button
      type="button"
      className={estilos.orar}
      data-orando={orando || undefined}
      aria-pressed={orando}
      onClick={pulsar}
      disabled={pendiente}
    >
      <span className={estilos.orarManos} aria-hidden="true">
        🙏
      </span>
      <span>{orando ? "Orando contigo" : "Estoy orando"}</span>
      <span className={estilos.orarTotal} aria-label={`${mostrado} ${mostrado === 1 ? "persona ora" : "personas oran"}`}>
        {mostrado}
      </span>
    </button>
  );
}
