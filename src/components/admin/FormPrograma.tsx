"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import type { Dia } from "@/content/programacion";
import { ESTADO_INICIAL, type EstadoFormulario } from "@/lib/admin/tipos";
import { DIAS, NOMBRE_DIA } from "@/lib/horario";
import { Aviso } from "./Aviso";
import estilos from "./panel.module.css";

export type ProgramaEditable = {
  nombre: string;
  descripcion: string;
  conductor: string;
  dias: Dia[];
  inicio: string;
  fin: string;
  activo: boolean;
};

type Props = {
  accion: (estado: EstadoFormulario, datos: FormData) => Promise<EstadoFormulario>;
  programa?: ProgramaEditable;
};

const ENTRE_SEMANA: Dia[] = ["lunes", "martes", "miercoles", "jueves", "viernes"];
const FIN_DE_SEMANA: Dia[] = ["sabado", "domingo"];

export function FormPrograma({ accion, programa }: Props) {
  const [estado, enviar, enviando] = useActionState(accion, ESTADO_INICIAL);
  const [dias, setDias] = useState<Dia[]>(programa?.dias ?? []);

  const anterior = estado.valores;
  const valor = (campo: keyof ProgramaEditable) =>
    (anterior?.[campo] as string | undefined) ?? (programa?.[campo] as string | undefined) ?? "";
  const error = (campo: string) => estado.errores?.[campo];
  const activo = anterior ? anterior.activo === true : (programa?.activo ?? true);

  const alternarDia = (dia: Dia) =>
    setDias((actuales) => (actuales.includes(dia) ? actuales.filter((d) => d !== dia) : [...actuales, dia]));

  return (
    <form
      className={estilos.formulario}
      noValidate
      onSubmit={(evento) => {
        // Enviamos sin el reinicio automático del formulario de React,
        // para que nada de lo escrito se pierda si hay que corregir algo.
        evento.preventDefault();
        const datos = new FormData(evento.currentTarget);
        startTransition(() => enviar(datos));
      }}
    >
      {estado.mensaje && <Aviso tipo="error">{estado.mensaje}</Aviso>}

      <div className={estilos.campo}>
        <label htmlFor="nombre" className={estilos.etiqueta}>
          Nombre del programa
        </label>
        <input
          id="nombre"
          name="nombre"
          className={estilos.entrada}
          maxLength={80}
          required
          defaultValue={valor("nombre")}
          aria-invalid={Boolean(error("nombre"))}
          aria-describedby={error("nombre") ? "error-nombre" : undefined}
        />
        {error("nombre") && (
          <p id="error-nombre" className={estilos.error}>
            {error("nombre")}
          </p>
        )}
      </div>

      <div className={estilos.campo}>
        <label htmlFor="descripcion" className={estilos.etiqueta}>
          Descripción <span className={estilos.opcional}>(opcional)</span>
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          className={estilos.entrada}
          maxLength={300}
          defaultValue={valor("descripcion")}
          aria-describedby="ayuda-descripcion"
        />
        <p id="ayuda-descripcion" className={estilos.ayuda}>
          Una o dos frases. Aparece debajo del nombre en la programación.
        </p>
      </div>

      <div className={estilos.campo}>
        <label htmlFor="conductor" className={estilos.etiqueta}>
          Conducido por <span className={estilos.opcional}>(opcional)</span>
        </label>
        <input
          id="conductor"
          name="conductor"
          className={estilos.entrada}
          maxLength={80}
          defaultValue={valor("conductor")}
          aria-describedby="ayuda-conductor"
        />
        <p id="ayuda-conductor" className={estilos.ayuda}>
          Por ejemplo: «el pastor Juan Pérez» o «Ana y Luis».
        </p>
      </div>

      <fieldset className={estilos.campo} style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className={estilos.etiqueta} style={{ marginBottom: "0.4rem" }}>
          Días en que se emite
        </legend>
        <div className={estilos.dias}>
          {DIAS.map((dia) => (
            <label key={dia} className={estilos.dia}>
              <input
                type="checkbox"
                name="dias"
                value={dia}
                checked={dias.includes(dia)}
                onChange={() => alternarDia(dia)}
              />
              {NOMBRE_DIA[dia].largo}
            </label>
          ))}
        </div>
        <div className={estilos.atajos}>
          <button type="button" className={estilos.atajo} onClick={() => setDias(ENTRE_SEMANA)}>
            Lunes a viernes
          </button>
          <button type="button" className={estilos.atajo} onClick={() => setDias(FIN_DE_SEMANA)}>
            Fines de semana
          </button>
          <button type="button" className={estilos.atajo} onClick={() => setDias([...DIAS])}>
            Todos los días
          </button>
          <button type="button" className={estilos.atajo} onClick={() => setDias([])}>
            Ninguno
          </button>
        </div>
        {error("dias") && <p className={estilos.error}>{error("dias")}</p>}
      </fieldset>

      <div className={estilos.dosColumnas}>
        <div className={estilos.campo}>
          <label htmlFor="inicio" className={estilos.etiqueta}>
            Empieza a las
          </label>
          <input
            id="inicio"
            name="inicio"
            type="time"
            step={300}
            required
            className={estilos.entrada}
            defaultValue={valor("inicio")}
            aria-invalid={Boolean(error("inicio"))}
          />
          {error("inicio") && <p className={estilos.error}>{error("inicio")}</p>}
        </div>
        <div className={estilos.campo}>
          <label htmlFor="fin" className={estilos.etiqueta}>
            Termina a las
          </label>
          <input
            id="fin"
            name="fin"
            type="time"
            step={300}
            required
            className={estilos.entrada}
            defaultValue={valor("fin")}
            aria-invalid={Boolean(error("fin"))}
            aria-describedby="ayuda-fin"
          />
          <p id="ayuda-fin" className={estilos.ayuda}>
            Si termina a medianoche, elige 12:00 a. m.
          </p>
          {error("fin") && <p className={estilos.error}>{error("fin")}</p>}
        </div>
      </div>

      <label className={estilos.casilla}>
        <input type="checkbox" name="activo" defaultChecked={activo} />
        <span>
          <span className={estilos.etiqueta}>Mostrar en la web</span>
          <br />
          <span className={estilos.ayuda}>Desmárcalo para ocultar el programa sin borrarlo.</span>
        </span>
      </label>

      <div className={estilos.acciones}>
        <button type="submit" className={estilos.boton} disabled={enviando}>
          {enviando ? "Guardando…" : "Guardar programa"}
        </button>
        <Link href="/admin/programacion" className={estilos.enlace}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
