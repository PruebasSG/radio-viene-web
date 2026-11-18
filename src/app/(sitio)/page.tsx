import { ALaCarta } from "@/components/a-la-carta/ALaCarta";
import { UltimosArticulos } from "@/components/blog/UltimosArticulos";
import { Inicio } from "@/components/inicio/Inicio";
import { Oracion } from "@/components/oracion/Oracion";
import { Pedidos } from "@/components/pedidos/Pedidos";
import { Programacion } from "@/components/programacion/Programacion";
import { obtenerUltimosArticulos } from "@/lib/blog";
import { obtenerAjustes } from "@/lib/datos";

export default async function PaginaPrincipal() {
  const [ajustes, articulos] = await Promise.all([obtenerAjustes(), obtenerUltimosArticulos(3)]);

  return (
    <>
      <Inicio lema={ajustes.lema} />
      <Programacion />
      <Pedidos whatsapp={ajustes.whatsapp} />
      <Oracion whatsapp={ajustes.whatsapp} />
      <UltimosArticulos articulos={articulos} />
      <ALaCarta />
    </>
  );
}
