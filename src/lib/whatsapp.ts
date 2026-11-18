/** Enlace que abre un chat de WhatsApp con el mensaje ya escrito. */
export function enlaceWhatsApp(numero: string, mensaje: string): string | null {
  const soloDigitos = numero.replace(/\D/g, "");
  if (soloDigitos.length < 8) return null;
  return `https://wa.me/${soloDigitos}?text=${encodeURIComponent(mensaje)}`;
}

/** Muestra "584121234567" como "+58 412 123 4567". */
export function numeroLegible(numero: string): string {
  const d = numero.replace(/\D/g, "");
  if (d.startsWith("58") && d.length === 12) {
    return `+58 ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
  }
  return `+${d}`;
}
