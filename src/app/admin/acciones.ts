"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { REDES_DISPONIBLES } from "@/content/radio";
import { exigirAdmin } from "@/lib/admin/sesion";
import type { EstadoFormulario, ResultadoFoto, ResultadoImagen } from "@/lib/admin/tipos";
import {
  DIAS_SEMANA,
  erroresPorCampo,
  esIdValido,
  esImagenReal,
  esquemaAjustes,
  esquemaArticulo,
  esquemaIngreso,
  esquemaModeracion,
  esquemaPagina,
  esquemaPortada,
  esquemaPrograma,
} from "@/lib/admin/validacion";
import { SECCIONES_FOTOS, type SeccionFoto } from "@/lib/fotos";
import { aMinutos, horaLegible, NOMBRE_DIA } from "@/lib/horario";
import { esSlugPagina } from "@/lib/paginas";
import { SUPABASE_URL } from "@/lib/supabase/config";
import { crearClienteServidor } from "@/lib/supabase/servidor";

/**
 * Acciones del panel. Todas se ejecutan en el servidor de la web y comprueban
 * que quien las usa es administrador antes de tocar la base de datos.
 */

const texto = (datos: FormData, campo: string) => String(datos.get(campo) ?? "");

/** Regenera la web pública para que muestre el cambio de inmediato. */
const actualizarWeb = () => revalidatePath("/", "layout");

// ---------- Sesión ----------

export async function ingresar(_: EstadoFormulario, datos: FormData): Promise<EstadoFormulario> {
  const valores = { email: texto(datos, "email") };
  const supabase = await crearClienteServidor();
  if (!supabase) return { mensaje: "El panel todavía no está conectado a la base de datos.", valores };

  const resultado = esquemaIngreso.safeParse({ email: valores.email.trim(), password: texto(datos, "password") });
  if (!resultado.success) return { mensaje: "Escribe tu correo y tu contraseña.", valores };

  const { error } = await supabase.auth.signInWithPassword(resultado.data);
  if (error) return { mensaje: "El correo o la contraseña no son correctos.", valores };

  const { data: esAdmin } = await supabase.rpc("es_admin");
  if (esAdmin !== true) {
    await supabase.auth.signOut();
    return { mensaje: "Esta cuenta no tiene acceso al panel. Pide acceso al responsable de la radio.", valores };
  }

  redirect("/admin");
}

export async function salir(): Promise<void> {
  const supabase = await crearClienteServidor();
  await supabase?.auth.signOut();
  redirect("/admin/ingresar");
}

// ---------- Programación ----------

