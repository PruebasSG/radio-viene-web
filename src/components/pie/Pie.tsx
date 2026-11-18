import { radio, type Ajustes } from "@/content/radio";
import { enlaceWhatsApp, numeroLegible } from "@/lib/whatsapp";
import estilos from "./pie.module.css";

export function Pie({ ajustes }: { ajustes: Ajustes }) {
  const whatsapp = enlaceWhatsApp(ajustes.whatsapp, "¡Hola, Radio Viene!");
  const anio = new Date().getFullYear();

  return (
    <footer className={estilos.pie}>
      <div className={`contenedor ${estilos.rejilla}`}>
        <div className={estilos.marca}>
          <p className={estilos.nombre}>
            {radio.nombre} <span>{radio.frecuencia} {radio.banda}</span>
          </p>
          <p className={estilos.descripcion}>{ajustes.descripcion}</p>
        </div>

        <div>
          <h2 className={estilos.subtitulo}>Contacto</h2>
          <ul className={estilos.lista}>
            <li>
              {radio.frecuencia} {radio.banda}, {radio.ubicacion}
            </li>
            {whatsapp && (
              <li>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp {numeroLegible(ajustes.whatsapp)}
                </a>
              </li>
            )}
            {ajustes.correo && (
              <li>
                <a href={`mailto:${ajustes.correo}`}>{ajustes.correo}</a>
              </li>
            )}
            {ajustes.redes.map((red) => (
              <li key={red.url}>
                <a href={red.url} target="_blank" rel="noopener noreferrer">
                  {red.nombre}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`contenedor ${estilos.final}`}>
        <p>
          © {anio} {radio.nombre}. Radio adventista del séptimo día.
        </p>
      </div>
    </footer>
  );
}
