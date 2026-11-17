import { IconoWhatsApp } from "@/components/iconos";
import { mensajesWhatsApp, radio } from "@/content/radio";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import estilos from "./oracion.module.css";

export function Oracion() {
  const enlace = enlaceWhatsApp(radio.whatsapp, mensajesWhatsApp.oracion);

  return (
    <section id="oracion" className={estilos.seccion} aria-labelledby="titulo-oracion">
      <div className={`contenedor ${estilos.interior}`}>
        <h2 id="titulo-oracion">¿Podemos orar por ti?</h2>
        <p className={estilos.texto}>
          Comparte tu motivo de oración con nuestro equipo. Lo presentaremos a Dios con respeto y en confianza.
          No hace falta que incluyas tu nombre.
        </p>
        {enlace ? (
          <a className={estilos.boton} href={enlace} target="_blank" rel="noopener noreferrer">
            <IconoWhatsApp className={estilos.icono} />
            Enviar mi petición de oración
            <span className="solo-lectores"> (abre WhatsApp)</span>
          </a>
        ) : (
          <p className={estilos.pronto}>Muy pronto podrás enviarnos tu petición desde aquí.</p>
        )}
        <p className={estilos.nota}>
          Pronto podrás compartirla también en nuestro muro de oración, con tu nombre o de forma anónima.
        </p>
      </div>
    </section>
  );
}
