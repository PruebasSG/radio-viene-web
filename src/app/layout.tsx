import type { Metadata, Viewport } from "next";
import "@fontsource-variable/literata/opsz.css";
import "@fontsource-variable/figtree";
import "./globals.css";

import { SITE_URL } from "@/config/emisora";
import { ajustesRespaldo, radio } from "@/content/radio";

const titulo = `${radio.nombre} ${radio.frecuencia} ${radio.banda}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: titulo, template: `%s | ${titulo}` },
  description: ajustesRespaldo.descripcion,
  applicationName: radio.nombre,
  openGraph: {
    type: "website",
    locale: "es_VE",
    siteName: titulo,
    title: titulo,
    description: ajustesRespaldo.lema,
  },
};

export const viewport: Viewport = {
  themeColor: "#0e2140",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
