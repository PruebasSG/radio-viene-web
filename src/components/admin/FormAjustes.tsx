"use client";

import { startTransition, useActionState } from "react";
import { guardarAjustes } from "@/app/admin/acciones";
import { REDES_DISPONIBLES, type Ajustes } from "@/content/radio";
import { ESTADO_INICIAL } from "@/lib/admin/tipos";
import { numeroLegible } from "@/lib/whatsapp";
import { Aviso } from "./Aviso";
import estilos from "./panel.module.css";

export function FormAjustes({ ajustes, conPortada }: { ajustes: Ajustes; conPortada: boolean }) {
  const [estado, enviar, enviando] = useActionState(guardarAjustes, ESTADO_INICIAL);

  const anterior = estado.valores as Record<string, string> | undefined;
  const error = (campo: string) => estado.errores?.[campo];
  const red = (nombre: string) => ajustes.redes.find((r) => r.nombre === nombre)?.url ?? "";

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

      <input type="hidden" name="conPortada" value={conPortada ? "1" : "0"} />
      {conPortada && (
        <fieldset className={`${estilos.campo} ${estilos.publicacion}`}>
          <legend className={estilos.etiqueta}>Titular de la portada</legend>
          <p className={estilos.ayuda}>
            Es la frase grande del inicio. La segunda parte aparece en dorado, subrayada. Por ejemplo:
            «Esperanza que» + «se escucha.»
          </p>
          <div className={estilos.dosColumnas}>
            <div className={estilos.campo}>
              <label htmlFor="titular" className={estilos.etiqueta}>
                Comienzo
              </label>
              <input
                id="titular"
                name="titular"
                className={estilos.entrada}
                maxLength={40}
                defaultValue={anterior?.titular ?? ajustes.titular}
                aria-invalid={Boolean(error("titular"))}
              />
              {error("titular") && <p className={estilos.error}>{error("titular")}</p>}
            </div>
            <div className={estilos.campo}>
              <label htmlFor="titularDestacado" className={estilos.etiqueta}>
                Parte destacada
              </label>
              <input
                id="titularDestacado"
                name="titularDestacado"
                className={estilos.entrada}
                maxLength={40}
                defaultValue={anterior?.titularDestacado ?? ajustes.titularDestacado}
                aria-invalid={Boolean(error("titularDestacado"))}
              />
              {error("titularDestacado") && <p className={estilos.error}>{error("titularDestacado")}</p>}
            </div>
          </div>
          <div className={estilos.campo}>
            <label htmlFor="frases" className={estilos.etiqueta}>
              Frases de la cinta dorada
            </label>
            <textarea
              id="frases"
              name="frases"
              className={estilos.entrada}
              rows={5}
              defaultValue={anterior?.frases ?? ajustes.frases.join("\n")}
              aria-invalid={Boolean(error("frases"))}
              aria-describedby="ayuda-frases"
            />
            <p id="ayuda-frases" className={estilos.ayuda}>
              Una frase por línea, hasta 8. Se desplazan sin parar debajo del inicio.
            </p>
            {error("frases") && <p className={estilos.error}>{error("frases")}</p>}
          </div>
        </fieldset>
      )}

      <div className={estilos.campo}>
        <label htmlFor="lema" className={estilos.etiqueta}>
          Lema
        </label>
        <input
          id="lema"
          name="lema"
          className={estilos.entrada}
          maxLength={120}
          defaultValue={anterior?.lema ?? ajustes.lema}
          aria-invalid={Boolean(error("lema"))}
          aria-describedby="ayuda-lema"
        />
        <p id="ayuda-lema" className={estilos.ayuda}>
          La frase que aparece debajo del titular, al inicio de la web.
        </p>
        {error("lema") && <p className={estilos.error}>{error("lema")}</p>}
      </div>

      <div className={estilos.campo}>
        <label htmlFor="descripcion" className={estilos.etiqueta}>
          Quiénes somos
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          className={estilos.entrada}
          maxLength={400}
          defaultValue={anterior?.descripcion ?? ajustes.descripcion}
          aria-invalid={Boolean(error("descripcion"))}
          aria-describedby="ayuda-descripcion"
        />
        <p id="ayuda-descripcion" className={estilos.ayuda}>
          Aparece en el pie de la web.
        </p>
        {error("descripcion") && <p className={estilos.error}>{error("descripcion")}</p>}
      </div>

      <div className={estilos.dosColumnas}>
        <div className={estilos.campo}>
          <label htmlFor="whatsapp" className={estilos.etiqueta}>
            WhatsApp
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            className={estilos.entrada}
            defaultValue={anterior?.whatsapp ?? (ajustes.whatsapp ? numeroLegible(ajustes.whatsapp) : "")}
            aria-invalid={Boolean(error("whatsapp"))}
            aria-describedby="ayuda-whatsapp"
          />
          <p id="ayuda-whatsapp" className={estilos.ayuda}>
            Con código de país. Si lo dejas vacío, los botones de WhatsApp se ocultan.
          </p>
          {error("whatsapp") && <p className={estilos.error}>{error("whatsapp")}</p>}
        </div>

        <div className={estilos.campo}>
          <label htmlFor="correo" className={estilos.etiqueta}>
            Correo <span className={estilos.opcional}>(opcional)</span>
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            className={estilos.entrada}
            defaultValue={anterior?.correo ?? ajustes.correo}
            aria-invalid={Boolean(error("correo"))}
          />
          {error("correo") && <p className={estilos.error}>{error("correo")}</p>}
        </div>
      </div>

      <fieldset className={estilos.campo} style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className={estilos.etiqueta}>Redes sociales</legend>
        <p className={estilos.ayuda}>Pega el enlace completo de cada perfil. Deja vacías las que no usen.</p>
        <div className={estilos.dosColumnas}>
          {REDES_DISPONIBLES.map((nombre) => {
            const campo = `redes.${nombre}`;
            return (
              <div key={nombre} className={estilos.campo}>
                <label htmlFor={campo} className={estilos.etiqueta}>
                  {nombre}
                </label>
                <input
                  id={campo}
                  name={campo}
                  type="url"
                  inputMode="url"
                  placeholder="https://"
                  className={estilos.entrada}
                  defaultValue={anterior?.[campo] ?? red(nombre)}
                  aria-invalid={Boolean(error(campo))}
                />
                {error(campo) && <p className={estilos.error}>{error(campo)}</p>}
              </div>
            );
          })}
        </div>
      </fieldset>

      <div className={estilos.acciones}>
        <button type="submit" className={estilos.boton} disabled={enviando}>
          {enviando ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
