import type { ReactNode } from 'react';

// Íconos propios de /gracias, a dos tonos: el relleno es el color del texto al
// 14 % y el trazo es el color pleno. El color lo pone quien los usa (text-*).
// Inline y sin librería: pesan menos que cualquier paquete de íconos.

type Props = { className?: string };

function Base({ className, children }: Props & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className ?? 'h-6 w-6'}
    >
      {children}
    </svg>
  );
}

const relleno = { fill: 'currentColor', fillOpacity: 0.14 } as const;

export function IconoLlamada(p: Props) {
  return (
    <Base {...p}>
      <path
        {...relleno}
        d="M21 16.2v2.7a1.8 1.8 0 0 1-2 1.8 17.8 17.8 0 0 1-7.8-2.8 17.5 17.5 0 0 1-5.4-5.4A17.8 17.8 0 0 1 3 4.7 1.8 1.8 0 0 1 4.8 2.8h2.7a1.8 1.8 0 0 1 1.8 1.5c.1.9.3 1.7.6 2.5a1.8 1.8 0 0 1-.4 1.9L8.3 9.9a14.4 14.4 0 0 0 5.4 5.4l1.2-1.2a1.8 1.8 0 0 1 1.9-.4c.8.3 1.6.5 2.5.6a1.8 1.8 0 0 1 1.7 1.9z"
      />
      <path d="M15 3.5a6 6 0 0 1 5.5 5.5" />
      <path d="M15 7a2.6 2.6 0 0 1 2 2" />
    </Base>
  );
}

export function IconoCaja(p: Props) {
  return (
    <Base {...p}>
      <path {...relleno} d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
      <path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9M7.75 5.25l8.5 4.5" />
    </Base>
  );
}

export function IconoCasa(p: Props) {
  return (
    <Base {...p}>
      <path {...relleno} d="M4 10.5 12 4l8 6.5V20H4z" />
      <path d="M10 20v-5.5h4V20" />
    </Base>
  );
}

export function IconoBillete(p: Props) {
  return (
    <Base {...p}>
      <rect {...relleno} x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.75" />
      <path d="M6 9.5v5M18 9.5v5" />
    </Base>
  );
}

export function IconoPago(p: Props) {
  return (
    <Base {...p}>
      <rect {...relleno} x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M2.5 9.5h19M6.5 15h4" />
    </Base>
  );
}

export function IconoComprobante(p: Props) {
  return (
    <Base {...p}>
      <path {...relleno} d="M6 3h12v18l-3-1.75L12 21l-3-1.75L6 21z" />
      <path d="M9 8h6M9 11.5h6M9 15h3" />
    </Base>
  );
}

export function IconoGota(p: Props) {
  return (
    <Base {...p}>
      <path {...relleno} d="M12 3.5c3 3.6 6 6.9 6 10.25a6 6 0 0 1-12 0C6 10.4 9 7.1 12 3.5z" />
      <path d="M9.4 14.2a2.7 2.7 0 0 0 2.6 2.3" />
    </Base>
  );
}

export function IconoCucaracha(p: Props) {
  return (
    <Base {...p}>
      <ellipse {...relleno} cx="12" cy="13.5" rx="4" ry="5.75" />
      <circle cx="12" cy="6" r="1.6" />
      <path d="M12 9v10M8 11 4.5 9.5M8 14H4.25M8.2 17 4.75 18.75M16 11l3.5-1.5M16 14h3.75M15.8 17l3.45 1.75M11 4.6 9.5 2.75M13 4.6l1.5-1.85" />
    </Base>
  );
}

export function IconoNido(p: Props) {
  return (
    <Base {...p}>
      <circle {...relleno} cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </Base>
  );
}

export function IconoEscudo(p: Props) {
  return (
    <Base {...p}>
      <path {...relleno} d="M12 3 4.5 6v5.5c0 4.6 3.2 8.3 7.5 9.5 4.3-1.2 7.5-4.9 7.5-9.5V6z" />
      <path d="m8.75 12 2.25 2.25 4.5-4.5" />
    </Base>
  );
}

export function IconoChat(p: Props) {
  return (
    <Base {...p}>
      <path {...relleno} d="M20 11.5a8 8 0 0 1-11.6 7.14L4 19.75l1.1-4A8 8 0 1 1 20 11.5z" />
      <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" strokeWidth={2.5} />
    </Base>
  );
}

export function IconoRuta(p: Props) {
  return (
    <Base {...p}>
      <path {...relleno} d="M12 21s6-5.4 6-10.5a6 6 0 0 0-12 0C6 15.6 12 21 12 21z" />
      <circle cx="12" cy="10.5" r="2.25" />
    </Base>
  );
}

export function IconoBrillo(p: Props) {
  return (
    <Base {...p}>
      <path {...relleno} d="M11 3.5l1.9 5.1 5.1 1.9-5.1 1.9L11 17.5l-1.9-5.1L4 10.5l5.1-1.9z" />
      <path d="M18.5 15v5M16 17.5h5" />
    </Base>
  );
}
