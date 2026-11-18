import { IconoCorazon, IconoMicrofono, IconoNota, IconoUbicacion, IconoWhatsApp } from "@/components/iconos";
import { mensajesWhatsApp, radio } from "@/content/radio";
import { enlaceWhatsApp, numeroLegible } from "@/lib/whatsapp";
import estilos from "./pedidos.module.css";

const OPCIONES = [
  {
    Icono: IconoUbicacion,
    titulo: "Cuéntanos desde dónde nos escuchas",
    detalle: "Leemos al aire los mensajes de nuestros oyentes.",
    mensaje: mensajesWhatsApp.ubicacion,
  },
  {
    Icono: IconoNota,
    titulo: "Pide una canción",
    detalle: "Dinos el título y, si lo sabes, quién la canta.",
    mensaje: mensajesWhatsApp.cancion,
  },
  {
    Icono: IconoCorazon,
    titulo: "Envía un saludo",
    detalle: "A tu familia, a tus amigos o a tu iglesia.",
    mensaje: mensajesWhatsApp.saludo,
  },
];

export function Pedidos({ whatsapp }: { whatsapp: string }) {
  const disponible = enlaceWhatsApp(whatsapp, "") !== null;

  return (
    <section id="pedidos" className={estilos.seccion} aria-labelledby="titulo-pedidos">
      <div className="contenedor">
        <div className={`${estilos.encabezado} revelar`}>
          <h2 id="titulo-pedidos">Tu voz también suena en {radio.nombre}</h2>
          <p>Escríbenos por WhatsApp y podrás escuchar tu mensaje al aire.</p>
        </div>

        <ul className={`${estilos.opciones} revelar`}>
          {OPCIONES.map(({ Icono, ...opcion }) => {
            const enlace = enlaceWhatsApp(whatsapp, opcion.mensaje);
            const contenido = (
              <>
                <span className={estilos.icono}>
                  <Icono />
                </span>
                <span className={estilos.opcionTitulo}>{opcion.titulo}</span>
                <span className={estilos.opcionDetalle}>{opcion.detalle}</span>
                <span className={estilos.opcionAccion}>
                  <IconoWhatsApp className={estilos.whatsapp} />
                  {enlace ? "Escribir por WhatsApp" : "Muy pronto"}
                </span>
              </>
            );
            return (
              <li key={opcion.titulo}>
                {enlace ? (
                  <a className={estilos.opcion} href={enlace} target="_blank" rel="noopener noreferrer">
                    {contenido}
                    <span className="solo-lectores"> (abre WhatsApp)</span>
                  </a>
                ) : (
                  <div className={estilos.opcion} aria-disabled="true">
                    {contenido}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className={`${estilos.notaVoz} revelar`}>
          <IconoMicrofono className={estilos.notaVozIcono} />
          <p>
            <strong>¿Prefieres hablar?</strong> Abre el chat y mantén pulsado el micrófono para enviarnos una nota
            de voz.
            {disponible && (
              <>
                {" "}
                Nuestro número: <strong>{numeroLegible(whatsapp)}</strong>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
