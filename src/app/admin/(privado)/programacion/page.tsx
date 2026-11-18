import type { Metadata } from "next";
import Link from "next/link";
import { Aviso } from "@/components/admin/Aviso";
import estilos from "@/components/admin/panel.module.css";
import type { Dia } from "@/content/programacion";
import { exigirAdmin } from "@/lib/admin/sesion";
import { filaAPrograma, type FilaPrograma } from "@/lib/datos";
import { DIAS, NOMBRE_DIA, horaLegible, resumenDias } from "@/lib/horario";

export const metadata: Metadata = { title: "Programación" };

type Props = {
  searchParams: Promise<{ dia?: string; guardado?: string; eliminado?: string }>;
};

export default async function ProgramacionPanel({ searchParams }: Props) {
  const { supabase } = await exigirAdmin();
  const { dia, guardado, eliminado } = await searchParams;
  const diaElegido = DIAS.includes(dia as Dia) ? (dia as Dia) : null;

  const { data, error } = await supabase
    .from("programas")
    .select("id, nombre, descripcion, conductor, dias, inicio, fin, activo")
    .order("inicio");

  const filas = (data ?? []) as FilaPrograma[];
  const visibles = diaElegido ? filas.filter((fila) => fila.dias.includes(diaElegido)) : filas;

  return (
    <>
      <div className={estilos.encabezado}>
        <div>
          <h1>Programación</h1>
          <p className={estilos.intro}>Toca un programa para editarlo.</p>
        </div>
        <Link href="/admin/programacion/nuevo" className={`${estilos.boton} ${estilos.botonDorado}`}>
          + Nuevo programa
        </Link>
      </div>

      {guardado && <Aviso tipo="exito">Programa guardado. Ya se ve en la web.</Aviso>}
      {eliminado && <Aviso tipo="exito">Programa eliminado.</Aviso>}
      {error && <Aviso tipo="error">No se pudo cargar la programación. Recarga la página.</Aviso>}

      <nav className={estilos.filtros} aria-label="Filtrar por día">
        <Link href="/admin/programacion" className={estilos.filtro} aria-current={!diaElegido}>
          Todos
        </Link>
        {DIAS.map((d) => (
          <Link
            key={d}
            href={`/admin/programacion?dia=${d}`}
            className={estilos.filtro}
            aria-current={diaElegido === d}
          >
            {NOMBRE_DIA[d].largo}
          </Link>
        ))}
      </nav>

      {visibles.length === 0 ? (
        <p className={`${estilos.lista} ${estilos.vacio}`}>
          {diaElegido
            ? `No hay programas el ${NOMBRE_DIA[diaElegido].largo.toLowerCase()}. En esas horas suena música continua.`
            : "Todavía no hay programas. Crea el primero con el botón «Nuevo programa»."}
        </p>
      ) : (
        <ul className={estilos.lista}>
          {visibles.map((fila) => {
            const programa = filaAPrograma(fila);
            return (
              <li key={fila.id}>
                <Link href={`/admin/programacion/${fila.id}`} className={estilos.fila}>
                  <span className={estilos.filaHora}>
                    {horaLegible(programa.inicio)} a {horaLegible(programa.fin)}
                  </span>
                  <span>
                    <span className={estilos.filaNombre}>
                      {programa.nombre}
                      {!fila.activo && <span className={estilos.etiquetaOculto}>Oculto</span>}
                    </span>
                    <br />
                    <span className={estilos.filaDetalle}>
                      {resumenDias(programa.dias)}
                      {programa.conductor && ` · Con ${programa.conductor}`}
                    </span>
                  </span>
                  <span className={estilos.filaEditar} aria-hidden="true">
                    Editar →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
