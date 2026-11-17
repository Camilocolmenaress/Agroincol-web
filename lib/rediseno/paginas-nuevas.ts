// Páginas creadas después del prototipo (no están en content/rediseno/paginas.json). Mismo formato que
// el prototipo: HTML de <main> con las piezas y clases de sitio.css, rutas del prototipo (servicio-x.html)
// o de producción, e imágenes en assets/ (las adapta transformar()).
//
// /servicios/control-cucarachas (17-nov-2026): la búsqueda con más volumen de la campaña de Google Ads.
// Todo el texto sale de lo ya publicado: el método y la seguridad, de /blog/como-eliminar-cucarachas-bucaramanga
// y del FAQ de residencial; la garantía es el texto aprobado por Camilo; sin cifras de precio.
import { gancho, tarjeta } from './piezas';

type PaginaNueva = { ruta: string; title: string; description: string; main: string };

const FORMULARIO = (servicio: string) => `<section class="cotizar" id="cotizar">
  <div class="cot-box">
    <div class="cot-copy" data-reveal>
      <span class="label">Cotización gratis</span>
      <h2 class="display">¿Tiene una plaga<br>ahora?</h2>
      <p>Déjenos sus datos. Le respondemos por WhatsApp en menos de 5 minutos.</p>
      <ul class="cot-list"><li>Cotización gratis y sin compromiso</li><li>Respuesta por WhatsApp en menos de 5 minutos</li><li>Certificado válido ante INVIMA</li><li>40+ años de experiencia</li></ul>
      <div class="cot-alt"><a class="btn btn-naranja" href="https://wa.me/573107891948">Prefiero WhatsApp</a><a class="call" href="tel:+573107891948">Llamar 310 789 1948</a></div>
    </div>
    <form class="cot-form" data-lead-form novalidate>
      <p class="cot-form-t">Solicite su cotización</p>
      <label class="fld"><span>Nombre completo *</span><input name="nombre" type="text" autocomplete="name" placeholder="Ej: Juan Pérez" required><em class="err">Escriba su nombre.</em></label>
      <label class="fld"><span>Teléfono / WhatsApp *</span><input name="telefono" type="tel" autocomplete="tel" inputmode="tel" placeholder="Ej: 310 789 1948" required><em class="err">Escriba un número de 10 dígitos.</em></label>
      <label class="fld"><span>¿Qué servicio necesita? *</span><span class="sel"><select name="tipoServicio" required><option value="">Seleccione un servicio</option><option selected>${servicio}</option><option>Fumigación Residencial</option><option>Fumigación para Restaurantes</option><option>Control de Plagas Comercial</option><option>Desratización</option><option>Control de Insectos Voladores</option><option>Fumigación Industrial</option><option>Otro</option></select></span><em class="err">Elija un servicio.</em></label>
      <div class="hp" aria-hidden="true"><label>Website<input name="website" type="text" tabindex="-1" autocomplete="off"></label></div>
      <label class="chk"><input name="aceptaTerminos" type="checkbox" required><span>Autorizo a AGROINCOL para el tratamiento de mis datos personales según la <a href="politica-de-privacidad.html" data-transition>Política de Tratamiento de Datos Personales</a>. *</span></label>
      <em class="err err-chk">Debe aceptar para continuar.</em>
      <button class="btn btn-verde" type="submit">Solicitar cotización gratis</button>
      <p class="cot-note">Respuesta por WhatsApp en menos de 5 minutos · Sin compromiso</p>
      <div class="cot-ok" role="status" aria-live="polite" hidden><span class="gel"></span><p class="cot-ok-t">Listo.</p><p>Le escribimos por WhatsApp en menos de 5 minutos.</p></div>
    </form>
  </div>
</section>`;

const OTROS = [
  ['servicio-fumigacion-residencial.html', 'obj-casa', 'Fumigación residencial'],
  ['servicio-fumigacion-restaurantes.html', 'obj-olla', 'Fumigación para restaurantes'],
  ['servicio-control-plagas-comercial.html', 'obj-local', 'Control de plagas comercial'],
  ['servicio-desratizacion.html', 'obj-estacion', 'Desratización'],
  ['servicio-control-insectos-voladores.html', 'obj-bomba', 'Control de insectos voladores'],
  ['servicio-fumigacion-industrial.html', 'obj-estiba', 'Fumigación industrial'],
  ['servicio-control-comejen-termitas.html', 'obj-viga', 'Control de comején y termitas'],
  ['servicio-eliminacion-abejas-avispas.html', 'obj-panal', 'Retiro de abejas y avispas'],
  ['servicio-control-chinches.html', 'obj-colchon', 'Control de chinches de cama'],
] as const;

