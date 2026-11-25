import type { Metadata } from "next";
import { FormPeticion } from "@/components/oracion/FormPeticion";
import { TarjetaPeticion } from "@/components/oracion/TarjetaPeticion";
import estilos from "@/components/oracion/muro.module.css";
import { obtenerPeticiones } from "@/lib/oracion";

/** El muro se actualiza como mucho cada minuto; al aprobar una petición, al instante. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Muro de oración",
  description: "Comparte tu petición de oración con Radio Viene. Oramos contigo.",
  alternates: { canonical: "/oracion" },
  // Son peticiones personales: el muro no aparece en Google.
  robots: { index: false, follow: true },
};

export default async function MuroDeOracion() {
  const peticiones = await obtenerPeticiones();

  return (
    <>
      <header className={estilos.cabecera}>
        <div className="contenedor">
          <h1>Muro de oración</h1>
          <p>Comparte lo que llevas en el corazón. Nuestro equipo y nuestra comunidad oramos contigo.</p>
          <p className={estilos.versiculo}>«Orad los unos por los otros» · Santiago 5:16</p>
        </div>
      </header>

      <div className={`contenedor ${estilos.rejilla}`}>
        <section id="escribir" className={estilos.columnaFormulario} aria-labelledby="titulo-escribir">
          <h2 id="titulo-escribir">Comparte tu petición</h2>
          <p className={estilos.intro}>
            Puedes dejar tu nombre o hacerlo de forma anónima. Nuestro equipo revisa cada petición antes de
            publicarla.
          </p>
          <FormPeticion />
        </section>

        <section className={estilos.columnaMuro} aria-labelledby="titulo-muro">
          <h2 id="titulo-muro">Oramos juntos</h2>
          <p className={estilos.intro}>Toca «Estoy orando» para que la persona sepa que no está sola.</p>
          {peticiones.length === 0 ? (
            <p className={estilos.vacio}>
              Todavía no hay peticiones publicadas. Sé la primera persona en compartir la tuya.
            </p>
          ) : (
            <div className={estilos.lista}>
              {peticiones.map((peticion) => (
                <TarjetaPeticion key={peticion.id} peticion={peticion} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
