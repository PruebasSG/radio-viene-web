import type { Metadata } from "next";
import { Aviso } from "@/components/admin/Aviso";
import { FormAjustes } from "@/components/admin/FormAjustes";
import estilos from "@/components/admin/panel.module.css";
import { ajustesRespaldo, type Ajustes, type RedSocial } from "@/content/radio";
import { exigirAdmin } from "@/lib/admin/sesion";

export const metadata: Metadata = { title: "Datos de la radio" };

export default async function DatosRadio() {
  const { supabase } = await exigirAdmin();
  const { data, error } = await supabase
    .from("ajustes")
    .select("lema, descripcion, whatsapp, correo, redes")
    .eq("id", 1)
    .maybeSingle();

  const ajustes: Ajustes = data
    ? { ...data, redes: Array.isArray(data.redes) ? (data.redes as RedSocial[]) : [] }
    : ajustesRespaldo;

  return (
    <>
      <div className={estilos.encabezado}>
        <div>
          <h1>Datos de la radio</h1>
          <p className={estilos.intro}>Textos y formas de contacto que aparecen en la web.</p>
        </div>
      </div>
      {(error || !data) && (
        <Aviso tipo="error">
          No se encontraron los datos en la base de datos. Revisa que se haya ejecutado el archivo esquema.sql.
        </Aviso>
      )}
      <div className={estilos.tarjeta}>
        <FormAjustes ajustes={ajustes} />
      </div>
    </>
  );
}
