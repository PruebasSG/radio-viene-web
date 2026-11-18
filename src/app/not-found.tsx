import Link from "next/link";
import estilos from "./not-found.module.css";

export default function NoEncontrada() {
  return (
    <section className={`contenedor ${estilos.pagina}`}>
      <h1>Esta página no existe</h1>
      <p>Puede que el enlace esté mal escrito o que la página se haya movido.</p>
      <Link href="/">Volver al inicio y escuchar la radio</Link>
    </section>
  );
}