const PREGUNTAS: [string, string][] = [
  [
    'Vi una cucaracha, ¿significa que hay más?',
    'Probablemente sí. Las cucarachas son nocturnas: si ve una durante el día, se estima que puede haber entre 100 y 200 más ocultas en su propiedad, porque la población es tan grande que algunas salen de sus escondites por falta de espacio.',
  ],
  [
    '¿Por qué el spray de supermercado no acaba con las cucarachas?',
    'El spray solo mata las cucarachas expuestas en el momento de la aplicación. No elimina los huevos (ootecas), que están protegidos por una cápsula resistente, ni alcanza las colonias escondidas detrás de paredes y electrodomésticos. Además, la cucaracha alemana ha desarrollado resistencia a los piretroides de la mayoría de productos domésticos.',
  ],
  [
    '¿Es seguro para niños y mascotas?',
    'Sí. Utilizamos productos registrados ante el ICA y aprobados por la OMS, de baja toxicidad para humanos y animales domésticos. Recomendamos mantener a niños y mascotas fuera del área tratada durante el tiempo indicado y ventilar bien antes de regresar.',
  ],
  [
    '¿Cuánto tiempo debo salir de la casa?',
    'Recomendamos ausentarse entre 2 y 4 horas después de la aplicación, dependiendo del tipo de tratamiento. Para familias con niños pequeños, adultos mayores o mascotas, podemos coordinar el servicio en un horario conveniente.',
  ],
  [
    '¿Cuánto cuesta fumigar cucarachas en Bucaramanga?',
    'Depende del tamaño de la propiedad, el nivel de infestación y si es un servicio puntual o un programa recurrente. Escríbanos con su caso y le enviamos la cotización el mismo día, gratis y sin compromiso.',
  ],
  [
    '¿Entregan certificado de fumigación?',
    'Sí. Emitimos un certificado de fumigación que detalla los productos utilizados, las áreas tratadas y la fecha del servicio. Es válido para conjuntos residenciales, arrendadores o cualquier entidad que lo requiera como soporte sanitario.',
  ],
];

