"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { subirFoto } from "@/app/admin/acciones";
import { LADO_MINI, prepararImagen } from "@/lib/admin/imagen";
import type { SeccionFoto } from "@/lib/fotos";
import estilos from "./panel.module.css";

/**
 * Sube varias fotos a la vez. Cada una se reduce en el navegador a dos tamaños
 * (1600 y 640 px) antes de enviarse: una foto de móvil de varios MB queda en
 * unos cientos de KB.
 */
export function SubidaFotos({ seccion }: { seccion: SeccionFoto }) {
  const router = useRouter();
  const selector = useRef<HTMLInputElement>(null);
  const [estado, setEstado] = useState("");
  const [trabajando, setTrabajando] = useState(false);

  const subir = async (archivos: FileList | null) => {
    if (!archivos?.length) return;
    setTrabajando(true);
    const lista = Array.from(archivos);
    const fallos: string[] = [];

    for (const [i, archivo] of lista.entries()) {
      setEstado(`Subiendo ${i + 1} de ${lista.length}…`);
      try {
        const [grande, mini] = await Promise.all([prepararImagen(archivo), prepararImagen(archivo, LADO_MINI)]);
        const datos = new FormData();
        datos.append("seccion", seccion);
        datos.append("imagen", grande.archivo);
        datos.append("mini", mini.archivo);
        datos.append("ancho", String(grande.ancho));
        datos.append("alto", String(grande.alto));
        const resultado = await subirFoto(datos);
        if ("error" in resultado) fallos.push(`${archivo.name}: ${resultado.error}`);
      } catch (problema) {
        fallos.push(`${archivo.name}: ${problema instanceof Error ? problema.message : "no se pudo leer"}`);
      }
    }

    const subidas = lista.length - fallos.length;
    setEstado(
      [
        subidas > 0 ? `${subidas === 1 ? "1 foto subida" : `${subidas} fotos subidas`}.` : "",
        fallos.length ? `No se pudieron subir: ${fallos.join(" · ")}` : "",
      ]
        .filter(Boolean)
        .join(" "),
    );
    setTrabajando(false);
    if (selector.current) selector.current.value = "";
    router.refresh();
  };

  return (
    <div className={estilos.subida}>
      <button
        type="button"
        className={`${estilos.boton} ${estilos.botonDorado}`}
        onClick={() => selector.current?.click()}
        disabled={trabajando}
      >
        {trabajando ? "Subiendo…" : "+ Subir fotos"}
      </button>
      <input
        ref={selector}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(evento) => subir(evento.target.files)}
      />
      {estado && (
        <p className={estilos.ayuda} role="status">
          {estado}
        </p>
      )}
    </div>
  );
}
