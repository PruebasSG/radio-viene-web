import type { Metadata } from "next";
import Link from "next/link";
import { PaginaInstitucional, TarjetaLateral } from "@/components/paginas/PaginaInstitucional";
import estilos from "@/components/paginas/paginas.module.css";
import { BotonPastilla } from "@/components/reproductor/BotonPastilla";
import { IMAGEN_COMPARTIR } from "@/config/emisora";
import { obtenerPagina } from "@/lib/paginas";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await obtenerPagina("quienes-somos");
  return {
    title: pagina.titulo,
    description: pagina.descripcion,
    alternates: { canonical: "/quienes-somos" },
    openGraph: { url: "/quienes-somos", title: pagina.titulo, description: pagina.descripcion, images: [IMAGEN_COMPARTIR] },
  };
}

export default async function QuienesSomos() {
  const pagina = await obtenerPagina("quienes-somos");
  return (
    <PaginaInstitucional
      pagina={pagina}
      lateral={
        <>
          <TarjetaLateral titulo="Escúchanos ahora">
            <p>En vivo las 24 horas, en el 101.3 FM y aquí mismo.</p>
            <BotonPastilla />
          </TarjetaLateral>
          <TarjetaLateral titulo="Conoce más">
            <ul className={estilos.enlaces}>
              <li>
                <Link href="/nuestras-creencias">Nuestras creencias →</Link>
              </li>
              <li>
                <Link href="/#programacion">Programación →</Link>
              </li>
              <li>
                <Link href="/oracion">Muro de oración →</Link>
              </li>
              <li>
                <Link href="/contacto">Contacto →</Link>
              </li>
            </ul>
          </TarjetaLateral>
        </>
      }
    />
  );
}
