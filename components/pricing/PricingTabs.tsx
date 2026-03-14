'use client';

import { useState } from 'react';
import { UtensilsCrossed, Home, Check, X, Star } from 'lucide-react';
import Button from '@/components/ui/Button';

// ── Types ────────────────────────────────────────────────────────────────

interface Feature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  tag: string;
  price: string;
  priceDetail: string;
  annualValue?: string;
  semesterValue?: string;
  monthlyEquiv?: string;
  features: Feature[];
  idealFor: string;
  highlighted?: boolean;
  ctaVariant: 'primary' | 'secondary';
}

// ── Restaurant Plans ─────────────────────────────────────────────────────

const restaurantPlans: PricingPlan[] = [
  {
    name: 'Servicio Único',
    tag: 'Puntual',
    price: '$150.000',
    priceDetail: 'pago único · IVA incluido',
    features: [
      { text: '1 visita', included: true },
      { text: 'Aspersión + gel', included: true },
      { text: 'Productos certificados INVIMA', included: true },
      { text: 'Certificado INVIMA no incluido', included: false },
      { text: 'Reporte técnico no incluido', included: false },
      { text: 'Sin garantía de re-servicio', included: false },
      { text: 'Sin soporte en auditorías', included: false },
      { text: 'Estaciones de roedores: adicionales $50.000 c/u', included: true },
    ],
    idealFor: 'Problema puntual. Una visita, una solución.',
    ctaVariant: 'secondary',
  },
  {
    name: 'Control',
    tag: 'Básico',
    price: '$80.000',
    priceDetail: '/mes · IVA incluido',
    annualValue: '$960.000/año',
    features: [
      { text: '4 visitas/año (1 cada 3 meses)', included: true },
      { text: 'Aspersión + gel', included: true },
      { text: 'Certificado INVIMA después de cada visita', included: true },
      { text: '1 estación de roedores incluida', included: true },
      { text: 'Reporte técnico no incluido', included: false },
      { text: 'Sin garantía de re-servicio', included: false },
      { text: 'Sin soporte en auditorías', included: false },
      { text: 'Sin capacitación', included: false },
    ],
    idealFor: 'Cumplir el mínimo legal.',
    ctaVariant: 'secondary',
  },
  {
    name: 'Protección',
    tag: 'Recomendado',
    price: '$105.000',
    priceDetail: '/mes · IVA incluido',
    annualValue: '$1.260.000/año',
    highlighted: true,
    features: [
      { text: '6 visitas/año (1 cada 2 meses)', included: true },
      { text: 'Aspersión + gel', included: true },
      { text: 'Certificado INVIMA después de cada visita', included: true },
      { text: 'Reporte técnico con fotos después de cada visita', included: true },
      { text: 'Soporte documental completo en auditorías', included: true },
      { text: 'Garantía sin costo entre visitas (respuesta <24h)', included: true },
      { text: 'Capacitación básica en prevención', included: true },
      { text: '2 estaciones de roedores incluidas', included: true },
    ],
    idealFor: 'Operar tranquilo y cumplir INVIMA sin preocupaciones.',
    ctaVariant: 'primary',
  },
  {
    name: 'Blindaje',
    tag: 'Premium',
    price: '$180.000',
    priceDetail: '/mes · IVA incluido',
    annualValue: '$2.160.000/año',
    features: [
      { text: '12 visitas/año (1 cada mes)', included: true },
      { text: 'Aspersión + gel + trampas de monitoreo', included: true },
      { text: 'Certificado INVIMA después de cada visita', included: true },
      { text: 'Reporte detallado + informe trimestral de tendencias', included: true },
      { text: 'Asesoría + acompañamiento en auditorías', included: true },
      { text: 'Garantía ilimitada entre visitas (respuesta <12h)', included: true },
      { text: 'Capacitación completa + actualizaciones', included: true },
      { text: 'Mapa de riesgo trimestral', included: true },
      { text: '4 estaciones de roedores incluidas', included: true },
    ],
    idealFor: 'Restaurante grande, cadena, hotel. Cero tolerancia.',
    ctaVariant: 'secondary',
  },
];

// ── Home Plans ───────────────────────────────────────────────────────────

