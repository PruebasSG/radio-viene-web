import { categorias } from "@/content/categorias";
import estilos from "./a-la-carta.module.css";

export function ALaCarta() {
  return (
    <section id="a-la-carta" className={estilos.seccion} aria-labelledby="titulo-a-la-carta">
      <div className="contenedor">
        <h2 id="titulo-a-la-carta">Para escuchar cuando quieras</h2>
        <p className={estilos.intro}>
          Estamos preparando una biblioteca con nuestros programas para que los escuches a tu ritmo. Tendrá
          estas secciones:
        </p>
        <ul className={estilos.categorias}>
          {categorias.map((categoria) => (
            <li key={categoria.nombre} className={estilos.categoria}>
              <h3>{categoria.nombre}</h3>
              <p>{categoria.descripcion}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
