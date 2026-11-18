import estilos from "./inicio.module.css";

/** Cinta dorada con las frases de la radio, desplazándose sin fin. Las frases se editan en el panel. */
export function Cinta({ frases }: { frases: string[] }) {
  if (frases.length === 0) return null;
  // Repetimos las frases hasta llenar de sobra pantallas anchas; luego se duplica el bloque para el ciclo.
  const bloque = Array.from({ length: Math.ceil(10 / frases.length) }, () => frases).flat();

  return (
    <div id="cinta" className={estilos.cinta} aria-hidden="true">
      <div className={estilos.cintaPista}>
        {[...bloque, ...bloque].map((frase, i) => (
          <span key={i} className={estilos.cintaFrase}>
            {frase}
            <span className={estilos.cintaSeparador}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
