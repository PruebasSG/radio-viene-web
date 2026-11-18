# Radio Viene 101.3 FM · Sitio web

Web oficial de Radio Viene, radio adventista del séptimo día. Hecha con
[Next.js](https://nextjs.org), publicada en Vercel y con un panel
administrativo conectado a [Supabase](https://supabase.com).

## Cómo actualizar el contenido

**Desde el panel** (`/admin`), sin tocar código:

- **Programación:** crear, editar, ocultar y eliminar programas. El panel avisa
  si dos programas se cruzan de horario.
- **Datos de la radio:** lema, texto de presentación, WhatsApp, correo y redes.

Los cambios se ven en la web en unos segundos.

**Desde el código**, solo para lo que cambia muy rara vez:

| Archivo | Qué contiene |
| --- | --- |
| `src/content/radio.ts` | Nombre, frecuencia, ubicación, zona horaria y textos de respaldo |
| `src/content/programacion.ts` | Programación de respaldo (si la base de datos no responde) |
| `src/content/categorias.ts` | Las secciones del contenido a la carta |

## Base de datos

El archivo `supabase/esquema.sql` crea todas las tablas, las reglas de seguridad
y los datos iniciales. Se ejecuta completo en Supabase → SQL Editor. Al final del
archivo están las instrucciones para dar o quitar acceso a un administrador.

## Seguridad

- **Seguridad en la base de datos (RLS):** cualquiera puede leer la programación
  visible; solo los usuarios de la tabla `administradores` pueden modificarla.
  Aunque alguien saltara la web, la base de datos le negaría el acceso.
- **Sin registro público:** los administradores se crean desde Supabase.
- **El navegador nunca habla con Supabase:** el inicio de sesión y los cambios
  pasan por el servidor de la web. La sesión vive en cookies seguras.
- **Doble comprobación:** `src/proxy.ts` protege las rutas `/admin`, y además cada
  página y cada acción vuelve a verificar que la persona es administradora.
- **Validación en dos capas:** en el servidor (`src/lib/admin/validacion.ts`) y
  con restricciones en la propia base de datos.
- **La web nunca se cae por el panel:** si Supabase no responde, la web pública
  usa el contenido de respaldo.
- Cabeceras de seguridad en `next.config.ts` y versiones de dependencias fijadas.

## Estructura

```
src/
  app/
    (sitio)/      Web pública (con el reproductor)
    admin/        Panel administrativo
    api/ahora/    Estado de la emisora (consulta AzuraCast)
  components/     Secciones de la web y del panel
  config/         Direcciones de la emisora
  content/        Identidad de la radio y contenido de respaldo
  lib/            Datos, horarios, sesión y validación
  proxy.ts        Protección de las rutas del panel
supabase/
  esquema.sql     Base de datos completa
```

## Variables de entorno

Ver `.env.example`.

## Trabajar en una computadora

Requiere Node.js 20.9 o superior.

```bash
npm install
npm run dev        # abre http://localhost:3000
npm run lint       # revisa el estilo del código
npm run typecheck  # revisa los tipos
npm run build      # compila como en producción
```
