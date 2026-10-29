'use client';

/**
 * Formulario de calificación de restaurantes, un paso por pantalla.
 *
 * Siete preguntas de un toque y una pantalla de datos. Las opciones avanzan
 * solas al tocarlas: en el celular, desde Instagram, cada toque extra es gente
 * que se va. La excepción es "Ya fumigamos y volvieron", que se detiene para
 * mostrar la garantía: es la objeción principal y ahí se responde.
 *
 * Nada en pantalla dice qué respuesta descalifica, y el resultado solo se
 * conoce al final: si se supiera en el paso 3, bastaría con devolverse y
 * cambiar la respuesta.
 *
 * Quién califica lo decide el SERVIDOR (lib/restaurantes/calificacion.ts). El
 * Pixel dispara el Lead solo si el servidor responde `calificado`, con el mismo
 * event_id (= lead_id) que usó la API de Conversiones.
 *
 * Recibe a cualquier hora. Lo que se promete ("en 5 minutos" o "mañana a partir
 * de las 8:00 a. m.") también lo dice el servidor: al cargar la página y otra
 * vez en la respuesta del envío, que es la que vale.
 */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LazyMotion, MotionConfig } from 'motion/react';
import * as m from 'motion/react-m';
import {
  ArrowLeft,
  BadgeCheck,
  Bug,
  CalendarCheck,
  CalendarX,
  Check,
  CircleHelp,
  ClipboardCheck,
  Coffee,
  KeyRound,
  Loader2,
  MapPin,
  MapPinOff,
  MessageCircle,
  MessageSquareWarning,
  MessagesSquare,
  Phone,
  RotateCcw,
  ShieldCheck,
  Store,
  User,
  UserRound,
  Users,
  UsersRound,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { PREGUNTAS, type IdPregunta, type Respuestas } from '@/lib/restaurantes/calificacion';
import { nuevoEventId } from '@/lib/meta/eventos';
import { rastrear, soloPixel } from '@/lib/meta/pixel';
import { idDeVisitante } from '@/lib/meta/visitante';
import { urlParaMedir } from '@/lib/meta/modo-prueba';
import { BUSINESS } from '@/lib/constants';

const TOTAL_PASOS = PREGUNTAS.length + 1;

/** Un ícono por respuesta: se reconoce la opción antes de terminar de leerla. */
const ICONOS: Record<string, LucideIcon> = {
  'situacion:cliente-vio': MessageSquareWarning,
  'situacion:cucarachas': Bug,
  'situacion:volvieron': RotateCcw,
  'situacion:secretaria': ClipboardCheck,
  'situacion:prevenir': ShieldCheck,
  'tipo:restaurante': UtensilsCrossed,
  'tipo:comida': Coffee,
  'tipo:otro': Store,
  'municipio:otro': MapPinOff,
  'personas:1': User,
  'personas:2-5': Users,
  'personas:6-15': UsersRound,
  'personas:15+': UsersRound,
  'rol:dueno': KeyRound,
  'rol:admin-decide': BadgeCheck,
  'rol:admin-consulta': MessagesSquare,
  'rol:otro': UserRound,
  'plan_anual:si': CalendarCheck,
  'plan_anual:no': CalendarX,
  'presupuesto:asesoria': CircleHelp,
};

const cargarMovimiento = () => import('./movimiento').then((r) => r.default);

/** Cada paso entra desde el lado hacia el que se avanza: adelante, derecha; atrás, izquierda. */
const VARIANTES_PASO = {
  entra: (d: number) => ({ x: d * 28, opacity: 0 }),
  centro: { x: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 420, damping: 36 } },
  sale: (d: number) => ({ x: d * -28, opacity: 0, transition: { duration: 0.14 } }),
};

function iconoDe(id: IdPregunta, valor: string): LucideIcon {
  return ICONOS[`${id}:${valor}`] ?? (id === 'municipio' ? MapPin : Wallet);
}
const WHATSAPP = BUSINESS.phoneRaw.replace('+', '');

type Estado = 'llenando' | 'enviando' | 'calificado' | 'descalificado' | 'error';

interface Props {
  /** "en 5 minutos" o la próxima apertura, calculado por el servidor al armar la página. */
  contacto: string;
}

export default function FormularioRestaurante(props: Props) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={cargarMovimiento} strict>
        <Formulario {...props} />
      </LazyMotion>
    </MotionConfig>
  );
}

