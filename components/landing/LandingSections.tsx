import { CheckCircle2, Clock, MapPin, ShieldCheck } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { FOUNDED, YEARS_ACTIVE, money, type LandingConfig } from '@/lib/landing';

// Secciones de contenido de la landing. Todas son server components: sin JS de cliente,
// que es lo que mantiene el LCP sano en tráfico pago desde móvil.

export function SignsSection({ config }: { config: LandingConfig }) {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom max-w-3xl">
        <span className="eyebrow">Cómo se reconoce</span>
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-3">
          Señales de {config.pest} en casa
        </h2>
        <ul className="mt-6 space-y-3.5">
          {config.signs.map((sign) => (
            <li key={sign} className="flex gap-3">
              <CheckCircle2 className="mt-0.5 flex-none text-brand-orange" size={20} aria-hidden />
              <span className="text-brand-black/80 text-body">{sign}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function TreatmentSection({ config }: { config: LandingConfig }) {
  return (
    <section className="section-padding bg-brand-light">
      <div className="container-custom max-w-3xl">
        <span className="eyebrow">Qué incluye</span>
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-3">
          Tratamiento completo: {money(config.price)}
        </h2>
        <p className="text-brand-black/70 text-body-lg mt-2">
          {config.visits} visitas incluidas. La inspección previa no tiene costo.
        </p>

        <ol className="mt-8 space-y-6">
          {config.steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-green font-heading font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="font-heading text-h3 text-brand-green">{step.title}</h3>
                <p className="text-brand-black/75 text-body mt-1">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function GuaranteeSection({ config }: { config: LandingConfig }) {
  return (
    <section className="section-padding bg-brand-green">
      <div className="container-custom max-w-3xl text-center">
        <ShieldCheck className="mx-auto text-brand-orange" size={44} aria-hidden />
        <h2 className="font-heading text-h2-mobile md:text-h2 text-white mt-4">
          60 días de garantía, contados desde la última visita
        </h2>
        <p className="text-white/80 text-body-lg mt-4">
          Si aparece actividad de {config.pest} dentro de los 60 días siguientes a la última visita del
          tratamiento, volvemos sin costo adicional. El plazo arranca cuando terminamos, no cuando empezamos.
        </p>
        <p className="text-white/55 text-body-sm mt-4">
          Aplican términos y condiciones, que el técnico le explica antes de iniciar el tratamiento.
        </p>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom max-w-3xl">
        <span className="eyebrow">Quiénes somos</span>
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-3">
          {YEARS_ACTIVE} años en Santander, con dirección fija
        </h2>
        <p className="text-brand-black/75 text-body mt-4">
          AGROINCOL opera desde {FOUNDED} en el área metropolitana de Bucaramanga. Trabajamos con técnicos
          certificados y productos con registro sanitario. No somos un número de celular: tenemos oficina y
          usted puede venir.
        </p>

        <dl className="mt-7 grid gap-5 sm:grid-cols-3">
          <div>
            <dt className="text-brand-gray text-body-sm">Servicios este año</dt>
            <dd className="font-heading text-3xl font-bold text-brand-green">+300</dd>
          </div>
          <div>
            <dt className="text-brand-gray text-body-sm">Calificación en Google</dt>
            <dd className="font-heading text-3xl font-bold text-brand-green">4,9</dd>
          </div>
          <div>
            <dt className="text-brand-gray text-body-sm">Operando desde</dt>
            <dd className="font-heading text-3xl font-bold text-brand-green">{FOUNDED}</dd>
          </div>
        </dl>

        <div className="mt-8 space-y-3 rounded-2xl bg-brand-light p-5">
          <p className="flex items-start gap-2.5 text-brand-black/80 text-body-sm">
            <MapPin size={18} className="mt-0.5 flex-none text-brand-orange" aria-hidden />
            {BUSINESS.address.full}
          </p>
          <p className="flex items-start gap-2.5 text-brand-black/80 text-body-sm">
            <Clock size={18} className="mt-0.5 flex-none text-brand-orange" aria-hidden />
            Lunes a viernes {BUSINESS.hours.weekdays} · Sábados {BUSINESS.hours.saturday}
          </p>
        </div>
      </div>
    </section>
  );
}

export function CoverageNote({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const isDark = tone === 'dark';
  return (
    <p className={`text-body-sm ${isDark ? 'text-white/60' : 'text-brand-black/60'}`}>
      Atendemos <strong className={isDark ? 'text-white' : 'text-brand-green'}>todo Santander</strong>. Fuera
      del área metropolitana de Bucaramanga aplica recargo por movilidad, informado antes de agendar.
    </p>
  );
}
