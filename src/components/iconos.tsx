/** Íconos propios en SVG: sin librerías externas ni peticiones adicionales. */

type Props = { className?: string };

export function IconoPlay({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10.4-6.5a1 1 0 0 0 0-1.7L9.53 4.65A1 1 0 0 0 8 5.5Z" fill="currentColor" />
    </svg>
  );
}

export function IconoDetener({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="6.5" y="5" width="4" height="14" rx="1.2" fill="currentColor" />
      <rect x="13.5" y="5" width="4" height="14" rx="1.2" fill="currentColor" />
    </svg>
  );
}

export function IconoCargando({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" />
      <path d="M20.5 12A8.5 8.5 0 0 0 12 3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconoWhatsApp({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12.04 2.5a9.43 9.43 0 0 0-8.1 14.26L2.5 21.5l4.86-1.4a9.43 9.43 0 1 0 4.68-17.6Zm0 17.2a7.77 7.77 0 0 1-3.96-1.09l-.28-.17-2.88.83.85-2.8-.19-.29a7.78 7.78 0 1 1 6.46 3.52Zm4.27-5.82c-.23-.12-1.38-.68-1.6-.76-.21-.08-.37-.12-.52.12-.16.23-.6.76-.74.91-.13.16-.27.18-.5.06a6.4 6.4 0 0 1-3.17-2.77c-.24-.41.24-.38.69-1.27.08-.16.04-.29-.02-.41-.06-.12-.52-1.26-.72-1.72-.19-.45-.38-.39-.52-.4h-.45a.86.86 0 0 0-.62.29 2.6 2.6 0 0 0-.81 1.93 4.5 4.5 0 0 0 .95 2.4 10.3 10.3 0 0 0 3.95 3.49c1.47.63 2.04.69 2.78.58.45-.07 1.38-.56 1.57-1.11.2-.55.2-1.02.14-1.12-.06-.1-.21-.16-.44-.27Z"
      />
    </svg>
  );
}
