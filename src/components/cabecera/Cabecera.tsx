import { radio } from "@/content/radio";
import estilos from "./cabecera.module.css";

const ENLACES = [
  { href: "#programacion", texto: "Programación" },
  { href: "#pedidos", texto: "Pedidos y saludos" },
  { href: "#oracion", texto: "Oración" },
  { href: "#a-la-carta", texto: "A la carta" },
];

export function Cabecera() {
  return (
    <header className={estilos.cabecera}>
      <div className={`contenedor ${estilos.interior}`}>
        <a href="#inicio" className={estilos.marca}>
          <span className={estilos.marcaNombre}>{radio.nombre}</span>
          <span className={estilos.marcaFrecuencia}>
            {radio.frecuencia} {radio.banda}
          </span>
        </a>
        <nav aria-label="Secciones">
          <ul className={estilos.menu}>
            {ENLACES.map((enlace) => (
              <li key={enlace.href}>
                <a href={enlace.href}>{enlace.texto}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
