import Image from "next/image";
import logo from "@/assets/logo-radio-viene.png";

type Props = {
  /** Alto en píxeles; el ancho se calcula solo para no deformarlo. */
  alto: number;
  className?: string;
  /** Solo la primera vez que aparece arriba del todo: así carga antes. */
  prioritario?: boolean;
};

/**
 * Logo de Radio Viene. Es decorativo (alt vacío) porque siempre va junto
 * al nombre de la radio escrito, que es lo que leen los lectores de pantalla.
 */
export function Logo({ alto, className, prioritario = false }: Props) {
  const ancho = Math.round((logo.width / logo.height) * alto);
  return (
    <Image
      src={logo}
      alt=""
      width={ancho}
      height={alto}
      className={className}
      priority={prioritario}
      sizes={`${ancho}px`}
    />
  );
}
