"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import estilos from "./panel.module.css";

const SECCIONES = [
  { href: "/admin", texto: "Inicio" },
  { href: "/admin/programacion", texto: "Programación" },
  { href: "/admin/blog", texto: "Blog" },
  { href: "/admin/fotos", texto: "Fotos" },
  { href: "/admin/oracion", texto: "Oración" },
  { href: "/admin/paginas", texto: "Páginas" },
  { href: "/admin/datos", texto: "Datos de la radio" },
];

/** "pendientes": peticiones de oración por revisar (se muestran como aviso en el menú). */
export function NavPanel({ pendientes = 0 }: { pendientes?: number }) {
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
                {seccion.href === "/admin/oracion" && pendientes > 0 && (
                  <span className={estilos.contador} aria-label={`${pendientes} por revisar`}>
                    {pendientes}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
