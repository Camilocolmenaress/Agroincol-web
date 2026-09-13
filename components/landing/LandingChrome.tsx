import { BUSINESS } from '@/lib/constants';

// Par de botones flotantes siempre visibles. En las landings gringas el teléfono va
// fijo en la cabecera; acá conviven los dos canales, con WhatsApp primero porque es
// el que la gente prefiere y el que no exige que alguien esté libre en ese segundo.
// Pie mínimo: solo lo legal. Cero enlaces de navegación — cada salida es un lead perdido.
export function LandingFooter() {
  return (
    <footer className="bg-brand-green-dark px-4 pb-[calc(env(safe-area-inset-bottom)+92px)] pt-10 text-center">
      <p className="font-heading text-lg font-bold text-white">{BUSINESS.name}</p>
      <p className="text-white/60 text-body-sm mt-1.5">{BUSINESS.address.full}</p>
      <p className="text-white/60 text-body-sm">
        {BUSINESS.phone} · {BUSINESS.email}
      </p>
      <p className="mt-5 text-white/45 text-body-sm">
        <a href="/politica-de-privacidad" className="underline underline-offset-4">
          Política de privacidad
        </a>
      </p>
      <p className="text-white/35 text-body-sm mt-3">
        © {new Date().getFullYear()} {BUSINESS.legalName}. Todos los derechos reservados.
      </p>
    </footer>
  );
}
