"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { enviarPeticion } from "@/app/(sitio)/oracion/acciones";
import { ESTADO_INICIAL } from "@/lib/admin/tipos";
import estilos from "./muro.module.css";

const MAXIMO = 600;

export function FormPeticion() {
  const [estado, enviar, enviando] = useActionState(enviarPeticion, ESTADO_INICIAL);
  const [anonima, setAnonima] = useState(false);
  const [texto, setTexto] = useState("");
  const [otra, setOtra] = useState(false);
  // Momento en que se abrió el formulario: un envío instantáneo delata a un robot.
  const abierto = useRef(0);
  useEffect(() => {
    abierto.current = Date.now();
  }, []);

  const error = (campo: string) => estado.errores?.[campo];

  if (estado.ok && !otra) {
    return (
      <div className={estilos.gracias} role="status">
        <p className={estilos.graciasTitulo}>🙏 Recibimos tu petición</p>
        <p>{estado.mensaje}</p>
        <button
          type="button"
          className={estilos.enlaceBoton}
          onClick={() => {
            setTexto("");
            setOtra(true);
          }}
        >
          Enviar otra petición
        </button>
      </div>
    );
  }

  return (
    <form
      className={estilos.formulario}
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault();
        const datos = new FormData(evento.currentTarget);
        datos.set("cargado", String(abierto.current));
        setOtra(false);
        startTransition(() => enviar(datos));
      }}
    >
      {estado.mensaje && !estado.ok && (
        <p className={estilos.error} role="alert">
          {estado.mensaje}
        </p>
      )}

      <div className={estilos.campo}>
        <label htmlFor="texto" className={estilos.etiqueta}>
          ¿Por qué podemos orar?
        </label>
        <textarea
          id="texto"
          name="texto"
          rows={5}
          maxLength={MAXIMO}
          className={estilos.entrada}
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          aria-invalid={Boolean(error("texto"))}
          aria-describedby="ayuda-texto"
        />
        <p id="ayuda-texto" className={estilos.ayuda}>
          {texto.length}/{MAXIMO}. Por respeto, no incluyas apellidos, teléfonos ni datos de otras personas.
        </p>
        {error("texto") && <p className={estilos.error}>{error("texto")}</p>}
      </div>

      <label className={estilos.casilla}>
        <input type="checkbox" name="anonima" checked={anonima} onChange={(e) => setAnonima(e.target.checked)} />
        Prefiero que sea anónima
      </label>

      {!anonima && (
        <div className={estilos.campo}>
          <label htmlFor="nombre" className={estilos.etiqueta}>
            Tu nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            maxLength={60}
            autoComplete="given-name"
            className={estilos.entrada}
            defaultValue={(estado.valores?.nombre as string) ?? ""}
            aria-invalid={Boolean(error("nombre"))}
            aria-describedby="ayuda-nombre"
          />
          <p id="ayuda-nombre" className={estilos.ayuda}>
            Basta con tu nombre de pila. Es lo que se verá en el muro.
          </p>
          {error("nombre") && <p className={estilos.error}>{error("nombre")}</p>}
        </div>
      )}

      {/* Campo trampa: invisible para las personas; los robots lo rellenan y se delatan */}
      <div className={estilos.trampa} aria-hidden="true">
        <label>
          No completar
          <input type="text" name="sitio_web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className={estilos.casilla}>
        <input type="checkbox" name="consentimiento" aria-invalid={Boolean(error("consentimiento"))} />
        Acepto que, una vez revisada por el equipo de la radio, mi petición se publique en este muro.
      </label>
      {error("consentimiento") && <p className={estilos.error}>{error("consentimiento")}</p>}

      <button type="submit" className={estilos.enviar} disabled={enviando}>
        {enviando ? "Enviando…" : "Enviar mi petición"}
      </button>
    </form>
  );
}
