import { AHORA_SUENA_URL } from "@/config/emisora";
import { desdeAzuraCast, SIN_SENAL } from "@/lib/ahora-suena";

/**
 * GET /api/ahora
 * Consulta AzuraCast desde el servidor de la web y devuelve solo lo necesario.
 * Así el navegador no depende de la configuración del servidor de radio y la
 * respuesta se guarda 15 segundos para no saturarlo.
 */
export async function GET() {
  const cabeceras = {
    "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30",
  };

  try {
    const respuesta = await fetch(AHORA_SUENA_URL, {
      next: { revalidate: 15 },
      signal: AbortSignal.timeout(5000),
    });
    if (!respuesta.ok) throw new Error(`AzuraCast respondió ${respuesta.status}`);

    return Response.json(desdeAzuraCast(await respuesta.json()), { headers: cabeceras });
  } catch {
    return Response.json(SIN_SENAL, { headers: cabeceras });
  }
}
