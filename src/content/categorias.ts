/**
 * CONTENIDO A LA CARTA
 * Secciones que tendrá la biblioteca de programas para escuchar cuando quieras.
 */

export type Categoria = {
  nombre: string;
  descripcion: string;
};

export const categorias: Categoria[] = [
  {
    nombre: "Estudio bíblico",
    descripcion: "Series para conocer la Biblia a tu ritmo, capítulo a capítulo.",
  },
  {
    nombre: "Salud integral",
    descripcion: "Alimentación, descanso y hábitos para vivir mejor.",
  },
  {
    nombre: "Reflexiones familiares",
    descripcion: "Ideas y consejos para el matrimonio, los hijos y el hogar.",
  },
  {
    nombre: "Música instrumental",
    descripcion: "Himnos y alabanzas sin voces, para orar, estudiar o descansar.",
  },
];
