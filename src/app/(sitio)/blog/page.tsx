import type { Metadata } from "next";
import { ListadoBlog } from "@/components/blog/ListadoBlog";
import { IMAGEN_COMPARTIR } from "@/config/emisora";
import { obtenerArticulos } from "@/lib/blog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description: "Reflexiones, estudio de la Biblia, salud integral y vida en familia, desde Radio Viene 101.3 FM.",
  alternates: { canonical: "/blog" },
  openGraph: { url: "/blog", title: "Blog de Radio Viene", images: [IMAGEN_COMPARTIR] },
};

export default async function Blog() {
  const { articulos, total } = await obtenerArticulos(1);
  return <ListadoBlog articulos={articulos} total={total} pagina={1} />;
}
