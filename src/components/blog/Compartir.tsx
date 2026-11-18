"use client";

import { useState } from "react";
import { IconoWhatsApp } from "@/components/iconos";
import estilos from "./blog.module.css";

/** Botones para compartir un artículo. WhatsApp primero: es como más se comparte en Venezuela. */
export function Compartir({ titulo, url }: { titulo: string; url: string }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      window.prompt("Copia este enlace:", url);
    }
  };

  return (
    <div className={estilos.compartir}>
      <p className={estilos.compartirTitulo}>Compártelo con alguien a quien le haga bien</p>
      <div className={estilos.compartirBotones}>
        <a
          className={`${estilos.compartirBoton} ${estilos.compartirWhatsApp}`}
          href={`https://wa.me/?text=${encodeURIComponent(`${titulo} ${url}`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconoWhatsApp className={estilos.compartirIcono} />
          WhatsApp
        </a>
        <a
          className={estilos.compartirBoton}
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>
        <button type="button" className={estilos.compartirBoton} onClick={copiar}>
          {copiado ? "¡Enlace copiado!" : "Copiar enlace"}
        </button>
      </div>
      <p className="solo-lectores" role="status">
        {copiado ? "Enlace copiado" : ""}
      </p>
    </div>
  );
}
