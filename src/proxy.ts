import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_KEY, SUPABASE_URL, supabaseConfigurado } from "@/lib/supabase/config";

/**
 * Se ejecuta antes de cada página del panel (/admin):
 *  1. Renueva la sesión del administrador cuando está por vencer.
 *  2. Si no hay sesión, envía a la página de inicio de sesión.
 * Es una primera barrera: cada página y cada acción vuelve a comprobar el acceso.
 */
export async function proxy(request: NextRequest) {
  let respuesta = NextResponse.next({ request });
  const enIngreso = request.nextUrl.pathname === "/admin/ingresar";

  if (!supabaseConfigurado) {
    return enIngreso ? respuesta : NextResponse.redirect(new URL("/admin/ingresar", request.url));
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (lista, cabeceras) => {
        lista.forEach(({ name, value }) => request.cookies.set(name, value));
        respuesta = NextResponse.next({ request });
        lista.forEach(({ name, value, options }) => respuesta.cookies.set(name, value, options));
        Object.entries(cabeceras ?? {}).forEach(([clave, valor]) => respuesta.headers.set(clave, valor));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !enIngreso) {
    return NextResponse.redirect(new URL("/admin/ingresar", request.url));
  }

  // Las páginas del panel nunca deben guardarse en caché.
  respuesta.headers.set("Cache-Control", "private, no-store");
  return respuesta;
}

export const config = {
  matcher: ["/admin/:path*"],
};