const homePlans: PricingPlan[] = [
  {
    name: 'Express',
    tag: 'Mínimo',
    price: '$90.000',
    priceDetail: 'pago único · IVA incluido',
    features: [
      { text: '1 visita — 1 espacio específico (cocina O baño O habitación)', included: true },
      { text: '1 plaga', included: true },
      { text: 'Aspersión + gel', included: true },
      { text: 'Productos INVIMA seguros para familia', included: true },
      { text: 'Sin inspección diagnóstica', included: false },
      { text: 'Sin reporte digital', included: false },
      { text: 'Sin garantía', included: false },
      { text: 'Sin seguimiento', included: false },
    ],
    idealFor: 'Solo una cocina o un baño. Solución rápida.',
    ctaVariant: 'secondary',
  },
  {
    name: 'Esencial',
    tag: 'Puntual',
    price: '$140.000',
    priceDetail: 'pago único · IVA incluido',
    features: [
      { text: '1 visita — áreas principales del interior', included: true },
      { text: '1 plaga principal', included: true },
      { text: 'Aspersión + gel', included: true },
      { text: 'Inspección rápida', included: true },
      { text: 'Productos INVIMA seguros para familia', included: true },
      { text: 'Garantía: refuerzo a 15 días ($140.000), si persiste 1 garantía sin costo (máx 90 días)', included: true },
      { text: 'Sin reporte digital', included: false },
      { text: 'Sin seguimiento', included: false },
    ],
    idealFor: 'Problema puntual. Una plaga, una visita.',
    ctaVariant: 'secondary',
  },
  {
    name: 'Integral',
    tag: 'Recomendado',
    price: '$250.000',
    priceDetail: 'pago único · IVA incluido',
    highlighted: true,
    features: [
      { text: '1 visita completa — toda la casa incluyendo exteriores', included: true },
      { text: 'Todas las plagas comunes', included: true },
      { text: 'Diagnóstico completo', included: true },
      { text: 'Aspersión + gel', included: true },
      { text: 'Reporte digital con fotos', included: true },
      { text: 'Seguimiento a las 2 semanas', included: true },
      { text: 'Garantía 30 días sin costo', included: true },
      { text: 'Productos INVIMA seguros para familia y mascotas', included: true },
    ],
    idealFor: 'Resolver de raíz, no solo el síntoma visible.',
    ctaVariant: 'primary',
  },
  {
    name: 'Hogar Protegido',
    tag: 'Premium · Recurrente',
    price: '$810.000',
    priceDetail: '/año · IVA incluido (10% dto. prepago)',
    semesterValue: '$430.000/semestre (5% dto.)',
    monthlyEquiv: '~$67.500/mes',
    features: [
      { text: '6 visitas/año (1 cada 2 meses)', included: true },
      { text: 'Toda la casa: interior + exterior + zonas ocultas', included: true },
      { text: 'Todas las plagas comunes', included: true },
      { text: 'Aspersión + gel + trampas de monitoreo', included: true },
      { text: 'Inspección completa en cada visita', included: true },
      { text: 'Reporte digital con fotos después de cada visita', included: true },
      { text: 'Seguimiento continuo por WhatsApp', included: true },
      { text: 'Garantía ilimitada entre visitas', included: true },
      { text: 'Atención prioritaria', included: true },
    ],
    idealFor: 'Familia que quiere olvidarse del tema para siempre.',
    ctaVariant: 'secondary',
  },
];

// ── PricingCard Component ────────────────────────────────────────────────

