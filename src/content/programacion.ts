/**
 * PROGRAMACIÓN SEMANAL
 *
 * ⚠️ Esta es una programación DE EJEMPLO. Reemplázala por la real.
 *
 * Cada programa indica los días en que se emite y su horario en formato
 * de 24 horas ("06:00", "18:30"). Para un programa que termina a medianoche,
 * usa "24:00". Las horas que queden sin programa se muestran como
 * "Música continua".
 */

export type Dia = "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo";

export type Programa = {
  nombre: string;
  descripcion: string;
  dias: readonly Dia[];
  inicio: string;
  fin: string;
  /** Opcional: quién lo conduce. */
  conductor?: string;
};

const entreSemana: Dia[] = ["lunes", "martes", "miercoles", "jueves", "viernes"];
const todosLosDias: Dia[] = [...entreSemana, "sabado", "domingo"];

export const programacion: Programa[] = [
  {
    nombre: "Música de madrugada",
    descripcion: "Himnos y alabanzas instrumentales para las horas de la noche.",
    dias: todosLosDias,
    inicio: "00:00",
    fin: "05:00",
  },
  {
    nombre: "Amanecer con Dios",
    descripcion: "Una lectura, una reflexión y un momento de oración para empezar el día.",
    dias: entreSemana,
    inicio: "05:00",
    fin: "06:00",
  },
  {
    nombre: "Buenos días, esperanza",
    descripcion: "Música, saludos de los oyentes y lo que necesitas saber para arrancar la mañana.",
    dias: entreSemana,
    inicio: "06:00",
    fin: "09:00",
  },
  {
    nombre: "Melodías de fe",
    descripcion: "Música cristiana en español para acompañar tu jornada.",
    dias: entreSemana,
    inicio: "09:00",
    fin: "12:00",
  },
  {
    nombre: "Salud integral",
    descripcion: "Consejos prácticos para cuidar el cuerpo, la mente y el espíritu.",
    dias: entreSemana,
    inicio: "12:00",
    fin: "13:00",
  },
  {
    nombre: "Tarde en familia",
    descripcion: "Reflexiones y música para fortalecer los lazos del hogar.",
    dias: entreSemana,
    inicio: "13:00",
    fin: "16:00",
  },
  {
    nombre: "Abre tu Biblia",
    descripcion: "Estudio bíblico sencillo, versículo a versículo.",
    dias: entreSemana,
    inicio: "16:00",
    fin: "18:00",
  },
  {
    nombre: "Cultivando la esperanza",
    descripcion: "Testimonios, entrevistas y música al caer la tarde.",
    dias: ["lunes", "martes", "miercoles", "jueves"],
    inicio: "18:00",
    fin: "20:00",
  },
  {
    nombre: "Recibiendo el sábado",
    descripcion: "Música sacra y meditación para dar la bienvenida al sábado.",
    dias: ["viernes"],
    inicio: "18:00",
    fin: "20:00",
  },
  {
    nombre: "Escuela Sabática",
    descripcion: "Repaso de la lección de la semana.",
    dias: ["sabado"],
    inicio: "08:00",
    fin: "10:00",
  },
  {
    nombre: "Culto divino",
    descripcion: "Transmisión del servicio de adoración.",
    dias: ["sabado"],
    inicio: "10:00",
    fin: "12:00",
  },
  {
    nombre: "Sábado en armonía",
    descripcion: "Música sacra para disfrutar el día de reposo.",
    dias: ["sabado"],
    inicio: "12:00",
    fin: "18:00",
  },
  {
    nombre: "Domingo en familia",
    descripcion: "Una mañana tranquila con música, historias y reflexiones para todos.",
    dias: ["domingo"],
    inicio: "08:00",
    fin: "12:00",
  },
  {
    nombre: "Noche de alabanza",
    descripcion: "Cantos de adoración para cerrar el día.",
    dias: todosLosDias,
    inicio: "20:00",
    fin: "24:00",
  },
];
