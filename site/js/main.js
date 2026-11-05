/* Al Objetivo · portafolio. Pinta la página desde window.AO y gestiona las interacciones. */
(function () {
  'use strict';

  var AO = window.AO || {};
  var T = AO.textos || {};
  var UI = T.interfaz || {};
  var SVGNS = 'http://www.w3.org/2000/svg';
  var LOCAL = location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  var REDUCIDO = window.matchMedia('(prefers-reduced-motion: reduce)');
  var ESCRITORIO = window.matchMedia('(min-width: 1024px)');
  var NAV_H = 64;

  if (LOCAL) document.documentElement.setAttribute('data-entorno', 'local');

  /* ---------- utilidades ---------- */
  function $(id) { return document.getElementById(id); }

  // Crea un elemento. Todo el texto entra con textContent, nunca como HTML.
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else n.setAttribute(k, v === true ? '' : v);
    });
    (kids || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }
  function sv(tag, attrs, kids) {
    var n = document.createElementNS(SVGNS, tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }
  function vaciar(n) { while (n.firstChild) n.removeChild(n.firstChild); return n; }
  function fmt(s, map) { return String(s || '').replace(/\{(\w+)\}/g, function (_, k) { return map[k] === undefined ? '' : map[k]; }); }
  function sinNumero(s) { return String(s || '').replace(/^\s*\d+\s*[—–-]\s*/, ''); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function anuncio(msg) { $('aviso').textContent = msg; }
  function externo(url) { return /^https?:/.test(url); }
  function enlace(clase, url, kids, mismaPestana) {
    var fuera = externo(url) && !mismaPestana;
    return el('a', { class: clase, href: url, target: fuera ? '_blank' : null, rel: fuera ? 'noopener' : null }, kids);
  }

  // En producción solo se muestra lo confirmado; en local se ve todo, con su etiqueta.
  function visible(item) { return LOCAL || item.estado === 'real'; }
  function estadoTag(item) {
    if (item.estado === 'ejemplo') return el('span', { class: 'estado estado-ejemplo', text: UI.ejemplo });
    if (item.estado === 'borrador') return el('span', { class: 'estado estado-borrador', text: UI.borrador });
    return null;
  }
  function marcador(texto, ratio) {
    if (!LOCAL) return null;
    return el('div', { class: 'marcador', role: 'img', 'aria-label': texto, style: ratio ? 'aspect-ratio:' + ratio : null, text: texto });
  }

  function iconoFlecha(dir) {
    var d = dir === 'izq' ? 'M13 7H2M6 3L2 7l4 4' : 'M1 7h11M8 3l4 4-4 4';
    return sv('svg', { viewBox: '0 0 14 14', 'aria-hidden': 'true', focusable: 'false' }, [sv('path', { d: d, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })]);
  }
  // Flecha apuntando a +x con la punta en el origen: asta de `largo`, punta triangular y dos plumas en V.
  function flechaDibujo(largo, punta, pluma) {
    return [
      sv('line', { class: 'f-asta', x1: -largo, y1: 0, x2: -(punta - 1), y2: 0 }),
      sv('polygon', { class: 'f-punta', points: '0,0 ' + (-punta) + ',' + (-punta * 0.4) + ' ' + (-punta) + ',' + (punta * 0.4) }),
      sv('line', { class: 'f-pluma', x1: -largo, y1: 0, x2: -largo - pluma, y2: -pluma * 0.7 }),
      sv('line', { class: 'f-pluma', x1: -largo, y1: 0, x2: -largo - pluma, y2: pluma * 0.7 }),
      sv('line', { class: 'f-pluma', x1: -largo + pluma * 0.8, y1: 0, x2: -largo + pluma * 0.8 - pluma, y2: -pluma * 0.7 }),
      sv('line', { class: 'f-pluma', x1: -largo + pluma * 0.8, y1: 0, x2: -largo + pluma * 0.8 - pluma, y2: pluma * 0.7 })
    ];
  }

  /* ---------- secciones visibles (lista única) ---------- */
  var casos = (AO.casos || []).filter(visible);
  var piezas = (AO.carcaj || []).filter(visible);

  var TODAS = ['hero', 'sectores', 'arco', 'tiradas', 'carcaj', 'contacto'];
  var SECCIONES = TODAS.filter(function (id) {
    if (id === 'tiradas') return casos.length > 0;
    if (id === 'carcaj') return piezas.length > 0;
    return true;
  });
  TODAS.forEach(function (id) { $(id).hidden = SECCIONES.indexOf(id) < 0; });

  var NUMERADAS = SECCIONES.filter(function (id) { return id !== 'hero' && id !== 'sectores'; });
  function numero(id) { var i = NUMERADAS.indexOf(id); return i < 0 ? null : pad(i + 1); }
  function nombre(id) {
    if (id === 'sectores') return UI.nombreSectores;
    return sinNumero((T[id] || {}).eyebrow);
  }
  function eyebrow(id) {
    var n = numero(id);
    return el('p', { class: 'eyebrow resaltable', 'data-diana': '' }, [
      n ? el('span', { class: 'eyebrow-num', text: n }) : null,
      n ? el('span', { class: 'eyebrow-filete', 'aria-hidden': 'true' }) : null,
      el('span', { text: nombre(id) })
    ]);
  }

  /* ---------- portada ---------- */
  function renderHero() {
    var h = T.hero || {};
    var s = vaciar($('hero')).appendChild(el('div', { class: 'wrap g12 hero-grid' }));
    s.appendChild(el('div', { class: 'hero-texto' }, [
      el('p', { class: 'eyebrow', text: h.eyebrow }),
      el('h1', { id: 'hero-titulo' }, [el('span', { class: 't-300', text: h.titular }), el('span', { class: 't-700', text: h.titularEnfasis })]),
      el('p', { class: 'entradilla', text: (h.subtitular || '').replace(/Al Objetivo/g, 'Al Objetivo') }),
      el('button', { type: 'button', class: 'btn btn-primario', id: 'recorrido-btn', text: h.cta && h.cta.texto })
    ]));
    var il = h.ilustracion;
    if (il && il.src) {
      s.appendChild(el('div', { class: 'hero-arte' }, [el('img', {
        src: il.src,
        srcset: il.src2x ? il.src + ' ' + il.ancho + 'w, ' + il.src2x + ' ' + (il.ancho * 2) + 'w' : null,
        sizes: il.src2x ? '(min-width: 1024px) 516px, 78vw' : null,
        alt: il.alt, width: il.ancho, height: il.alto
      })]));
    }
  }

  /* ---------- sectores y marcas ---------- */
  // Normaliza el área óptica: recorta el margen en blanco del archivo (logoRecorte = [x, y, ancho, alto] del contenido)
  // y lo encaja en una caja de logoAltura (40 px por defecto) y 136 px de ancho como máximo.
  function nodoLogo(m) {
    var r = m.logoRecorte || [0, 0, m.logoAncho, m.logoAlto];
    var h = m.logoAltura || 40;
    var w = h * r[2] / r[3];
    if (w > 136) { w = 136; h = w * r[3] / r[2]; }
    var k = w / r[2];
    var img = el('img', {
      src: m.logo, alt: 'Logotipo de ' + m.nombre, width: m.logoAncho, height: m.logoAlto, loading: 'lazy',
      style: 'width:' + (m.logoAncho * k).toFixed(1) + 'px;height:' + (m.logoAlto * k).toFixed(1) + 'px;left:' + (-r[0] * k).toFixed(1) + 'px;top:' + (-r[1] * k).toFixed(1) + 'px'
    });
    return el('span', { class: 'marca-logo', style: 'height:' + h.toFixed(1) + 'px' }, [
      el('span', { class: 'logo-caja', style: 'width:' + w.toFixed(1) + 'px;height:' + h.toFixed(1) + 'px' }, [img])
    ]);
  }
  // Anillo de acierto: empieza a las 12 en punto y se dibuja en sentido horario.
  function anilloMarca() {
    return sv('svg', { class: 'marca-anillo', viewBox: '0 0 116 116', 'aria-hidden': 'true', focusable: 'false' }, [
      sv('circle', { cx: 58, cy: 58, r: 57, pathLength: 1, transform: 'rotate(-90 58 58)' })
    ]);
  }

  function renderSectores() {
    var d = T.sectores || {};
    var s = vaciar($('sectores')).appendChild(el('div', { class: 'wrap g12' }));
    s.appendChild(el('div', { class: 'sec-cab' }, [
      el('h2', { class: 'titulo resaltable', id: 'sectores-titulo', 'data-diana': '', text: d.eyebrow }),
      el('p', { class: 'apoyo', text: d.instruccion })
    ]));
    var chips = el('div', { class: 'chips', role: 'group', 'aria-label': d.eyebrow });
    var muro = el('ul', { class: 'muro' });
    s.appendChild(el('div', { class: 'sec-cuerpo' }, [chips, el('div', { class: 'muro-caja' }, [muro])]));

    var sectores = AO.sectores || [];
    var marcas = AO.marcas || [];
    var activo = null;
    var botones = [];

    marcas.forEach(function (m) {
      var cabeza = m.logo ? nodoLogo(m) : el('span', { class: 'monograma', 'aria-hidden': 'true', text: m.siglas || '' });
      muro.appendChild(el('li', { class: 'marca', 'data-marca': m.id }, [anilloMarca(), cabeza, el('span', { class: 'marca-nombre', text: m.nombre })]));
    });

    function aplicar() {
      var n = 0;
      Array.prototype.forEach.call(muro.children, function (li, i) {
        var coincide = !activo || (marcas[i].sectores || []).indexOf(activo) >= 0;
        li.classList.toggle('is-acierto', !!activo && coincide);
        li.classList.toggle('is-apagada', !!activo && !coincide);
        if (coincide) n++;
      });
      botones.forEach(function (b) { b.setAttribute('aria-pressed', String((b.getAttribute('data-sector') || null) === activo)); });
      var sec = sectores.filter(function (x) { return x.id === activo; })[0];
      anuncio(activo ? fmt(UI.avisoMarcas, { n: n, sector: sec ? sec.nombre : '' }) : UI.avisoMarcasTodas);
    }
    [{ id: null, nombre: UI.todos }].concat(sectores).forEach(function (sec) {
      var b = el('button', { type: 'button', class: 'chip', 'aria-pressed': 'false', 'data-sector': sec.id, text: sec.nombre });
      b.addEventListener('click', function () { activo = sec.id; aplicar(); });
      botones.push(b);
      chips.appendChild(b);
    });
    aplicar();
    anuncio('');
  }

  /* ---------- vídeo ---------- */
  function idVideoValido(id) { return /^[A-Za-z0-9_-]+$/.test(id || ''); }
  function urlVideo(m) {
    return m.proveedor === 'vimeo'
      ? 'https://player.vimeo.com/video/' + m.videoId + '?autoplay=1&dnt=1'
      : 'https://www.youtube-nocookie.com/embed/' + m.videoId + '?autoplay=1&rel=0';
  }
  function iframeVideo(m, titulo) {
    return el('iframe', { src: urlVideo(m), title: titulo || m.alt || UI.verVideo, allow: 'autoplay; fullscreen; picture-in-picture', allowfullscreen: true, referrerpolicy: 'strict-origin-when-cross-origin' });
  }

  // Vídeo suelto (pop-up o medios de un caso): el iframe solo se crea al pulsar.
  function nodoVideo(m) {
    if (!idVideoValido(m.videoId)) return marcador(UI.marcadores.video, '16 / 9');
    var caja = el('div', { class: 'medio-video' });
    var boton = el('button', { type: 'button', class: 'video-boton', 'aria-label': UI.verVideo }, [
      el('span', { class: 'play', 'aria-hidden': 'true' }, [sv('svg', { viewBox: '0 0 12 14', 'aria-hidden': 'true', focusable: 'false' }, [sv('polygon', { points: '0,0 12,7 0,14', fill: 'currentColor' })])]),
      el('span', { class: 'franja', text: UI.verVideo })
    ]);
    boton.addEventListener('click', function () {
      var ifr = iframeVideo(m);
      vaciar(caja).appendChild(ifr);
      ifr.focus();
    });
    caja.appendChild(boton);
    return caja;
  }

  // La diana de reproducción: anillos que "apuntan" al pasar el cursor; sin vídeo, el centro queda vacío.
  function dianaPlay(conVideo) {
    var kids = [
      sv('circle', { class: 'r-ext', cx: 44, cy: 44, r: 42 }),
      sv('circle', { class: 'r-med', cx: 44, cy: 44, r: 32 }),
      sv('circle', { class: 'r-centro' + (conVideo ? '' : ' vacio'), cx: 44, cy: 44, r: 22 })
    ];
    if (conVideo) kids.push(sv('path', { class: 'r-tri', d: 'M39 35 L53 44 L39 53 Z' }));
    return sv('svg', { class: 'play-diana', viewBox: '0 0 88 88', 'aria-hidden': 'true', focusable: 'false' }, kids);
  }

  function bloqueVideo(v) {
    var conVideo = idVideoValido(v.videoId);
    var linea = conVideo ? v.descripcion : UI.proximamente;
    var kids = [
      v.poster ? el('img', { class: 'video-poster', src: v.poster, alt: '', width: 1600, height: 901, loading: 'lazy' }) : null,
      v.textura && !v.poster ? el('img', { class: 'video-textura', src: v.textura, alt: '', width: 600, height: 814, loading: 'lazy' }) : null,
      dianaPlay(conVideo),
      el('span', { class: 'video-textos' }, [
        el('span', { class: 'video-etiqueta', text: UI.video }),
        el('span', { class: 'video-titulo', text: v.titulo }),
        linea ? el('span', { class: 'video-linea', text: linea }) : null
      ])
    ];
    var clase = 'arco-video' + (v.poster ? ' con-poster' : '');
    if (!conVideo) return el('div', { class: clase + ' sin-video' }, kids);
    var boton = el('button', { type: 'button', class: clase + ' con-video', 'aria-label': fmt(UI.reproducir, { titulo: v.titulo }) }, kids);
    boton.addEventListener('click', function () {
      var ifr = iframeVideo(v, v.alt || v.titulo);
      var caja = el('div', { class: 'arco-embed' }, [ifr]);
      boton.parentNode.replaceChild(caja, boton);
      ifr.focus();
    });
    return boton;
  }

  /* ---------- el arco ---------- */
  function renderArco() {
    var d = T.arco || {};
    var s = vaciar($('arco')).appendChild(el('div', { class: 'wrap g12 arco-grid' }));
    var tx = el('div', { class: 'arco-texto' }, [
      eyebrow('arco'),
      el('h2', { class: 'titulo', id: 'arco-titulo', text: d.titulo }),
      el('div', { class: 'texto', style: 'margin-top:24px' }, (d.parrafos || []).map(function (p) { return el('p', { text: p }); }))
    ]);
    if (d.video) tx.appendChild(bloqueVideo(d.video));
    s.appendChild(tx);

    var foto = null;
    if (d.foto && d.foto.src) {
      foto = el('figure', { class: 'arco-foto' }, [
        el('img', { src: d.foto.src, alt: d.foto.alt, width: d.foto.ancho, height: d.foto.alto, loading: 'lazy' }),
        el('figcaption', { text: UI.pieFoto })
      ]);
    } else {
      var mk = marcador(UI.marcadores.foto, '4 / 5');
      if (mk) foto = el('figure', { class: 'arco-foto' }, [mk]);
    }
    if (foto) s.appendChild(foto); else tx.classList.add('sin-foto');

    // Trayectoria previa: frase y tira de logos bajo la foto y el vídeo
    var tr = d.trayectoria;
    var logos = AO.trayectoriaLogos || [];
    if (tr && logos.length) {
      s.appendChild(el('div', { class: 'arco-trayectoria' }, [
        el('p', { class: 'etiqueta', id: 'trayectoria-etiqueta', text: tr.etiqueta }),
        el('p', { class: 'trayectoria-frase', text: tr.frase }),
        tiraLogos(logos)
      ]));
    }
  }

  // Tira de logos: una fila que se desliza (arrastrar, rueda, teclado) cuando no cabe entera
  function tiraLogos(logos) {
    var lista = el('ul', { class: 'trayectoria-logos', 'aria-labelledby': 'trayectoria-etiqueta' }, logos.map(function (l) {
      return el('li', { style: l.escala ? '--escala:' + l.escala : null }, [el('img', { src: l.logo, alt: l.nombre, width: l.ancho, height: l.alto, loading: 'lazy' })]);
    }));
    var vp = el('div', { class: 'trayectoria-vista', tabindex: '0', role: 'group', 'aria-label': UI.logosDesplazar }, [lista]);
    var barra = el('span', { class: 'trayectoria-barra' });
    var raya = el('div', { class: 'trayectoria-raya', 'aria-hidden': 'true' }, [barra]);
    var btnAnt = el('button', { type: 'button', class: 'trayectoria-flecha', 'aria-label': UI.logosAnterior, text: '‹' });
    var btnSig = el('button', { type: 'button', class: 'trayectoria-flecha', 'aria-label': UI.logosSiguiente, text: '›' });
    var mando = el('div', { class: 'trayectoria-mando' }, [btnAnt, raya, btnSig]);
    var caja = el('div', { class: 'trayectoria-tira' }, [vp, mando]);
    function medir() {
      var total = vp.scrollWidth, vista = vp.clientWidth, max = total - vista;
      var resto = max - vp.scrollLeft;
      caja.classList.toggle('hay-mas', resto > 2);
      caja.classList.toggle('hay-antes', vp.scrollLeft > 2);
      caja.classList.toggle('se-desplaza', max > 2);
      if (max > 2) {
        var ancho = Math.max(vista / total, .1);
        barra.style.width = (ancho * 100) + '%';
        barra.style.left = ((1 - ancho) * (vp.scrollLeft / max) * 100) + '%';
      }
    }
    function paso(dir) {
      vp.scrollBy({ left: dir * vp.clientWidth * .8, behavior: REDUCIDO.matches ? 'auto' : 'smooth' });
    }
    btnAnt.addEventListener('click', function () { paso(-1); });
    btnSig.addEventListener('click', function () { paso(1); });
    vp.addEventListener('scroll', medir, { passive: true });
    window.addEventListener('resize', medir);
    window.addEventListener('load', medir);
    Array.prototype.forEach.call(lista.querySelectorAll('img'), function (im) { im.addEventListener('load', medir); });
    setTimeout(medir, 0);
    // Arrastre con ratón (el tacto ya desliza de forma nativa)
    var ini = null;
    vp.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      ini = { x: e.clientX, l: vp.scrollLeft };
    });
    window.addEventListener('pointermove', function (e) {
      if (!ini) return;
      vp.classList.add('arrastrando');
      vp.scrollLeft = ini.l - (e.clientX - ini.x);
    });
    window.addEventListener('pointerup', function () { ini = null; vp.classList.remove('arrastrando'); });
    return caja;
  }

  /* ---------- tiradas certeras ---------- */
  function nombreSector(id) {
    var sec = (AO.sectores || []).filter(function (x) { return x.id === id; })[0];
    return sec ? sec.nombre : '';
  }
  function lista(v) { return Array.isArray(v) ? v : (v ? [v] : []); }
  function clienteCorto(c) {
    var m = /\(([^)]+)\)\s*$/.exec(c.cliente || '');
    return m ? m[1] : (c.cliente || '');
  }
  var PARTES = UI.partesCaso || [];

  // La infografía es el momento de impacto: marco navy, barra inferior y toda la pieza como botón.
  function nodoInfografia(c, m, abrir) {
    if (!m || !m.src) {
      var mk = marcador(UI.marcadores.infografia, '16 / 9');
      return mk ? el('div', { class: 'caso-info-pendiente' }, [mk]) : null;
    }
    var boton = el('button', { type: 'button', class: 'caso-info', 'data-popup': 'caso', 'data-clave': 'info', 'aria-label': UI.ampliar + ': ' + (m.alt || '') }, [
      el('img', { src: m.src, alt: '', width: m.ancho, height: m.alto, loading: 'lazy' }),
      el('span', { class: 'info-barra', 'aria-hidden': 'true' }, [
        el('span', { class: 'info-impacto', text: UI.resultadoBarra }),
        el('span', { class: 'info-ampliar' }, [
          el('span', { class: 'ia-largo', text: UI.ampliar }),
          el('span', { class: 'ia-corto', text: UI.ampliarCorto })
        ])
      ])
    ]);
    boton.addEventListener('click', function () { abrir(boton); });
    return boton;
  }

  function razon(m) { return m && m.ancho && m.alto ? m.ancho / m.alto : 0; }

  function nodoCaptura(c, m, i, abrir) {
    if (m.tipo === 'video') {
      var v = nodoVideo(m);
      return v ? el('div', { class: 'captura' }, [v]) : null;
    }
    if (!m.src) {
      var mk = marcador(UI.marcadores.imagen, '16 / 10');
      return mk ? el('div', { class: 'captura' }, [mk]) : null;
    }
    var b = el('button', { type: 'button', class: 'captura captura-boton', 'data-clave': 'media-' + i, style: razon(m) ? '--ar:' + razon(m).toFixed(3) : null, 'aria-label': UI.ampliarImagen + ': ' + (m.alt || '') }, [
      el('img', { src: m.src, alt: m.alt || '', width: m.ancho, height: m.alto, loading: 'lazy' })
    ]);
    b.addEventListener('click', function () { abrir(b, m); });
    return b;
  }

  function paso(clase, etiqueta, texto) {
    return el('div', { class: 'paso ' + clase }, [
      el('p', { class: 'etiqueta', text: etiqueta }),
      texto ? el('p', { class: 'paso-texto', text: texto }) : null
    ]);
  }

  // Raíl de cuatro nodos (solo escritorio): el reto, el enfoque y la ejecución (huecos) y la mini diana final.
  function recorridoCaso() {
    var clases = ['r-reto', 'r-medio', 'r-medio', 'r-fin'];
    return el('ol', { class: 'recorrido', 'aria-hidden': 'true' }, [
      el('span', { class: 'rail' }, [el('span')])
    ].concat(PARTES.map(function (n, i) {
      return el('li', { class: clases[i] }, [el('span', { class: 'nodo' }), el('span', { class: 'r-nombre', text: n })]);
    })));
  }

  function renderTiradas() {
    var d = T.tiradas || {};
    var s = vaciar($('tiradas')).appendChild(el('div', { class: 'wrap' }));
    s.appendChild(el('div', { class: 'cabecera' }, [
      eyebrow('tiradas'),
      el('h2', { class: 'titulo', id: 'tiradas-titulo', text: d.titulo }),
      d.subtitulo ? el('p', { class: 'apoyo', text: d.subtitulo }) : null
    ]));
    casos.forEach(function (c, i) {
      var info = (c.media || []).filter(function (m) { return m.tipo === 'infografia'; })[0] || null;
      if (!(c.media || []).length && LOCAL) info = { tipo: 'infografia', src: null };

      var art = el('article', { class: 'caso' + (c.estado === 'ejemplo' ? ' es-ejemplo' : ''), id: 'caso-' + c.id });
      var nodoInfo = info ? nodoInfografia(c, info, function (b) {
        abrirPopup({ estado: c.estado, categoria: c.cliente || c.tipoNegocio, titulo: c.titular, descripcion: '', formato: 'infografia', tamano: 'xl', media: [info] }, b);
      }) : null;

      var cab = el('div', { class: 'caso-cab' }, [
        el('p', { class: 'caso-meta resaltable' }, [
          estadoTag(c),
          el('span', { class: 'caso-num', text: fmt(UI.tirada, { n: pad(i + 1) }) + (nombreSector(c.sector) ? ' · ' + nombreSector(c.sector) : '') })
        ]),
        el('h3', { class: 'caso-titular', text: c.titular }),
        el('p', { class: 'caso-cliente', text: [c.cliente, c.tipoNegocio].filter(Boolean).join(' · ') })
      ]);
      var tiro = el('div', { class: 'caso-tiro' }, [
        paso('p-reto', PARTES[0], c.reto),
        paso('p-medio', PARTES[1] + ' · ' + PARTES[2]),
        recorridoCaso(),
        paso('p-resultado', PARTES[3])
      ]);
      var btn = el('button', { type: 'button', class: 'btn btn-primario', 'data-popup': 'tirada' }, [UI.verTirada, el('span', { class: 'solo-lectores', text: ': ' + c.cliente })]);
      btn.addEventListener('click', function () { abrirExpediente(c, btn, i); });
      var acciones = el('div', { class: 'caso-acciones' }, [
        btn,
        (c.cta && c.cta.url) ? enlace('btn btn-azul', c.cta.url, [c.cta.texto, iconoFlecha('der')], true) : null
      ]);
      [cab, tiro, nodoInfo, acciones].forEach(function (n) { if (n) art.appendChild(n); });
      s.appendChild(art);
    });
  }

  /* ---------- expediente de un caso (pop-up) ---------- */
  function seccionExp(clave, i, hijos) {
    return el('section', { class: 'exp-sec', id: 'exp-' + clave, 'aria-labelledby': 'exp-' + clave + '-t' }, [
      el('h3', { class: 'exp-h3', id: 'exp-' + clave + '-t', tabindex: '-1' }, [
        el('span', { class: 'eyebrow-num', text: pad(i + 1) }),
        el('span', { class: 'eyebrow-filete', 'aria-hidden': 'true' }),
        el('span', { text: PARTES[i] })
      ])
    ].concat(hijos));
  }

  function cuerpoExpediente(c) {
    var claves = ['reto', 'enfoque', 'ejecucion', 'resultado'];
    var info = (c.media || []).filter(function (m) { return m.tipo === 'infografia'; })[0] || null;
    var resto = (c.media || []).filter(function (m) { return m !== info; });
    function ampliar(b, m) { vistaZoom(m || info, b.getAttribute('data-clave')); }

    var capturas = resto.map(function (m) { return nodoCaptura(c, m, (c.media || []).indexOf(m), ampliar); }).filter(Boolean);
    var natural = resto.length > 1 && resto.every(function (m) { return m.src && razon(m) >= 1.5; });
    var ejec = [el('ul', { class: 'lista-ejec' }, lista(c.ejecucion).map(function (t) {
      return el('li', { text: t });
    }))];
    if (capturas.length) ejec.push(el('div', { class: 'pruebas' + (natural ? ' pruebas-nat' : '') }, capturas));

    var r = c.resultado || {};
    var fin = [];
    if (r.arranque) fin.push(el('p', { class: 'resultado-arranque', text: r.arranque }));
    var nodoInfo = info ? nodoInfografia(c, info, function (b) { ampliar(b, info); }) : null;
    if (nodoInfo) { nodoInfo.classList.add('caso-info-exp'); fin.push(nodoInfo); }
    if (lista(r.parrafos).length) fin.push(el('div', { class: 'texto' }, lista(r.parrafos).map(function (p) { return el('p', { text: p }); })));
    if (c.cta && c.cta.url) {
      fin.push(el('div', { class: 'exp-cierre' }, [
        c.cierre && c.cierre.pregunta ? el('p', { class: 'exp-pregunta', text: c.cierre.pregunta }) : null,
        enlace('btn btn-azul', c.cta.url, [c.cta.texto, iconoFlecha('der')], true)
      ]));
    }

    var secs = [
      seccionExp(claves[0], 0, [el('p', { class: 'exp-p', text: c.reto })]),
      seccionExp(claves[1], 1, lista(c.enfoque).map(function (t) { return el('p', { class: 'exp-p', text: t }); })),
      seccionExp(claves[2], 2, ejec),
      seccionExp(claves[3], 3, fin)
    ];
    var links = PARTES.map(function (n, i) {
      var a = el('a', { href: '#exp-' + claves[i] }, [el('span', { class: 'ind-nodo', 'aria-hidden': 'true' }), el('span', { class: 'ind-largo', text: n }), el('span', { class: 'ind-corto', text: (UI.partesCasoCortas || PARTES)[i] })]);
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var sec = secs[i];
        sec.scrollIntoView({ behavior: REDUCIDO.matches ? 'auto' : 'smooth', block: 'start' });
        sec.querySelector('h3').focus({ preventScroll: true });
      });
      return el('li', {}, [a]);
    });
    var indice = el('nav', { class: 'indice', 'aria-label': UI.partesCasoIndice }, [el('ol', {}, links)]);
    return { indice: indice, secs: secs, links: links, nodo: el('div', { class: 'exp-cuerpo' }, [indice, el('div', { class: 'exp-secciones' }, secs)]) };
  }

  function quitarSpy() {
    if (popup.alScroll) { card.removeEventListener('scroll', popup.alScroll); popup.alScroll = null; }
  }
  // Índice de partes: marca la leída, la actual (la que cruza el 35 % de la altura) y las que faltan.
  function activarSpy(parts) {
    quitarSpy();
    var pend = false;
    function medir() {
      pend = false;
      var cr = card.getBoundingClientRect();
      var linea = cr.top + card.clientHeight * 0.35;
      var act = 0;
      parts.secs.forEach(function (sec, i) { if (sec.getBoundingClientRect().top <= linea) act = i; });
      if (card.scrollTop + card.clientHeight >= card.scrollHeight - 4) act = parts.secs.length - 1;
      parts.links.forEach(function (li, i) {
        li.classList.toggle('is-leida', i < act);
        li.classList.toggle('is-actual', i === act);
        var a = li.firstChild;
        if (i === act) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
      });
      parts.indice.style.setProperty('--fill', (parts.links[act].offsetTop + 7) + 'px');
    }
    popup.alScroll = function () { if (!pend) { pend = true; window.requestAnimationFrame(medir); } };
    card.addEventListener('scroll', popup.alScroll, { passive: true });
    medir();
  }

  function botonCerrar() {
    var cerrar = el('button', { type: 'button', class: 'modal-cerrar', 'aria-label': UI.cerrar }, [el('span', { text: UI.cerrar }), el('span', { 'aria-hidden': 'true', text: '×' })]);
    cerrar.addEventListener('click', cerrarPopup);
    return cerrar;
  }
  function fundido() {
    if (REDUCIDO.matches || !card.animate) return;
    card.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150 });
  }

  function pintarExpediente() {
    var c = popup.caso;
    quitarSpy();
    vaciar(card);
    card.className = 'modal-card exp';
    popup.vista = 'exp';
    var partes = cuerpoExpediente(c);
    card.appendChild(el('div', { class: 'modal-barra' }, [
      el('p', { class: 'etiqueta' }, [fmt(UI.tirada, { n: pad(popup.n + 1) }) + ' · ' + clienteCorto(c)]),
      el('div', { class: 'modal-acciones' }, [botonCerrar()])
    ]));
    card.appendChild(el('div', { class: 'exp-cab' }, [
      estadoTag(c),
      el('h2', { class: 'exp-titulo', id: 'modal-titulo', text: c.titular }),
      el('p', { class: 'caso-cliente', text: [c.cliente, c.tipoNegocio].filter(Boolean).join(' · ') })
    ]));
    card.appendChild(partes.nodo);
    activarSpy(partes);
  }

  function abrirExpediente(c, origen, n) {
    popup.modo = 'exp'; popup.caso = c; popup.n = n; popup.origen = origen; popup.pieza = { media: [] }; popup.cont = null;
    pintarExpediente();
    var art = origen.closest('.caso') || origen;
    mostrarModal(art.getBoundingClientRect(), card.querySelector('.modal-cerrar'));
    card.dispatchEvent(new Event('scroll')); // el diálogo ya es visible: marca la parte actual
  }

  // Ampliar dentro del expediente: el mismo diálogo cambia a la vista de zoom.
  function vistaZoom(m, clave) {
    popup.scroll = card.scrollTop; popup.clave = clave; popup.vista = 'zoom';
    quitarSpy();
    vaciar(card);
    card.className = 'modal-card exp en-zoom';
    var volver = el('button', { type: 'button', class: 'modal-volver' }, [iconoFlecha('izq'), UI.volverCaso]);
    volver.addEventListener('click', volverAlCaso);
    var zoom = el('button', { type: 'button', class: 'modal-zoom', 'aria-pressed': 'false', text: UI.zoomMas || 'Acercar' });
    zoom.addEventListener('click', function () {
      var on = card.classList.toggle('ampliada');
      zoom.setAttribute('aria-pressed', on ? 'true' : 'false');
      zoom.textContent = on ? (UI.zoomMenos || 'Ajustar') : (UI.zoomMas || 'Acercar');
    });
    card.appendChild(el('div', { class: 'modal-barra' }, [volver, el('div', { class: 'modal-acciones' }, [zoom, botonCerrar()])]));
    card.appendChild(el('h2', { class: 'solo-lectores', id: 'modal-titulo', text: popup.caso.titular }));
    var img = el('img', { src: m.src, alt: m.alt || '', width: m.ancho, height: m.alto, class: m.tipo === 'infografia' ? 'img-info' : null });
    var nodo = m.tipo === 'infografia'
      ? el('div', { class: 'marco-info', style: 'max-width:' + (m.ancho + 16) + 'px' }, [img])
      : img;
    card.appendChild(el('div', { class: 'zoom-medio' }, [nodo]));
    card.scrollTop = 0;
    fundido();
    volver.focus();
  }
  function volverAlCaso() {
    var y = popup.scroll, clave = popup.clave;
    pintarExpediente();
    card.scrollTop = y;
    var b = card.querySelector('[data-clave="' + clave + '"]');
    if (b) b.focus({ preventScroll: true }); else card.querySelector('.modal-cerrar').focus();
    fundido();
  }

  /* ---------- el carcaj: índice y visor ---------- */
  function primeraImagen(p) { return (p.media || []).filter(function (x) { return x.src; })[0] || null; }

  function flechaFila() {
    return sv('svg', { class: 'fila-flecha', viewBox: '0 0 36 12', 'aria-hidden': 'true', focusable: 'false' }, [
      sv('line', { x1: 0, y1: 6, x2: 30, y2: 6, stroke: 'currentColor', 'stroke-width': 2 }),
      sv('path', { d: 'M36 6 l-8 -5 v10 z', fill: 'currentColor' })
    ]);
  }

  function renderCarcaj() {
    var d = T.carcaj || {};
    var s = vaciar($('carcaj')).appendChild(el('div', { class: 'wrap' }));
    s.appendChild(el('div', { class: 'cabecera' }, [
      eyebrow('carcaj'),
      el('h2', { class: 'titulo', id: 'carcaj-titulo', text: d.titulo }),
      d.subtitulo ? el('p', { class: 'apoyo', text: d.subtitulo }) : null
    ]));
    var filtros = el('div', { class: 'filtros', role: 'group', 'aria-label': d.titulo });
    s.appendChild(filtros);

    var lista = el('ul', { class: 'carcaj-lista' });
    var visorA = el('img', { class: 'visor-capa', alt: '', width: 1080, height: 1350 });
    var visorB = el('img', { class: 'visor-capa', alt: '', width: 1080, height: 1350 });
    var visorMarcador = el('div', { class: 'visor-marcador' });
    var visorCat = el('span', { class: 'etiqueta' });
    var visorPos = el('span', { class: 'visor-pos' });
    var visorBtn = el('button', { type: 'button', class: 'btn btn-primario btn-compacto', text: UI.verEnGrande });
    var visorAviso = el('p', { class: 'solo-lectores', 'aria-live': 'polite' });
    var visor = el('div', { class: 'visor', id: 'visor' }, [
      el('div', { class: 'visor-img' }, [visorA, visorB, visorMarcador]),
      el('div', { class: 'visor-pie' }, [el('div', { class: 'visor-meta' }, [visorCat, visorPos]), visorBtn]),
      visorAviso
    ]);
    var cinta = el('div', { class: 'cinta' });
    var ind = el('div', { class: 'cinta-ind', 'aria-hidden': 'true' });
    s.appendChild(el('div', { class: 'carcaj-cuerpo' }, [lista, visor, cinta, ind]));

    var filas = [], tarjetas = [], items = [];
    piezas.forEach(function (p, i) {
      var m = primeraImagen(p);
      var fila = el('button', { type: 'button', class: 'fila', 'data-id': p.id, 'aria-controls': 'visor' }, [
        flechaFila(),
        el('span', { class: 'fila-n', text: pad(i + 1) }),
        el('span', { class: 'fila-titulo', text: p.titulo }),
        el('span', { class: 'fila-cat' }, [estadoTag(p), el('span', { class: 'etiqueta', text: p.categoria })])
      ]);
      var li = el('li', { class: 'fila-li' }, [fila]);
      lista.appendChild(li);
      var mini = m
        ? el('img', { src: m.src, alt: m.alt || '', width: m.ancho, height: m.alto, loading: 'lazy' })
        : marcador(UI.marcadores[p.formato] || UI.marcadores.imagen);
      var tarjeta = el('button', { type: 'button', class: 'tarjeta', 'data-id': p.id }, [
        el('span', { class: 'pieza-mini' }, [mini]),
        el('span', { class: 'tarjeta-cat' }, [estadoTag(p), el('span', { class: 'etiqueta', text: p.categoria })]),
        el('span', { class: 'tarjeta-titulo', text: p.titulo })
      ]);
      cinta.appendChild(tarjeta);
      filas.push(fila); tarjetas.push(tarjeta);
      items.push({ pieza: p, li: li, fila: fila, tarjeta: tarjeta, oculta: false });
    });

    // data-popup solo en el conjunto que se ve: filas desde 1024 px, tarjetas por debajo.
    function asignarPopup() {
      var esc = ESCRITORIO.matches;
      items.forEach(function (it) {
        if (esc) { it.fila.setAttribute('data-popup', it.pieza.id); it.tarjeta.removeAttribute('data-popup'); }
        else { it.tarjeta.setAttribute('data-popup', it.pieza.id); it.fila.removeAttribute('data-popup'); }
      });
    }
    asignarPopup();
    if (ESCRITORIO.addEventListener) ESCRITORIO.addEventListener('change', asignarPopup);

    var activa = -1;
    var capaActiva = visorB;
    function pintarVisor(i) {
      var p = items[i].pieza;
      var m = primeraImagen(p);
      visorCat.textContent = p.categoria;
      visorPos.textContent = (p.media || []).length > 1 ? fmt(UI.posicion, { n: 1, m: p.media.length }) : '';
      visorAviso.textContent = p.titulo + ', ' + p.categoria;
      visorMarcador.textContent = '';
      if (m) {
        var nueva = capaActiva === visorA ? visorB : visorA;
        var vieja = capaActiva;
        nueva.onload = function () { nueva.classList.add('is-on'); if (vieja !== nueva) vieja.classList.remove('is-on'); };
        nueva.alt = m.alt || '';
        nueva.src = m.src;
        capaActiva = nueva;
        visorMarcador.hidden = true;
        if (nueva.complete && nueva.naturalWidth) nueva.onload();
      } else {
        visorA.classList.remove('is-on'); visorB.classList.remove('is-on');
        var mk = marcador(UI.marcadores[p.formato] || UI.marcadores.imagen);
        visorMarcador.hidden = !mk;
        if (mk) visorMarcador.appendChild(mk);
      }
    }
    function activar(i) {
      if (i === activa || i < 0) return;
      activa = i;
      items.forEach(function (it, k) { if (k === i) it.fila.setAttribute('aria-current', 'true'); else it.fila.removeAttribute('aria-current'); });
      pintarVisor(i);
    }
    items.forEach(function (it, i) {
      var precarga = function () { var m = primeraImagen(it.pieza); if (m) { var im = new Image(); im.src = m.src; } };
      it.fila.addEventListener('mouseenter', function () { precarga(); activar(i); });
      it.fila.addEventListener('focus', function () { activar(i); });
    });
    visorBtn.addEventListener('click', function () { if (activa >= 0) abrirPopup(items[activa].pieza, visorBtn); });

    function actualizarIndicador() {
      var vis = items.filter(function (it) { return !it.oculta; });
      var primera = vis[0] && vis[0].tarjeta;
      var n = primera && primera.offsetWidth ? Math.round(cinta.scrollLeft / (primera.offsetWidth + 16)) : 0;
      Array.prototype.forEach.call(ind.children, function (g, k) { g.classList.toggle('on', k === n); });
    }
    cinta.addEventListener('scroll', actualizarIndicador, { passive: true });

    var botones = [];
    function filtrar(cat) {
      var n = 0;
      items.forEach(function (it) {
        var ok = !cat || it.pieza.categoria === cat;
        it.oculta = !ok;
        it.li.hidden = !ok;
        it.tarjeta.hidden = !ok;
        if (ok) n++;
      });
      botones.forEach(function (b) { b.setAttribute('aria-pressed', String((b.getAttribute('data-cat') || null) === cat)); });
      vaciar(ind);
      for (var k = 0; k < n; k++) ind.appendChild(el('i'));
      cinta.scrollLeft = 0;
      actualizarIndicador();
      if (activa < 0 || items[activa].oculta) {
        var primero = -1;
        items.forEach(function (it, k) { if (primero < 0 && !it.oculta) primero = k; });
        activa = -1;
        activar(primero);
      }
      anuncio(cat ? fmt(UI.avisoPiezas, { n: n, categoria: cat }) : UI.avisoPiezasTodas);
    }
    [null].concat(AO.carcajCategorias || []).forEach(function (cat) {
      var b = el('button', { type: 'button', class: 'filtro', 'aria-pressed': 'false', 'data-cat': cat, text: cat || UI.todo });
      b.addEventListener('click', function () { filtrar(cat); });
      b.addEventListener('focus', function () { if (b.scrollIntoView) b.scrollIntoView({ inline: 'nearest', block: 'nearest' }); });
      botones.push(b);
      filtros.appendChild(b);
    });
    filtrar(null);
    anuncio('');

    $('carcaj').addEventListener('click', function (e) {
      var b = e.target.closest('[data-popup]');
      if (!b || !lista.contains(b) && !cinta.contains(b)) return;
      var p = piezas.filter(function (x) { return x.id === b.getAttribute('data-popup'); })[0];
      if (p) abrirPopup(p, b);
    });
  }

  /* ---------- pop-up ---------- */
  var modal = $('modal');
  var card = $('modal-card');
  var popup = { modo: 'medio', vista: null, pieza: null, origen: null, i: 0, slot: null, cont: null, caso: null, n: 0, scroll: 0, clave: null, alScroll: null };
  var INERTES = ['nav', 'principal', 'pie', 'recorrido-barra'];

  function pintarMedioPopup() {
    var p = popup.pieza;
    var m = (p.media || [])[popup.i];
    vaciar(popup.slot);
    var n = null;
    if (m && m.tipo === 'video') n = nodoVideo(m);
    else if (m && m.src && m.tipo === 'infografia') {
      n = el('div', { class: 'marco-info', style: 'max-width:' + (m.ancho + 16) + 'px' }, [
        el('img', { src: m.src, alt: m.alt || '', width: m.ancho, height: m.alto, class: 'img-info' })
      ]);
    }
    else if (m && m.src) n = el('img', { src: m.src, alt: m.alt || '', width: m.ancho, height: m.alto });
    else n = marcador(UI.marcadores[p.formato] || UI.marcadores.imagen);
    if (n) popup.slot.appendChild(n);
    if (popup.pie) popup.pie.textContent = (m && m.pie) || '';
    if (popup.cont) popup.cont.textContent = fmt(UI.posicion, { n: popup.i + 1, m: p.media.length });
  }
  // descripcion: string, array de strings (lista sin números) o vacío
  function descripcionNodo(d) {
    var l = (Array.isArray(d) ? d : [d]).filter(function (t) { return typeof t === 'string' && t.trim(); });
    if (!l.length) return null;
    if (l.length === 1) return el('p', { text: l[0] });
    return el('ul', { class: 'modal-lista' }, l.map(function (t) { return el('li', { text: t }); }));
  }
  function mover(d) {
    var n = popup.pieza.media.length;
    if (n < 2) return;
    popup.i = (popup.i + d + n) % n;
    pintarMedioPopup();
  }
  function enfocables() {
    return Array.prototype.filter.call(card.querySelectorAll('button, a[href], iframe, [tabindex]:not([tabindex="-1"])'), function (n) { return !n.disabled && n.offsetParent !== null; });
  }
  function teclasPopup(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      // En la vista de zoom del expediente, Escape vuelve al caso; un segundo Escape cierra.
      if (popup.modo === 'exp' && popup.vista === 'zoom') volverAlCaso(); else cerrarPopup();
      return;
    }
    if (popup.modo === 'medio' && e.key === 'ArrowRight') mover(1);
    if (popup.modo === 'medio' && e.key === 'ArrowLeft') mover(-1);
    if (e.key === 'Tab') {
      var f = enfocables();
      if (!f.length) { e.preventDefault(); return; }
      var primero = f[0], ultimo = f[f.length - 1];
      if (!card.contains(document.activeElement)) { e.preventDefault(); primero.focus(); }
      else if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  }
  function clicFuera(e) { if (e.target === modal) cerrarPopup(); }

  function abrirPopup(p, origen) {
    popup.modo = 'medio'; popup.vista = null; popup.pieza = p; popup.origen = origen; popup.i = 0; popup.cont = null; popup.pie = null;
    card.className = 'modal-card ' + (p.tamano || 'md') + (p.apaisado ? ' apaisado' : '');
    vaciar(card);
    var cerrar = el('button', { type: 'button', class: 'modal-cerrar', 'aria-label': UI.cerrar }, [el('span', { text: UI.cerrar }), el('span', { 'aria-hidden': 'true', text: '×' })]);
    cerrar.addEventListener('click', cerrarPopup);
    var acciones = [cerrar];
    var m0 = (p.media || [])[0];
    if ((p.media || []).length === 1 && m0 && (m0.tipo === 'imagen' || m0.tipo === 'infografia') && m0.src) {
      var zoom = el('button', { type: 'button', class: 'modal-zoom', 'aria-pressed': 'false', text: UI.zoomMas || 'Acercar' });
      zoom.addEventListener('click', function () {
        var on = card.classList.toggle('zoom');
        zoom.setAttribute('aria-pressed', on ? 'true' : 'false');
        zoom.textContent = on ? (UI.zoomMenos || 'Ajustar') : (UI.zoomMas || 'Acercar');
      });
      acciones.unshift(zoom);
    }
    card.appendChild(el('div', { class: 'modal-barra' }, [el('p', { class: 'etiqueta' }, [p.categoria]), el('div', { class: 'modal-acciones' }, acciones)]));
    var slot = el('div', { class: 'modal-slot' });
    popup.slot = slot;
    var medio = el('div', { class: 'modal-medio' }, [slot]);
    if ((p.media || []).length > 1) {
      var ant = el('button', { type: 'button', class: 'carrusel-btn carrusel-ant', 'aria-label': UI.anterior }, [iconoFlecha('izq')]);
      var sig = el('button', { type: 'button', class: 'carrusel-btn carrusel-sig', 'aria-label': UI.siguiente }, [iconoFlecha('der')]);
      popup.cont = el('span', { class: 'carrusel-cont', 'aria-live': 'polite' });
      ant.addEventListener('click', function () { mover(-1); });
      sig.addEventListener('click', function () { mover(1); });
      medio.appendChild(ant); medio.appendChild(sig); medio.appendChild(popup.cont);
    }
    card.appendChild(medio);
    card.appendChild(el('div', { class: 'modal-texto' }, [estadoTag(p), el('h2', { id: 'modal-titulo', text: p.titulo }), popup.pie = el('p', { class: 'modal-pie', 'aria-live': 'polite' }), descripcionNodo(p.descripcion)]));
    pintarMedioPopup();

    mostrarModal((origen.querySelector('.pieza-mini') || origen).getBoundingClientRect(), cerrar);
  }

  // Abre el diálogo ya montado: inerte el resto, animación desde el rectángulo de origen y foco.
  function mostrarModal(r, foco) {
    INERTES.forEach(function (id) { var n = $(id); if (n) n.setAttribute('inert', ''); });
    document.documentElement.classList.add('modal-abierto');
    modal.hidden = false;
    document.addEventListener('keydown', teclasPopup);
    modal.addEventListener('mousedown', clicFuera);

    if (!REDUCIDO.matches && card.animate) {
      var c = card.getBoundingClientRect();
      var dx = (r.left + r.width / 2) - (c.left + c.width / 2);
      var dy = (r.top + r.height / 2) - (c.top + c.height / 2);
      card.animate([
        { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + (r.width / c.width) + ',' + (r.height / c.height) + ')', opacity: 0.4 },
        { transform: 'none', opacity: 1 }
      ], { duration: 400, easing: 'cubic-bezier(.22,.61,.36,1)' });
      modal.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250 });
    }
    foco.focus();
  }

  function cerrarPopup() {
    if (modal.hidden) return;
    quitarSpy();
    modal.hidden = true;
    card.scrollTop = 0;
    vaciar(card);
    document.documentElement.classList.remove('modal-abierto');
    INERTES.forEach(function (id) { var n = $(id); if (n) n.removeAttribute('inert'); });
    document.removeEventListener('keydown', teclasPopup);
    modal.removeEventListener('mousedown', clicFuera);
    if (popup.origen && document.contains(popup.origen)) popup.origen.focus();
    popup.origen = null;
  }

  /* ---------- cierre y pie ---------- */
  // Diana final: una flecha blanca se clava, la diana pasa a naranja y sale una onda (una sola vez).
  function dianaFinal() {
    return sv('svg', { class: 'cf-svg', viewBox: '0 0 200 200', 'aria-hidden': 'true', focusable: 'false' }, [
      sv('circle', { class: 'cf-a', cx: 100, cy: 100, r: 96 }),
      sv('circle', { class: 'cf-a', cx: 100, cy: 100, r: 66 }),
      sv('circle', { class: 'cf-a', cx: 100, cy: 100, r: 36 }),
      sv('circle', { class: 'cf-centro', cx: 100, cy: 100, r: 10 }),
      sv('circle', { class: 'cf-onda', cx: 100, cy: 100, r: 36 }),
      sv('g', { transform: 'translate(100 100) rotate(27)' }, [sv('g', { class: 'cf-flecha' }, flechaDibujo(84, 12, 8))])
    ]);
  }

  function renderContacto() {
    var d = T.contacto || {};
    var s = vaciar($('contacto')).appendChild(el('div', { class: 'wrap' }));
    s.appendChild(el('div', { class: 'cierre-diana', 'data-diana-final': '' }, [dianaFinal()]));
    s.appendChild(eyebrow('contacto'));
    s.appendChild(el('h2', { class: 'titulo', id: 'contacto-titulo', text: d.titulo }));
    s.appendChild(el('p', { class: 'entradilla', text: d.subtitulo }));
    var botones = el('div', { class: 'cierre-botones' });
    if (d.ctaPrincipal) botones.appendChild(enlace('btn btn-primario', d.ctaPrincipal.url, [d.ctaPrincipal.texto]));
    if (d.ctaSecundario && d.ctaSecundario.url) botones.appendChild(enlace('btn btn-sec', d.ctaSecundario.url, [d.ctaSecundario.texto, iconoFlecha('der')]));
    s.appendChild(botones);
  }

  function renderPie() {
    var p = T.pie || {};
    var enlaces = (p.enlaces || []).filter(function (e) { return e.url; });
    var correo = enlaces.filter(function (e) { return /^mailto:/.test(e.url); });
    var resto = enlaces.filter(function (e) { return !/^mailto:/.test(e.url); });
    var lista = el('div', { class: 'pie-enlaces' });
    correo.concat(resto).forEach(function (e) { lista.appendChild(enlace('', e.url, [e.texto])); });
    vaciar($('pie')).appendChild(el('div', { class: 'wrap' }, [lista, el('p', { class: 'pie-copy', text: p.copy })]));
  }

  /* ---------- navegación ---------- */
  function renderNav() {
    var m = T.marca || {};
    $('saltar').textContent = UI.saltar;
    $('nav-logo').appendChild(el('img', { src: m.logo, alt: m.alt, width: m.ancho, height: m.alto }));
    var ids = SECCIONES.filter(function (id) { return id !== 'hero' && id !== 'sectores'; });
    var bar = $('nav-enlaces');
    var panel = $('nav-panel');
    ids.forEach(function (id) {
      bar.appendChild(el('a', { href: '#' + id, 'data-nav': id }, [el('span', { text: nombre(id) })]));
      panel.appendChild(el('a', { href: '#' + id, 'data-nav': id }, [el('span', { text: nombre(id) })]));
    });
    var btn = $('nav-menu-btn');
    btn.textContent = UI.secciones;
    function abrir(v) { panel.hidden = !v; btn.setAttribute('aria-expanded', String(v)); }
    btn.addEventListener('click', function () { abrir(panel.hidden); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) abrir(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { abrir(false); btn.focus(); } });
    document.addEventListener('click', function (e) { if (!panel.hidden && !$('nav').contains(e.target)) abrir(false); });
  }

  /* ---------- dibujos que se disparan una vez al entrar ---------- */
  var cierreEncendido = false;
  function encenderCierre() {
    if (cierreEncendido) return;
    cierreEncendido = true;
    var d = document.querySelector('.cierre-diana');
    if (d) d.classList.add('is-encendida');
  }

  // Umbral .45 sobre el elemento. Si es más alto que la ventana, basta con que ocupe el 45 % de ella.
  function observarDisparos() {
    var objetivos = [].concat(Array.prototype.slice.call(document.querySelectorAll('.caso')), Array.prototype.slice.call(document.querySelectorAll('.cierre-diana')));
    function disparar(n) {
      if (n.classList.contains('caso')) n.classList.add('is-vista'); else encenderCierre();
    }
    if (REDUCIDO.matches || !window.IntersectionObserver) { objetivos.forEach(disparar); return; }
    var umbrales = [];
    for (var i = 0; i <= 20; i++) umbrales.push(i / 20);
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var ventana = e.rootBounds ? e.rootBounds.height : window.innerHeight;
        if (e.intersectionRatio >= 0.45 || e.intersectionRect.height >= ventana * 0.45) { disparar(e.target); io.unobserve(e.target); }
      });
    }, { threshold: umbrales });
    objetivos.forEach(function (n) { io.observe(n); });
  }

  /* ---------- trayectoria (desde 1200 px) ---------- */
  var tr = $('trayectoria');
  var pagina = $('pagina');
  var geo = null;
  var sondaFrac = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sonda')) || 0.55;
  // La salida desde la punta de la flecha se dibuja una vez al cargar; después la línea sigue el scroll.
  var salida = { p: 0 };

  function anchoDoc() { return document.documentElement.clientWidth; }

  function construirTrayectoria() {
    vaciar(tr);
    geo = null;
    if (anchoDoc() < 1200) return;
    pagina.classList.add('midiendo');
    try { trazar(); } finally { pagina.classList.remove('midiendo'); }
  }
  function trazar() {
    var pr = pagina.getBoundingClientRect();
    var W = pagina.clientWidth, H = pagina.scrollHeight;
    tr.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    function cy(r) { return r.top - pr.top + r.height / 2; }

    var imagen = $('hero').querySelector('.hero-arte img');
    if (!imagen) return;
    var ir = imagen.getBoundingClientRect();
    var punta = ((T.hero || {}).ilustracion || {}).punta || [0.048, 0.433];
    var sx = ir.left - pr.left + ir.width * punta[0];
    var sy = ir.top - pr.top + ir.height * punta[1];
    var gx = ir.left - pr.left - 12; // centro del medianil entre el texto y la arquera

    var mx = Math.max(28, (W - 1080) / 4);
    var destinos = [];
    var k = 0;
    SECCIONES.slice(1).forEach(function (id) {
      var i = k++;
      var sec = $(id);
      var final = id === 'contacto';
      var ancla = final ? sec.querySelector('.cierre-diana svg') : sec.querySelector('[data-diana]');
      if (!ancla) return;
      var r = ancla.getBoundingClientRect();
      var top = sec.getBoundingClientRect().top - pr.top;
      var y = cy(r);
      // Sectores no lleva eyebrow: la diana se alinea con el centro de la primera línea del h2
      if (id === 'sectores') y = r.top - pr.top + (parseFloat(getComputedStyle(ancla).lineHeight) || r.height) / 2;
      // El cierre: la línea acaba en el borde superior del anillo exterior de la diana final
      if (final) y = r.top - pr.top + r.height * 0.02;
      destinos.push({ id: id, final: final, x: final ? W / 2 : (i % 2 === 0 ? mx : W - mx), y: y, g: top });
      // La flecha se detiene también en cada caso de éxito
      if (id === 'tiradas') {
        Array.prototype.forEach.call(sec.querySelectorAll('.caso'), function (art) {
          var marca = art.querySelector('.caso-meta');
          if (!marca) return;
          var j = k++;
          destinos.push({ id: id, final: false, x: j % 2 === 0 ? mx : W - mx, y: cy(marca.getBoundingClientRect()), g: art.getBoundingClientRect().top - pr.top });
        });
      }
    });
    if (!destinos.length) return;

    // Primer tramo: sale de la punta hacia la izquierda, baja por el medianil y cruza en el hueco bajo la portada
    var d = 'M' + sx + ' ' + sy + ' C' + (sx - 20) + ' ' + sy + ' ' + gx + ' ' + (sy + 8) + ' ' + gx + ' ' + (sy + 48);
    var t0 = destinos[0];
    var corte = Math.max(sy + 48, t0.g - 72);
    d += ' L' + gx + ' ' + corte + ' C' + gx + ' ' + (corte + 82) + ' ' + t0.x + ' ' + (corte + 82) + ' ' + t0.x + ' ' + (corte + 172) + ' L' + t0.x + ' ' + t0.y;
    var prev = t0;
    destinos.slice(1).forEach(function (t) {
      var a = Math.max(prev.y, t.g - 100);
      d += ' L' + prev.x + ' ' + a + ' C' + prev.x + ' ' + t.g + ' ' + t.x + ' ' + t.g + ' ' + t.x + ' ' + (t.g + 100) + ' L' + t.x + ' ' + t.y;
      prev = t;
    });

    var camino = sv('path', { class: 'tr-camino', d: d });
    var recorrido = sv('path', { class: 'tr-recorrido', d: d });
    tr.appendChild(camino);
    tr.appendChild(recorrido);

    // Dentro del cierre (navy) el mismo trazo va en blanco, recortado a la caja del cierre
    var cierre = $('contacto').getBoundingClientRect();
    var cTop = cierre.top - pr.top;
    var clip = sv('clipPath', { id: 'tr-clip-cierre' }, [sv('rect', { x: '0', y: String(cTop), width: String(W), height: String(cierre.height) })]);
    tr.appendChild(sv('defs', {}, [clip]));
    var caminoNavy = sv('path', { class: 'tr-camino tr-sobre-navy', d: d, 'clip-path': 'url(#tr-clip-cierre)' });
    var recorridoNavy = sv('path', { class: 'tr-recorrido tr-sobre-navy', d: d, 'clip-path': 'url(#tr-clip-cierre)' });
    tr.appendChild(caminoNavy);
    tr.appendChild(recorridoNavy);

    var dianas = [];
    destinos.forEach(function (t) {
      if (t.final) return;
      var g = sv('g', { class: 'tr-diana', transform: 'translate(' + t.x + ' ' + t.y + ')' }, [
        sv('circle', { class: 'anillo anillo-ext', r: '15' }), sv('circle', { class: 'anillo centro', r: '7' }), sv('circle', { class: 'impacto', r: '15' })
      ]);
      tr.appendChild(g);
      dianas.push({ y: t.y, g: g, on: false });
    });

    var flecha = sv('g', { class: 'tr-flecha' }, flechaDibujo(28, 10, 6));
    tr.appendChild(flecha);

    var total = camino.getTotalLength();
    var N = Math.max(2, Math.ceil(total / 8));
    var ys = [];
    for (var i = 0; i <= N; i++) ys.push(camino.getPointAtLength(total * i / N).y);
    [recorrido, recorridoNavy].forEach(function (p) { p.setAttribute('stroke-dasharray', total); p.setAttribute('stroke-dashoffset', total); });
    geo = { top: pr.top + window.pageYOffset, total: total, N: N, ys: ys, camino: camino, recorrido: recorrido, recorridoNavy: recorridoNavy, dianas: dianas, flecha: flecha, cierreTop: cTop, pieHero: 0 };
    geo.pieHero = longitudParaY($('hero').getBoundingClientRect().bottom - pr.top);
    actualizarTrayectoria();
  }

  function longitudParaY(y) {
    var ys = geo.ys, lo = 0, hi = geo.N;
    if (y <= ys[0]) return 0;
    if (y >= ys[hi]) return geo.total;
    while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (ys[mid] <= y) lo = mid; else hi = mid; }
    var f = (y - ys[lo]) / Math.max(0.0001, ys[hi] - ys[lo]);
    return (lo + f) / geo.N * geo.total;
  }

  function alFinal() { return window.pageYOffset + window.innerHeight >= document.documentElement.scrollHeight - 4; }

  function actualizarTrayectoria() {
    if (!geo) return;
    var sonda = window.pageYOffset + window.innerHeight * sondaFrac - geo.top;
    var final = alFinal();
    var len = final ? geo.total : longitudParaY(sonda);
    // Tras la salida, el tramo hasta el pie de la portada queda dibujado
    if (!REDUCIDO.matches) len = Math.max(len, salida.p * geo.pieHero);
    geo.recorrido.setAttribute('stroke-dashoffset', geo.total - len);
    geo.recorridoNavy.setAttribute('stroke-dashoffset', geo.total - len);
    var p = geo.camino.getPointAtLength(len);
    var a = geo.camino.getPointAtLength(Math.max(0, len - 2));
    var b = geo.camino.getPointAtLength(Math.min(geo.total, len + 2));
    var ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    geo.flecha.setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ') rotate(' + ang + ')');
    geo.flecha.classList.toggle('en-navy', p.y >= geo.cierreTop);
    // En el cierre la flecha que se clava es la de la diana final: la de la línea desaparece al llegar
    geo.flecha.classList.toggle('is-fin', len >= geo.total - 1);
    geo.dianas.forEach(function (d) {
      var on = final || sonda >= d.y;
      if (on === d.on) return;
      d.on = on;
      d.g.classList.toggle('is-encendida', on);
      d.g.classList.remove('is-impacto');
      if (on && !REDUCIDO.matches) { void d.g.getBoundingClientRect(); d.g.classList.add('is-impacto'); }
    });
    if (final) encenderCierre();
  }

  function lanzarSalida() {
    if (REDUCIDO.matches) { salida.p = 1; return; }
    var t0 = null;
    function paso(t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / 600);
      salida.p = 1 - Math.pow(1 - k, 3);
      actualizarTrayectoria();
      if (k < 1) window.requestAnimationFrame(paso);
    }
    window.requestAnimationFrame(paso);
  }

  /* ---------- línea de vuelo y sección actual ---------- */
  function actualizarScroll() {
    var y = window.pageYOffset;
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    $('vuelo-linea').style.width = Math.min(100, y / max * 100) + '%';

    var sonda = window.innerHeight * 0.35;
    var actual = SECCIONES[0];
    SECCIONES.forEach(function (id) { if ($(id).getBoundingClientRect().top <= sonda) actual = id; });
    $('vuelo').classList.toggle('is-final', actual === 'contacto');
    Array.prototype.forEach.call(document.querySelectorAll('[data-nav]'), function (a) {
      if (a.getAttribute('data-nav') === actual) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    actualizarTrayectoria();
  }

  /* ---------- recorrido guiado ---------- */
  var recorrido = { activo: false, timers: [], paradas: [] };
  var EVENTOS_CANCELAR = ['wheel', 'touchstart', 'keydown', 'pointerdown'];

  function limpiarResalte() {
    Array.prototype.forEach.call(document.querySelectorAll('.is-resalte'), function (n) { n.classList.remove('is-resalte'); });
  }
  function terminarRecorrido() {
    if (!recorrido.activo) return;
    recorrido.activo = false;
    recorrido.timers.forEach(clearTimeout);
    recorrido.timers = [];
    EVENTOS_CANCELAR.forEach(function (ev) { window.removeEventListener(ev, terminarRecorrido, true); });
    limpiarResalte();
    $('recorrido-barra').hidden = true;
  }
  function iniciarRecorrido() {
    if (recorrido.activo) return;
    recorrido.activo = true;
    // Una parada por sección y una por cada caso de éxito (su borde superior queda a 96 px de la ventana)
    recorrido.paradas = [];
    SECCIONES.slice(1).forEach(function (id) {
      var sec = $(id);
      recorrido.paradas.push({ nodo: sec, marca: sec.querySelector('.resaltable'), margen: NAV_H, nombre: nombre(id) });
      if (id === 'tiradas') {
        casos.forEach(function (c, i) {
          var art = $('caso-' + c.id);
          if (art) recorrido.paradas.push({ nodo: art, marca: art.querySelector('.caso-meta'), margen: 96, nombre: nombre(id) + ' · ' + clienteCorto(c) });
        });
      }
    });
    var barra = $('recorrido-barra');
    var puntos = $('recorrido-dianas');
    if (!puntos) { puntos = el('span', { class: 'recorrido-dianas', id: 'recorrido-dianas', 'aria-hidden': 'true' }); barra.insertBefore(puntos, barra.firstChild); }
    vaciar(puntos);
    recorrido.paradas.forEach(function () { puntos.appendChild(el('i')); });
    barra.hidden = false;
    EVENTOS_CANCELAR.forEach(function (ev) { window.addEventListener(ev, terminarRecorrido, { capture: true, passive: true }); });
    function paso(i) {
      if (!recorrido.activo) return;
      if (i >= recorrido.paradas.length) { terminarRecorrido(); return; }
      var parada = recorrido.paradas[i];
      $('recorrido-texto').textContent = fmt(UI.recorrido, { n: i + 1, m: recorrido.paradas.length, nombre: parada.nombre });
      Array.prototype.forEach.call($('recorrido-dianas').children, function (p, k) {
        p.className = k < i ? 'hecha' : (k === i ? 'actual' : '');
      });
      var top = parada.nodo.getBoundingClientRect().top + window.pageYOffset - parada.margen;
      window.scrollTo({ top: Math.max(0, top), behavior: REDUCIDO.matches ? 'auto' : 'smooth' });
      var marca = parada.marca;
      recorrido.timers.push(setTimeout(function () { if (marca) marca.classList.add('is-resalte'); }, 500));
      recorrido.timers.push(setTimeout(function () { if (marca) marca.classList.remove('is-resalte'); }, 1700));
      recorrido.timers.push(setTimeout(function () { paso(i + 1); }, 2400));
    }
    paso(0);
  }

  /* ---------- arranque ---------- */
  renderHero();
  renderSectores();
  renderArco();
  if (SECCIONES.indexOf('tiradas') >= 0) renderTiradas();
  if (SECCIONES.indexOf('carcaj') >= 0) renderCarcaj();
  renderContacto();
  renderPie();
  renderNav();
  observarDisparos();

  $('arco').classList.add('sec-tint');
  $('carcaj').classList.add('sec-tint');
  $('contacto').classList.add('sobre-navy');

  $('recorrido-parar').textContent = UI.parar;
  $('recorrido-btn').addEventListener('click', iniciarRecorrido);

  var temporizador = null;
  function recalcular() { clearTimeout(temporizador); temporizador = setTimeout(function () { construirTrayectoria(); actualizarScroll(); }, 150); }
  window.addEventListener('resize', recalcular);
  window.addEventListener('load', function () { construirTrayectoria(); actualizarScroll(); lanzarSalida(); });
  document.addEventListener('load', recalcular, true); // carga de cada imagen
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(recalcular);
  if (window.ResizeObserver) new ResizeObserver(recalcular).observe(pagina);

  var pendiente = false;
  window.addEventListener('scroll', function () {
    if (pendiente) return;
    pendiente = true;
    window.requestAnimationFrame(function () { pendiente = false; actualizarScroll(); });
  }, { passive: true });

  construirTrayectoria();
  actualizarScroll();
})();
