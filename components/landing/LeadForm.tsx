'use client';

import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Loader2, MessageCircle } from 'lucide-react';
import { CALL_SLOTS, METRO_MUNICIPALITIES, OTHER_MUNICIPALITY, whatsappUrl } from '@/lib/landing';
import { soloPixel } from '@/lib/meta/pixel';
import { idDeVisitante } from '@/lib/meta/visitante';

// Formulario de dos pasos. El paso 1 no exige escribir nada — es un micro-compromiso
// de un toque que además filtra zona de cobertura. El paso 2 pide lo mínimo y termina
// en una cita ("¿a qué hora lo llamamos?"), no en un dato suelto.

// Solo los tres campos que el formulario necesita de verdad. Pasar el config completo
// serializaría las FAQ, los pasos y las señales dentro del HTML sin que nadie los use.
interface Props {
  /** Tipo de servicio que viaja al webhook. */
  serviceType: string;
  /** Texto con el que se abre WhatsApp desde la confirmación. */
  whatsappText: string;
  /** Id que viaja al webhook y a GTM para separar el rendimiento por landing. */
  formId: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function LeadForm({ serviceType, whatsappText, formId }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [municipio, setMunicipio] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [franja, setFranja] = useState('');
  const [acepta, setAcepta] = useState(false);
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');

  const pickMunicipio = (value: string) => {
    setMunicipio(value);
    setStep(2);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (nombre.trim().length < 2) next.nombre = 'Escriba su nombre';
    if (telefono.replace(/\D/g, '').length < 7) next.telefono = 'Escriba un número válido';
    if (!franja) next.franja = 'Escoja una franja';
    if (!acepta) next.acepta = 'Necesitamos su autorización para poder llamarlo';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (website) {
      setStatus('success');
      return;
    }

    setStatus('loading');

    // El Pixel del navegador dispara aquí y devuelve el event_id. El MISMO id
    // viaja a /api/contact, que manda el evento por la API de Conversiones con
    // los datos hasheados. Meta deduplica por (event_name, event_id), así que
    // la conversión cuenta una sola vez aunque salga por los dos caminos.
    // Devuelve null si ya hubo un Lead en esta sesión.
    const eventId = soloPixel('Lead');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          telefono,
          tipoServicio: serviceType,
          municipio,
          franjaHoraria: franja,
          formId,
          page: typeof window !== 'undefined' ? window.location.pathname : '',
          website,
          aceptaTerminos: acepta,
          // Medición. Si el Pixel está bloqueado, eventId llega null y el
          // servidor genera el suyo: el evento sale igual por CAPI.
          eventId,
          externalId: idDeVisitante(),
          sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });

      if (!res.ok) {
        setStatus('error');
        return;
      }

