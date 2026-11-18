import { IconoCasa, IconoHoja, IconoLibro, IconoNota } from "@/components/iconos";
import { categorias } from "@/content/categorias";
import estilos from "./a-la-carta.module.css";

/** Un ícono por sección, en el mismo orden que src/content/categorias.ts. */
const ICONOS = [IconoLibro, IconoHoja, IconoCasa, IconoNota];

export function ALaCarta() {
  return (
    <section id="a-la-carta" className={estilos.seccion} aria-labelledby="titulo-a-la-carta">
      <div className="contenedor">
        <div className={`${estilos.encabezado} revelar`}>
          <h2 id="titulo-a-la-carta">Para escuchar cuando quieras</h2>
          <span className={estilos.pronto}>Muy pronto</span>
        </div>
        <p className={`${estilos.intro} revelar`}>
          Estamos preparando una biblioteca con nuestros programas para que los escuches a tu ritmo.
        </p>
        <ul className={`${estilos.categorias} revelar`}>
          {categorias.map((categoria, indice) => {
            const Icono = ICONOS[indice % ICONOS.length];
            return (
              <li key={categoria.nombre} className={estilos.categoria}>
                <Icono className={estilos.icono} />
                <h3>{categoria.nombre}</h3>
                <p>{categoria.descripcion}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
