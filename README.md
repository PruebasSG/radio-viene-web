# Radio Viene 101.3 FM · Sitio web

Web oficial de Radio Viene, radio adventista del séptimo día. Hecha con
[Next.js](https://nextjs.org) y publicada en Vercel.

## Cómo actualizar el contenido

Todo el contenido editable está en la carpeta `src/content/`. No hace falta
tocar nada más para los cambios del día a día.

| Archivo | Qué contiene |
| --- | --- |
| `src/content/radio.ts` | Nombre, lema, descripción, WhatsApp, correo y redes sociales |
| `src/content/programacion.ts` | La programación semanal (días y horarios de cada programa) |
| `src/content/categorias.ts` | Las secciones del contenido a la carta |

Para cambiar algo: abre el archivo en GitHub, pulsa el lápiz (✏️), edita el
texto entre comillas y guarda con **Commit changes**. Vercel publica la nueva
versión sola en uno o dos minutos.

## Estructura

```
src/
  app/            Páginas, diseño general, icono y API interna (/api/ahora)
  components/     Cada sección de la web, con su propio archivo de estilos
  config/         Direcciones técnicas de la emisora (stream y API)
  content/        Contenido editable
  lib/            Utilidades: horarios, WhatsApp, reloj y datos de AzuraCast
```

## Variables de entorno

Ver `.env.example`. Si no se definen, la web usa el servidor de pruebas
(`radio.syncrochats.com`). Al mudar la radio a su servidor definitivo, basta con
cambiar estas variables en Vercel; no hay que tocar el código.

## Trabajar en una computadora

Requiere Node.js 20.9 o superior.

```bash
npm install
npm run dev        # abre http://localhost:3000
npm run lint       # revisa el estilo del código
npm run typecheck  # revisa los tipos
npm run build      # compila como en producción
```

## Seguridad

- Las cabeceras de seguridad (incluida la política de contenido) están en
  `next.config.ts`: el navegador solo carga recursos de la propia web y el audio
  del servidor de la radio.
- La web consulta AzuraCast desde su propio servidor (`/api/ahora`), nunca
  desde el navegador del oyente, y solo reenvía los datos necesarios.
- Las versiones de las dependencias están fijadas en `package.json`.
- `npm audit` muestra un aviso en herramientas de desarrollo (ESLint). No forma
  parte de la web publicada.
