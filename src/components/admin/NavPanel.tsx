"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import estilos from "./panel.module.css";

const SECCIONES = [
  { href: "/admin", texto: "Inicio" },
  { href: "/admin/programacion", texto: "Programación" },
  { href: "/admin/datos", texto: "Datos de la radio" },
];

export function NavPanel() {
  const ruta = usePathname();

  return (
    <nav className={estilos.nav} aria-label="Secciones del panel">
      <ul>
        {SECCIONES.map((seccion) => {
          const activa = seccion.href === "/admin" ? ruta === "/admin" : ruta.startsWith(seccion.href);
          return (
            <li key={seccion.href}>
              <Link href={seccion.href} aria-current={activa ? "page" : undefined}>
                {seccion.texto}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
