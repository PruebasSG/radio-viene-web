import Link from "next/link";
import { mensajesWhatsApp } from "@/content/radio";
import type { Peticion } from "@/lib/oracion";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import { BotonOrar } from "./BotonOrar";
import estilos from "./oracion.module.css";

/** Sección de la portada: invita al muro de oración y muestra las últimas peticiones aprobadas. */
export function Oracion({ whatsapp, peticiones }: { whatsapp: string; peticiones: Peticion[] }) {
  const enlace = enlaceWhatsApp(whatsapp, mensajesWhatsApp.oracion);

  return (
    <section id="oracion" className={estilos.seccion} aria-labelledby="titulo-oracion">
      <div className={`contenedor ${estilos.rejilla}`}>
        <div className={`${estilos.interior} revelar`}>
          <h2 id="titulo-oracion">¿Podemos orar por ti?</h2>
          <p className={estilos.texto}>
            Escribe tu petición en nuestro muro de oración, con tu nombre o de forma anónima. Nuestro equipo y
            nuestra comunidad oraremos contigo.
          </p>
          <div className={estilos.botones}>
            <Link className={estilos.boton} href="/oracion#escribir">
              Escribir mi petición
            </Link>
            <Link className={estilos.botonSecundario} href="/oracion">
              Ver el muro de oración
            </Link>
          </div>
          {enlace && (
            <p className={estilos.nota}>
              ¿Prefieres hacerlo en privado?{" "}
              <a href={enlace} target="_blank" rel="noopener noreferrer">
                Escríbenos por WhatsApp
              </a>
              .
            </p>
          )}
        </div>

        {peticiones.length > 0 ? (
          <ul className={`${estilos.ultimas} revelar`} aria-label="Últimas peticiones">
            {peticiones.map((peticion) => (
              <li key={peticion.id} className={estilos.ultima}>
                <p className={estilos.ultimaTexto}>{peticion.texto}</p>
                <div className={estilos.ultimaPie}>
                  <span>{peticion.nombre ?? "Anónimo"}</span>
                  <BotonOrar id={peticion.id} inicial={peticion.oraciones} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <figure className={`${estilos.versiculo} revelar`}>
            <blockquote>Echa sobre Jehová tu carga, y él te sustentará.</blockquote>
            <figcaption>Salmos 55:22</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
