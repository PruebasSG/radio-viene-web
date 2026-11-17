import { ALaCarta } from "@/components/a-la-carta/ALaCarta";
import { Inicio } from "@/components/inicio/Inicio";
import { Oracion } from "@/components/oracion/Oracion";
import { Pedidos } from "@/components/pedidos/Pedidos";
import { Programacion } from "@/components/programacion/Programacion";

export default function PaginaPrincipal() {
  return (
    <>
      <Inicio />
      <Programacion />
      <Pedidos />
      <Oracion />
      <ALaCarta />
    </>
  );
}
