import Link from "next/link";
import { Logo } from "@/components/Logo";
import { BotonEscuchar } from "@/components/reproductor/BotonEscuchar";
import { lugar, radio, type Ajustes } from "@/content/radio";
import { enlaceWhatsApp, numeroLegible } from "@/lib/whatsapp";
import estilos from "./pie.module.css";

const LA_RADIO = [
  { href: "/quienes-somos", texto: "Quiénes somos" },
  { href: "/nuestras-creencias", texto: "Nuestras creencias" },
  { href: "/contacto", texto: "Contacto" },
];

const PARTICIPA = [
  { href: "/#programacion", texto: "Programación" },
  { href: "/#pedidos", texto: "Pedidos y saludos" },
  { href: "/oracion", texto: "Muro de oración" },
  { href: "/blog", texto: "Blog" },
];

export function Pie({ ajustes }: { ajustes: Ajustes }) {
  const whatsapp = enlaceWhatsApp(ajustes.whatsapp, "¡Hola, Radio Viene!");
  const anio = new Date().getFullYear();

  return (
    <footer className={estilos.pie}>
      <div className={`contenedor ${estilos.rejilla}`}>
        <div className={estilos.marca}>
          <div className={estilos.firma}>
            <Logo alto={72} className={estilos.logo} />
            <p className={estilos.nombre}>
              {radio.nombre} <span>{radio.frecuencia} {radio.banda}</span>
            </p>
          </div>
          <p className={estilos.descripcion}>{ajustes.descripcion}</p>
          <div className={estilos.escuchar}>
            <BotonEscuchar tamano="chico" />
          </div>
        </div>

        <nav aria-labelledby="pie-radio">
          <h2 id="pie-radio" className={estilos.subtitulo}>
            La radio
          </h2>
          <ul className={estilos.lista}>
            {LA_RADIO.map((seccion) => (
              <li key={seccion.href}>
                <Link href={seccion.href}>{seccion.texto}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="pie-participa">
          <h2 id="pie-participa" className={estilos.subtitulo}>
            Escucha y participa
          </h2>
          <ul className={estilos.lista}>
            {PARTICIPA.map((seccion) => (
              <li key={seccion.href}>
                <Link href={seccion.href}>{seccion.texto}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={estilos.subtitulo}>Contacto</h2>
          <ul className={estilos.lista}>
            <li>
              {radio.frecuencia} {radio.banda}, {lugar}
            </li>
            {whatsapp && (
              <li>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp <span className={estilos.sinCortes}>{numeroLegible(ajustes.whatsapp)}</span>
                </a>
              </li>
            )}
            {ajustes.correo && (
              <li>
                <a href={`mailto:${ajustes.correo}`}>{ajustes.correo}</a>
              </li>
            )}
          </ul>
        </div>

        {ajustes.redes.length > 0 && (
          <div>
            <h2 className={estilos.subtitulo}>Síguenos</h2>
            <ul className={estilos.lista}>
              {ajustes.redes.map((red) => (
                <li key={red.url}>
                  <a href={red.url} target="_blank" rel="noopener noreferrer">
                    {red.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={`contenedor ${estilos.final}`}>
        <p>
          © {anio} {radio.nombre}. Radio adventista del séptimo día.
        </p>
      </div>
    </footer>
  );
}
