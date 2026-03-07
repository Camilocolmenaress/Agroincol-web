'use client';

import { useState } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { SERVICE_TYPE_OPTIONS, BUSINESS } from '@/lib/constants';
import Button from '@/components/ui/Button';
import type { ContactFormProps } from '@/lib/types';

export default function ContactForm({ preselectedService, formId }: ContactFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    tipoServicio: preselectedService || '',
    direccion: '',
    mensaje: '',
    website: '', // honeypot anti-spam
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre || formData.nombre.length < 2) {
      newErrors.nombre = 'Ingrese su nombre completo';
    }
    if (!formData.telefono || formData.telefono.replace(/\D/g, '').length < 7) {
      newErrors.telefono = 'Ingrese un número de teléfono válido';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }
    if (!formData.tipoServicio) {
      newErrors.tipoServicio = 'Seleccione un servicio';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Si el honeypot tiene valor, es un bot — silenciar sin error
    if (formData.website) {
      setStatus('success'); // Fake success para no alertar al bot
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          formId,
          page: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'telefono') {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/[^\d\s\-+()]/g, '') }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  if (status === 'success') {
    return (
      <div id="contacto" className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
          <h3 className="font-heading font-semibold text-h3 text-brand-green">¡Mensaje enviado con éxito!</h3>
          <p className="text-brand-gray text-body mt-2">
            Nos pondremos en contacto con usted en menos de 2 horas. Si necesita atención inmediata,
            puede llamarnos o escribirnos por WhatsApp.
          </p>
          <div className="mt-6">
            <Button variant="whatsapp" href={BUSINESS.whatsappLink} target="_blank">
              Escribir por WhatsApp
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="contacto" className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
      <div className="mb-6">
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
          Solicite su Cotización Gratis
        </h2>
        <p className="text-brand-gray text-body-sm mt-2">
          Respuesta en menos de 2 horas · Sin compromiso · 40+ años de experiencia
        </p>
      </div>

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-body-sm">
            Hubo un error al enviar su mensaje. Por favor intente nuevamente o contáctenos por WhatsApp.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="text-red-700 font-semibold text-body-sm underline mt-2"
          >
            Reintentar
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Nombre */}
        <div className="flex flex-col gap-1">
          <label htmlFor={`${formId}-nombre`} className="font-body font-semibold text-brand-black text-body-sm">
            Nombre completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id={`${formId}-nombre`}
            name="nombre"
            placeholder="Ej: Juan Pérez"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-brand-gray-light bg-white text-brand-black font-body focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1 font-body">{errors.nombre}</p>}
        </div>

        {/* Teléfono */}
        <div className="flex flex-col gap-1">
          <label htmlFor={`${formId}-telefono`} className="font-body font-semibold text-brand-black text-body-sm">
            Teléfono / WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id={`${formId}-telefono`}
            name="telefono"
            placeholder="Ej: 310 789 1948"
            value={formData.telefono}
            onChange={handleChange}
            maxLength={15}
            className="w-full px-4 py-3 rounded-lg border border-brand-gray-light bg-white text-brand-black font-body focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
          />
          {errors.telefono && <p className="text-red-500 text-xs mt-1 font-body">{errors.telefono}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label htmlFor={`${formId}-email`} className="font-body font-semibold text-brand-black text-body-sm">
            Correo electrónico
          </label>
          <input
            type="email"
            id={`${formId}-email`}
            name="email"
            placeholder="Ej: juan@empresa.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-brand-gray-light bg-white text-brand-black font-body focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1 font-body">{errors.email}</p>}
        </div>

        {/* Tipo de servicio */}
        <div className="flex flex-col gap-1">
          <label htmlFor={`${formId}-tipoServicio`} className="font-body font-semibold text-brand-black text-body-sm">
            ¿Qué servicio necesita? <span className="text-red-500">*</span>
          </label>
          <select
            id={`${formId}-tipoServicio`}
            name="tipoServicio"
            value={formData.tipoServicio}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-brand-gray-light bg-white text-brand-black font-body focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
          >
            <option value="">Seleccione un servicio</option>
            {SERVICE_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.tipoServicio && <p className="text-red-500 text-xs mt-1 font-body">{errors.tipoServicio}</p>}
        </div>

        {/* Dirección */}
        <div className="flex flex-col gap-1">
          <label htmlFor={`${formId}-direccion`} className="font-body font-semibold text-brand-black text-body-sm">
            Dirección del servicio
          </label>
          <input
            type="text"
            id={`${formId}-direccion`}
            name="direccion"
            placeholder="Ej: Cra 15 #30-45, Bucaramanga"
            value={formData.direccion}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-brand-gray-light bg-white text-brand-black font-body focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
          />
        </div>

        {/* Mensaje */}
        <div className="flex flex-col gap-1">
          <label htmlFor={`${formId}-mensaje`} className="font-body font-semibold text-brand-black text-body-sm">
            Cuéntenos su situación
          </label>
          <textarea
            id={`${formId}-mensaje`}
            name="mensaje"
            placeholder="Descríbanos su problema de plagas o el servicio que necesita..."
            value={formData.mensaje}
            onChange={handleChange}
            maxLength={500}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-brand-gray-light bg-white text-brand-black font-body focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Honeypot anti-spam — campo oculto, si se llena es bot */}
        <div className="absolute opacity-0 pointer-events-none h-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
          <label htmlFor={`${formId}-website`}>Website</label>
          <input
            type="text"
            id={`${formId}-website`}
            name="website"
            value={formData.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Submit */}
        <Button
          variant="primary"
          type="submit"
          disabled={status === 'loading'}
          fullWidth
        >
          {status === 'loading' ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              Solicitar Cotización Gratis
              <Send size={20} />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
