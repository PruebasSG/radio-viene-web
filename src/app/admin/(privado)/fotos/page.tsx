import type { Metadata } from "next";
import Link from "next/link";
import { Aviso } from "@/components/admin/Aviso";
import { SubidaFotos } from "@/components/admin/SubidaFotos";
import { TarjetaFoto } from "@/components/admin/TarjetaFoto";
import estilos from "@/components/admin/panel.module.css";
import { exigirAdmin } from "@/lib/admin/sesion";
import { COLUMNAS_FOTO, NOMBRE_SECCION, SECCIONES_FOTOS, filaAFoto, type FilaFoto, type SeccionFoto } from "@/lib/fotos";

export const metadata: Metadata = { title: "Fotos" };

const AYUDA: Record<SeccionFoto, string> = {
  portada:
    "Aparecen en el mosaico en movimiento del inicio. Lo ideal son 12 o más, mezclando fotos verticales y horizontales. Mientras haya pocas, el mosaico se completa con tarjetas de diseño.",
  cabina:
    "Locutores y equipo en cabina. Se mostrarán en la próxima sección «En cabina» de la web: puedes ir subiéndolas desde ya.",
  comunidad:
    "Cultos, eventos y actividades con los oyentes. Se mostrarán en la próxima sección «Comunidad»: puedes ir subiéndolas desde ya.",
};

type Props = { searchParams: Promise<{ seccion?: string }> };

export default async function FotosPanel({ searchParams }: Props) {
  const { supabase } = await exigirAdmin();
  const { seccion: pedida } = await searchParams;
  const seccion: SeccionFoto = SECCIONES_FOTOS.includes(pedida as SeccionFoto) ? (pedida as SeccionFoto) : "portada";

  const { data, error } = await supabase.from("fotos").select(COLUMNAS_FOTO).order("orden");
  const todas = ((data ?? []) as FilaFoto[]).map(filaAFoto);
  const fotos = todas.filter((foto) => foto.seccion === seccion);

  return (
    <>
      <div className={estilos.encabezado}>
        <div>
          <h1>Fotos</h1>
          <p className={estilos.intro}>Se reducen solas al subirlas, para que la web cargue rápido.</p>
        </div>
      </div>

      {error && (
        <Aviso tipo="error">
          No se pudieron cargar las fotos. Si es la primera vez, ejecuta el archivo fotos.sql en Supabase.
        </Aviso>
      )}

      <nav className={estilos.filtros} aria-label="Secciones de fotos">
        {SECCIONES_FOTOS.map((s) => (
          <Link key={s} href={`/admin/fotos?seccion=${s}`} className={estilos.filtro} aria-current={s === seccion}>
            {NOMBRE_SECCION[s]} ({todas.filter((foto) => foto.seccion === s).length})
          </Link>
        ))}
      </nav>

      <div className={estilos.tarjeta}>
        <p className={estilos.intro} style={{ marginTop: 0, marginBottom: "1rem" }}>
          {AYUDA[seccion]}
        </p>
        <SubidaFotos seccion={seccion} />
      </div>

      {fotos.length === 0 ? (
        <p className={`${estilos.lista} ${estilos.vacio}`} style={{ marginTop: "1.25rem" }}>
          Todavía no hay fotos en {NOMBRE_SECCION[seccion].toLowerCase()}. Sube las primeras con el botón de arriba.
        </p>
      ) : (
        <ul className={estilos.fotos}>
          {fotos.map((foto, i) => (
            <TarjetaFoto key={foto.id} foto={foto} esPrimera={i === 0} esUltima={i === fotos.length - 1} />
          ))}
        </ul>
      )}
    </>
  );
}
