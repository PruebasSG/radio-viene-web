import type { Metadata } from "next";
import { Aviso } from "@/components/admin/Aviso";
import { FormAjustes } from "@/components/admin/FormAjustes";
import estilos from "@/components/admin/panel.module.css";
import { ajustesRespaldo, type Ajustes, type RedSocial } from "@/content/radio";
import { exigirAdmin } from "@/lib/admin/sesion";

export const metadata: Metadata = { title: "Datos de la radio" };

const BASE = "lema, descripcion, whatsapp, correo, redes";

export default async function DatosRadio() {
  const { supabase } = await exigirAdmin();

  // Intentamos leer también los textos de la portada; si aún no existen, seguimos sin ellos.
  let conPortada = true;
  let respuesta = await supabase
    .from("ajustes")
    .select(`${BASE}, titular, titular_destacado, frases`)
    .eq("id", 1)
    .maybeSingle();
  if (respuesta.error?.code === "42703" || respuesta.error?.code === "PGRST204") {
    conPortada = false;
    respuesta = await supabase.from("ajustes").select(BASE).eq("id", 1).maybeSingle();
  }
  const { data, error } = respuesta;
  const fila = (data ?? {}) as Record<string, unknown>;

  const ajustes: Ajustes = data
    ? {
        titular: typeof fila.titular === "string" ? fila.titular : ajustesRespaldo.titular,
        titularDestacado:
          typeof fila.titular_destacado === "string" ? fila.titular_destacado : ajustesRespaldo.titularDestacado,
        frases: Array.isArray(fila.frases) ? (fila.frases as string[]) : ajustesRespaldo.frases,
        lema: String(fila.lema),
        descripcion: String(fila.descripcion),
        whatsapp: String(fila.whatsapp),
        correo: String(fila.correo),
        redes: Array.isArray(fila.redes) ? (fila.redes as RedSocial[]) : [],
      }
    : ajustesRespaldo;

  return (
    <>
      <div className={estilos.encabezado}>
        <div>
          <h1>Datos de la radio</h1>
          <p className={estilos.intro}>Textos de la portada y formas de contacto que aparecen en la web.</p>
        </div>
      </div>
      {(error || !data) && (
        <Aviso tipo="error">
          No se encontraron los datos en la base de datos. Revisa que se haya ejecutado el archivo esquema.sql.
        </Aviso>
      )}
      {data && !conPortada && (
        <Aviso>
          Para editar el titular y las frases de la portada, ejecuta el archivo fotos.sql en Supabase. Mientras
          tanto, la portada usa los textos de siempre.
        </Aviso>
      )}
      <div className={estilos.tarjeta}>
        <FormAjustes ajustes={ajustes} conPortada={conPortada} />
      </div>
    </>
  );
}
