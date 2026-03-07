import { Quote } from 'lucide-react';

const testimonials = [
  {
    text: 'Llevamos 5 años trabajando con AGROINCOL para la fumigación de nuestro restaurante. Siempre puntuales, profesionales y con certificación al día.',
    name: 'María López',
    business: 'Restaurante La Sazón, Bucaramanga',
  },
  {
    text: 'Excelente servicio de desratización en nuestra bodega. Resolvieron el problema en una sola visita y hacen seguimiento periódico.',
    name: 'Carlos Ruiz',
    business: 'Distribuidora del Oriente, Floridablanca',
  },
  {
    text: 'Los recomiendo 100%. Rápidos, profesionales y a buen precio. Ya no tenemos problemas de plagas en el conjunto.',
    name: 'Ana García',
    business: 'Conjunto Residencial Los Pinos, Piedecuesta',
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-brand-green">
      <div className="container-custom">
        <h2 className="font-heading text-h2-mobile md:text-h2 text-white text-center mb-12">
          Lo Que Dicen Nuestros Clientes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/10 backdrop-blur rounded-xl p-6">
              <Quote size={32} className="text-brand-orange mb-4" />
              <p className="text-gray-200 italic text-body">{testimonial.text}</p>
              <p className="text-white font-semibold mt-4">— {testimonial.name}</p>
              <p className="text-gray-400 text-body-sm">{testimonial.business}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
