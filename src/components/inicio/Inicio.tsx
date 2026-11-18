import { Logo } from "@/components/Logo";
import { BotonEscuchar } from "@/components/reproductor/BotonEscuchar";
import { radio } from "@/content/radio";
import { AhoraYDespues } from "./AhoraYDespues";
import { Dial } from "./Dial";
import { MensajeSenal } from "./MensajeSenal";
import estilos from "./inicio.module.css";

export function Inicio({ lema }: { lema: string }) {
  return (
    <section id="inicio" className={estilos.inicio} aria-labelledby="titulo-inicio">
      <div className={`contenedor ${estilos.rejilla}`}>
        <div className={estilos.presentacion}>
          <Logo alto={136} className={estilos.logo} prioritario />
          <h1 id="titulo-inicio" className={estilos.titulo}>
            {radio.nombre}
            <span className="solo-lectores">
              {" "}
              {radio.frecuencia} {radio.banda}
            </span>
          </h1>
          <p className={estilos.lema}>{lema}</p>
          <div id="control-escucha" className={estilos.control}>
            <BotonEscuchar />
            <MensajeSenal />
          </div>
        </div>
        <AhoraYDespues />
      </div>

      <div className="contenedor">
        <Dial />
      </div>
    </section>
  );
}
