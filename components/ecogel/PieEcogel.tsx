import { BUSINESS } from '@/lib/constants';

export default function PieEcogel() {
  return (
    <footer className="mt-12 bg-brand-green-dark px-4 pb-[calc(env(safe-area-inset-bottom)+92px)] pt-10 text-center text-white">
      <p className="font-heading text-lg font-bold">{BUSINESS.name}</p>
      <p className="text-white/60 text-body-sm mt-1.5">{BUSINESS.address.full}</p>
      <p className="text-white/60 text-body-sm">{BUSINESS.phone} · {BUSINESS.email}</p>
      <p className="mt-4 text-body-sm text-white/60">Pagos aceptados: PSE · Nequi · Tarjeta · Contraentrega (efectivo)</p>
      <p className="mt-4 text-white/45 text-body-sm">
        <a href="/politica-de-privacidad" className="underline underline-offset-4">Política de privacidad</a>
      </p>
      <p className="text-white/35 text-body-sm mt-3">© {new Date().getFullYear()} {BUSINESS.legalName}. EcoGel es marca de Mylva S.A. Registro INVIMA 2009V0004964.</p>
    </footer>
  );
}