      setStatus('success');
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'form_submission',
          form_id: formId,
          form_page: window.location.pathname,
          form_service: serviceType,
          form_municipio: municipio,
        });
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-white p-7 text-center shadow-card">
        <CheckCircle2 className="mx-auto text-brand-green" size={44} aria-hidden />
        <h3 className="font-heading text-h3 text-brand-green mt-4">Listo, {nombre.split(' ')[0]}.</h3>
        <p className="text-brand-black/75 text-body-sm mt-2">
          Lo llamamos al <strong>{telefono}</strong> {franja.toLowerCase()}. Si prefiere adelantar, escríbanos
          ahora por WhatsApp y le respondemos de una.
        </p>
        <a
          href={whatsappUrl(whatsappText)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          <MessageCircle size={18} aria-hidden /> Escribir por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card sm:p-7">
      {step === 1 ? (
        <fieldset>
          <legend className="font-heading text-h3 text-brand-green">
            ¿En cuál municipio se encuentra ubicado?
          </legend>
          <p className="text-brand-black/65 text-body-sm mt-1">Un toque y listo. Sin escribir nada.</p>
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            {METRO_MUNICIPALITIES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => pickMunicipio(m)}
                className="rounded-xl border-2 border-brand-green/20 px-4 py-3.5 text-body-sm font-semibold text-brand-green transition-colors hover:border-brand-green hover:bg-brand-green hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                {m}
              </button>
            ))}
            <button
              type="button"
              onClick={() => pickMunicipio(OTHER_MUNICIPALITY)}
              className="col-span-2 rounded-xl border-2 border-brand-green/20 px-4 py-3.5 text-body-sm font-semibold text-brand-green transition-colors hover:border-brand-green hover:bg-brand-green hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              Otro municipio de Santander
            </button>
          </div>
        </fieldset>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1.5 text-body-sm font-medium text-brand-green/70 transition-colors hover:text-brand-green"
          >
            <ArrowLeft size={15} aria-hidden /> {municipio}
          </button>

          {municipio === OTHER_MUNICIPALITY && (
            <p className="mt-3 rounded-lg bg-brand-orange/10 px-3 py-2.5 text-body-sm text-brand-orange-dark">
              Atendemos todo Santander. Fuera del área metropolitana aplica un recargo por movilidad, y se lo
              decimos antes de agendar.
            </p>
          )}

          <h3 className="font-heading text-h3 text-brand-green mt-4">¿A quién llamamos?</h3>

          <div className="mt-4 space-y-3.5">
            <div>
              <label htmlFor="lf-nombre" className="block text-body-sm font-medium text-brand-black">
                Nombre
              </label>
              <input
                id="lf-nombre"
                name="nombre"
                type="text"
                autoComplete="name"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-gray-light px-4 py-3 text-body focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/25"
              />
              {errors.nombre && <p className="mt-1 text-body-sm text-brand-orange-dark">{errors.nombre}</p>}
            </div>

            <div>
              <label htmlFor="lf-telefono" className="block text-body-sm font-medium text-brand-black">
                WhatsApp
              </label>
              <input
                id="lf-telefono"
                name="telefono"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value.replace(/[^\d\s\-+()]/g, ''))}
                className="mt-1 w-full rounded-xl border border-brand-gray-light px-4 py-3 text-body focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/25"
              />
              {errors.telefono && <p className="mt-1 text-body-sm text-brand-orange-dark">{errors.telefono}</p>}
            </div>

            <fieldset>
              <legend className="block text-body-sm font-medium text-brand-black">
                ¿A qué hora lo llamamos?
              </legend>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {CALL_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    aria-pressed={franja === slot}
                    onClick={() => setFranja(slot)}
                    className={`rounded-xl border-2 px-3 py-2.5 text-body-sm font-semibold transition-colors ${
                      franja === slot
                        ? 'border-brand-green bg-brand-green text-white'
                        : 'border-brand-green/20 text-brand-green hover:border-brand-green'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {errors.franja && <p className="mt-1 text-body-sm text-brand-orange-dark">{errors.franja}</p>}
            </fieldset>

            {/* Honeypot anti-bot: invisible para personas, irresistible para scripts. */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-px w-px opacity-0"
            />

            <label className="flex items-start gap-2.5 text-body-sm text-brand-black/70">
              <input
                type="checkbox"
                checked={acepta}
                onChange={(e) => setAcepta(e.target.checked)}
                className="mt-0.5 h-4 w-4 flex-none rounded border-brand-gray-light text-brand-green focus:ring-brand-green"
              />
              <span>
                Autorizo a AGROINCOL a contactarme y tratar mis datos según su{' '}
                <a href="/politica-de-privacidad" target="_blank" className="underline">
                  política de privacidad
                </a>
                .
              </span>
            </label>
            {errors.acepta && <p className="text-body-sm text-brand-orange-dark">{errors.acepta}</p>}

            {status === 'error' && (
              <p className="rounded-lg bg-brand-orange/10 px-3 py-2.5 text-body-sm text-brand-orange-dark">
                No pudimos enviar sus datos. Escríbanos por WhatsApp y lo atendemos de una.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-full bg-brand-orange px-6 py-4 font-heading text-body font-bold text-white shadow-brand transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {status === 'loading' ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" aria-hidden /> Enviando…
                </span>
              ) : (
                'Agendar inspección sin costo'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
