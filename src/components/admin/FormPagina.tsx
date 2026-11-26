"use client";

import { startTransition, useActionState, useState } from "react";
import type { ContenidoPagina } from "@/content/paginas";
import { ESTADO_INICIAL, type EstadoFormulario } from "@/lib/admin/tipos";
import { Aviso } from "./Aviso";
import { EditorMarkdown } from "./EditorMarkdown";
import estilos from "./panel.module.css";

type Props = {
  accion: (estado: EstadoFormulario, datos: FormData) => Promise<EstadoFormulario>;
  pagina: ContenidoPagina;
};

export function FormPagina({ accion, pagina }: Props) {
  const [estado, enviar, enviando] = useActionState(accion, ESTADO_INICIAL);
  const [descripcion, setDescripcion] = useState(pagina.descripcion);
  const [contenido, setContenido] = useState(pagina.contenido);
  const error = (campo: string) => estado.errores?.[campo];
  const largo = descripcion.trim().length;

  return (
    <form
      className={estilos.formulario}
      noValidate
      onSubmit={(evento) => {
        // Sin el reinicio automático del formulario: lo escrito se conserva siempre.
        evento.preventDefault();
        const datos = new FormData(evento.currentTarget);
        startTransition(() => enviar(datos));
      }}
    >
      {estado.mensaje && <Aviso tipo={estado.ok ? "exito" : "error"}>{estado.mensaje}</Aviso>}

      <div className={estilos.campo}>
        <label htmlFor="titulo" className={estilos.etiqueta}>
          Título
        </label>
        <input
          id="titulo"
          name="titulo"
          className={`${estilos.entrada} ${estilos.entradaTitulo}`}
          maxLength={80}
          defaultValue={(estado.valores?.titulo as string) ?? pagina.titulo}
          aria-invalid={Boolean(error("titulo"))}
        />
        {error("titulo") && <p className={estilos.error}>{error("titulo")}</p>}
      </div>

      <div className={estilos.campo}>
        <label htmlFor="descripcion" className={estilos.etiqueta}>
          Descripción para Google
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          className={estilos.entrada}
          rows={3}
          maxLength={200}
          value={descripcion}
          onChange={(evento) => setDescripcion(evento.target.value)}
          aria-describedby="ayuda-descripcion"
          aria-invalid={Boolean(error("descripcion"))}
        />
        <p id="ayuda-descripcion" className={estilos.ayuda}>
          Aparece en los resultados de Google y bajo el título de la página. {largo} caracteres{" "}
          {largo >= 110 && largo <= 160 ? "✓ (largo ideal)" : "(ideal: entre 110 y 160)"}.
        </p>
        {error("descripcion") && <p className={estilos.error}>{error("descripcion")}</p>}
      </div>

      <div className={estilos.campo}>
        <span className={estilos.etiqueta}>Texto de la página</span>
        <EditorMarkdown valor={contenido} onCambio={setContenido} error={error("contenido")} />
      </div>

      <div className={estilos.acciones}>
        <button type="submit" className={estilos.boton} disabled={enviando}>
          {enviando ? "Guardando…" : "Guardar página"}
        </button>
      </div>
    </form>
  );
}
