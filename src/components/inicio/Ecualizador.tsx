import estilos from "./inicio.module.css";

type Props = {
  activo: boolean;
  /** Cantidad de barras (4 por defecto). */
  barras?: number;
  className?: string;
};

/** Barras que bailan mientras suena la radio. Decorativo: no lo leen los lectores de pantalla. */
export function Ecualizador({ activo, barras = 4, className }: Props) {
  return (
    <span
      className={`${estilos.ecualizador} ${className ?? ""}`}
      data-activo={activo || undefined}
      aria-hidden="true"
    >
      {Array.from({ length: barras }, (_, i) => (
        <span key={i} />
      ))}
    </span>
  );
}
