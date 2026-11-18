import type { MetadataRoute } from "next";
import { ajustesRespaldo, radio } from "@/content/radio";

/** Permite instalar la web como una app en el móvil. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${radio.nombre} ${radio.frecuencia} ${radio.banda}`,
    short_name: radio.nombre,
    description: ajustesRespaldo.lema,
    lang: "es",
    start_url: "/",
    display: "standalone",
    background_color: "#0e2140",
    theme_color: "#0e2140",
    icons: [
      { src: "/iconos/icono-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/iconos/icono-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/iconos/icono-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
