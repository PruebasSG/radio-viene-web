"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { eliminarPeticion, moderarPeticion } from "@/app/admin/acciones";
import type { ResultadoFoto } from "@/lib/admin/tipos";
import estilos from "./panel.module.css";

export type PeticionModerable = {
  id: string;
  nombre: string | null;
  texto: string;
  estado: "pendiente" | "publicada" | "archivada";
  oraciones: number;
  creadoEn: string;
};

/** Una petición del panel: se puede corregir antes de publicarla, archivar o eliminar. */
export function TarjetaModeracion({ peticion, fecha }: { peticion: PeticionModerable; fecha: string }) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [texto, setTexto] = useState(peticion.texto);
  const [nombre, setNombre] = useState(peticion.nombre ?? "");
  const [aviso, setAviso] = useState("");

  const cambiado = texto.trim() !== peticion.texto || (nombre.trim() || null) !== peticion.nombre;

  const ejecutar = (accion: () => Promise<ResultadoFoto>, exito: string) =>
    iniciar(async () => {
      const resultado = await accion();
      setAviso("error" in resultado ? resultado.error : exito);
      router.refresh();
    });

  const conCambios = (estado?: PeticionModerable["estado"]) => () =>
    moderarPeticion(peticion.id, { texto, nombre, ...(estado ? { estado } : {}) });

  return (
    <li className={estilos.moderacion} data-estado={peticion.estado} aria-busy={pendiente}>
      <div className={estilos.moderacionCabecera}>
        <span className={estilos.moderacionFecha}>Recibida el {fecha}</span>
        {peticion.estado === "publicada" && (
          <span className={estilos.moderacionOraciones}>🙏 {peticion.oraciones}</span>
        )}
      </div>

      <label className={estilos.campo}>
        <span className={estilos.ayuda}>Petición (puedes corregirla para quitar datos personales)</span>
        <textarea
          className={estilos.entrada}
          rows={4}
          maxLength={600}
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
        />
      </label>

      <label className={estilos.campo}>
        <span className={estilos.ayuda}>Nombre (vacío = anónima)</span>
        <input
          className={estilos.entrada}
          maxLength={60}
          value={nombre}
          placeholder="Anónima"
          onChange={(evento) => setNombre(evento.target.value)}
        />
      </label>

      <div className={estilos.fotoAcciones}>
        {peticion.estado === "pendiente" && (
          <button
            type="button"
            className={`${estilos.boton} ${estilos.botonDorado}`}
            disabled={pendiente}
            onClick={() => ejecutar(conCambios("publicada"), "Publicada en el muro.")}
          >
            Publicar
          </button>
        )}
        {peticion.estado === "publicada" && (
          <>
            <button
              type="button"
              className={estilos.boton}
              disabled={pendiente || !cambiado}
              onClick={() => ejecutar(conCambios(), "Cambios guardados.")}
            >
              Guardar cambios
            </button>
            <button
              type="button"
              className={estilos.fotoBoton}
              disabled={pendiente}
              onClick={() => ejecutar(() => moderarPeticion(peticion.id, { estado: "archivada" }), "Archivada.")}
            >
              Archivar
            </button>
          </>
        )}
        {peticion.estado === "archivada" && (
          <button
            type="button"
            className={estilos.boton}
            disabled={pendiente}
            onClick={() => ejecutar(conCambios("publicada"), "Publicada de nuevo.")}
          >
            Volver a publicar
          </button>
        )}
        <button
          type="button"
          className={`${estilos.fotoBoton} ${estilos.fotoEliminar}`}
          disabled={pendiente}
          onClick={() => {
            if (window.confirm("¿Eliminar esta petición? Esta acción no se puede deshacer.")) {
              ejecutar(() => eliminarPeticion(peticion.id), "Eliminada.");
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
