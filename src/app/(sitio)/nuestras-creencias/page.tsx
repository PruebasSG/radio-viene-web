import type { Metadata } from "next";
import Link from "next/link";
import { PaginaInstitucional, TarjetaLateral } from "@/components/paginas/PaginaInstitucional";
import estilos from "@/components/paginas/paginas.module.css";
import { IMAGEN_COMPARTIR } from "@/config/emisora";
import { obtenerPagina } from "@/lib/paginas";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await obtenerPagina("nuestras-creencias");
  return {
    title: pagina.titulo,
    description: pagina.descripcion,
    alternates: { canonical: "/nuestras-creencias" },
    openGraph: {
      url: "/nuestras-creencias",
      title: pagina.titulo,
      description: pagina.descripcion,
      images: [IMAGEN_COMPARTIR],
    },
  };
}

export default async function NuestrasCreencias() {
  const pagina = await obtenerPagina("nuestras-creencias");
  return (
    <PaginaInstitucional
      pagina={pagina}
      lateral={
        <>
          <TarjetaLateral titulo="¿Quieres estudiar la Biblia?">
            <p>Escríbenos y con gusto te acompañamos. También puedes escuchar nuestros programas de estudio bíblico.</p>
            <ul className={estilos.enlaces}>
              <li>
                <Link href="/contacto">Escríbenos →</Link>
              </li>
              <li>
                <Link href="/#programacion">Ver la programación →</Link>
              </li>
            </ul>
          </TarjetaLateral>
          <TarjetaLateral titulo="Conoce más">
            <ul className={estilos.enlaces}>
              <li>
                <Link href="/quienes-somos">Quiénes somos →</Link>
              </li>
              <li>
                <Link href="/blog">Nuestro blog →</Link>
              </li>
            </ul>
          </TarjetaLateral>
        </>
      }
    />
  );
}
