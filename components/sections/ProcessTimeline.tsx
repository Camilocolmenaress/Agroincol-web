const steps = [
  {
    number: 1,
    title: 'Inspección Inicial',
    description: 'Visitamos su restaurante para identificar puntos críticos, tipo de plagas presentes y nivel de infestación. Sin costo.',
  },
  {
    number: 2,
    title: 'Diagnóstico y Plan',
    description: 'Diseñamos un plan de control de plagas personalizado para su establecimiento, considerando el tipo de alimentos, horarios de operación y normativa aplicable.',
  },
  {
    number: 3,
    title: 'Aplicación Profesional',
    description: 'Nuestros técnicos certificados aplican el tratamiento con productos registrados ante el ICA y aprobados para áreas de alimentos. Coordinamos el horario para no interrumpir su operación.',
  },
  {
    number: 4,
    title: 'Certificación',
    description: 'Entregamos el certificado de fumigación el mismo día, válido ante el INVIMA y la Secretaría de Salud de Santander como soporte de su Plan de Saneamiento.',
  },
  {
    number: 5,
    title: 'Seguimiento y Mantenimiento',
    description: 'Programamos visitas periódicas de seguimiento para garantizar que su restaurante se mantenga libre de plagas de forma continua.',
  },
];

export default function ProcessTimeline() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green text-center mb-12">
          Nuestro Proceso de Fumigación para Restaurantes
        </h2>
        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="flex gap-4">
              {/* Timeline column */}
              <div className="flex flex-col items-center">
                <div className="bg-brand-orange text-white w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-lg shrink-0">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 bg-brand-orange flex-1 my-2" />
                )}
              </div>
              {/* Content */}
              <div className={`pb-8 ${index === steps.length - 1 ? 'pb-0' : ''}`}>
                <h3 className="font-heading font-semibold text-h3 text-brand-green">{step.title}</h3>
                <p className="text-brand-gray text-body mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
