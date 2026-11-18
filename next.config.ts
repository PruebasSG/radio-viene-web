import type { NextConfig } from "next";
import { STREAM_URL } from "./src/config/emisora";
import { SUPABASE_URL } from "./src/lib/supabase/config";

const desarrollo = process.env.NODE_ENV !== "production";
const origenSupabase = SUPABASE_URL ? ` ${new URL(SUPABASE_URL).origin}` : "";

/**
 * Política de seguridad de contenido: el navegador solo carga recursos de
 * nuestra propia web, el audio del servidor de la radio y las imágenes del
 * blog guardadas en Supabase. Cualquier otro origen queda bloqueado.
 */
const politicaContenido = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${desarrollo ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${origenSupabase}`,
  "font-src 'self'",
  `media-src 'self' ${new URL(STREAM_URL).origin}`,
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Las imágenes del blog se reducen en el navegador antes de subirlas;
    // este límite deja margen de sobra sin superar el de Vercel (4,5 MB).
    serverActions: { bodySizeLimit: "3mb" },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: politicaContenido },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
