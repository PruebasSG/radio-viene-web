"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { BotonEscuchar } from "@/components/reproductor/BotonEscuchar";
import { useReproductor } from "@/components/reproductor/ReproductorProvider";
import { radio } from "@/content/radio";
import estilos from "./cabecera.module.css";

// Con "/" delante, los enlaces funcionan también desde las páginas del blog.
const ENLACES = [
  { href: "/#programacion", texto: "Programación" },
  { href: "/#pedidos", texto: "Pedidos y saludos" },
  { href: "/#oracion", texto: "Oración" },
  { href: "/blog", texto: "Blog" },
];

/**
 * Cabecera fija: amplia al comienzo de la página y compacta al bajar.
 * Si el botón grande de «Escuchar» ya no se ve, aparece uno pequeño aquí,
 * para que siempre se pueda poner la radio con un toque.
 */
export function Cabecera() {
  const ruta = usePathname();
  const { usado } = useReproductor();
  const [compacta, setCompacta] = useState(false);
  const [controlVisible, setControlVisible] = useState(true);
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

  // En la portada, vigila si el botón grande de «Escuchar» está a la vista.
  const enPortada = ruta === "/";
  useEffect(() => {
    const control = document.getElementById("control-escucha");
    if (!enPortada || !control) return;
    const observador = new IntersectionObserver(([entrada]) => setControlVisible(entrada.isIntersecting), {
      rootMargin: "-72px 0px 0px 0px",
    });
    observador.observe(control);
    return () => observador.disconnect();
  }, [enPortada]);

  // El menú del móvil se cierra con la tecla Escape.
  useEffect(() => {
    if (!menuAbierto) return;
    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setMenuAbierto(false);
    };
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [menuAbierto]);

  const mostrarEscuchar = !usado && !(enPortada && controlVisible);

  return (
    <header className={estilos.cabecera} data-compacta={compacta || menuAbierto || undefined}>
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
          <div className={estilos.escuchar} data-visible={mostrarEscuchar || undefined}>
            <BotonEscuchar tamano="mini" />
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
