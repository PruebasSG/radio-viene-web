"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import { CATEGORIAS_BLOG } from "@/content/blog";
import { ESTADO_INICIAL, type EstadoFormulario } from "@/lib/admin/tipos";
import { crearSlug } from "@/lib/blog";
import { useMontado } from "@/lib/montado";
import { Aviso } from "./Aviso";
import { CampoPortada, type Portada } from "./CampoPortada";
import { EditorMarkdown } from "./EditorMarkdown";
import { VistaGoogle } from "./VistaGoogle";
import estilos from "./panel.module.css";

export type ArticuloEditable = {
  titulo: string;
  slug: string;
  extracto: string;
  contenido: string;
  categoria: string;
  autor: string;
  portada: Portada;
  estado: "borrador" | "publicado";
  publicadoEn: string | null;
};

type Props = {
  accion: (estado: EstadoFormulario, datos: FormData) => Promise<EstadoFormulario>;
  articulo?: ArticuloEditable;
  /** Dominio de la web, para la vista previa de Google. */
  sitio: string;
};

/** "2026-11-17T14:30:00Z" → "2026-11-17T10:30" en la hora del navegador. */
function aFechaLocal(iso: string | null): string {
  if (!iso) return "";
  const fecha = new Date(iso);
  const desfase = fecha.getTimezoneOffset() * 60_000;
  return new Date(fecha.getTime() - desfase).toISOString().slice(0, 16);
}

