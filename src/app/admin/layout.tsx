import type { Metadata } from "next";
import estilos from "@/components/admin/panel.module.css";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · Panel de Radio Viene" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={estilos.fondo}>{children}</div>;
}
