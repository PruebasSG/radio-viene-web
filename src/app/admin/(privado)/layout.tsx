import Link from "next/link";
import { salir } from "@/app/admin/acciones";
import { Logo } from "@/components/Logo";
import { NavPanel } from "@/components/admin/NavPanel";
import estilos from "@/components/admin/panel.module.css";
import { radio } from "@/content/radio";

/**
 * Estructura común de las páginas privadas del panel.
 * El acceso NO se comprueba aquí: lo hace cada página y cada acción.
 */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className={estilos.barra}>
        <div className={estilos.barraInterior}>
          <Link href="/admin" className={estilos.marca}>
            <Logo alto={30} className={estilos.marcaLogo} />
            {radio.nombre}
            <span>Panel</span>
          </Link>
          <div className={estilos.cuenta}>
            <a href="/" target="_blank" rel="noopener noreferrer">
              Ver la web
            </a>
            <form action={salir}>
              <button type="submit" className={estilos.enlaceSalir}>
                Cerrar sesión
              </button>
            </form>
          </div>
          <NavPanel />
        </div>
      </header>
      <main className={estilos.contenido}>{children}</main>
    </>
  );
}