const CUCARACHAS = `<section class="foco srv-hero" data-fall="load">
  <p class="crumb"><a href="index.html" data-transition>Inicio</a> · <a href="servicios.html" data-transition>Servicios</a> · Control de cucarachas</p>
  <h1 class="display sm"><span>Cucarachas</span> <span class="h1-small">Fumigación y control en Bucaramanga</span></h1>
  ${gancho({ beneficio: 'Gel que la cucaracha lleva a su colonia: la elimina completa. Seguro para niños y mascotas.', wa: 'Cotizar por WhatsApp', form: 'Solicitar cotización' })}
  <div class="foco-row">
    <p>Casas<br>Apartamentos</p>
    <div class="foco-obj"><img src="assets/obj-aplicador.webp" alt="" width="200" height="200"></div>
    <p>Desde 1985<br>Santander</p>
  </div>
  <div class="foco-text"><span class="gel" data-drop></span><p>Si ve una cucaracha de día, hay muchas más escondidas. Tratamos la colonia completa con gel cucarachicida, aspersión perimetral y seguimiento, en Bucaramanga, Floridablanca, Piedecuesta y Girón.</p></div>
</section><section class="metodo"><span class="gel" data-drop></span><p class="lead" data-reveal>Tratamos la plaga donde vive, no solo donde se ve. Detrás de la nevera, debajo del lavaplatos, en sifones, grietas y marcos de puertas.</p><p class="zonas">Atendemos Bucaramanga, Floridablanca, Piedecuesta y Girón.</p><span class="gel" data-drop style="margin-top:30px"></span><div class="tabla" data-reveal><div><span class="label">Qué incluye</span><p>Inspección, gel cucarachicida, aspersión perimetral, recomendaciones de sellado y seguimiento.</p></div><div><span class="label">Frecuencia</span><div class="chips"><span>Única</span><span>Cada 3 meses</span><span>Cada 6 meses</span></div></div><div><span class="label">Garantía</span><p>En planes: si la plaga vuelve entre visitas, volvemos sin costo, siguiendo las recomendaciones del técnico.</p></div></div></section>
<section class="pasos">
  <h2 class="display" data-reveal>Cómo la<br>tratamos</h2>
  <ol class="steps6 five"><li data-reveal><span class="n">01</span><p><strong>Inspección.</strong> Identificamos la especie, el nivel de infestación y los puntos críticos: nevera, lavaplatos, sifones, grietas y zonas con humedad.</p></li><li data-reveal><span class="n">02</span><p><strong>Gel cucarachicida.</strong> Es un cebo: la cucaracha lo consume y lo lleva a la colonia, y el efecto en cadena alcanza a las que nunca salieron. Es el tratamiento más efectivo contra la cucaracha alemana.</p></li><li data-reveal><span class="n">03</span><p><strong>Aspersión perimetral.</strong> Barrera en perímetros, grietas y accesos para que no entren nuevas desde afuera o desde los vecinos.</p></li><li data-reveal><span class="n">04</span><p><strong>Sellado y recomendaciones.</strong> Le señalamos los puntos de entrada y le damos consejos de prevención para su propiedad.</p></li><li data-reveal><span class="n">05</span><p><strong>Seguimiento.</strong> Verificamos el resultado a las 2 semanas. En programas recurrentes, monitoreo continuo con trampas de detección.</p></li></ol>
</section>
<section class="docs-sec">
  <h2 class="display" data-reveal>Seguro para niños<br>y mascotas</h2>
  <div class="docs"><div class="doc" data-reveal><span class="doc-n">01</span><h3>Productos registrados</h3><p>Ante el ICA y aprobados por la OMS, de baja toxicidad para personas y animales.</p></div><div class="doc" data-reveal><span class="doc-n">02</span><h3>Sin olores fuertes</h3><p>El tratamiento no deja olores fuertes ni residuos tóxicos.</p></div><div class="doc" data-reveal><span class="doc-n">03</span><h3>De 2 a 4 horas fuera</h3><p>Según el tratamiento. Le indicamos cuándo volver y cómo ventilar.</p></div><div class="doc" data-reveal><span class="doc-n">04</span><h3>Horario a su medida</h3><p>Si hay niños pequeños, adultos mayores o mascotas, coordinamos la hora con usted.</p></div></div>
  <p class="note">¿Quiere entender su caso antes? Lea <a href="/blog/vi-cucaracha-en-mi-casa-que-hacer" data-transition>qué significa ver una cucaracha en casa</a> y <a href="/blog/como-eliminar-cucarachas-bucaramanga" data-transition>cómo eliminar cucarachas en Bucaramanga</a>.</p>
</section><section class="hogar">
  <div class="hogar-copy">
    <span class="label">Para su casa</span>
    <h2 class="display" data-reveal>Usted a<br>lo suyo</h2>
    <p class="sub">que la plaga es cosa nuestra.</p>
    <p class="lema">Llegó AGROINCOL. Nos vamos.</p>
  </div>
  <div class="hogar-stage" aria-hidden="true"><span class="colado"><img src="assets/colado-dona-cuca-cucaracha.webp" alt="" width="317" height="500"></span><span class="colado"><img src="assets/colado-la-ingeniera-hormiga.webp" alt="" width="364" height="500"></span><span class="colado"><img src="assets/colado-don-serenata-zancudo.webp" alt="" width="351" height="500"></span><span class="colado"><img src="assets/colado-pulgarcito-pulga.webp" alt="" width="431" height="500"></span><span class="colado"><img src="assets/colado-rosa-desvelo-chinche.webp" alt="" width="337" height="500"></span></div>
</section><section class="voces" aria-label="Preguntas frecuentes">
  <div class="faq-wrap" style="margin-top:0">
    <div><h2 class="display">Preguntas<br>frecuentes</h2></div>
    <div class="faq">${PREGUNTAS.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
  </div>
</section><section class="otros">
  <h2 class="display" data-reveal>Otros<br>servicios</h2>
  <div class="cards" data-cursor="ARRASTRE" tabindex="0" aria-label="Servicios, arrastre para ver más">${OTROS.map(([a, o, n]) => tarjeta(a, o, n)).join('\n')}
</div>
</section>${FORMULARIO('Control de Cucarachas')}`;

export const PAGINAS_NUEVAS: Record<string, PaginaNueva> = {
  'servicio-control-cucarachas.html': {
    ruta: '/servicios/control-cucarachas',
    title: 'Fumigación de Cucarachas en Bucaramanga | AGROINCOL',
    description:
      'Control de cucarachas en Bucaramanga con gel que elimina la colonia completa. Seguro para niños y mascotas, garantía en planes y cotización gratis el mismo día.',
    main: CUCARACHAS,
  },
};

// Tarjeta de "Otros servicios" para las demás páginas (lib/rediseno/ajustes.ts).
export const TARJETA_CUCARACHAS = tarjeta('servicio-control-cucarachas.html', 'obj-aplicador', 'Control de cucarachas');
