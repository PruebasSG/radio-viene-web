import type { Metadata } from "next";
import { ALaCarta } from "@/components/a-la-carta/ALaCarta";
import { UltimosArticulos } from "@/components/blog/UltimosArticulos";
import { Inicio } from "@/components/inicio/Inicio";
import { Oracion } from "@/components/oracion/Oracion";
import { Pedidos } from "@/components/pedidos/Pedidos";
import { Programacion } from "@/components/programacion/Programacion";
import { STREAM_URL, SITE_URL } from "@/config/emisora";
import { radio, type Ajustes } from "@/content/radio";
import { obtenerUltimosArticulos } from "@/lib/blog";
import { obtenerAjustes, obtenerProgramacion } from "@/lib/datos";
import { obtenerFotos } from "@/lib/fotos";
import { obtenerPeticiones } from "@/lib/oracion";

const nombreCompleto = `${radio.nombre} ${radio.frecuencia} ${radio.banda}`;

/**
 * Título y descripción de la portada en Google. El título incluye lo que la gente
 * busca ("radio cristiana", "adventista", "Venezuela"); la descripción es el texto
 * «Quiénes somos» que se edita desde el panel.
 */
export async function generateMetadata(): Promise<Metadata> {
  const ajustes = await obtenerAjustes();
  return {
    title: { absolute: `${nombreCompleto} · Radio cristiana adventista en ${radio.ubicacion}` },
    description: ajustes.descripcion,
    // Dirección oficial: Google une aquí radioviene.net, www y la dirección de Vercel.
    alternates: { canonical: "/" },
  };
}

/**
 * Datos estructurados: le dicen a Google, sin ambigüedad, que esta web es una
 * emisora de radio, cómo se llama el sitio, cuál es su logo y sus redes.
 */
function datosEstructurados(ajustes: Ajustes) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#sitio`,
        url: SITE_URL,
        name: radio.nombre,
        alternateName: nombreCompleto,
        inLanguage: "es",
        publisher: { "@id": `${SITE_URL}/#emisora` },
      },
      {
        "@type": "RadioStation",
        "@id": `${SITE_URL}/#emisora`,
        name: nombreCompleto,
        alternateName: radio.nombre,
        url: SITE_URL,
        description: ajustes.descripcion,
        slogan: ajustes.lema,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/iconos/icono-512.png`, width: 512, height: 512 },
        image: `${SITE_URL}/opengraph-image.png`,
        address: { "@type": "PostalAddress", addressCountry: "VE" },
        areaServed: { "@type": "Country", name: radio.ubicacion },
        ...(ajustes.whatsapp ? { telephone: `+${ajustes.whatsapp}` } : {}),
        ...(ajustes.correo ? { email: ajustes.correo } : {}),
        ...(ajustes.redes.length ? { sameAs: ajustes.redes.map((red) => red.url) } : {}),
        // La señal en vivo, para que los buscadores sepan que se puede escuchar en línea.
        potentialAction: {
          "@type": "ListenAction",
          target: { "@type": "EntryPoint", urlTemplate: STREAM_URL },
        },
      },
    ],
  };
}

export default async function PaginaPrincipal() {
  const [ajustes, articulos, fotos, programas, peticiones] = await Promise.all([
    obtenerAjustes(),
    obtenerUltimosArticulos(3),
    obtenerFotos("portada"),
    obtenerProgramacion(),
    obtenerPeticiones(3),
  ]);
  // Programas distintos (uno que se emite varios días cuenta una sola vez).
  const totalProgramas = new Set(programas.map((programa) => programa.nombre)).size;
  // Escapamos "<" para que ningún texto pueda cerrar la etiqueta <script>.
  const jsonLd = JSON.stringify(datosEstructurados(ajustes)).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <Inicio ajustes={ajustes} fotos={fotos} totalProgramas={totalProgramas} />
      <Programacion />
      <Pedidos whatsapp={ajustes.whatsapp} />
      <Oracion whatsapp={ajustes.whatsapp} peticiones={peticiones} />
      <UltimosArticulos articulos={articulos} />
      <ALaCarta />
    </>
  );
}
