import { Cabecera } from "@/components/cabecera/Cabecera";
import { ProgramacionProvider } from "@/components/datos/ProgramacionProvider";
import { Pie } from "@/components/pie/Pie";
import { BarraReproductor } from "@/components/reproductor/BarraReproductor";
import { ReproductorProvider } from "@/components/reproductor/ReproductorProvider";
import { obtenerAjustes, obtenerProgramacion } from "@/lib/datos";

/**
 * La web pública se guarda en caché y se regenera cada 5 minutos como máximo.
 * Cuando se guarda un cambio en el panel, se regenera al instante.
 */
export const revalidate = 300;

export default async function SitioLayout({ children }: { children: React.ReactNode }) {
  const [programas, ajustes] = await Promise.all([obtenerProgramacion(), obtenerAjustes()]);

  return (
    <ProgramacionProvider programas={programas}>
      <ReproductorProvider>
        <a className="saltar" href="#contenido">
          Saltar al contenido
        </a>
        <Cabecera />
        <main id="contenido">{children}</main>
        <Pie ajustes={ajustes} />
        <BarraReproductor />
      </ReproductorProvider>
    </ProgramacionProvider>
  );
}
