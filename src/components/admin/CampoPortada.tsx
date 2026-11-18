"use client";

import { useRef, useState } from "react";
import { subirImagenBlog } from "@/app/admin/acciones";
import { prepararImagen } from "@/lib/admin/imagen";
import estilos from "./panel.module.css";

export type Portada = { url: string; ancho: number; alto: number; alt: string };

type Props = {
  portada: Portada;
  onCambio: (portada: Portada) => void;
  errorAlt?: string;
};

export function CampoPortada({ portada, onCambio, errorAlt }: Props) {
  const selector = useRef<HTMLInputElement>(null);
  const [estado, setEstado] = useState("");
  const [trabajando, setTrabajando] = useState(false);

  const elegir = async (archivo: File | undefined) => {
    if (!archivo) return;
    setTrabajando(true);
    try {
      setEstado("Preparando la imagen…");
      const { archivo: listo, ancho, alto } = await prepararImagen(archivo);
      setEstado("Subiendo la imagen…");
      const datos = new FormData();
      datos.append("imagen", listo);
      const resultado = await subirImagenBlog(datos);
      if ("error" in resultado) throw new Error(resultado.error);
      onCambio({ ...portada, url: resultado.url, ancho, alto });
      setEstado("");
    } catch (problema) {
      setEstado(problema instanceof Error ? problema.message : "No se pudo subir la imagen.");
    } finally {
      setTrabajando(false);
      if (selector.current) selector.current.value = "";
    }
  };

  return (
    <fieldset className={estilos.campo} style={{ border: 0, padding: 0, margin: 0 }}>
      <legend className={estilos.etiqueta} style={{ marginBottom: "0.4rem" }}>
        Imagen de portada <span className={estilos.opcional}>(recomendada)</span>
      </legend>

      <input type="hidden" name="portadaUrl" value={portada.url} />
      <input type="hidden" name="portadaAncho" value={portada.ancho || ""} />
      <input type="hidden" name="portadaAlto" value={portada.alto || ""} />

      {portada.url ? (
        <div className={estilos.portadaVista}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={portada.url} alt="" width={portada.ancho || undefined} height={portada.alto || undefined} />
        </div>
      ) : (
        <p className={estilos.ayuda}>
          Aparece arriba del artículo y cuando alguien lo comparte en WhatsApp o Facebook. Ideal: una foto
          horizontal.
        </p>
      )}

      <div className={estilos.atajos}>
        <button
          type="button"
          className={`${estilos.boton} ${estilos.botonClaro}`}
          onClick={() => selector.current?.click()}
          disabled={trabajando}
        >
          {portada.url ? "Cambiar imagen" : "Elegir imagen"}
        </button>
        {portada.url && (
          <button
            type="button"
            className={estilos.atajo}
            onClick={() => onCambio({ url: "", ancho: 0, alto: 0, alt: "" })}
          >
            Quitar imagen
          </button>
        )}
      </div>
      <input
        ref={selector}
        type="file"
        accept="image/*"
        hidden
        onChange={(evento) => elegir(evento.target.files?.[0])}
      />
      {estado && (
        <p className={estilos.ayuda} role="status">
          {estado}
        </p>
      )}

      {portada.url && (
        <div className={estilos.campo}>
          <label htmlFor="portadaAlt" className={estilos.etiqueta}>
            ¿Qué se ve en la imagen?
          </label>
          <input
            id="portadaAlt"
            name="portadaAlt"
            className={estilos.entrada}
            maxLength={200}
            value={portada.alt}
            onChange={(evento) => onCambio({ ...portada, alt: evento.target.value })}
            placeholder="Por ejemplo: Una familia leyendo la Biblia en la sala"
            aria-invalid={Boolean(errorAlt)}
          />
          {errorAlt && <p className={estilos.error}>{errorAlt}</p>}
        </div>
      )}
    </fieldset>
  );
}