function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div
      className={`relative bg-white rounded-2xl p-6 md:p-8 hover:shadow-lg transition-shadow flex flex-col ${
        plan.highlighted
          ? 'border-2 border-brand-orange shadow-xl'
          : 'border border-gray-200 shadow-sm'
      }`}
    >
      {/* Badge for highlighted plan */}
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-brand-orange text-white text-xs font-heading font-bold px-4 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1">
            <Star size={12} fill="white" />
            Más elegido
          </span>
        </div>
      )}

      {/* Tag */}
      <span className="inline-block bg-brand-light text-brand-green text-xs font-semibold font-body px-3 py-1 rounded-full mb-3 w-fit">
        {plan.tag}
      </span>

      {/* Name */}
      <h3 className="font-heading text-xl font-bold text-brand-green">{plan.name}</h3>

      {/* Price */}
      <div className="mt-3 mb-1">
        <span className="font-heading text-3xl md:text-4xl text-brand-green font-bold">{plan.price}</span>
      </div>
      <p className="text-brand-gray text-body-sm">{plan.priceDetail}</p>
      {plan.annualValue && (
        <p className="text-brand-gray text-xs mt-0.5">{plan.annualValue}</p>
      )}
      {plan.semesterValue && (
        <p className="text-brand-gray text-xs mt-0.5">{plan.semesterValue}</p>
      )}
      {plan.monthlyEquiv && (
        <p className="text-brand-orange text-xs font-semibold mt-0.5">{plan.monthlyEquiv}</p>
      )}

      {/* Divider */}
      <hr className="my-5 border-gray-100" />

      {/* Features */}
      <ul className="space-y-2.5 flex-1">
        {plan.features.map((feature) => (
          <li key={feature.text} className="flex items-start gap-2">
            {feature.included ? (
              <Check size={16} className="text-brand-orange mt-0.5 shrink-0" />
            ) : (
              <X size={16} className="text-gray-300 mt-0.5 shrink-0" />
            )}
            <span className={`text-body-sm leading-snug ${feature.included ? 'text-brand-black' : 'text-gray-400'}`}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Ideal for */}
      <div className="bg-brand-light rounded-lg p-3 mt-5">
        <p className="text-brand-gray text-xs">
          <span className="font-semibold text-brand-green">Ideal para:</span> {plan.idealFor}
        </p>
      </div>

      {/* CTA */}
      <div className="mt-5">
        <Button variant={plan.ctaVariant} href="#contacto" fullWidth>
          Cotizar
        </Button>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────

export default function PricingTabs() {
  const [activeTab, setActiveTab] = useState<'restaurantes' | 'hogares'>('restaurantes');

  return (
    <>
      {/* Tab Selector */}
      <section className="section-padding pb-0">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => setActiveTab('restaurantes')}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 rounded-2xl border-2 font-heading font-bold text-lg transition-all duration-300 ${
                activeTab === 'restaurantes'
                  ? 'border-brand-orange bg-brand-orange/5 text-brand-green shadow-md'
                  : 'border-gray-200 text-brand-gray hover:border-brand-orange/50'
              }`}
            >
              <UtensilsCrossed
                size={24}
                className={activeTab === 'restaurantes' ? 'text-brand-orange' : 'text-gray-400'}
              />
              <span>Restaurantes y Negocios de Alimentos</span>
            </button>
            <button
              onClick={() => setActiveTab('hogares')}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 rounded-2xl border-2 font-heading font-bold text-lg transition-all duration-300 ${
                activeTab === 'hogares'
                  ? 'border-brand-orange bg-brand-orange/5 text-brand-green shadow-md'
                  : 'border-gray-200 text-brand-gray hover:border-brand-orange/50'
              }`}
            >
              <Home
                size={24}
                className={activeTab === 'hogares' ? 'text-brand-orange' : 'text-gray-400'}
              />
              <span>Hogares y Residencias</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            {activeTab === 'restaurantes' ? (
              <>
                <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
                  Programas de Protección para Restaurantes
                </h2>
                <p className="text-brand-gray text-body-lg mt-4 max-w-3xl mx-auto">
                  La Resolución 2674 de 2013 exige un programa continuo de control de plagas — no un servicio anual.
                  Todos los programas incluyen certificado INVIMA después de cada visita.
                </p>
              </>
            ) : (
              <>
                <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
                  Planes de Protección para Hogares
                </h2>
                <p className="text-brand-gray text-body-lg mt-4 max-w-3xl mx-auto">
                  Productos certificados INVIMA, seguros para familias con niños y mascotas. Sin olores fuertes ni
                  residuos tóxicos.
                </p>
              </>
            )}
          </div>

          {/* Cards Grid */}
          <div
            key={activeTab}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-5 animate-fade-in-up"
          >
            {(activeTab === 'restaurantes' ? restaurantPlans : homePlans).map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>

          {/* Callout */}
          <div className="mt-10 max-w-4xl mx-auto">
            <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-2xl p-5 md:p-6">
              <p className="text-brand-black text-body leading-relaxed text-center">
                <Star size={16} className="inline text-brand-orange mr-1 -mt-0.5" />
                {activeTab === 'restaurantes' ? (
                  <>
                    <strong>PROTECCIÓN</strong> es el programa más elegido por restaurantes en Bucaramanga. Solo
                    $25.000/mes más que Control, pero incluye garantía, reportes técnicos y soporte en auditorías.
                  </>
                ) : (
                  <>
                    <strong>INTEGRAL</strong> es el plan más elegido por familias en Bucaramanga. Diagnóstico completo,
                    tratamiento en todas las áreas, garantía de 30 días y seguimiento. Solo $110.000 más que Express.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
