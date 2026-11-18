import { IconoCasa, IconoCorazon, IconoLibro, IconoMicrofono, IconoNota } from "@/components/iconos";
import { radio } from "@/content/radio";
import type { Foto } from "@/lib/fotos";
import estilos from "./inicio.module.css";

/** Tarjetas de diseño que completan el mosaico mientras no haya fotos suficientes. */
const TARJETAS = [
  { Icono: IconoNota, texto: "Música que edifica" },
  { Icono: IconoLibro, texto: "La Biblia para cada día" },
  { Icono: null, texto: radio.frecuencia },
  { Icono: IconoCorazon, texto: "Oramos contigo" },
  { Icono: IconoCasa, texto: "Esperanza para tu familia" },
  { Icono: IconoMicrofono, texto: "En vivo desde Venezuela" },
] as const;

/** Proporciones que se alternan para dar ritmo al mosaico. */
const FORMATOS = ["3 / 4", "4 / 3", "1 / 1", "4 / 5", "5 / 4", "3 / 4"];
const MINIMO_PIEZAS = 12;
const COLUMNAS = 3;

type Pieza = { tipo: "foto"; foto: Foto } | { tipo: "tarjeta"; indice: number };

function Contenido({ pieza, formato, visible }: { pieza: Pieza; formato: string; visible: boolean }) {
  if (pieza.tipo === "foto") {
    return (
      <div className={estilos.pieza} style={{ aspectRatio: formato }}>
        {/* Decorativa: el mosaico entero está oculto a los lectores de pantalla. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pieza.foto.urlMini}
          alt=""
          width={pieza.foto.ancho}
          height={pieza.foto.alto}
          // Las que se ven al abrir la página cargan enseguida; el resto, cuando aparecen.
          loading={visible ? "eager" : "lazy"}
          decoding="async"
          fetchPriority="low"
        />
      </div>
    );
  }
  const { Icono, texto } = TARJETAS[pieza.indice % TARJETAS.length];
  return (
    <div className={estilos.pieza} data-tarjeta style={{ aspectRatio: formato }}>
      {Icono ? <Icono className={estilos.piezaIcono} /> : <span className={estilos.piezaFrecuencia}>{texto}</span>}
      {Icono && <span className={estilos.piezaTexto}>{texto}</span>}
    </div>
  );
}

/**
 * Mosaico de la portada: tres columnas inclinadas que se deslizan despacio,
 * alternando la dirección. Cada columna se repite dos veces para que el
 * movimiento sea un ciclo continuo, sin saltos.
 */
export function Mosaico({ fotos }: { fotos: Foto[] }) {
  const piezas: Pieza[] = fotos.map((foto) => ({ tipo: "foto", foto }));
  for (let i = 0; piezas.length < MINIMO_PIEZAS; i++) piezas.push({ tipo: "tarjeta", indice: i });

  const columnas: Pieza[][] = Array.from({ length: COLUMNAS }, () => []);
  piezas.forEach((pieza, i) => columnas[i % COLUMNAS].push(pieza));

  return (
    <div className={estilos.mosaico} aria-hidden="true">
      {columnas.map((columna, c) => (
        <div key={c} className={estilos.columna}>
          <div className={estilos.pista}>
            {[...columna, ...columna].map((pieza, i) => (
              <Contenido
                key={i}
                pieza={pieza}
                formato={FORMATOS[(i + c * 2) % FORMATOS.length]}
                visible={i < 2}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
