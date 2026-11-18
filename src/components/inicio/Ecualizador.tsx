import estilos from "./inicio.module.css";

/** Barras que bailan mientras suena la radio. Decorativo: no lo leen los lectores de pantalla. */
export function Ecualizador({ activo }: { activo: boolean }) {
  return (
    <span className={estilos.ecualizador} data-activo={activo || undefined} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
