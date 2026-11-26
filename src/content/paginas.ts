/**
 * BORRADORES DE LAS PÁGINAS INSTITUCIONALES
 *
 * El texto real se edita desde el panel (/admin/paginas). Estos borradores
 * se muestran mientras una página no se haya editado, y sirven de punto de
 * partida en el editor. Están escritos en formato Markdown.
 */

export const SLUGS_PAGINAS = ["quienes-somos", "nuestras-creencias", "contacto"] as const;
export type SlugPagina = (typeof SLUGS_PAGINAS)[number];

export type ContenidoPagina = {
  titulo: string;
  /** Descripción para Google (ideal: entre 110 y 160 caracteres). */
  descripcion: string;
  contenido: string;
};

export const BORRADORES: Record<SlugPagina, ContenidoPagina> = {
  "quienes-somos": {
    titulo: "Quiénes somos",
    descripcion:
      "Radio Viene 101.3 FM es una emisora adventista del séptimo día en Mérida, Venezuela. Música cristiana, Biblia y esperanza para toda la familia.",
    contenido: `Radio Viene 101.3 FM es una emisora adventista del séptimo día que transmite desde **Mérida, Venezuela**, en el 101.3 de la FM y por internet para el mundo, las 24 horas del día.

## Nuestra misión

Llevar esperanza a cada hogar a través de música que edifica, el estudio de la Biblia y mensajes que fortalecen la fe, la salud y la familia, mientras compartimos la promesa de que Jesús viene pronto.

## Lo que hacemos

- **Música cristiana**: himnos y alabanzas que acompañan tu día y tu descanso.
- **Estudio de la Biblia**: programas para conocer la Palabra de Dios de forma sencilla y práctica.
- **Salud integral y familia**: consejos para vivir mejor en cuerpo, mente y espíritu.
- **Oración**: un equipo y una comunidad que oran por cada petición que recibimos.

## Una radio para todos

No necesitas ser adventista para escucharnos. Nuestra programación está pensada para toda persona que busque paz, esperanza y una relación más cercana con Dios.

## Escríbenos

Nos alegra saber de ti. Puedes enviarnos un saludo, pedir una canción o compartir tu petición de oración desde nuestra página de [contacto](/contacto).`,
  },

  "nuestras-creencias": {
    titulo: "Nuestras creencias",
    descripcion:
      "Lo que creemos los adventistas del séptimo día: la Biblia, la salvación en Jesús, el sábado y la esperanza en su pronta venida.",
    contenido: `Radio Viene forma parte de la Iglesia Adventista del Séptimo Día, una comunidad cristiana presente en más de 200 países. Aceptamos la Biblia como nuestra única regla de fe, y estas son, en pocas palabras, las convicciones que dan sentido a nuestra programación.

## Dios y su Palabra

Creemos que la Biblia es la Palabra de Dios, inspirada por el Espíritu Santo, y la norma con la que se evalúa toda enseñanza. Creemos en un solo Dios: Padre, Hijo y Espíritu Santo, unidos en amor. Dios es el Creador de todo lo que existe.

## Jesús y la salvación

Creemos que Jesucristo, plenamente Dios y plenamente hombre, vivió una vida perfecta, murió en nuestro lugar y resucitó. La salvación es un regalo de Dios que recibimos por gracia, mediante la fe en Jesús, y no por nuestros méritos. Él nos transforma y nos ayuda a crecer cada día.

## La iglesia

Creemos en la iglesia como una familia de creyentes que adora, sirve y comparte el evangelio. Practicamos el bautismo por inmersión como símbolo de una nueva vida en Cristo, y celebramos la Santa Cena en memoria de su sacrificio. Creemos que Dios concede dones a su iglesia, entre ellos el don de profecía, que reconocemos en el ministerio de Elena G. de White; la Biblia sigue siendo la norma de toda enseñanza.

## El sábado

Creemos que el sábado, el séptimo día de la semana, es el día de reposo que Dios bendijo desde la Creación. Lo guardamos desde la puesta del sol del viernes hasta la del sábado, como un tiempo especial para Dios, la familia y el servicio a los demás.

## Una vida con propósito

Creemos que los Diez Mandamientos expresan el amor de Dios, y que obedecerlos es una respuesta de gratitud, no un medio de salvación. Cuidamos nuestra salud como un regalo de Dios, con una alimentación sana y lejos del alcohol, el tabaco y las drogas. Valoramos el matrimonio y la familia, y administramos con fidelidad el tiempo, los talentos y los bienes que Dios nos confía.

## La esperanza que nos da nombre

Creemos que Jesús intercede hoy por nosotros en el santuario celestial, y que **volverá de forma literal, visible y gloriosa**. De esa esperanza viene nuestro nombre: *adventista* significa que esperamos su venida. Creemos que la muerte es un sueño hasta la resurrección, y que Dios pondrá fin al mal y hará nuevas todas las cosas.

## Conoce más

La Iglesia Adventista del Séptimo Día expresa sus enseñanzas en 28 creencias fundamentales. Puedes leerlas completas en el [sitio oficial de la Iglesia Adventista](https://www.adventist.org/beliefs/).`,
  },

  contacto: {
    titulo: "Contacto",
    descripcion:
      "Contacta a Radio Viene 101.3 FM en Mérida, Venezuela: pide una canción, envía un saludo o comparte tu petición de oración.",
    contenido: `¿Quieres saludarnos, compartir una inquietud o proponer una colaboración? Nos encantará escucharte.

## Pedidos y saludos

Para pedir una canción o enviar un saludo al aire, la forma más rápida es escribirnos por WhatsApp. También puedes mandarnos una nota de voz.

## Oración

Si necesitas que oremos por ti, deja tu petición en nuestro [muro de oración](/oracion), con tu nombre o de forma anónima. Nuestro equipo y nuestra comunidad oramos contigo.`,
  },
};
