import { IconoWhatsApp } from "@/components/iconos";
import { mensajesWhatsApp, radio } from "@/content/radio";
import { enlaceWhatsApp, numeroLegible } from "@/lib/whatsapp";
import estilos from "./pedidos.module.css";

const OPCIONES = [
  {
    titulo: "Cuéntanos desde dónde nos escuchas",
    detalle: "Leemos al aire los mensajes de nuestros oyentes.",
    mensaje: mensajesWhatsApp.ubicacion,
  },
  {
    titulo: "Pide una canción",
    detalle: "Dinos el título y, si lo sabes, quién la canta.",
    mensaje: mensajesWhatsApp.cancion,
  },
  {
    titulo: "Envía un saludo",
    detalle: "A tu familia, a tus amigos o a tu iglesia.",
    mensaje: mensajesWhatsApp.saludo,
  },
];

export function Pedidos({ whatsapp }: { whatsapp: string }) {
  const disponible = enlaceWhatsApp(whatsapp, "") !== null;

  return (
    <section id="pedidos" className={estilos.seccion} aria-labelledby="titulo-pedidos">
      <div className={`contenedor ${estilos.rejilla}`}>
        <div className={estilos.texto}>
          <h2 id="titulo-pedidos">Tu voz también suena en {radio.nombre}</h2>
          <p>
            Escríbenos por WhatsApp y podrás escuchar tu mensaje al aire. ¿Prefieres hablar? Abre el chat y
            mantén pulsado el micrófono para enviarnos una nota de voz.
          </p>
          {disponible ? (
            <p className={estilos.numero}>
              Nuestro WhatsApp: <strong>{numeroLegible(whatsapp)}</strong>
            </p>
          ) : (
            <p className={estilos.numero}>Muy pronto podrás escribirnos por WhatsApp desde aquí.</p>
          )}
        </div>

        <ul className={estilos.opciones}>
          {OPCIONES.map((opcion) => {
            const enlace = enlaceWhatsApp(whatsapp, opcion.mensaje);
            const contenido = (
              <>
                <IconoWhatsApp className={estilos.icono} />
                <span>
                  <span className={estilos.opcionTitulo}>{opcion.titulo}</span>
                  <span className={estilos.opcionDetalle}>{opcion.detalle}</span>
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
      </div>
    </section>
  );
}
