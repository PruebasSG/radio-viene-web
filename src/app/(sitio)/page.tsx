import { ALaCarta } from "@/components/a-la-carta/ALaCarta";
import { Inicio } from "@/components/inicio/Inicio";
import { Oracion } from "@/components/oracion/Oracion";
import { Pedidos } from "@/components/pedidos/Pedidos";
import { Programacion } from "@/components/programacion/Programacion";
import { obtenerAjustes } from "@/lib/datos";

export default async function PaginaPrincipal() {
  const ajustes = await obtenerAjustes();

  return (
    <>
      <Inicio lema={ajustes.lema} />
      <Programacion />
      <Pedidos whatsapp={ajustes.whatsapp} />
      <Oracion whatsapp={ajustes.whatsapp} />
      <ALaCarta />
    </>
  );
}
