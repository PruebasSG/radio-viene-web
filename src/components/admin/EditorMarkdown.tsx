"use client";

import { useRef, useState } from "react";
import { subirImagenBlog } from "@/app/admin/acciones";
import { ContenidoArticulo } from "@/components/blog/ContenidoArticulo";
import { prepararImagen } from "@/lib/admin/imagen";
import estilos from "./panel.module.css";

type Formato = "subtitulo" | "negrita" | "cursiva" | "lista" | "cita" | "enlace";

const BOTONES: { formato: Formato; etiqueta: string; titulo: string }[] = [
  { formato: "subtitulo", etiqueta: "Subtítulo", titulo: "Subtítulo" },
  { formato: "negrita", etiqueta: "N", titulo: "Negrita" },
  { formato: "cursiva", etiqueta: "C", titulo: "Cursiva" },
  { formato: "lista", etiqueta: "• Lista", titulo: "Lista" },
  { formato: "cita", etiqueta: "❝ Cita", titulo: "Cita o versículo" },
  { formato: "enlace", etiqueta: "Enlace", titulo: "Enlace" },
];

type Props = {
  valor: string;
  onCambio: (texto: string) => void;
  error?: string;
};

/**
 * Editor sencillo: los botones escriben las marcas de formato por ti,
 * y la pestaña «Vista previa» muestra cómo quedará el artículo.
 */
export function EditorMarkdown({ valor, onCambio, error }: Props) {
  const area = useRef<HTMLTextAreaElement>(null);
  const selectorImagen = useRef<HTMLInputElement>(null);
  const [pestana, setPestana] = useState<"escribir" | "vista">("escribir");
  const [estadoImagen, setEstadoImagen] = useState("");

  /** Rodea lo seleccionado con marcas, por ejemplo **negrita**. */
  const envolver = (antes: string, despues: string, ejemplo: string) => {
    const campo = area.current;
    if (!campo) return;
    const { selectionStart: inicio, selectionEnd: fin } = campo;
    const seleccion = valor.slice(inicio, fin) || ejemplo;
    onCambio(valor.slice(0, inicio) + antes + seleccion + despues + valor.slice(fin));
    requestAnimationFrame(() => {
      campo.focus();
      campo.setSelectionRange(inicio + antes.length, inicio + antes.length + seleccion.length);
    });
  };

  /** Añade una marca al comienzo de cada línea seleccionada, por ejemplo "- " para listas. */
  const prefijar = (prefijo: string, ejemplo: string) => {
    const campo = area.current;
    if (!campo) return;
    const { selectionStart: inicio, selectionEnd: fin } = campo;
    const comienzoLinea = valor.lastIndexOf("\n", inicio - 1) + 1;
    const bloque = valor.slice(comienzoLinea, fin) || ejemplo;
    const prefijado = bloque
      .split("\n")
      .map((linea) => prefijo + linea)
      .join("\n");
    onCambio(valor.slice(0, comienzoLinea) + prefijado + valor.slice(Math.max(fin, comienzoLinea)));
    requestAnimationFrame(() => {
      campo.focus();
      campo.setSelectionRange(comienzoLinea + prefijado.length, comienzoLinea + prefijado.length);
    });
  };

  const insertar = (texto: string) => {
    const campo = area.current;
    const posicion = campo?.selectionStart ?? valor.length;
    onCambio(valor.slice(0, posicion) + texto + valor.slice(posicion));
  };

  const elegirImagen = async (archivo: File | undefined) => {
    if (!archivo) return;
    try {
      setEstadoImagen("Preparando la imagen…");
      const { archivo: listo } = await prepararImagen(archivo);
      setEstadoImagen("Subiendo la imagen…");
      const datos = new FormData();
      datos.append("imagen", listo);
      const resultado = await subirImagenBlog(datos);
      if ("error" in resultado) throw new Error(resultado.error);
      const descripcion =
        window.prompt("Describe la imagen en pocas palabras (ayuda a Google y a personas ciegas):", "") ?? "";
      insertar(`\n\n![${descripcion.replace(/[[\]]/g, "")}](${resultado.url})\n\n`);
      setEstadoImagen("Imagen añadida.");
    } catch (problema) {
      setEstadoImagen(problema instanceof Error ? problema.message : "No se pudo añadir la imagen.");
    } finally {
      if (selectorImagen.current) selectorImagen.current.value = "";
    }
  };

  const aplicarFormato = (formato: Formato) => {
    switch (formato) {
      case "subtitulo":
        return prefijar("## ", "Subtítulo");
      case "negrita":
        return envolver("**", "**", "texto en negrita");
      case "cursiva":
        return envolver("_", "_", "texto en cursiva");
      case "lista":
        return prefijar("- ", "Elemento de la lista");
      case "cita":
        return prefijar("> ", "Texto de la cita");
      case "enlace":
        return envolver("[", "](https://)", "texto del enlace");
    }
  };

  return (
    <div className={estilos.editor}>
      <div className={estilos.editorPestanas} role="tablist" aria-label="Modo del editor">
        <button
          type="button"
          role="tab"
          aria-selected={pestana === "escribir"}
          onClick={() => setPestana("escribir")}
        >
          Escribir
        </button>
        <button type="button" role="tab" aria-selected={pestana === "vista"} onClick={() => setPestana("vista")}>
          Vista previa
        </button>
      </div>

      {pestana === "escribir" ? (
        <>
          <div className={estilos.editorBarra} role="toolbar" aria-label="Formato">
            {BOTONES.map((boton) => (
              <button
                key={boton.formato}
                type="button"
                title={boton.titulo}
                aria-label={boton.titulo}
                onClick={() => aplicarFormato(boton.formato)}
                data-negrita={boton.formato === "negrita" || undefined}
                data-cursiva={boton.formato === "cursiva" || undefined}
              >
                {boton.etiqueta}
              </button>
            ))}
            <button type="button" title="Imagen" onClick={() => selectorImagen.current?.click()}>
              🖼 Imagen
            </button>
            <input
              ref={selectorImagen}
              type="file"
              accept="image/*"
              hidden
              onChange={(evento) => elegirImagen(evento.target.files?.[0])}
            />
          </div>
          <textarea
            ref={area}
            id="contenido"
            name="contenido"
            className={`${estilos.entrada} ${estilos.editorTexto}`}
            value={valor}
            onChange={(evento) => onCambio(evento.target.value)}
            aria-invalid={Boolean(error)}
            aria-label="Texto del artículo"
          />
          {estadoImagen && (
            <p className={estilos.ayuda} role="status">
              {estadoImagen}
            </p>
          )}
        </>
      ) : (
        <div className={estilos.editorVista}>
          <input type="hidden" name="contenido" value={valor} />
          {valor.trim() ? (
            <ContenidoArticulo texto={valor} />
          ) : (
            <p className={estilos.ayuda}>Todavía no has escrito nada.</p>
          )}
        </div>
      )}
      {error && <p className={estilos.error}>{error}</p>}
    </div>
  );
}