export function FormArticulo({ accion, articulo, sitio }: Props) {
  const [estado, enviar, enviando] = useActionState(accion, ESTADO_INICIAL);
  const montado = useMontado();

  const [titulo, setTitulo] = useState(articulo?.titulo ?? "");
  const [slug, setSlug] = useState(articulo?.slug ?? "");
  // Mientras no se toque a mano, la dirección se escribe sola a partir del título.
  const [slugManual, setSlugManual] = useState(Boolean(articulo));
  const [extracto, setExtracto] = useState(articulo?.extracto ?? "");
  const [contenido, setContenido] = useState(articulo?.contenido ?? "");
  const [portada, setPortada] = useState<Portada>(articulo?.portada ?? { url: "", ancho: 0, alto: 0, alt: "" });
  const [publicar, setPublicar] = useState(articulo?.estado === "publicado");
  const [fechaLocal, setFechaLocal] = useState<string | null>(null);

  const error = (campo: string) => estado.errores?.[campo];
  const valorFecha = fechaLocal ?? (montado ? aFechaLocal(articulo?.publicadoEn ?? null) : "");
  const yaPublicado = articulo?.estado === "publicado";

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
      {estado.mensaje && <Aviso tipo="error">{estado.mensaje}</Aviso>}

      <div className={estilos.campo}>
        <label htmlFor="titulo" className={estilos.etiqueta}>
          Título
        </label>
        <input
          id="titulo"
          name="titulo"
          className={`${estilos.entrada} ${estilos.entradaTitulo}`}
          maxLength={120}
          value={titulo}
          onChange={(evento) => {
            setTitulo(evento.target.value);
            if (!slugManual) setSlug(crearSlug(evento.target.value));
          }}
          aria-invalid={Boolean(error("titulo"))}
        />
        {error("titulo") && <p className={estilos.error}>{error("titulo")}</p>}
      </div>

      <div className={estilos.campo}>
        <label htmlFor="slug" className={estilos.etiqueta}>
          Dirección del artículo
        </label>
        <div className={estilos.prefijoCampo}>
          <span aria-hidden="true">{sitio}/blog/</span>
          <input
            id="slug"
            name="slug"
            className={estilos.entrada}
            maxLength={100}
            value={slug}
            onChange={(evento) => {
              setSlugManual(true);
              setSlug(crearSlug(evento.target.value) + (evento.target.value.endsWith("-") ? "-" : ""));
            }}
            onBlur={() => setSlug(crearSlug(slug))}
            aria-invalid={Boolean(error("slug"))}
            aria-describedby="ayuda-slug"
          />
        </div>
        <p id="ayuda-slug" className={estilos.ayuda}>
          {yaPublicado
            ? "Ojo: si cambias la dirección de un artículo ya publicado, los enlaces que se hayan compartido dejarán de funcionar."
            : "Se escribe sola a partir del título. Corta y clara es mejor para Google."}
        </p>
        {error("slug") && <p className={estilos.error}>{error("slug")}</p>}
      </div>

      <div className={estilos.dosColumnas}>
        <div className={estilos.campo}>
          <label htmlFor="categoria" className={estilos.etiqueta}>
            Categoría
          </label>
          <select
            id="categoria"
            name="categoria"
            className={estilos.entrada}
            defaultValue={articulo?.categoria ?? CATEGORIAS_BLOG[0]}
          >
            {CATEGORIAS_BLOG.map((categoria) => (
              <option key={categoria}>{categoria}</option>
            ))}
          </select>
        </div>
        <div className={estilos.campo}>
          <label htmlFor="autor" className={estilos.etiqueta}>
            Autor <span className={estilos.opcional}>(opcional)</span>
          </label>
          <input
            id="autor"
            name="autor"
            className={estilos.entrada}
            maxLength={80}
            defaultValue={articulo?.autor ?? ""}
          />
        </div>
      </div>

      <div className={estilos.campo}>
        <label htmlFor="extracto" className={estilos.etiqueta}>
          Extracto
        </label>
        <textarea
          id="extracto"
          name="extracto"
          className={estilos.entrada}
          maxLength={300}
          rows={3}
          value={extracto}
          onChange={(evento) => setExtracto(evento.target.value)}
          aria-invalid={Boolean(error("extracto"))}
          aria-describedby="ayuda-extracto"
        />
        <p id="ayuda-extracto" className={estilos.ayuda}>
          Una o dos frases que inviten a leer. Aparece en Google, en el blog y al compartir.
        </p>
        {error("extracto") && <p className={estilos.error}>{error("extracto")}</p>}
      </div>

      <CampoPortada portada={portada} onCambio={setPortada} errorAlt={error("portadaAlt")} />

      <div className={estilos.campo}>
        <span className={estilos.etiqueta}>Texto del artículo</span>
        <EditorMarkdown valor={contenido} onCambio={setContenido} error={error("contenido")} />
      </div>

      <VistaGoogle sitio={sitio} slug={slug} titulo={titulo} extracto={extracto} />

      <fieldset className={`${estilos.campo} ${estilos.publicacion}`}>
        <legend className={estilos.etiqueta}>Publicación</legend>
        <input type="hidden" name="estado" value={publicar ? "publicado" : "borrador"} />
        <label className={estilos.casilla}>
          <input type="radio" name="estadoVisible" checked={!publicar} onChange={() => setPublicar(false)} />
          <span>
            <span className={estilos.etiqueta}>Borrador</span>
            <br />
            <span className={estilos.ayuda}>Solo lo ven los administradores. Puedes seguir editándolo.</span>
          </span>
        </label>
        <label className={estilos.casilla}>
          <input type="radio" name="estadoVisible" checked={publicar} onChange={() => setPublicar(true)} />
          <span>
            <span className={estilos.etiqueta}>Publicado</span>
            <br />
            <span className={estilos.ayuda}>Visible para todos en la web y en Google.</span>
          </span>
        </label>

        {publicar && (
          <div className={estilos.campo}>
            <label htmlFor="fechaPublicacion" className={estilos.etiqueta}>
              Fecha de publicación <span className={estilos.opcional}>(opcional)</span>
            </label>
            <input
              id="fechaPublicacion"
              type="datetime-local"
              className={estilos.entrada}
              value={valorFecha}
              onChange={(evento) => setFechaLocal(evento.target.value)}
              aria-describedby="ayuda-fecha"
            />
            <p id="ayuda-fecha" className={estilos.ayuda}>
              Déjala vacía para publicar al guardar. Si eliges una fecha futura, aparecerá en la web ese día.
            </p>
            {error("publicadoEn") && <p className={estilos.error}>{error("publicadoEn")}</p>}
          </div>
        )}
        <input
          type="hidden"
          name="publicadoEn"
          value={publicar && valorFecha ? new Date(valorFecha).toISOString() : ""}
        />
      </fieldset>

      <div className={estilos.acciones}>
        <button type="submit" className={estilos.boton} disabled={enviando}>
          {enviando ? "Guardando…" : publicar ? "Guardar y publicar" : "Guardar borrador"}
        </button>
        <Link href="/admin/blog" className={estilos.enlace}>
          Volver al blog
        </Link>
      </div>
    </form>
  );
}
