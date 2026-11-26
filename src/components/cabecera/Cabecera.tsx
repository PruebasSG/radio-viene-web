"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { BotonPastilla } from "@/components/reproductor/BotonPastilla";
import { radio } from "@/content/radio";
import estilos from "./cabecera.module.css";

// Con "/" delante, los enlaces funcionan también desde las páginas del blog.
const ENLACES = [
  { href: "/#programacion", texto: "Programación" },
  { href: "/oracion", texto: "Oración" },
  { href: "/blog", texto: "Blog" },
  { href: "/quienes-somos", texto: "Quiénes somos" },
  { href: "/contacto", texto: "Contacto" },
];

/**
 * Cabecera fija. En la portada empieza transparente, sobre el mosaico de fotos;
 * al bajar (y en el resto de páginas) se vuelve sólida y compacta.
 */
export function Cabecera() {
  const ruta = usePathname();
  const [compacta, setCompacta] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    let pendiente = false;
    const revisar = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        setCompacta(window.scrollY > 24);
        pendiente = false;
      });
    };
    revisar();
    window.addEventListener("scroll", revisar, { passive: true });
    return () => window.removeEventListener("scroll", revisar);
  }, []);

  // El menú del móvil se cierra con la tecla Escape.
  useEffect(() => {
    if (!menuAbierto) return;
    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setMenuAbierto(false);
    };
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [menuAbierto]);

  const transparente = ruta === "/" && !compacta && !menuAbierto;

  return (
    <header
      className={estilos.cabecera}
      data-compacta={compacta || menuAbierto || undefined}
      data-transparente={transparente || undefined}
    >
      <div className={`contenedor ${estilos.interior}`}>
        <Link href="/" className={estilos.marca} onClick={() => setMenuAbierto(false)}>
          <Logo alto={40} className={estilos.marcaLogo} prioritario />
          <span className={estilos.marcaNombre}>{radio.nombre}</span>
          <span className={estilos.marcaFrecuencia}>
            {radio.frecuencia} {radio.banda}
          </span>
        </Link>

        <nav aria-label="Secciones" className={estilos.navEscritorio}>
          <ul className={estilos.menu}>
            {ENLACES.map((enlace) => (
              <li key={enlace.href}>
                <Link href={enlace.href}>{enlace.texto}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={estilos.acciones}>
          <div className={estilos.escuchar}>
            <BotonPastilla variante="clara" />
          </div>
          <button
            type="button"
            className={estilos.botonMenu}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            <span className={estilos.iconoMenu} aria-hidden="true" data-abierto={menuAbierto || undefined}>
              <span />
              <span />
            </span>
            <span className={estilos.textoMenu}>{menuAbierto ? "Cerrar" : "Menú"}</span>
          </button>
        </div>
      </div>

      <nav
        id="menu-movil"
        aria-label="Secciones"
        className={estilos.menuMovil}
        data-abierto={menuAbierto || undefined}
        hidden={!menuAbierto}
      >
        <ul className="contenedor">
          {ENLACES.map((enlace) => (
            <li key={enlace.href}>
              <Link href={enlace.href} onClick={() => setMenuAbierto(false)}>
                {enlace.texto}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
