'use client';

import { useState, useCallback } from 'react';
import {
  Home, UtensilsCrossed, Building2, Factory, Building, GraduationCap,
  ChevronRight, ChevronLeft, RotateCcw, Bug, ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import ContactForm from '@/components/forms/ContactForm';
import { BUSINESS } from '@/lib/constants';

// ── Types ──────────────────────────────────────────────────────────────

type PropertyType = 'casa' | 'restaurante' | 'oficina' | 'bodega' | 'conjunto' | 'institucion';

interface Option {
  value: string;
  label: string;
  icon?: LucideIcon;
}

interface Step {
  id: string;
  label: string;
  question: string;
  options: Option[];
  type: 'cards' | 'select';
}

// ── Data ───────────────────────────────────────────────────────────────

const steps: Step[] = [
  {
    id: 'propiedad',
    label: 'Propiedad',
    question: '¿Qué tipo de propiedad necesita fumigar?',
    type: 'cards',
    options: [
      { value: 'casa', label: 'Casa o apartamento', icon: Home },
      { value: 'restaurante', label: 'Restaurante o negocio de alimentos', icon: UtensilsCrossed },
      { value: 'oficina', label: 'Oficina o local comercial', icon: Building2 },
      { value: 'bodega', label: 'Bodega o planta industrial', icon: Factory },
      { value: 'conjunto', label: 'Conjunto residencial o propiedad horizontal', icon: Building },
      { value: 'institucion', label: 'Institución educativa o de salud', icon: GraduationCap },
    ],
  },
  {
    id: 'ubicacion',
    label: 'Ubicación',
    question: '¿Dónde está ubicada su propiedad?',
    type: 'select',
    options: [
      { value: 'bucaramanga', label: 'Bucaramanga' },
      { value: 'floridablanca', label: 'Floridablanca' },
      { value: 'piedecuesta', label: 'Piedecuesta' },
      { value: 'giron', label: 'Girón' },
      { value: 'otro-santander', label: 'Otro municipio de Santander' },
      { value: 'otra-ciudad', label: 'Otra ciudad de Colombia' },
    ],
  },
  {
    id: 'historial',
    label: 'Historial',
    question: '¿Ha tenido problemas de plagas en los últimos 6 meses?',
    type: 'cards',
    options: [
      { value: 'infestacion', label: 'Sí, infestación activa o reciente' },
      { value: 'avistamientos', label: 'Sí, avistamientos ocasionales' },
      { value: 'prevenir', label: 'No, pero quiero prevenir' },
      { value: 'no-seguro', label: 'No estoy seguro' },
    ],
  },
  {
    id: 'entorno',
    label: 'Entorno',
    question: '¿Cómo es el entorno de su propiedad?',
    type: 'cards',
    options: [
      { value: 'urbana-densa', label: 'Zona urbana densa (cerca de mercados, restaurantes, alcantarillas)' },
      { value: 'residencial', label: 'Zona residencial estándar' },
      { value: 'rural', label: 'Zona rural o con poca densidad' },
      { value: 'industrial', label: 'Zona industrial' },
    ],
  },
  {
    id: 'tamano',
    label: 'Tamaño',
    question: '¿Cuál es el tamaño aproximado del área a fumigar?',
    type: 'cards',
    options: [
      { value: 'pequeno', label: 'Pequeño (menos de 50 m²)' },
      { value: 'mediano', label: 'Mediano (50 – 200 m²)' },
      { value: 'grande', label: 'Grande (200 – 500 m²)' },
      { value: 'muy-grande', label: 'Muy grande (más de 500 m²)' },
    ],
  },
];

const baseScores: Record<PropertyType, number> = {
  casa: 2,
  restaurante: 5,
  oficina: 3,
  bodega: 4,
  conjunto: 3,
  institucion: 4,
};

const ubicacionMod: Record<string, number> = {
  bucaramanga: 2, floridablanca: 1, piedecuesta: 1, giron: 1,
  'otro-santander': 1, 'otra-ciudad': 1,
};

const historialMod: Record<string, number> = {
  infestacion: 3, avistamientos: 2, prevenir: 0, 'no-seguro': 1,
};

const entornoMod: Record<string, number> = {
  'urbana-densa': 2, residencial: 1, rural: 0, industrial: 2,
};

const tamanoMod: Record<string, number> = {
  pequeno: 0, mediano: 1, grande: 2, 'muy-grande': 3,
};

interface RiskLevel {
  label: string;
  color: string;
  bg: string;
  frequency: string;
}

function getRiskLevel(score: number): RiskLevel {
  if (score <= 4) return { label: 'Bajo', color: '#22C55E', bg: 'bg-green-50', frequency: 'Cada 6 meses' };
  if (score <= 7) return { label: 'Moderado', color: '#EAB308', bg: 'bg-yellow-50', frequency: 'Cada 3 meses' };
  if (score <= 10) return { label: 'Alto', color: '#F46931', bg: 'bg-orange-50', frequency: 'Cada 2 meses' };
  if (score <= 14) return { label: 'Muy alto', color: '#EF4444', bg: 'bg-red-50', frequency: 'Mensual' };
  return { label: 'Crítico', color: '#DC2626', bg: 'bg-red-100', frequency: 'Quincenal o inmediata' };
}

function getFrequencyMonths(score: number): string {
  if (score <= 4) return '6';
  if (score <= 7) return '3';
  if (score <= 10) return '2';
  if (score <= 14) return '1';
  return '0.5';
}

function getExplanation(prop: PropertyType, ubicacion: string, months: string): string {
  const ubicLabel = steps[1].options.find((o) => o.value === ubicacion)?.label || ubicacion;

  const explanations: Record<PropertyType, string> = {
    restaurante: `Los establecimientos de alimentos en Colombia deben cumplir con la Resolución 2674 de 2013, que exige un Plan de Saneamiento con control de plagas. Dado su tipo de negocio y las condiciones indicadas, le recomendamos fumigar cada ${months} mes(es) con una empresa certificada que emita el certificado válido ante INVIMA.`,
    casa: `Para una vivienda en ${ubicLabel}, con las condiciones indicadas, le recomendamos realizar control de plagas preventivo cada ${months} mes(es). Esto ayuda a prevenir infestaciones de cucarachas, roedores e insectos comunes en el clima tropical de Santander.`,
    oficina: `Los espacios comerciales y oficinas deben mantener un programa de control de plagas para garantizar un ambiente saludable para empleados y clientes. Le recomendamos fumigar cada ${months} mes(es).`,
    bodega: `Las instalaciones industriales requieren control de plagas riguroso según el Decreto 1843 de 1991. Dada la naturaleza de su operación, le recomendamos un programa de control cada ${months} mes(es).`,
    conjunto: `Los conjuntos residenciales y propiedades horizontales deben incluir el control de plagas en sus planes de mantenimiento. Le recomendamos programar fumigación de áreas comunes cada ${months} mes(es).`,
    institucion: `Las instituciones educativas y de salud tienen protocolos estrictos de sanidad. Le recomendamos control de plagas cada ${months} mes(es) para cumplir con la normativa vigente.`,
  };
  return explanations[prop];
}

function getNormativa(prop: PropertyType): string {
  if (prop === 'restaurante') {
    return 'Normativa: Resolución 2674 de 2013 — Su establecimiento debe tener certificado de fumigación vigente para las inspecciones del INVIMA.';
  }
  return 'Normativa: Decreto 1843 de 1991 — Regula el uso y manejo de plaguicidas. La fumigación debe ser realizada por personal certificado.';
}

const plagasPorTipo: Record<PropertyType, string[]> = {
  restaurante: ['Cucarachas', 'Roedores', 'Moscas', 'Hormigas'],
  casa: ['Cucarachas', 'Hormigas', 'Mosquitos', 'Arañas'],
  oficina: ['Cucarachas', 'Roedores', 'Hormigas'],
  bodega: ['Roedores', 'Gorgojos', 'Termitas', 'Cucarachas'],
  conjunto: ['Cucarachas', 'Mosquitos', 'Roedores', 'Hormigas'],
  institucion: ['Cucarachas', 'Roedores', 'Mosquitos', 'Moscas'],
};

// ── Component ──────────────────────────────────────────────────────────

export default function FumigationCalculator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const step = steps[currentStep];
  const selectedValue = answers[step.id] || '';

  const handleSelect = useCallback((value: string) => {
    setAnswers((prev) => ({ ...prev, [step.id]: value }));
  }, [step.id]);

  const handleNext = () => {
    if (!selectedValue) return;
    if (currentStep < steps.length - 1) {
      setDirection('next');
      setCurrentStep((s) => s + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (showResult) {
      setShowResult(false);
      return;
    }
    setDirection('prev');
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResult(false);
    setDirection('next');
  };

  // Calculate result
  const prop = (answers.propiedad || 'casa') as PropertyType;
  const score =
    (baseScores[prop] || 2) +
    (ubicacionMod[answers.ubicacion] ?? 1) +
    (historialMod[answers.historial] ?? 0) +
    (entornoMod[answers.entorno] ?? 0) +
    (tamanoMod[answers.tamano] ?? 0);

  const risk = getRiskLevel(score);
  const months = getFrequencyMonths(score);
  const plagas = plagasPorTipo[prop] || plagasPorTipo.casa;

  if (showResult) {
    return (
      <div className="space-y-8">
        {/* Result Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 animate-fade-in-up">
          {/* Risk Indicator */}
          <div className="flex flex-col items-center text-center mb-8">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center mb-4 border-4"
              style={{ borderColor: risk.color, backgroundColor: `${risk.color}15` }}
            >
              <span className="text-3xl font-heading font-bold" style={{ color: risk.color }}>
                {risk.label}
              </span>
            </div>
            <h3 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
              {risk.frequency}
            </h3>
            <p className="text-brand-gray text-body-sm mt-1">Frecuencia recomendada de fumigación</p>
          </div>

          {/* Explanation */}
          <div className="bg-brand-light rounded-xl p-5 mb-6">
            <p className="text-brand-black text-body leading-relaxed">
              {getExplanation(prop, answers.ubicacion, months)}
            </p>
          </div>

          {/* Normativa */}
          <div className={`${risk.bg} border-l-4 rounded-r-lg p-5 mb-6`} style={{ borderLeftColor: risk.color }}>
            <p className="text-brand-black text-body">
              <span className="mr-2">📋</span>{getNormativa(prop)}
            </p>
          </div>

          {/* Plagas comunes */}
          <div className="mb-6">
            <h4 className="font-heading font-semibold text-brand-green text-lg mb-3">
              Plagas más comunes para su tipo de propiedad
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {plagas.map((plaga) => (
                <div key={plaga} className="flex items-center gap-2 bg-brand-light rounded-lg px-4 py-3">
                  <Bug size={18} className="text-brand-orange shrink-0" />
                  <span className="text-brand-black text-body-sm font-semibold">{plaga}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-brand-green rounded-xl p-6 text-center">
            <h4 className="font-heading text-xl md:text-2xl text-white font-bold mb-2">
              ¿Necesita fumigar? Cotice gratis con AGROINCOL
            </h4>
            <p className="text-gray-300 text-body-sm mb-5">
              40+ años de experiencia en el Área Metropolitana de Bucaramanga. Respuesta en menos de 2 horas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" href="#contacto-calculadora">
                Solicitar Cotización
              </Button>
              <Button variant="whatsapp" href={BUSINESS.whatsappLink} target="_blank">
                WhatsApp
              </Button>
            </div>
          </div>

          {/* Pricing link */}
          <div className="text-center mt-6">
            <a
              href="/precios"
              className="inline-flex items-center gap-2 text-brand-orange hover:text-brand-orange-dark font-body font-semibold text-body transition-colors"
            >
              Vea nuestros precios y programas de protección →
            </a>
          </div>

          {/* Recalcular */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-brand-gray hover:text-brand-orange transition-colors font-body font-semibold text-body-sm"
            >
              <RotateCcw size={16} />
              Recalcular
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div id="contacto-calculadora">
          <ContactForm formId="calculadora-contact" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex items-center justify-center gap-0">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-heading font-bold transition-colors duration-300 ${
                i < currentStep
                  ? 'bg-brand-green text-white'
                  : i === currentStep
                  ? 'bg-brand-orange text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 md:w-12 h-1 transition-colors duration-300 ${
                  i < currentStep ? 'bg-brand-green' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Question card */}
      <div
        key={step.id}
        className={`bg-white shadow-xl rounded-2xl p-6 md:p-8 ${
          direction === 'next' ? 'animate-slide-in-right' : 'animate-slide-in-left'
        }`}
      >
        <p className="text-brand-gray text-body-sm mb-1 font-body">
          Pregunta {currentStep + 1} de {steps.length}
        </p>
        <h3 className="font-heading text-xl md:text-2xl text-brand-green font-bold mb-6">
          {step.question}
        </h3>

        {/* Options */}
        {step.type === 'cards' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {step.options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedValue === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`flex items-center gap-3 text-left px-4 py-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-brand-orange bg-brand-orange/5'
                      : 'border-gray-200 hover:border-brand-orange/50'
                  }`}
                >
                  {Icon && (
                    <Icon
                      size={22}
                      className={`shrink-0 transition-colors ${isSelected ? 'text-brand-orange' : 'text-gray-400'}`}
                    />
                  )}
                  <span className={`text-body-sm font-body font-semibold ${isSelected ? 'text-brand-green' : 'text-brand-black'}`}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <select
            value={selectedValue}
            onChange={(e) => handleSelect(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-brand-black font-body focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
          >
            <option value="">Seleccione una opción</option>
            {step.options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}

        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-8">
          {currentStep > 0 ? (
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 text-brand-gray hover:text-brand-green transition-colors font-body font-semibold text-body-sm px-4 py-2 rounded-lg border border-gray-200 hover:border-brand-green"
            >
              <ChevronLeft size={18} />
              Anterior
            </button>
          ) : (
            <div />
          )}
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!selectedValue}
          >
            {currentStep === steps.length - 1 ? 'Calcular' : 'Siguiente'}
            {currentStep < steps.length - 1 ? <ChevronRight size={18} /> : <ArrowRight size={18} />}
          </Button>
        </div>
      </div>
    </div>
  );
}
