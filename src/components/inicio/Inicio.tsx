import { BotonEscuchar } from "@/components/reproductor/BotonEscuchar";
import { radio } from "@/content/radio";
import { AhoraYDespues } from "./AhoraYDespues";
import { Dial } from "./Dial";
import { MensajeSenal } from "./MensajeSenal";
import estilos from "./inicio.module.css";

export function Inicio() {
  return (
    <section id="inicio" className={estilos.inicio} aria-labelledby="titulo-inicio">
      <div className={`contenedor ${estilos.rejilla}`}>
        <div>
          <h1 id="titulo-inicio" className={estilos.titulo}>
            {radio.nombre}
            <span className="solo-lectores">
              {" "}
              {radio.frecuencia} {radio.banda}
            </span>
          </h1>
          <p className={estilos.lema}>{radio.lema}</p>
        </div>
        <div className={estilos.control}>
          <BotonEscuchar />
          <MensajeSenal />
        </div>
      </div>

      <div className="contenedor">
        <Dial />
        <AhoraYDespues />
      </div>
    </section>
  );
}
