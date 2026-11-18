import Link from "next/link";
import { radio } from "@/content/radio";
import estilos from "./cabecera.module.css";

// Con "/" delante, los enlaces funcionan también desde las páginas del blog.
const ENLACES = [
  { href: "/#programacion", texto: "Programación" },
  { href: "/#pedidos", texto: "Pedidos y saludos" },
  { href: "/#oracion", texto: "Oración" },
  { href: "/blog", texto: "Blog" },
];

export function Cabecera() {
  return (
    <header className={estilos.cabecera}>
      <div className={`contenedor ${estilos.interior}`}>
        <Link href="/" className={estilos.marca}>
          <span className={estilos.marcaNombre}>{radio.nombre}</span>
          <span className={estilos.marcaFrecuencia}>
            {radio.frecuencia} {radio.banda}
          </span>
        </Link>
        <nav aria-label="Secciones">
          <ul className={estilos.menu}>
            {ENLACES.map((enlace) => (
              <li key={enlace.href}>
                <Link href={enlace.href}>{enlace.texto}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
