import type { Metadata } from "next";
import Link from "next/link";
import { Aviso } from "@/components/admin/Aviso";
import { TarjetaModeracion, type PeticionModerable } from "@/components/admin/TarjetaModeracion";
import estilos from "@/components/admin/panel.module.css";
import { radio } from "@/content/radio";
import { exigirAdmin } from "@/lib/admin/sesion";

export const metadata: Metadata = { title: "Muro de oración" };

const ESTADOS = [
  { clave: "pendiente", texto: "Por revisar" },
  { clave: "publicada", texto: "Publicadas" },
  { clave: "archivada", texto: "Archivadas" },
] as const;

type Estado = (typeof ESTADOS)[number]["clave"];
type Props = { searchParams: Promise<{ estado?: string }> };

const fechaHora = (iso: string) =>
  new Intl.DateTimeFormat("es-VE", {
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZone: radio.zonaHoraria,
  }).format(new Date(iso));

export default async function OracionPanel({ searchParams }: Props) {
  const { supabase } = await exigirAdmin();
  const { estado: pedido } = await searchParams;
  const estado: Estado = ESTADOS.some((e) => e.clave === pedido) ? (pedido as Estado) : "pendiente";

  const { data, error } = await supabase
    .from("peticiones")
    .select("id, nombre, texto, estado, oraciones, creado_en")
    .order("creado_en", { ascending: estado === "pendiente" })
    .limit(300);

  const todas: PeticionModerable[] = (data ?? []).map((fila) => ({
    id: fila.id as string,
    nombre: fila.nombre as string | null,
    texto: fila.texto as string,
    estado: fila.estado as Estado,
    oraciones: fila.oraciones as number,
    creadoEn: fila.creado_en as string,
  }));
  const lista = todas.filter((p) => p.estado === estado);
  const cuenta = (clave: Estado) => todas.filter((p) => p.estado === clave).length;

  return (
    <>
      <div className={estilos.encabezado}>
        <div>
          <h1>Muro de oración</h1>
          <p className={estilos.intro}>
            Las peticiones llegan aquí primero. Solo se ven en la web cuando las publicas.
          </p>
        </div>
        <a href="/oracion" target="_blank" rel="noopener noreferrer" className={estilos.enlace}>
          Ver el muro ↗
        </a>
      </div>

      {error && (
        <Aviso tipo="error">
          No se pudieron cargar las peticiones. Si es la primera vez, ejecuta el archivo oracion.sql en Supabase.
        </Aviso>
      )}

      <nav className={estilos.filtros} aria-label="Estado de las peticiones">
        {ESTADOS.map((e) => (
          <Link
            key={e.clave}
            href={`/admin/oracion?estado=${e.clave}`}
            className={estilos.filtro}
            aria-current={e.clave === estado}
          >
            {e.texto} ({cuenta(e.clave)})
          </Link>
        ))}
      </nav>

      {lista.length === 0 ? (
        <p className={`${estilos.lista} ${estilos.vacio}`}>
          {estado === "pendiente"
            ? "No hay peticiones por revisar. ¡Todo al día!"
            : `No hay peticiones ${estado === "publicada" ? "publicadas" : "archivadas"}.`}
        </p>
      ) : (
        <ul className={estilos.moderaciones}>
          {lista.map((peticion) => (
            <TarjetaModeracion key={peticion.id} peticion={peticion} fecha={fechaHora(peticion.creadoEn)} />
          ))}
        </ul>
      )}
    </>
  );
}
