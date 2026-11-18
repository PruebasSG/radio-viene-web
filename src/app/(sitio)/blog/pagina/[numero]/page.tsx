import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ListadoBlog } from "@/components/blog/ListadoBlog";
import { obtenerArticulos } from "@/lib/blog";

export const revalidate = 300;

/** Las páginas se generan la primera vez que alguien las visita y luego se guardan. */
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ numero: string }> };

const leerNumero = (texto: string) => (/^\d{1,4}$/.test(texto) ? Number(texto) : NaN);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pagina = leerNumero((await params).numero);
  return {
    title: `Blog · Página ${pagina}`,
    alternates: { canonical: `/blog/pagina/${pagina}` },
  };
}

export default async function BlogPagina({ params }: Props) {
  const pagina = leerNumero((await params).numero);
  if (!Number.isInteger(pagina) || pagina < 1) notFound();
  if (pagina === 1) redirect("/blog");

  const { articulos, total } = await obtenerArticulos(pagina);
  if (articulos.length === 0) notFound();

  return <ListadoBlog articulos={articulos} total={total} pagina={pagina} />;
}
