import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { SITE_URL } from "@/config/emisora";
import { ajustesRespaldo, radio } from "@/content/radio";

const titulo = `${radio.nombre} ${radio.frecuencia} ${radio.banda}`;

/**
 * Tipografías alojadas en la propia web (licencia libre OFL, ver carpeta fuentes).
 * Next.js las precarga y ajusta la letra de reserva para que el texto
 * no "salte" cuando terminan de cargar.
 */
const literata = localFont({
  src: "./fuentes/literata.woff2",
  weight: "200 900",
  variable: "--fuente-literata",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const figtree = localFont({
  src: "./fuentes/figtree.woff2",
  weight: "300 900",
  variable: "--fuente-figtree",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: titulo, template: `%s | ${titulo}` },
  description: ajustesRespaldo.descripcion,
  applicationName: radio.nombre,
  // Verificación opcional de Google Search Console y Bing con etiqueta.
  // (Recomendado: verificar por DNS, que no necesita estas variables.)
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
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
    <html lang="es" className={`${literata.variable} ${figtree.variable}`}>
      <body>{children}</body>
    </html>
  );
}