export async function guardarPrograma(
  id: string | null,
  _: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  const { supabase } = await exigirAdmin();
  if (id !== null && !esIdValido(id)) return { mensaje: "No encontramos ese programa." };

  const valores = {
    nombre: texto(datos, "nombre"),
    descripcion: texto(datos, "descripcion"),
    conductor: texto(datos, "conductor"),
    dias: datos.getAll("dias").map(String),
    inicio: texto(datos, "inicio"),
    fin: texto(datos, "fin"),
    activo: datos.get("activo") === "on",
  };

  const resultado = esquemaPrograma.safeParse(valores);
  if (!resultado.success) {
    return { mensaje: "Revisa los campos marcados.", errores: erroresPorCampo(resultado.error), valores };
  }

  const programa = resultado.data;
  // En el formulario, medianoche se elige como 12:00 a. m.; se guarda como 24:00.
  const fin = programa.fin === "00:00" ? "24:00" : programa.fin;
  if (aMinutos(fin) <= aMinutos(programa.inicio)) {
    return {
      mensaje: "Revisa los campos marcados.",
      errores: { fin: "Debe terminar después de empezar. Si termina a medianoche, elige 12:00 a. m." },
      valores,
    };
  }

  // Un programa visible no puede pisar el horario de otro en el mismo día.
  if (programa.activo) {
    const { data: otros, error } = await supabase
      .from("programas")
      .select("id, nombre, dias, inicio, fin")
      .eq("activo", true)
      .overlaps("dias", programa.dias);

    if (error) return { mensaje: "No se pudo comprobar el horario. Inténtalo de nuevo.", valores };

    for (const otro of otros ?? []) {
      if (otro.id === id) continue;
      const otroInicio = aMinutos(String(otro.inicio).slice(0, 5));
      const otroFin = aMinutos(String(otro.fin).slice(0, 5));
      if (aMinutos(programa.inicio) < otroFin && otroInicio < aMinutos(fin)) {
        const dia = DIAS_SEMANA.find((d) => programa.dias.includes(d) && (otro.dias as string[]).includes(d));
        return {
          mensaje: `El horario se cruza con «${otro.nombre}» el ${dia ? NOMBRE_DIA[dia].largo.toLowerCase() : "mismo día"} (de ${horaLegible(String(otro.inicio))} a ${horaLegible(String(otro.fin))}). Ajusta las horas o los días.`,
          errores: { inicio: "Se cruza con otro programa.", fin: "Se cruza con otro programa." },
          valores,
        };
      }
    }
  }

  const fila = {
    nombre: programa.nombre,
    descripcion: programa.descripcion,
    conductor: programa.conductor || null,
    dias: DIAS_SEMANA.filter((d) => programa.dias.includes(d)),
    inicio: programa.inicio,
    fin,
    activo: programa.activo,
  };

  const { data: guardado, error } = id
    ? await supabase.from("programas").update(fila).eq("id", id).select("id")
    : await supabase.from("programas").insert(fila).select("id");

  if (error || !guardado?.length) {
    if (error) console.error("Error al guardar el programa:", error.message);
    return { mensaje: "No se pudo guardar. Inténtalo de nuevo en unos segundos.", valores };
  }

  actualizarWeb();
  redirect("/admin/programacion?guardado=1");
}

export async function eliminarPrograma(id: string): Promise<void> {
  const { supabase } = await exigirAdmin();
  if (!esIdValido(id)) redirect("/admin/programacion");

  const { error } = await supabase.from("programas").delete().eq("id", id);
  if (error) {
    console.error("Error al eliminar el programa:", error.message);
    redirect(`/admin/programacion/${id}?error=eliminar`);
  }

  actualizarWeb();
  redirect("/admin/programacion?eliminado=1");
}

// ---------- Datos de la radio ----------

export async function guardarAjustes(_: EstadoFormulario, datos: FormData): Promise<EstadoFormulario> {
  const { supabase } = await exigirAdmin();

  const valores: Record<string, string> = {
    lema: texto(datos, "lema"),
    descripcion: texto(datos, "descripcion"),
    whatsapp: texto(datos, "whatsapp"),
    correo: texto(datos, "correo"),
  };
  for (const red of REDES_DISPONIBLES) valores[`redes.${red}`] = texto(datos, `redes.${red}`);

  // Los textos de la portada solo llegan si ya existe su lugar en la base de datos (fotos.sql).
  const conPortada = datos.get("conPortada") === "1";
  let portada: Record<string, unknown> = {};
  if (conPortada) {
    valores.titular = texto(datos, "titular");
    valores.titularDestacado = texto(datos, "titularDestacado");
    valores.frases = texto(datos, "frases");
    const resultadoPortada = esquemaPortada.safeParse(valores);
    if (!resultadoPortada.success) {
      return { mensaje: "Revisa los campos marcados.", errores: erroresPorCampo(resultadoPortada.error), valores };
    }
    portada = {
      titular: resultadoPortada.data.titular,
      titular_destacado: resultadoPortada.data.titularDestacado,
      frases: resultadoPortada.data.frases,
    };
  }

  const resultado = esquemaAjustes.safeParse({
    lema: valores.lema,
    descripcion: valores.descripcion,
    whatsapp: valores.whatsapp,
    correo: valores.correo,
    redes: Object.fromEntries(REDES_DISPONIBLES.map((red) => [red, valores[`redes.${red}`]])),
  });
  if (!resultado.success) {
    return { mensaje: "Revisa los campos marcados.", errores: erroresPorCampo(resultado.error), valores };
  }

  const { redes, ...resto } = resultado.data;
  const { data: guardado, error } = await supabase
    .from("ajustes")
    .update({
      ...resto,
      ...portada,
      redes: REDES_DISPONIBLES.filter((red) => redes[red] !== "").map((red) => ({ nombre: red, url: redes[red] })),
    })
    .eq("id", 1)
    .select("id");

  if (error || !guardado?.length) {
    if (error) console.error("Error al guardar los datos de la radio:", error.message);
    return { mensaje: "No se pudo guardar. Inténtalo de nuevo en unos segundos.", valores };
  }

  actualizarWeb();
  return { ok: true, mensaje: "Cambios guardados. Ya se ven en la web.", valores };
}

