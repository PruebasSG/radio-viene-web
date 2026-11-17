import type { MetadataRoute } from "next";
import { radio } from "@/content/radio";

/** Permite instalar la web como una app en el móvil. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${radio.nombre} ${radio.frecuencia} ${radio.banda}`,
    short_name: radio.nombre,
    description: radio.lema,
    lang: "es",
    start_url: "/",
    display: "standalone",
    background_color: "#0e2140",
    theme_color: "#0e2140",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
