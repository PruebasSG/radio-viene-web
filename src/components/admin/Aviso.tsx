import estilos from "./panel.module.css";

type Props = {
  tipo?: "info" | "exito" | "error";
  children: React.ReactNode;
};

export function Aviso({ tipo = "info", children }: Props) {
  return (
    <div className={estilos.aviso} data-tipo={tipo} role={tipo === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}