function Formulario(props: Props) {
  const [paso, setPaso] = useState(0);
  const [respuestas, setRespuestas] = useState<Partial<Respuestas>>({});
  const [mostrarGarantia, setMostrarGarantia] = useState(false);
  const [nombre, setNombre] = useState('');
  const [negocio, setNegocio] = useState('');
  const [celular, setCelular] = useState('');
  const [canal, setCanal] = useState<'' | 'llamada' | 'whatsapp'>('');
  const [acepta, setAcepta] = useState(false);
  const [website, setWebsite] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<Estado>('llenando');
  const [contacto, setContacto] = useState(props.contacto);
  const [enHorario, setEnHorario] = useState(true);

  // El lead_id nace aquí para que el Pixel y el servidor usen el mismo.
  const leadId = useRef('');
  const titulo = useRef<HTMLHeadingElement>(null);
  const tarjeta = useRef<HTMLDivElement>(null);
  const primerRender = useRef(true);
  const garantia = useRef<HTMLDivElement>(null);
  // Hacia dónde se movió el último cambio de paso, para la dirección de la animación.
  const pasoAnterior = useRef(0);
  const direccion = paso >= pasoAnterior.current ? 1 : -1;
  useEffect(() => {
    pasoAnterior.current = paso;
  }, [paso]);
  useEffect(() => {
    leadId.current = nuevoEventId();
  }, []);

  // Al cambiar de paso, el foco va al título (lectores de pantalla) y la
  // tarjeta vuelve a quedar a la vista si el teclado la desplazó.
  useEffect(() => {
    if (primerRender.current) {
      primerRender.current = false;
      return;
    }
    // Con AnimatePresence el título nuevo monta después de la salida: el foco
    // de los pasos lo pone onExitComplete. Aquí solo el de las pantallas finales.
    if (estado !== 'llenando' && estado !== 'enviando') titulo.current?.focus({ preventScroll: true });
    const caja = tarjeta.current?.getBoundingClientRect();
    // window.scrollBy y no scrollIntoView: este último también desplaza los
    // contenedores con overflow oculto, y corría la tarjeta 30 px de lado.
    if (caja && caja.top < 0) window.scrollBy({ top: caja.top - 12, behavior: 'smooth' });
  }, [paso, estado]);

  const elegir = (id: IdPregunta, valor: string) => {
    setRespuestas((r) => ({ ...r, [id]: valor }));
    if (id === 'situacion' && valor === 'volvieron') {
      setMostrarGarantia(true);
      // En el celular la garantía aparece debajo de la última opción, fuera de vista.
      setTimeout(() => {
        const caja = garantia.current?.getBoundingClientRect();
        if (caja && caja.bottom > window.innerHeight) window.scrollBy({ top: caja.bottom - window.innerHeight + 24, behavior: 'smooth' });
      }, 60);
      return;
    }
    setMostrarGarantia(false);
    // Una pausa corta para que se vea la opción marcada antes de avanzar.
    setTimeout(() => setPaso((p) => p + 1), 220);
  };

  const validar = () => {
    const e: Record<string, string> = {};
    if (nombre.trim().length < 2) e.nombre = 'Escriba su nombre.';
    if (negocio.trim().length < 2) e.negocio = 'Escriba el nombre del restaurante o su Instagram.';
    if (!/^3\d{9}$/.test(celular)) e.celular = 'Escriba un celular de 10 dígitos que empiece por 3.';
    if (!canal) e.canal = 'Elija cómo prefiere que lo contactemos.';
    if (!acepta) e.acepta = 'Necesitamos su autorización para poder contactarlo.';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const enviar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validar()) return;
    setEstado('enviando');
    try {
      const r = await fetch('/api/restaurantes', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          respuestas,
          nombre,
          negocio,
          celular,
          canal,
          autoriza: acepta,
          website,
          leadId: leadId.current,
          externalId: idDeVisitante(),
          sourceUrl: urlParaMedir(),
        }),
      });
      const datos = (await r.json().catch(() => ({}))) as {
        ok?: boolean;
        calificado?: boolean;
        leadId?: string;
        enHorario?: boolean;
        contacto?: string;
      };
      if (!r.ok || !datos.ok) {
        setEstado('error');
        return;
      }
      if (datos.leadId) leadId.current = datos.leadId;
      if (datos.contacto) setContacto(datos.contacto);
      setEnHorario(datos.enHorario !== false);
      if (datos.calificado) {
        soloPixel('Lead', { eventId: leadId.current, categoria: 'restaurantes' });
        setEstado('calificado');
      } else {
        setEstado('descalificado');
      }
    } catch {
      setEstado('error');
    }
  };

  const primerNombre = nombre.trim().split(/\s+/)[0] ?? '';
  const codigo = leadId.current.slice(0, 8).toUpperCase();

  if (estado === 'calificado') {
    const mensaje = `Hola, soy ${primerNombre} de ${negocio}. Acabo de pedir la inspección gratis para mi restaurante. Mi código es ${codigo}.`;
    return (
      <div className="px-6 py-9 text-center sm:px-10" aria-live="polite">
        <m.span
          className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-green text-white"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 18 }}
        >
          <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <m.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.45, ease: 'easeOut' }} />
          </svg>
        </m.span>
        <h2 ref={titulo} tabIndex={-1} className="mt-5 font-heading text-[1.75rem] font-semibold leading-tight tracking-[-0.015em] text-brand-green-dark outline-none">
          Listo, {primerNombre}.
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-body-lg text-brand-black/75">
          Lo contactamos {contacto} para agendar su inspección gratis.
        </p>
        {/* Fuera de horario no hay quién conteste el teléfono: solo WhatsApp, que queda en fila. */}
        <div className="mt-7 grid gap-3">
          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`}
            onClick={() => rastrear('Contact', { categoria: 'restaurantes' })}
            className="flex min-h-[56px] items-center justify-center gap-2.5 rounded-full bg-[#1FA855] px-5 font-heading text-lg font-semibold text-white transition active:scale-[0.98]"
          >
            <MessageCircle size={22} aria-hidden /> {enHorario ? 'Escríbanos ya por WhatsApp' : 'Escríbanos por WhatsApp'}
          </a>
          {enHorario ? (
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              onClick={() => rastrear('Contact', { categoria: 'restaurantes' })}
              className="flex min-h-[56px] items-center justify-center gap-2.5 rounded-full border border-[#D5E0DA] px-5 font-heading text-lg font-semibold text-brand-green-dark transition active:scale-[0.98]"
            >
              <Phone size={20} aria-hidden /> Llámenos ahora
            </a>
          ) : null}
        </div>
        <p className="mt-5 text-body-sm text-brand-black/55">Su código de solicitud: {codigo}</p>
      </div>
    );
  }

  if (estado === 'descalificado') {
    return (
      <div className="px-6 py-10 text-center sm:px-10" aria-live="polite">
        <h2 ref={titulo} tabIndex={-1} className="font-heading text-[1.6rem] font-semibold leading-tight tracking-[-0.015em] text-brand-green-dark outline-none">
          Gracias, {primerNombre}.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-body text-brand-black/70">
          Por ahora este programa está pensado para restaurantes de Bucaramanga y su área metropolitana con un equipo de
          trabajo establecido. Guardamos sus datos por si eso cambia.
        </p>
      </div>
    );
  }

  const enDatos = paso >= PREGUNTAS.length;
  const pregunta = PREGUNTAS[paso];

  return (
    <div ref={tarjeta} className="scroll-mt-4">
      {/* Progreso: es una secuencia real, por eso lleva número. */}
      <div className="flex items-center gap-3 px-5 pt-5 sm:px-7 sm:pt-6">
        {paso > 0 && estado !== 'enviando' ? (
          <button
            type="button"
            onClick={() => {
              setMostrarGarantia(false);
              setPaso((p) => p - 1);
            }}
            className="-ml-1.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F2F6F3] text-brand-green-dark transition hover:bg-brand-mint"
            aria-label="Volver a la pregunta anterior"
          >
            <ArrowLeft size={18} aria-hidden />
          </button>
        ) : null}
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E8EEEA]" aria-hidden>
          <m.div
            className="h-full rounded-full bg-brand-green"
            initial={false}
            animate={{ width: `${((paso + 1) / TOTAL_PASOS) * 100}%` }}
            transition={{ type: 'spring', stiffness: 160, damping: 24 }}
          />
        </div>
        <span className="shrink-0 text-[0.8rem] font-semibold tabular-nums text-[#5B6B63]">
          {paso + 1} de {TOTAL_PASOS}
        </span>
      </div>

      <AnimatePresence
        mode="wait"
        initial={false}
        custom={direccion}
        onExitComplete={() => titulo.current?.focus({ preventScroll: true })}
      >
      {!enDatos && pregunta ? (
        <m.fieldset
          key={pregunta.id}
          custom={direccion}
          variants={VARIANTES_PASO}
          initial="entra"
          animate="centro"
          exit="sale"
          className="px-5 pb-6 pt-5 sm:px-7 sm:pb-7"
        >
          <legend className="sr-only">{pregunta.titulo}</legend>
          <h2 ref={titulo} tabIndex={-1} className="font-heading text-[1.45rem] font-semibold leading-[1.15] tracking-[-0.015em] text-brand-green-dark outline-none sm:text-[1.6rem]">
            {pregunta.titulo}
          </h2>
          {pregunta.ayuda ? <p className="mt-1.5 text-body-sm text-brand-black/55">{pregunta.ayuda}</p> : null}
          <div className="mt-5 grid gap-2" role="radiogroup" aria-label={pregunta.titulo}>
            {pregunta.opciones.map((o) => {
              const marcada = respuestas[pregunta.id] === o.valor;
              const Icono = iconoDe(pregunta.id, o.valor);
              return (
                <m.button
                  key={o.valor}
                  type="button"
                  role="radio"
                  aria-checked={marcada}
                  onClick={() => elegir(pregunta.id, o.valor)}
                  whileTap={{ scale: 0.985 }}
                  className={`flex min-h-[60px] w-full items-center gap-3.5 rounded-[18px] border px-3 py-2.5 text-left text-[1.02rem] font-semibold leading-snug transition-colors ${
                    marcada
                      ? 'border-brand-green bg-[#F2F6F3] text-brand-green-dark ring-1 ring-brand-green'
                      : 'border-[#E3EAE6] bg-white text-brand-black hover:border-brand-green/40 hover:bg-[#FAFCFB]'
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition ${
                      marcada ? 'bg-brand-green text-white' : 'bg-[#EEF3F0] text-brand-green'
                    }`}
                    aria-hidden
                  >
                    {marcada ? (
                      <m.span initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                        <Check size={19} strokeWidth={2.75} />
                      </m.span>
                    ) : (
                      <Icono size={19} strokeWidth={1.9} />
                    )}
                  </span>
                  <span className="flex-1">{o.etiqueta}</span>
                </m.button>
              );
            })}
          </div>

          {mostrarGarantia && pregunta.id === 'situacion' ? (
            <div ref={garantia} className="rr-paso mt-4 scroll-mb-6 rounded-[18px] bg-[#EEF3F0] p-4">
              <p className="flex gap-2.5 text-body text-brand-green-dark">
                <ShieldCheck size={22} className="mt-0.5 shrink-0" aria-hidden />
                <span>
                  <strong>Si la plaga vuelve mientras su plan esté activo, volvemos sin costo.</strong> Solo cumpla las
                  recomendaciones del técnico después del primer servicio.
                </span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setMostrarGarantia(false);
                  setPaso(1);
                }}
                className="mt-4 min-h-[52px] w-full rounded-full bg-brand-green-dark font-heading text-lg font-semibold text-white"
              >
                Continuar
              </button>
            </div>
          ) : null}
        </m.fieldset>
      ) : (
        <m.form
          key="datos"
          custom={direccion}
          variants={VARIANTES_PASO}
          initial="entra"
          animate="centro"
          exit="sale"
          onSubmit={enviar}
          noValidate
          className="px-5 pb-6 pt-5 sm:px-7 sm:pb-7"
        >
          <h2 ref={titulo} tabIndex={-1} className="font-heading text-[1.45rem] font-semibold leading-[1.15] tracking-[-0.015em] text-brand-green-dark outline-none sm:text-[1.6rem]">
            ¿A quién contactamos?
          </h2>

          <div className="mt-5 grid gap-4">
            <Campo id="rr-nombre" etiqueta="Su nombre" error={errores.nombre}>
              <input
                id="rr-nombre"
                autoComplete="name"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={claseInput(errores.nombre)}
              />
            </Campo>
            <Campo id="rr-negocio" etiqueta="Restaurante, Instagram o página web" error={errores.negocio}>
              <input
                id="rr-negocio"
                autoComplete="organization"
                placeholder="La Brasa de Don José o @labrasa"
                value={negocio}
                onChange={(e) => setNegocio(e.target.value)}
                className={claseInput(errores.negocio)}
              />
            </Campo>
            <Campo id="rr-celular" etiqueta="Su celular" error={errores.celular}>
              <div className={`flex overflow-hidden ${claseInput(errores.celular)} p-0`}>
                <span className="grid place-items-center border-r border-[#E3EAE6] bg-[#F5F8F6] px-3.5 font-semibold text-brand-black/60">+57</span>
                <input
                  id="rr-celular"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="300 123 4567"
                  value={celular.replace(/(\d{3})(\d{3})(\d{0,4})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '))}
                  onChange={(e) => setCelular(e.target.value.replace(/\D/g, '').replace(/^57(?=3\d{9}$)/, '').slice(0, 10))}
                  className="min-w-0 flex-1 bg-transparent px-3.5 outline-none"
                />
              </div>
            </Campo>

            <div>
              <p className="mb-2 text-body-sm font-semibold text-brand-black/80">¿Cómo prefiere que lo contactemos?</p>
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Cómo prefiere que lo contactemos">
                {(
                  [
                    ['llamada', 'Llamada', Phone],
                    ['whatsapp', 'WhatsApp', MessageCircle],
                  ] as const
                ).map(([valor, etiqueta, Icono]) => (
                  <button
                    key={valor}
                    type="button"
                    role="radio"
                    aria-checked={canal === valor}
                    onClick={() => setCanal(valor)}
                    className={`flex min-h-[52px] items-center justify-center gap-2 rounded-[16px] border font-semibold transition ${
                      canal === valor
                        ? 'border-brand-green bg-[#F2F6F3] text-brand-green-dark ring-1 ring-brand-green'
                        : 'border-[#E3EAE6] bg-white text-brand-black'
                    }`}
                  >
                    <Icono size={18} aria-hidden /> {etiqueta}
                  </button>
                ))}
              </div>
              {errores.canal ? <p className="mt-1.5 text-body-sm text-red-700">{errores.canal}</p> : null}
            </div>

            {/* Honeypot: invisible para personas, irresistible para bots. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
              aria-hidden
            />

            <label className="flex cursor-pointer gap-3 text-body-sm leading-relaxed text-brand-black/70">
              <input
                type="checkbox"
                checked={acepta}
                onChange={(e) => setAcepta(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-brand-green"
              />
              <span>
                Autorizo a AGROINCOL a tratar mis datos para contactarme sobre este servicio, según su{' '}
                <a href="/politica-de-privacidad" target="_blank" rel="noopener" className="font-semibold text-brand-green underline underline-offset-2">
                  política de privacidad
                </a>{' '}
                (Ley 1581 de 2012).
              </span>
            </label>
            {errores.acepta ? <p className="-mt-2 text-body-sm text-red-700">{errores.acepta}</p> : null}
          </div>

          {estado === 'error' ? (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-body-sm text-red-800" role="alert">
              No pudimos registrar su solicitud. Intente de nuevo o escríbanos al WhatsApp {BUSINESS.phone}.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={estado === 'enviando'}
            className="mt-6 flex min-h-[58px] w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-5 font-heading text-[1.2rem] font-bold text-white shadow-brand transition hover:bg-brand-orange-dark active:scale-[0.98] disabled:opacity-70"
          >
            {estado === 'enviando' ? <Loader2 className="animate-spin" size={22} aria-hidden /> : null}
            Agende su inspección gratis
          </button>
          <p className="mt-3 text-center text-body-sm text-brand-black/55">Lo contactamos {contacto}.</p>
        </m.form>
      )}
      </AnimatePresence>
    </div>
  );
}

function claseInput(error?: string) {
  return `min-h-[54px] w-full rounded-[16px] border bg-white px-4 text-[1.05rem] text-brand-black outline-none transition placeholder:text-brand-black/35 focus-within:border-brand-green focus-within:ring-1 focus-within:ring-brand-green ${
    error ? 'border-red-400' : 'border-[#E3EAE6]'
  }`;
}

function Campo({ id, etiqueta, error, children }: { id: string; etiqueta: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-body-sm font-semibold text-brand-black/80">
        {etiqueta}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-body-sm text-red-700">{error}</p> : null}
    </div>
  );
}
