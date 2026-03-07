import { Bug, MousePointer2 } from 'lucide-react';

const pests = [
  {
    name: 'Cucarachas',
    icon: Bug,
    description: 'Las cucarachas son el problema #1 en restaurantes. Se reproducen rápidamente en áreas cálidas y húmedas como cocinas y bodegas. Transmiten enfermedades como salmonelosis y gastroenteritis.',
  },
  {
    name: 'Roedores',
    icon: MousePointer2,
    description: 'Ratas y ratones contaminan alimentos y superficies con sus heces y orina. Pueden causar cortocircuitos al roer cables y generan pérdidas significativas de producto.',
  },
  {
    name: 'Moscas',
    icon: Bug,
    description: 'Las moscas domésticas y de la fruta son vectores de más de 100 enfermedades. Se multiplican rápidamente en residuos orgánicos y pueden generar sanciones sanitarias inmediatas.',
  },
  {
    name: 'Hormigas',
    icon: Bug,
    description: 'Las hormigas invaden áreas de almacenamiento y preparación de alimentos. Aunque parecen inofensivas, algunas especies contaminan alimentos y pueden provocar reacciones alérgicas.',
  },
];

export default function PestCards() {
  return (
    <section className="section-padding bg-brand-light">
      <div className="container-custom">
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green text-center mb-12">
          Plagas Comunes en Restaurantes de Bucaramanga
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pests.map((pest) => {
            const Icon = pest.icon;
            return (
              <div key={pest.name} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="bg-brand-orange/10 w-14 h-14 rounded-lg flex items-center justify-center">
                  <Icon size={32} className="text-brand-orange" />
                </div>
                <h3 className="font-heading font-semibold text-brand-green mt-4 text-h3">{pest.name}</h3>
                <p className="text-brand-gray text-body mt-2">{pest.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
