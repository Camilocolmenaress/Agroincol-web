(function () {
  'use strict';
  /* Calculadora de frecuencia */
  var calc = document.getElementById('calc');
  if (calc) {
    var sets = Array.prototype.slice.call(calc.querySelectorAll('fieldset'));
    var ans = {}, i = 0;
    var step = document.getElementById('calc-step'), bar = document.getElementById('calc-bar'), back = document.getElementById('calc-back');
    var result = document.getElementById('calc-result');
    var show = function (k) {
      sets.forEach(function (f, j) { f.hidden = j !== k; });
      result.hidden = k < sets.length;
      step.textContent = k < sets.length ? 'Pregunta ' + (k + 1) + ' de ' + sets.length : 'Resultado';
      bar.style.width = Math.min(100, ((k + 1) / sets.length) * 100) + '%';
      back.hidden = k === 0 || k >= sets.length;
      var first = k < sets.length ? sets[k].querySelector('button') : result;
      if (first && k > 0) first.focus({ preventScroll: true });
    };
    var base = { casa: [3, 6], conjunto: [2, 3], oficina: [3, 3], institucion: [2, 3], restaurante: [1, 3], bodega: [1, 2] };
    var srv = { casa: 'servicio-fumigacion-residencial.html', conjunto: 'servicio-control-plagas-comercial.html', oficina: 'servicio-control-plagas-comercial.html', institucion: 'servicio-control-plagas-comercial.html', restaurante: 'servicio-fumigacion-restaurantes.html', bodega: 'servicio-fumigacion-industrial.html' };
    var finish = function () {
      var r = base[ans.tipo].slice(), why = [];
      var tighten = 0;
      if (ans.entorno === 'agua' || ans.entorno === 'mercado') { tighten++; why.push(ans.entorno === 'agua' ? 'hay agua cerca, que favorece zancudos y cucarachas' : 'el comercio denso aumenta la presión de roedores y cucarachas'); }
      if (ans.historial === 'frecuente') { tighten += 2; why.push('ya hay plaga activa'); } else if (ans.historial === 'ocasional') { tighten++; why.push('ha visto plagas de vez en cuando'); }
      if (ans.construccion === 'antigua') { tighten++; why.push('las grietas y la tubería expuesta les dan refugio'); }
      for (var t = 0; t < tighten; t++) { r[1] = Math.max(r[0], r[1] - 1); if (r[1] === r[0]) r[0] = Math.max(1, r[0] - 1); }
      var txt = r[0] === r[1] ? 'Cada ' + r[0] + (r[0] === 1 ? ' mes' : ' meses') : 'Cada ' + r[0] + ' a ' + r[1] + ' meses';
      document.getElementById('calc-freq').textContent = txt;
      var extra = ans.ultima === 'nunca' ? ' Como hace más de 6 meses que no fumiga, conviene empezar con una inspección pronto.' : '';
      document.getElementById('calc-why').textContent = (why.length ? 'Ajustamos la frecuencia porque ' + why.join(', ') + '.' : 'Su propiedad tiene condiciones de riesgo bajo.') + (ans.tipo === 'restaurante' ? ' Para negocios de alimentos, la Resolución 2674 exige un programa continuo.' : '') + extra;
      document.getElementById('calc-srv').setAttribute('href', srv[ans.tipo]);
      document.getElementById('calc-wa').setAttribute('href', 'https://wa.me/573107891948?text=' + encodeURIComponent('Hola, la calculadora me recomendó fumigar ' + txt.toLowerCase() + '. Quiero cotizar.'));
    };
    sets.forEach(function (f, k) {
      f.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          ans[f.getAttribute('data-q')] = b.getAttribute('data-v');
          i = k + 1;
          if (i >= sets.length) finish();
          show(i);
        });
      });
    });
    back.addEventListener('click', function () { i = Math.max(0, i - 1); show(i); });
    document.getElementById('calc-reset').addEventListener('click', function () { ans = {}; i = 0; show(0); });
    show(0);
  }

  /* Identificador de plagas */
  var plaga = document.getElementById('plaga');
  if (plaga) {
    var info = {
      cucarachas: ['Cucarachas', 'Si las ve de día, la colonia ya es grande. Tratamos el nido con gel y cebos.', 'servicio-fumigacion-residencial.html', 'casa'],
      chinches: ['Chinches de cama', 'No use insecticida casero: dispersa la plaga a otras habitaciones. El tratamiento lleva dos visitas.', 'servicio-control-chinches.html', 'colchon'],
      comejen: ['Comején', 'El daño avanza aunque no vea insectos. Pida una inspección cuanto antes.', 'servicio-control-comejen-termitas.html', 'viga'],
      roedores: ['Ratas o ratones', 'Además del cebado, hay que sellar por dónde entran.', 'servicio-desratizacion.html', 'estacion'],
      abejas: ['Abejas o avispas', 'No se acerque ni intente retirarlo. Envíenos una foto desde lejos.', 'servicio-eliminacion-abejas-avispas.html', 'panal'],
      zancudos: ['Zancudos', 'Elimine el agua estancada. En temporada de lluvias conviene un tratamiento con larvicida.', 'servicio-control-insectos-voladores.html', 'bomba']
    };
    var res = document.getElementById('plaga-result');
    var upd = function () {
      var score = {};
      plaga.querySelectorAll('.sign[aria-pressed="true"]').forEach(function (s) { var p = s.getAttribute('data-p'); score[p] = (score[p] || 0) + 1; });
      var best = Object.keys(score).sort(function (a, b) { return score[b] - score[a]; })[0];
      res.hidden = !best;
      if (!best) return;
      var d = info[best];
      document.getElementById('plaga-name').textContent = d[0];
      document.getElementById('plaga-what').textContent = d[1];
      document.getElementById('plaga-srv').setAttribute('href', d[2]);
      document.getElementById('plaga-img').setAttribute('src', 'assets/obj-' + d[3] + '.webp');
    };
    plaga.querySelectorAll('.sign').forEach(function (s) {
      s.addEventListener('click', function () { s.setAttribute('aria-pressed', s.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); upd(); });
    });
  }

  /* Lista antes de fumigar */
  var ck = document.getElementById('checklist');
  if (ck) {
    var boxes = ck.querySelectorAll('input');
    var cnt = document.getElementById('ck-count'), cb = document.getElementById('ck-bar'), done = document.getElementById('ck-done');
    var u = function () {
      var n = ck.querySelectorAll('input:checked').length;
      cnt.textContent = n + ' de ' + boxes.length + ' listos';
      cb.style.width = (n / boxes.length * 100) + '%';
      done.hidden = n !== boxes.length;
    };
    boxes.forEach(function (b) { b.addEventListener('change', u); });
    u();
  }
})();
