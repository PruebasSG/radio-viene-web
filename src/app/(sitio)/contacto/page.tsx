import type { Metadata } from "next";
import Link from "next/link";
import {
  IconoCorazon,
  IconoCorreo,
  IconoEnlace,
  IconoMicrofono,
  IconoUbicacion,
  IconoWhatsApp,
} from "@/components/iconos";
import { PaginaInstitucional, TarjetaLateral } from "@/components/paginas/PaginaInstitucional";
import estilos from "@/components/paginas/paginas.module.css";
import { BotonPastilla } from "@/components/reproductor/BotonPastilla";
import { IMAGEN_COMPARTIR, SITE_URL } from "@/config/emisora";
import { lugar, radio } from "@/content/radio";
import { obtenerAjustes } from "@/lib/datos";
import { obtenerPagina } from "@/lib/paginas";
import { enlaceWhatsApp, numeroLegible } from "@/lib/whatsapp";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await obtenerPagina("contacto");
  return {
    title: pagina.titulo,
    description: pagina.descripcion,
    alternates: { canonical: "/contacto" },
    openGraph: { url: "/contacto", title: pagina.titulo, description: pagina.descripcion, images: [IMAGEN_COMPARTIR] },
  };
}

type Tarjeta = {
  Icono: (props: { className?: string }) => React.ReactNode;
  etiqueta: string;
  valor: string;
  href?: string;
  externo?: boolean;
};

export default async function Contacto() {
  const [pagina, ajustes] = await Promise.all([obtenerPagina("contacto"), obtenerAjustes()]);
  const whatsapp = enlaceWhatsApp(ajustes.whatsapp, "¡Hola, Radio Viene!");

  // Las tarjetas salen de «Datos de la radio» del panel: si cambian allí, cambian aquí.
  const tarjetas: Tarjeta[] = [
    ...(whatsapp
      ? [{ Icono: IconoWhatsApp, etiqueta: "WhatsApp", valor: numeroLegible(ajustes.whatsapp), href: whatsapp, externo: true }]
      : []),
    ...(ajustes.correo
      ? [{ Icono: IconoCorreo, etiqueta: "Correo", valor: ajustes.correo, href: `mailto:${ajustes.correo}` }]
      : []),
    { Icono: IconoUbicacion, etiqueta: "Dónde estamos", valor: lugar },
    { Icono: IconoMicrofono, etiqueta: "Sintonízanos", valor: `${radio.frecuencia} ${radio.banda} y en esta web, las 24 horas` },
    { Icono: IconoCorazon, etiqueta: "Necesitas oración", valor: "Deja tu petición en el muro", href: "/oracion" },
    ...ajustes.redes.map((red) => ({
      Icono: IconoEnlace,
      etiqueta: red.nombre,
      valor: red.url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""),
      href: red.url,
      externo: true,
    })),
  ];

  // Datos estructurados: Google entiende que esta es la página de contacto de la emisora.
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${SITE_URL}/contacto`,
    name: pagina.titulo,
    about: { "@id": `${SITE_URL}/#emisora` },
  }).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <PaginaInstitucional
        pagina={pagina}
        antes={
          <ul className={estilos.contactos}>
            {tarjetas.map(({ Icono, etiqueta, valor, href, externo }) => {
              const contenido = (
                <>
                  <span className={estilos.contactoIcono}>
                    <Icono />
                  </span>
                  <span>
                    <span className={estilos.contactoEtiqueta}>{etiqueta}</span>
                    <span className={estilos.contactoValor}>{valor}</span>
                  </span>
                </>
              );
              return (
                <li key={etiqueta}>
                  {!href ? (
                    <div className={estilos.contacto}>{contenido}</div>
                  ) : externo || href.startsWith("mailto:") ? (
                    <a className={estilos.contacto} href={href} {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                      {contenido}
                    </a>
                  ) : (
                    <Link className={estilos.contacto} href={href}>
                      {contenido}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        }
        lateral={
          <TarjetaLateral titulo="Escúchanos ahora">
            <p>En vivo desde {lugar}, en el 101.3 FM y aquí mismo.</p>
            <BotonPastilla />
          </TarjetaLateral>
        }
      />
    </>
  );
}
