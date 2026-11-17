/* S2 Manager · página de ventas: arma la página en español o inglés, tema claro u oscuro,
   contador de cifras, calculadora de precios y envío del formulario (Netlify Forms). */
var S2 = (function () {
  'use strict';
  var WA = 'https://wa.me/50763601775', WA_TXT = 'WhatsApp · +507 6360-1775';
  var PRIVACIDAD = 'https://eventos.s2techgroup.net/privacidad';
  var MSJ = 'M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z';
  var EXTRA = {
    es: { enviando: 'Enviando…', ok: 'Recibido. Te escribimos pronto por WhatsApp o correo.', mal: 'No se pudo enviar. Escríbenos por WhatsApp al +507 6360-1775.', acepto: 'Al enviar aceptas nuestro ', aviso: 'aviso de privacidad', falta: 'Escribe tu nombre y un WhatsApp o correo.' },
    en: { enviando: 'Sending…', ok: 'Received. We will write to you soon by WhatsApp or email.', mal: 'It could not be sent. Message us on WhatsApp at +507 6360-1775.', acepto: 'By sending you accept our ', aviso: 'privacy notice', falta: 'Enter your name and a WhatsApp number or email.' }
  };
  var PRECIO = { org: 0.5, torneo: 1.75, club: 5, minimo: 100, clubMin: 4, clubCotiza: 11 };

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function svg(d, n) { return '<svg class="linea" aria-hidden="true" viewBox="0 0 24 24" width="' + n + '" height="' + n + '"><path d="' + d + '"></path></svg>'; }
  function puntos(xs) { return '<ul class="lista">' + xs.map(function (x) { return '<li class="punto"><span>' + esc(x.t) + '</span></li>'; }).join('') + '</ul>'; }
  function wa(clase) { return '<a class="' + clase + '" href="' + WA + '" rel="noopener">' + svg(MSJ, 20) + '<span>' + WA_TXT + '</span></a>'; }
  function marca() { return '<span class="logo"><img src="' + IMG.logo + '" alt="S2" width="36" height="30"></span><span>Manager</span>'; }
  function dinero(n) { return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  function pagina(idioma) {
    var t = T[idioma] || T.es, x = EXTRA[idioma] || EXTRA.es, h = [];
    // 1 · Barra
    h.push('<header class="barra"><div class="cont"><a class="marca" href="#inicio">' + marca() + '</a>'
      + '<nav class="nav" aria-label="' + esc(t.ui.secciones) + '">' + t.nav.map(function (n) { return '<a href="' + n.href + '">' + esc(n.t) + '</a>'; }).join('') + '</nav>'
      + '<div class="controles"><div class="idioma" role="group" aria-label="' + esc(t.ui.idioma) + '">'
      + '<button type="button" data-idioma="es" aria-pressed="' + (idioma === 'es') + '">ES</button><button type="button" data-idioma="en" aria-pressed="' + (idioma === 'en') + '">EN</button></div>'
      + '<button type="button" class="tema" data-tema data-oscuro="' + esc(t.ui.oscuro) + '" data-claro="' + esc(t.ui.claro) + '">' + esc(t.ui.oscuro) + '</button>'
      + '<a class="btn pri" href="#demo">' + esc(t.ui.pedirDemo) + '</a></div></div></header>');
    // 2 · Portada y formulario
    h.push('<section class="portada" id="inicio"><div class="cont"><div class="texto">'
      + '<p class="ceja">' + esc(t.hero.ceja) + '</p><h1>' + esc(t.hero.titulo) + '</h1><p class="sub">' + esc(t.hero.sub) + '</p>' + puntos(t.hero.puntos)
      + '<div class="acciones">' + wa('btn claro') + '<a class="suelto" href="' + EV + '" rel="noopener">' + esc(t.hero.evento) + '</a></div></div>'
      + '<form class="demo" id="demo" name="demo" method="POST" data-netlify="true" netlify-honeypot="bot-field" aria-label="' + esc(t.form.titulo) + '">'
      + '<input type="hidden" name="form-name" value="demo"><input type="hidden" name="idioma" value="' + idioma + '">'
      + '<p class="trampa"><label>No llenar<input name="bot-field" tabindex="-1" autocomplete="off"></label></p>'
      + '<h2>' + esc(t.form.titulo) + '</h2><p>' + esc(t.form.sub) + '</p>'
      + '<label>' + esc(t.form.nombre) + '<input type="text" name="nombre" autocomplete="name" required maxlength="120"></label>'
      + '<label>' + esc(t.form.org) + '<input type="text" name="organizacion" autocomplete="organization" maxlength="160"></label>'
      + '<label>' + esc(t.form.contacto) + '<input type="text" name="contacto" required maxlength="160"></label>'
      + '<label>' + esc(t.form.necesidad) + '<select name="necesidad">' + t.form.opciones.map(function (o) { return '<option>' + esc(o.t) + '</option>'; }).join('') + '</select></label>'
      + '<button type="submit" class="btn pri">' + esc(t.form.boton) + '</button>'
      + '<p class="estado" role="status" hidden></p>'
      + '<p>' + esc(x.acepto) + '<a href="' + PRIVACIDAD + '" rel="noopener">' + esc(x.aviso) + '</a>.</p></form></div></section>');
    // 3 · Cifras
    h.push('<section class="cifras" id="cifras" aria-label="' + esc(t.ui.cifras) + '"><div class="cont"><div class="fila">'
      + t.cifras.map(function (c) { return '<div class="cifra"><b data-cifra="' + esc(c.n) + '">' + esc(c.n) + '</b><span>' + esc(c.t) + '</span></div>'; }).join('')
      + '</div><p class="nota">' + esc(t.cifrasNota) + '</p></div></section>');
    // 4 · Servicios
    h.push('<section class="servicios" id="servicios"><div class="cont"><div class="cab" style="margin-bottom:24px"><h2 style="font-size:28px;line-height:1.2">' + esc(t.servicios.titulo) + '</h2><p style="color:var(--mut)">' + esc(t.servicios.sub) + '</p></div><div class="fila">'
      + t.servicios.lista.map(function (s) { return '<a class="servicio" href="' + s.href + '"' + (s.href.charAt(0) === '#' ? '' : ' rel="noopener"') + '><span class="ic">' + svg(s.icono, 32) + '</span><b>' + esc(s.t) + '</b><span>' + esc(s.d) + '</span><em>' + esc(s.u) + '</em></a>'; }).join('')
      + '</div></div></section>');
    // 5 · Dolores
    h.push('<section><div class="cont"><div class="cab"><h2 class="h2">' + esc(t.dolores.titulo) + '</h2><p class="sub">' + esc(t.dolores.sub) + '</p></div><div class="rejilla" style="gap:20px">'
      + t.dolores.lista.map(function (d) { return '<article class="tarjeta dolor t4"><h3>' + esc(d.t) + '</h3><p>' + esc(d.d) + '</p></article>'; }).join('') + '</div></div></section>');
    // 6 · Soluciones
    h.push('<section class="alt" id="soluciones"><div class="cont"><div class="cab"><h2 class="h2">' + esc(t.soluciones.titulo) + '</h2><p class="sub">' + esc(t.soluciones.sub) + '</p></div><div class="rejilla">'
      + t.soluciones.lista.map(function (s) { return '<article class="tarjeta solucion t3"><p class="ceja">' + esc(s.k) + '</p><h3>' + esc(s.t) + '</h3>' + puntos(s.puntos) + '<a class="enlace" href="' + s.href + '">' + esc(s.cta) + '</a></article>'; }).join('') + '</div></div></section>');
    // 7 · Módulos
    h.push('<section id="modulos"><div class="cont"><div class="cab"><h2 class="h2">' + esc(t.modulos.titulo) + '</h2><p class="sub">' + esc(t.modulos.sub) + '</p></div><div class="rejilla">'
      + t.modulos.lista.map(function (m) {
        return '<article class="tarjeta modulo t2"><h3>' + esc(m.t) + '</h3><img src="' + m.img + '" alt="' + esc(m.alt) + '" loading="lazy" width="1400" height="800">'
          + '<ul class="lista">' + m.items.map(function (i) { return '<li><b>' + esc(i.b) + '</b> ' + esc(i.t) + '</li>'; }).join('') + '</ul><a class="enlace" href="' + m.href + '" rel="noopener">' + esc(m.cta) + '</a></article>';
      }).join('') + '</div><p class="pronto">' + esc(t.modulos.pronto) + '</p></div></section>');
    // 8 · Banda
    h.push('<section class="banda"><div class="cont"><div class="texto"><h2 class="h2">' + esc(t.vivo.titulo) + '</h2><p class="sub">' + esc(t.vivo.sub) + '</p>'
      + '<div class="fila" style="gap:14px"><a class="btn pri" href="' + EV + '" rel="noopener">' + esc(t.vivo.cta1) + '</a><a class="btn claro" href="#demo">' + esc(t.vivo.cta2) + '</a></div>'
      + '<p class="nota">' + esc(t.vivo.nota) + '</p></div><div class="foto"><img src="' + IMG.mesa + '" alt="' + esc(t.vivo.alt) + '" loading="lazy" width="1160" height="854"></div></div></section>');
    // 9 · Pasos
    h.push('<section><div class="cont"><div class="cab"><h2 class="h2">' + esc(t.pasos.titulo) + '</h2></div><ol class="rejilla">'
      + t.pasos.lista.map(function (p) { return '<li class="paso"><b>' + esc(p.n) + '</b><h3>' + esc(p.t) + '</h3><p>' + esc(p.d) + '</p></li>'; }).join('') + '</ol></div></section>');
    // 10 · Caso
    h.push('<section class="alt caso"><div class="cont"><div class="texto"><p class="ceja">' + esc(t.caso.ceja) + '</p><h2>' + esc(t.caso.titulo) + '</h2><p class="cuerpo">' + esc(t.caso.texto) + '</p>'
      + '<a class="enlace" style="margin-top:0" href="' + RK + '" rel="noopener">' + esc(t.caso.cta) + '</a></div><div class="tarjeta datos">'
      + t.caso.datos.map(function (d) { return '<div><b>' + esc(d.n) + '</b><span>' + esc(d.t) + '</span></div>'; }).join('') + '</div></div></section>');
    // 11 · Planes
    h.push('<section class="planes" id="planes"><div class="cont"><div class="cab"><h2 class="h2">' + esc(t.planes.titulo) + '</h2><p class="sub">' + esc(t.planes.sub) + '</p></div><div class="fila">'
      + t.planes.lista.map(function (p) {
        return '<article class="tarjeta plan' + (p.destacado ? ' destacado' : '') + '"><p class="ceja">' + esc(p.k) + '</p><h3>' + esc(p.t) + '</h3>'
          + '<p class="precio">' + esc(p.precio) + ' <small>' + esc(p.unidad) + '</small></p><p class="nota">' + esc(p.nota) + '</p>' + puntos(p.puntos)
          + '<a class="btn ' + (p.destacado ? 'pri' : 'borde') + '" href="' + p.href + '"' + (p.href.charAt(0) === '#' ? '' : ' rel="noopener"') + '>' + esc(p.cta) + '</a></article>';
      }).join('') + '</div>'
      + '<article class="fed"><div class="texto"><p class="ceja" style="font-size:12px">' + esc(t.fed.k) + '</p><h3>' + esc(t.fed.t) + '</h3><p>' + esc(t.fed.sub) + '</p>' + puntos(t.fed.puntos) + '</div>'
      + '<div class="tramos"><div class="tramo"><span class="n">' + esc(t.fed.n1) + '</span><span class="p">$' + PRECIO.club + '</span><span class="u">' + esc(t.fed.u1) + '</span><span class="l">' + esc(t.fed.l1) + '</span></div>'
      + '<div class="tramo"><span class="n">' + esc(t.fed.n2) + '</span><span class="p">' + esc(t.fed.p2) + '</span><span class="u">' + esc(t.fed.u2) + '</span><span class="l">' + esc(t.fed.l2) + '</span></div>'
      + '<a class="btn pri" href="#demo">' + esc(t.fed.cta) + '</a></div></article><p class="pie-planes">' + esc(t.planes.pie) + '</p></div></section>');
    // 12 · Calculadora
    h.push('<section class="alt calc" id="calculadora"><div class="cont medio"><div class="cab"><h2 class="h2">' + esc(t.calc.titulo) + '</h2><p class="sub">' + esc(t.calc.sub) + '</p></div><div class="caja"><div class="entradas">'
      + '<div class="planes-calc" role="group" aria-label="' + esc(t.calc.plan) + '">'
      + [['org', t.calc.org], ['torneo', t.calc.torneo], ['fed', t.calc.fed]].map(function (b) { return '<button type="button" data-plan="' + b[0] + '" aria-pressed="false">' + esc(b[1]) + '</button>'; }).join('') + '</div>'
      + '<label data-campo="atletas">' + esc(t.calc.atletas) + '<span class="campo"><input type="range" min="20" max="1500" step="10" data-atletas aria-label="' + esc(t.calc.atletas) + '"><input type="number" min="1" max="20000" data-atletas aria-label="' + esc(t.calc.atletas) + '"></span></label>'
      + '<label data-campo="clubes" hidden>' + esc(t.calc.clubes) + '<span class="campo"><input type="range" min="' + PRECIO.clubMin + '" max="' + PRECIO.clubCotiza + '" step="1" data-clubes aria-label="' + esc(t.calc.clubes) + '"><input type="number" min="' + PRECIO.clubMin + '" max="' + PRECIO.clubCotiza + '" data-clubes aria-label="' + esc(t.calc.clubes) + '"></span></label>'
      + '<p class="aviso">' + esc(t.calc.pie) + '</p></div>'
      + '<div class="resultado" aria-live="polite"><span class="et" data-r="etiqueta"></span><span class="total" data-r="total"></span><span class="det" data-r="detalle"></span><span class="nt" data-r="nota"></span><a class="btn pri" href="#demo" data-r="cta"></a></div></div></div></section>');
    // 13 · Confianza
    h.push('<section class="confianza"><div class="cont"><div class="cab"><h2 class="h2">' + esc(t.confianza.titulo) + '</h2></div><div class="rejilla">'
      + t.confianza.lista.map(function (c) { return '<div class="item"><h3>' + esc(c.t) + '</h3><p>' + esc(c.d) + '</p></div>'; }).join('') + '</div></div></section>');
    // 14 · Preguntas
    h.push('<section class="alt faq" id="preguntas"><div class="cont angosto"><div class="cab"><h2 class="h2">' + esc(t.faq.titulo) + '</h2></div><div class="preguntas">'
      + t.faq.lista.map(function (f) { return '<div class="item"><h3>' + esc(f.q) + '</h3><p>' + esc(f.a) + '</p></div>'; }).join('') + '</div></div></section>');
    // 15 · Cierre
    h.push('<section class="cierre"><div class="cont angosto"><h2>' + esc(t.cierre.titulo) + '</h2><p>' + esc(t.cierre.sub) + '</p><div class="fila"><a class="btn pri" href="#demo">' + esc(t.ui.pedirDemo) + '</a>' + wa('btn claro') + '</div></div></section>');
    // 16 · Pie
    h.push('<footer class="pie"><div class="cont"><div class="col ancha"><span class="marca">' + marca() + '</span><span>' + esc(t.pie.producto) + '</span></div>'
      + '<div class="col"><b>' + esc(t.pie.contacto) + '</b><a href="mailto:soporte@s2techgroup.net">soporte@s2techgroup.net</a>' + wa('wa') + '</div>'
      + '<div class="col"><b>' + esc(t.pie.legal) + '</b><a href="' + PRIVACIDAD + '" rel="noopener">' + esc(t.pie.privacidad) + '</a></div>'
      + '<div class="col"><b>' + esc(t.pie.accesos) + '</b><a href="' + EV + '" rel="noopener">' + esc(t.pie.eventos) + '</a><a href="' + RK + '" rel="noopener">Ranking</a><a href="' + CL + '" rel="noopener">' + esc(t.pie.portal) + '</a></div></div></footer>');
    return h.join('\n');
  }

  // ─── Comportamiento (solo en el navegador) ───
  var est = { idioma: 'es', plan: 'org', atletas: 150, clubes: 5, contado: false };
  function guarda(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  function lee(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function ponTema(oscuro) {
    document.documentElement.classList.toggle('oscuro', oscuro);
    var b = $('[data-tema]'); if (b) b.textContent = oscuro ? b.getAttribute('data-claro') : b.getAttribute('data-oscuro');
  }
  function calcula() {
    var t = T[est.idioma].calc, fed = est.plan === 'fed', r = { etiqueta: '', total: '', detalle: '', nota: '', cta: t.cta };
    if (fed) {
      var c = Math.min(PRECIO.clubCotiza, Math.max(PRECIO.clubMin, parseInt(est.clubes, 10) || PRECIO.clubMin));
      r.etiqueta = t.totalAnio;
      if (c >= PRECIO.clubCotiza) { r.total = t.cotizar; r.detalle = t.cotizarNota; r.cta = t.ctaCotizar; }
      else { r.total = dinero(c * PRECIO.club * 12); r.detalle = c + t.porClub; r.nota = dinero(c * PRECIO.club) + t.alMes; }
      $$('[data-clubes]').forEach(function (i) { if (document.activeElement !== i || i.type === 'range') i.value = c; });
    } else {
      var a = Math.max(1, parseInt(est.atletas, 10) || 1), p = est.plan === 'org' ? PRECIO.org : PRECIO.torneo, f = Math.max(PRECIO.minimo, a);
      r.etiqueta = t.totalEvento; r.total = dinero(f * p); r.detalle = f + ' ' + t.porAtleta + dinero(p); r.nota = a < PRECIO.minimo ? t.minimo : '';
      $$('[data-atletas]').forEach(function (i) { if (document.activeElement !== i || i.type === 'range') i.value = a; });
    }
    $('[data-campo=atletas]').hidden = fed; $('[data-campo=clubes]').hidden = !fed;
    $$('[data-plan]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-plan') === est.plan)); });
    Object.keys(r).forEach(function (k) { var e = $('[data-r=' + k + ']'); if (e) e.textContent = r[k]; });
  }
  function cuenta() {
    var nodos = $$('[data-cifra]');
    if (est.contado || !nodos.length || !window.requestAnimationFrame) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    est.contado = true;
    var sep = est.idioma === 'en' ? ',' : '.', metas = nodos.map(function (n) { var m = /^([0-9.,]+)(\+?)$/.exec(n.getAttribute('data-cifra')); return m ? { n: n, v: parseInt(m[1].replace(/[.,]/g, ''), 10), mas: m[2] } : null; }).filter(Boolean);
    var t0 = null, dur = 2000;
    function paso(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur), s = 1 - Math.pow(1 - p, 3);
      metas.forEach(function (m) { m.n.textContent = String(Math.round(m.v * s)).replace(/\B(?=(\d{3})+(?!\d))/g, sep) + (p >= 1 ? m.mas : ''); });
      if (p < 1) window.requestAnimationFrame(paso);
    }
    metas.forEach(function (m) { m.n.textContent = '0'; });
    window.requestAnimationFrame(paso);
  }
  function enlaza() {
    $$('[data-idioma]').forEach(function (b) { b.addEventListener('click', function () { ponIdioma(b.getAttribute('data-idioma')); }); });
    var bt = $('[data-tema]'); if (bt) bt.addEventListener('click', function () { var o = !document.documentElement.classList.contains('oscuro'); ponTema(o); guarda('s2tema', o ? 'oscuro' : 'claro'); });
    ponTema(document.documentElement.classList.contains('oscuro'));
    $$('[data-plan]').forEach(function (b) { b.addEventListener('click', function () { est.plan = b.getAttribute('data-plan'); calcula(); }); });
    $$('[data-atletas]').forEach(function (i) { i.addEventListener('input', function () { est.atletas = i.value; calcula(); }); });
    $$('[data-clubes]').forEach(function (i) { i.addEventListener('input', function () { est.clubes = i.value; calcula(); }); });
    calcula();
    var f = $('#demo');
    if (f) f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var x = EXTRA[est.idioma], e = $('.estado', f), b = $('button[type=submit]', f);
      function di(txt, clase) { e.hidden = false; e.className = 'estado ' + clase; e.textContent = txt; }
      if (!f.nombre.value.trim() || !f.contacto.value.trim()) { di(x.falta, 'mal'); return; }
      b.disabled = true; di(x.enviando, '');
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(f)).toString() })
        .then(function (r) { if (!r.ok) throw new Error(String(r.status)); f.reset(); di(x.ok, 'ok'); })
        .catch(function () { di(x.mal, 'mal'); })
        .then(function () { b.disabled = false; });
    });
    var sec = $('#cifras');
    if (sec && 'IntersectionObserver' in window) {
      var ob = new IntersectionObserver(function (xs) { if (xs.some(function (x) { return x.isIntersecting; })) { ob.disconnect(); cuenta(); } }, { threshold: 0.3 });
      ob.observe(sec);
    } else cuenta();
  }
  function ponIdioma(id) {
    if (id !== 'es' && id !== 'en') id = 'es';
    est.idioma = id; guarda('s2idioma', id);
    document.documentElement.lang = id;
    $('#app').innerHTML = pagina(id);
    est.contado = true;   // el contador corre una sola vez, al entrar
    enlaza();
  }
  function iniciar() {
    if (lee('s2tema') === 'oscuro') document.documentElement.classList.add('oscuro');
    var guardado = lee('s2idioma'), id = guardado || ((navigator.language || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es');
    if (id === 'en') { est.idioma = 'en'; document.documentElement.lang = 'en'; $('#app').innerHTML = pagina('en'); }
    enlaza();
  }
  return { pagina: pagina, iniciar: iniciar };
})();
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', S2.iniciar); else S2.iniciar();
}
