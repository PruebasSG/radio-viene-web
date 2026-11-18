"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { actualizarFoto, eliminarFoto, moverFoto } from "@/app/admin/acciones";
import type { ResultadoFoto } from "@/lib/admin/tipos";
import type { Foto } from "@/lib/fotos";
import estilos from "./panel.module.css";

type Props = { foto: Foto; esPrimera: boolean; esUltima: boolean };

/** Una foto del panel: descripción, visibilidad, orden y eliminación. */
export function TarjetaFoto({ foto, esPrimera, esUltima }: Props) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [alt, setAlt] = useState(foto.alt);
  const [aviso, setAviso] = useState("");

  const ejecutar = (accion: () => Promise<ResultadoFoto>, exito = "") =>
    iniciar(async () => {
      const resultado = await accion();
      setAviso("error" in resultado ? resultado.error : exito);
      router.refresh();
    });

  const guardarAlt = () => {
    if (alt.trim() === foto.alt) return;
    ejecutar(() => actualizarFoto(foto.id, { alt }), "Descripción guardada.");
  };

  return (
    <li className={estilos.foto} data-oculta={!foto.activo || undefined} aria-busy={pendiente}>
      <div className={estilos.fotoImagen}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={foto.urlMini} alt="" width={foto.ancho} height={foto.alto} loading="lazy" />
        {!foto.activo && <span className={estilos.etiquetaOculto}>Oculta</span>}
      </div>

      <label className={estilos.campo}>
        <span className={estilos.ayuda}>¿Qué se ve en la foto?</span>
        <input
          className={estilos.entrada}
          value={alt}
          maxLength={200}
          placeholder="Por ejemplo: Locutora en la cabina"
          onChange={(evento) => setAlt(evento.target.value)}
          onBlur={guardarAlt}
          onKeyDown={(evento) => {
            if (evento.key === "Enter") {
              evento.preventDefault();
              guardarAlt();
            }
          }}
        />
      </label>

      <div className={estilos.fotoAcciones}>
        <button
          type="button"
          className={estilos.fotoBoton}
          aria-label="Mover antes"
          title="Mover antes"
          disabled={esPrimera || pendiente}
          onClick={() => ejecutar(() => moverFoto(foto.id, "antes"))}
        >
          ←
        </button>
        <button
          type="button"
          className={estilos.fotoBoton}
          aria-label="Mover después"
          title="Mover después"
          disabled={esUltima || pendiente}
          onClick={() => ejecutar(() => moverFoto(foto.id, "despues"))}
        >
          →
        </button>
        <button
          type="button"
          className={estilos.fotoBoton}
          disabled={pendiente}
          onClick={() => ejecutar(() => actualizarFoto(foto.id, { activo: !foto.activo }))}
        >
          {foto.activo ? "Ocultar" : "Mostrar"}
        </button>
        <button
          type="button"
          className={`${estilos.fotoBoton} ${estilos.fotoEliminar}`}
          disabled={pendiente}
          onClick={() => {
            if (window.confirm("¿Eliminar esta foto? Esta acción no se puede deshacer.")) {
              ejecutar(() => eliminarFoto(foto.id));
            }
          }}
        >
          Eliminar
        </button>
      </div>
      {aviso && (
        <p className={estilos.ayuda} role="status">
          {aviso}
        </p>
      )}
    </li>
  );
}
