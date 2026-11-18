import { BotonPastilla } from "@/components/reproductor/BotonPastilla";
import { radio, type Ajustes } from "@/content/radio";
import type { Foto } from "@/lib/fotos";
import { Cifras } from "./Cifras";
import { Cinta } from "./Cinta";
import { Dial } from "./Dial";
import { EstadoSenal } from "./EstadoSenal";
import { MensajeSenal } from "./MensajeSenal";
import { Mosaico } from "./Mosaico";
import { PausaFueraDeVista } from "./PausaFueraDeVista";
import estilos from "./inicio.module.css";

type Props = {
  ajustes: Pick<Ajustes, "titular" | "titularDestacado" | "lema" | "frases">;
  fotos: Foto[];
  totalProgramas: number;
};

export function Inicio({ ajustes, fotos, totalProgramas }: Props) {
  return (
    <>
      <section id="inicio" className={estilos.inicio} aria-labelledby="titulo-inicio">
        <Mosaico fotos={fotos} />
        <div className={estilos.velo} aria-hidden="true" />

        <div className={`contenedor ${estilos.contenido}`}>
          <EstadoSenal />
          <h1 id="titulo-inicio" className={estilos.titular}>
            <span className="solo-lectores">
              {radio.nombre} {radio.frecuencia} {radio.banda}:{" "}
            </span>
            <span className={estilos.titularLinea}>{ajustes.titular}</span>{" "}
            <span className={estilos.destacado}>
              {ajustes.titularDestacado}
              {/* Trazo dorado que se dibuja al cargar, con la curva del aro del logo */}
              <svg className={estilos.subrayado} viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                <path d="M4 15 C 90 3, 200 2, 296 11" pathLength={1} />
              </svg>
            </span>
          </h1>
          <p className={estilos.lema}>{ajustes.lema}</p>

          <div id="control-escucha" className={estilos.botones}>
            <BotonPastilla />
            <a href="#programacion" className={estilos.botonSecundario}>
              Ver programación
            </a>
          </div>
          <MensajeSenal />
          <Cifras totalProgramas={totalProgramas} />
        </div>

        <div className={`contenedor ${estilos.pieInicio}`}>
          <Dial />
        </div>
      </section>
      <Cinta frases={ajustes.frases} />
      <PausaFueraDeVista selectores={["#inicio", "#cinta"]} />
    </>
  );
}