// ---------- Blog ----------

const TIPOS_IMAGEN: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAXIMO_IMAGEN = 3 * 1024 * 1024;

/** Sube una imagen (ya reducida en el navegador) a la carpeta pública del blog. */
export async function subirImagenBlog(datos: FormData): Promise<ResultadoImagen> {
  const { supabase } = await exigirAdmin();
  const archivo = datos.get("imagen");

  if (!(archivo instanceof File) || archivo.size === 0) return { error: "No llegó ninguna imagen." };
  const extension = TIPOS_IMAGEN[archivo.type];
  if (!extension) return { error: "Usa una imagen JPG, PNG o WebP." };
  if (archivo.size > MAXIMO_IMAGEN) return { error: "La imagen pesa demasiado (máximo 3 MB)." };

  const bytes = new Uint8Array(await archivo.arrayBuffer());
  if (!esImagenReal(bytes)) return { error: "El archivo no parece una imagen válida." };

  const hoy = new Date();
  const ruta = `${hoy.getUTCFullYear()}/${String(hoy.getUTCMonth() + 1).padStart(2, "0")}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from("blog").upload(ruta, bytes, {
    contentType: archivo.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    console.error("Error al subir la imagen:", error.message);
    return { error: "No se pudo subir la imagen. Inténtalo de nuevo." };
  }

  return { url: supabase.storage.from("blog").getPublicUrl(ruta).data.publicUrl };
}

export async function guardarArticulo(
  id: string | null,
  _: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  const { supabase } = await exigirAdmin();
  if (id !== null && !esIdValido(id)) return { mensaje: "No encontramos ese artículo." };

  const campos = [
    "titulo",
    "slug",
    "extracto",
    "contenido",
    "categoria",
    "autor",
    "portadaUrl",
    "portadaAncho",
    "portadaAlto",
    "portadaAlt",
    "estado",
    "publicadoEn",
  ] as const;
  const valores = Object.fromEntries(campos.map((campo) => [campo, texto(datos, campo)])) as Record<
    (typeof campos)[number],
    string
  >;

  const resultado = esquemaArticulo.safeParse({
    ...valores,
    portadaAncho: valores.portadaAncho || 0,
    portadaAlto: valores.portadaAlto || 0,
  });
  if (!resultado.success) {
    return { mensaje: "Revisa los campos marcados.", errores: erroresPorCampo(resultado.error), valores };
  }
  const articulo = resultado.data;

  // Solo se aceptan portadas subidas a nuestra propia carpeta del blog.
  const origenPermitido = `${SUPABASE_URL}/storage/v1/object/public/blog/`;
  if (articulo.portadaUrl !== "" && !articulo.portadaUrl.startsWith(origenPermitido)) {
    return { mensaje: "La imagen de portada no es válida. Vuelve a subirla.", valores };
  }

  const tienePortada = articulo.portadaUrl !== "";
  const fila = {
    titulo: articulo.titulo,
    slug: articulo.slug,
    extracto: articulo.extracto,
    contenido: articulo.contenido,
    categoria: articulo.categoria,
    autor: articulo.autor,
    portada_url: tienePortada ? articulo.portadaUrl : null,
    portada_ancho: tienePortada && articulo.portadaAncho > 0 ? articulo.portadaAncho : null,
    portada_alto: tienePortada && articulo.portadaAlto > 0 ? articulo.portadaAlto : null,
    portada_alt: tienePortada ? articulo.portadaAlt : "",
    estado: articulo.estado,
    // Al publicar sin fecha, se publica en este momento.
    publicado_en: articulo.publicadoEn
      ? new Date(articulo.publicadoEn).toISOString()
      : articulo.estado === "publicado"
        ? new Date().toISOString()
        : null,
  };

  const { data: guardado, error } = id
    ? await supabase.from("articulos").update(fila).eq("id", id).select("id")
    : await supabase.from("articulos").insert(fila).select("id");

  if (error?.code === "23505") {
    return {
      mensaje: "Revisa los campos marcados.",
      errores: { slug: "Ya existe un artículo con esta dirección. Cambia alguna palabra." },
      valores,
    };
  }
  if (error || !guardado?.length) {
    if (error) console.error("Error al guardar el artículo:", error.message);
    return { mensaje: "No se pudo guardar. Inténtalo de nuevo en unos segundos.", valores };
  }

  actualizarWeb();
  redirect(`/admin/blog/${guardado[0].id}?guardado=1`);
}

export async function eliminarArticulo(id: string): Promise<void> {
  const { supabase } = await exigirAdmin();
  if (!esIdValido(id)) redirect("/admin/blog");

  const { error } = await supabase.from("articulos").delete().eq("id", id);
  if (error) {
    console.error("Error al eliminar el artículo:", error.message);
    redirect(`/admin/blog/${id}?error=eliminar`);
  }

  actualizarWeb();
  redirect("/admin/blog?eliminado=1");
}

// ---------- Fotos ----------

const actualizarFotosWeb = () => revalidatePath("/", "layout");

/** Lee y comprueba una imagen recibida del navegador. */
async function leerImagen(valor: FormDataEntryValue | null): Promise<{ bytes: Uint8Array; tipo: string } | null> {
  if (!(valor instanceof File) || valor.size === 0 || valor.size > MAXIMO_IMAGEN) return null;
  if (!TIPOS_IMAGEN[valor.type]) return null;
  const bytes = new Uint8Array(await valor.arrayBuffer());
  return esImagenReal(bytes) ? { bytes, tipo: valor.type } : null;
}

/** Ruta dentro de la carpeta "fotos" a partir de su dirección pública. */
function rutaDeFoto(url: string): string | null {
  const marca = "/storage/v1/object/public/fotos/";
  const i = url.indexOf(marca);
  return i >= 0 ? decodeURIComponent(url.slice(i + marca.length)) : null;
}

/** Sube una foto en dos tamaños (ya reducidos en el navegador) y la añade al final de su sección. */
export async function subirFoto(datos: FormData): Promise<ResultadoFoto> {
  const { supabase } = await exigirAdmin();

  const seccion = texto(datos, "seccion");
  if (!SECCIONES_FOTOS.includes(seccion as SeccionFoto)) return { error: "Sección no válida." };
  const ancho = Number(texto(datos, "ancho"));
  const alto = Number(texto(datos, "alto"));
  if (!Number.isInteger(ancho) || !Number.isInteger(alto) || ancho < 1 || alto < 1 || ancho > 4000 || alto > 4000) {
    return { error: "No se pudo leer el tamaño de la foto." };
  }

  const [grande, mini] = await Promise.all([leerImagen(datos.get("imagen")), leerImagen(datos.get("mini"))]);
  if (!grande || !mini) return { error: "El archivo no parece una foto válida (JPG, PNG o WebP de hasta 3 MB)." };

  const hoy = new Date();
  const base = `${seccion}/${hoy.getUTCFullYear()}/${crypto.randomUUID()}`;
  const ruta = `${base}.${TIPOS_IMAGEN[grande.tipo]}`;
  const rutaMini = `${base}-mini.${TIPOS_IMAGEN[mini.tipo]}`;
  const opciones = { cacheControl: "31536000", upsert: false };

  const subidas = await Promise.all([
    supabase.storage.from("fotos").upload(ruta, grande.bytes, { ...opciones, contentType: grande.tipo }),
    supabase.storage.from("fotos").upload(rutaMini, mini.bytes, { ...opciones, contentType: mini.tipo }),
  ]);
  if (subidas.some((subida) => subida.error)) {
    console.error("Error al subir la foto:", subidas.map((subida) => subida.error?.message).join(" / "));
    await supabase.storage.from("fotos").remove([ruta, rutaMini]);
    return { error: "No se pudo subir la foto. Inténtalo de nuevo." };
  }

  const { data: ultima } = await supabase
    .from("fotos")
    .select("orden")
    .eq("seccion", seccion)
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("fotos").insert({
    url: supabase.storage.from("fotos").getPublicUrl(ruta).data.publicUrl,
    url_mini: supabase.storage.from("fotos").getPublicUrl(rutaMini).data.publicUrl,
    ancho,
    alto,
    seccion,
    orden: (ultima?.orden ?? -1) + 1,
  });
  if (error) {
    console.error("Error al guardar la foto:", error.message);
    await supabase.storage.from("fotos").remove([ruta, rutaMini]);
    return { error: "No se pudo guardar la foto. Inténtalo de nuevo." };
  }

  actualizarFotosWeb();
  return { ok: true };
}

/** Cambia la descripción de una foto o si se muestra en la web. */
export async function actualizarFoto(
  id: string,
  cambios: { alt?: string; activo?: boolean },
): Promise<ResultadoFoto> {
  const { supabase } = await exigirAdmin();
  if (!esIdValido(id)) return { error: "No encontramos esa foto." };

  const fila: { alt?: string; activo?: boolean } = {};
  if (typeof cambios.alt === "string") {
    const alt = cambios.alt.trim();
    if (alt.length > 200) return { error: "La descripción puede tener hasta 200 caracteres." };
    fila.alt = alt;
  }
  if (typeof cambios.activo === "boolean") fila.activo = cambios.activo;
  if (Object.keys(fila).length === 0) return { ok: true };

  const { data, error } = await supabase.from("fotos").update(fila).eq("id", id).select("id");
  if (error || !data?.length) return { error: "No se pudo guardar el cambio. Inténtalo de nuevo." };

  actualizarFotosWeb();
  return { ok: true };
}

/** Mueve una foto un lugar antes o después dentro de su sección. */
export async function moverFoto(id: string, direccion: "antes" | "despues"): Promise<ResultadoFoto> {
  const { supabase } = await exigirAdmin();
  if (!esIdValido(id)) return { error: "No encontramos esa foto." };

  const { data: foto } = await supabase.from("fotos").select("seccion").eq("id", id).maybeSingle();
  if (!foto) return { error: "No encontramos esa foto." };

  const { data: lista, error } = await supabase
    .from("fotos")
    .select("id, orden")
    .eq("seccion", foto.seccion)
    .order("orden");
  if (error || !lista) return { error: "No se pudo ordenar. Inténtalo de nuevo." };

  const i = lista.findIndex((f) => f.id === id);
  const j = direccion === "antes" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= lista.length) return { ok: true };

  // Intercambiamos posiciones y numeramos de nuevo toda la sección (0, 1, 2…) para mantener el orden limpio.
  [lista[i], lista[j]] = [lista[j], lista[i]];
  const cambios = lista
    .map((f, posicion) => ({ id: f.id, orden: posicion, antes: f.orden }))
    .filter((f) => f.orden !== f.antes);
  for (const cambio of cambios) {
    const { error: errorOrden } = await supabase.from("fotos").update({ orden: cambio.orden }).eq("id", cambio.id);
    if (errorOrden) return { error: "No se pudo ordenar. Inténtalo de nuevo." };
  }

  actualizarFotosWeb();
  return { ok: true };
}

/** Elimina una foto de la web y sus dos archivos de la carpeta. */
export async function eliminarFoto(id: string): Promise<ResultadoFoto> {
  const { supabase } = await exigirAdmin();
  if (!esIdValido(id)) return { error: "No encontramos esa foto." };

  const { data: foto } = await supabase.from("fotos").select("url, url_mini").eq("id", id).maybeSingle();
  if (!foto) return { error: "No encontramos esa foto." };

  const { error } = await supabase.from("fotos").delete().eq("id", id);
  if (error) return { error: "No se pudo eliminar. Inténtalo de nuevo." };

  const rutas = [rutaDeFoto(foto.url), rutaDeFoto(foto.url_mini)].filter((ruta): ruta is string => ruta !== null);
  if (rutas.length) await supabase.storage.from("fotos").remove(rutas);

  actualizarFotosWeb();
  return { ok: true };
}

// ---------- Muro de oración ----------

type EstadoPeticion = "pendiente" | "publicada" | "archivada";

/**
 * Guarda las correcciones de una petición (texto y nombre) y, si se indica,
 * cambia su estado. Corregir sirve para quitar datos personales sin rechazarla.
 * Un nombre vacío la deja anónima.
 */
export async function moderarPeticion(
  id: string,
  cambios: { texto?: string; nombre?: string; estado?: EstadoPeticion },
): Promise<ResultadoFoto> {
  const { supabase } = await exigirAdmin();
  if (!esIdValido(id)) return { error: "No encontramos esa petición." };

  const fila: Record<string, unknown> = {};
  if (cambios.texto !== undefined || cambios.nombre !== undefined) {
    const resultado = esquemaModeracion.safeParse({ texto: cambios.texto ?? "", nombre: cambios.nombre ?? "" });
    if (!resultado.success) return { error: resultado.error.issues[0]?.message ?? "Revisa el texto." };
    fila.texto = resultado.data.texto;
    fila.nombre = resultado.data.nombre === "" ? null : resultado.data.nombre;
  }
  if (cambios.estado) {
    if (!["pendiente", "publicada", "archivada"].includes(cambios.estado)) return { error: "Estado no válido." };
    fila.estado = cambios.estado;
    if (cambios.estado === "publicada") {
      // La fecha de publicación se fija la primera vez; al volver a publicar se conserva.
      const { data: actual } = await supabase.from("peticiones").select("publicada_en").eq("id", id).maybeSingle();
      if (!actual?.publicada_en) fila.publicada_en = new Date().toISOString();
    }
  }
  if (Object.keys(fila).length === 0) return { ok: true };

  const { data, error } = await supabase.from("peticiones").update(fila).eq("id", id).select("id");
  if (error || !data?.length) {
    if (error) console.error("Error al moderar la petición:", error.message);
    return { error: "No se pudo guardar. Inténtalo de nuevo." };
  }

  actualizarWeb();
  return { ok: true };
}

export async function eliminarPeticion(id: string): Promise<ResultadoFoto> {
  const { supabase } = await exigirAdmin();
  if (!esIdValido(id)) return { error: "No encontramos esa petición." };

  const { error } = await supabase.from("peticiones").delete().eq("id", id);
  if (error) return { error: "No se pudo eliminar. Inténtalo de nuevo." };

  actualizarWeb();
  return { ok: true };
}

// ---------- Páginas institucionales ----------

export async function guardarPagina(
  slug: string,
  _: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  const { supabase } = await exigirAdmin();
  if (!esSlugPagina(slug)) return { mensaje: "Página no válida." };

  const valores = {
    titulo: texto(datos, "titulo"),
    descripcion: texto(datos, "descripcion"),
    contenido: texto(datos, "contenido"),
  };
  const resultado = esquemaPagina.safeParse(valores);
  if (!resultado.success) {
    return { mensaje: "Revisa los campos marcados.", errores: erroresPorCampo(resultado.error), valores };
  }

  const { data, error } = await supabase.from("paginas").update(resultado.data).eq("slug", slug).select("slug");
  if (error || !data?.length) {
    if (error) console.error("Error al guardar la página:", error.message);
    return {
      mensaje: "No se pudo guardar. Si es la primera vez, ejecuta el archivo paginas.sql en Supabase.",
      valores,
    };
  }

  actualizarWeb();
  return { ok: true, mensaje: "Página guardada. Ya se ve en la web.", valores };
}
