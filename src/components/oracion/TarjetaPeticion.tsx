import { fechaLegible } from "@/lib/blog";
import type { Peticion } from "@/lib/oracion";
import { BotonOrar } from "./BotonOrar";
import estilos from "./muro.module.css";

export function TarjetaPeticion({ peticion }: { peticion: Peticion }) {
  return (
    <article className={estilos.peticion}>
      <p className={estilos.peticionTexto}>{peticion.texto}</p>
      <footer className={estilos.peticionPie}>
        <p className={estilos.peticionAutor}>
          {peticion.nombre ?? "Anónimo"}
          {peticion.publicadaEn && (
            <>
              {" · "}
              <time dateTime={peticion.publicadaEn}>{fechaLegible(peticion.publicadaEn)}</time>
            </>
          )}
        </p>
        <BotonOrar id={peticion.id} inicial={peticion.oraciones} />
      </footer>
    </article>
  );
}
