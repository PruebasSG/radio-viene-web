/**
 * Prepara una foto en el navegador antes de subirla:
 * la reduce a 1600 px como máximo y la comprime (WebP o, si el navegador
 * no lo permite, JPG). Una foto de móvil de 5 MB suele quedar en 200–400 KB.
 */

const LADO_MAXIMO = 1600;
/** Tamaño de las miniaturas (mosaico, galerías): carga mucho más rápido. */
export const LADO_MINI = 640;

const aBlob = (lienzo: HTMLCanvasElement, tipo: string, calidad: number) =>
  new Promise<Blob | null>((resolver) => lienzo.toBlob(resolver, tipo, calidad));

export type ImagenPreparada = { archivo: File; ancho: number; alto: number };

export async function prepararImagen(original: File, ladoMaximo = LADO_MAXIMO): Promise<ImagenPreparada> {
  let mapa: ImageBitmap;
  try {
    mapa = await createImageBitmap(original);
  } catch {
    throw new Error("No se pudo leer la imagen. Prueba con una foto JPG o PNG.");
  }

  const escala = Math.min(1, ladoMaximo / Math.max(mapa.width, mapa.height));
  const ancho = Math.round(mapa.width * escala);
  const alto = Math.round(mapa.height * escala);

  const lienzo = document.createElement("canvas");
  lienzo.width = ancho;
  lienzo.height = alto;
  const contexto = lienzo.getContext("2d");
  if (!contexto) throw new Error("Tu navegador no permite preparar la imagen.");
  contexto.drawImage(mapa, 0, 0, ancho, alto);
  mapa.close();

  // Algunos navegadores (como Safari) no generan WebP y devuelven PNG: entonces usamos JPG.
  let blob = await aBlob(lienzo, "image/webp", 0.82);
  if (!blob || blob.type !== "image/webp") blob = await aBlob(lienzo, "image/jpeg", 0.85);
  if (!blob) throw new Error("No se pudo preparar la imagen.");

  const extension = blob.type === "image/webp" ? "webp" : "jpg";
  return { archivo: new File([blob], `imagen.${extension}`, { type: blob.type }), ancho, alto };
}
