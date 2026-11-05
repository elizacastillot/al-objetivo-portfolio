#!/usr/bin/env node
// Revisa estructura, datos y enlaces del portafolio. Sin dependencias.
// Uso: node scripts/check-site.mjs            → modo normal (los datos de ejemplo son aviso)
//      node scripts/check-site.mjs --strict   → antes de publicar (los datos de ejemplo bloquean)

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import vm from 'node:vm';

const ROOT = resolve(process.cwd());
const SITE = join(ROOT, 'site');
const STRICT = process.argv.includes('--strict');
const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => (STRICT ? errors : warnings).push(m);

// 1. Cargar datos en un "window" simulado
const sandbox = {};
sandbox.window = sandbox; // como en el navegador: window es el objeto global
vm.createContext(sandbox);
const dataDir = join(SITE, 'data');
const dataFiles = existsSync(dataDir) ? readdirSync(dataDir).filter((f) => f.endsWith('.js')).sort() : [];
for (const f of dataFiles) {
  try { vm.runInContext(readFileSync(join(dataDir, f), 'utf8'), sandbox, { filename: f }); }
  catch (e) { fail(`data/${f}: error de sintaxis → ${e.message}`); }
}
const AO = sandbox.window.AO || {};

// 2. index.html
const indexPath = join(SITE, 'index.html');
let html = '';
if (!existsSync(indexPath)) {
  fail('Falta site/index.html (pendiente de la primera implementación)');
} else {
  html = readFileSync(indexPath, 'utf8');
  if (!/<html[^>]*lang=["']es["']/i.test(html)) fail('index.html: falta lang="es"');
  if (!/<title>[^<]+<\/title>/i.test(html)) fail('index.html: falta <title>');
  if (!/<meta[^>]+name=["']description["'][^>]+content=["'][^"']{50,}/i.test(html)) fail('index.html: falta meta description (50+ caracteres)');
  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) fail('index.html: falta meta viewport');
  if (!/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) fail('index.html: falta <meta name="robots" content="noindex, nofollow"> (el portafolio es solo por enlace)');
  if (existsSync(join(SITE, 'robots.txt')) || existsSync(join(SITE, 'sitemap.xml'))) fail('site/: no debe haber robots.txt ni sitemap.xml (acceso solo por enlace)');
  if (/youtube\.com\/embed/i.test(html) && !/youtube-nocookie\.com/i.test(html)) warn('index.html: usa youtube-nocookie.com para los vídeos');
  for (const m of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=["'](https?:\/\/[^"']+)["']/gi)) {
    fail(`index.html: recurso externo ${m[1]} (envía datos de visitantes a terceros; alójalo en site/)`);
  }
  if (/<iframe\b[^>]*\bsrc=["']https?:/i.test(html)) fail('index.html: iframe cargado de inicio; los vídeos solo se insertan al pulsar el póster');
  for (const id of ['hero', 'sectores', 'arco', 'tiradas', 'carcaj', 'contacto']) {
    if (!new RegExp(`id=["']${id}["']`).test(html)) fail(`index.html: falta la sección #${id}`);
  }
  const ids = new Set([...html.matchAll(/id=["']([^"']+)["']/g)].map((m) => m[1]));
  for (const m of html.matchAll(/href=["']#([^"']+)["']/g)) if (!ids.has(m[1])) fail(`index.html: ancla rota #${m[1]}`);
  for (const m of html.matchAll(/(?:src|href)=["'](?!https?:|mailto:|#|data:)([^"']+)["']/g)) {
    const p = m[1].split(/[?#]/)[0];
    if (p && !existsSync(join(SITE, p))) fail(`index.html: archivo no encontrado ${p}`);
  }
  for (const m of html.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/gi)) fail(`index.html: <img> sin alt → ${m[0].slice(0, 60)}`);
  if (/href=["']http:\/\//i.test(html)) fail('index.html: hay enlaces http:// (usa https)');
}

// 3. Datos
const allText = JSON.stringify(AO);
if (!allText.includes('mailto:info@alobjetivo.com')) {
  fail('Falta el CTA de cierre a mailto:info@alobjetivo.com');
}
const checkMedia = (owner, media = []) => media.forEach((m, i) => {
  if (m.tipo === 'video') { if (!m.videoId) warn(`${owner}: vídeo ${i + 1} sin videoId`); return; }
  if (!m.src) { warn(`${owner}: medio ${i + 1} sin archivo todavía`); return; }
  if (!existsSync(join(SITE, m.src))) fail(`${owner}: no existe ${m.src}`);
  if (!m.alt || !m.alt.trim()) fail(`${owner}: ${m.src} sin texto alternativo`);
});
const checkCta = (owner, cta) => {
  if (!cta) return;
  const words = (cta.texto || '').trim().split(/\s+/).filter(Boolean).length;
  if (words > 3) fail(`${owner}: CTA "${cta.texto}" tiene ${words} palabras (máximo 3)`);
  if (cta.url && !/^(https:\/\/|mailto:)/.test(cta.url)) fail(`${owner}: la URL del CTA debe ser https o mailto`);
  if (!cta.url) warn(`${owner}: CTA sin URL todavía`);
};
const checkEstado = (owner, item) => {
  if (!['ejemplo', 'borrador', 'real'].includes(item.estado)) fail(`${owner}: estado inválido "${item.estado}"`);
  if (item.estado === 'ejemplo') warn(`${owner}: contenido de EJEMPLO (inventado)`);
  if (item.estado === 'borrador' && STRICT) fail(`${owner}: sigue en borrador`);
};

(AO.casos || []).forEach((c) => { const o = `caso ${c.id}`; checkEstado(o, c); checkMedia(o, c.media); checkCta(o, c.cta);
  if (AO.sectores && !AO.sectores.some((s) => s.id === c.sector)) fail(`${o}: sector "${c.sector}" no existe en AO.sectores`); });
(AO.carcaj || []).forEach((p) => { const o = `carcaj ${p.id}`; checkEstado(o, p); checkMedia(o, p.media);
  if (!['sm', 'md', 'lg'].includes(p.tamano)) fail(`${o}: tamano debe ser sm, md o lg`);
  if (AO.carcajCategorias && !AO.carcajCategorias.includes(p.categoria)) fail(`${o}: categoría "${p.categoria}" no está en AO.carcajCategorias`); });
(AO.marcas || []).forEach((m) => {
  if (m.logo && !existsSync(join(SITE, m.logo))) fail(`marca ${m.id}: no existe ${m.logo}`);
  if (!m.logo) warn(`marca ${m.id}: sin logo (se mostrará monograma)`);
  if (!m.sectorConfirmado) warn(`marca ${m.id}: sector sin confirmar por Elizabeth`);
  (m.sectores || []).forEach((s) => { if (AO.sectores && !AO.sectores.some((x) => x.id === s)) fail(`marca ${m.id}: sector "${s}" no existe`); });
});
if (AO.textos) {
  // El CTA de la portada lanza el recorrido guiado: no lleva URL, solo se comprueba su longitud.
  checkCta('textos.hero', { ...AO.textos.hero?.cta, url: 'https://recorrido' });
  checkCta('textos.contacto (principal)', AO.textos.contacto?.ctaPrincipal);
}
if (allText.includes('[DATO PENDIENTE')) warn('Hay campos con [DATO PENDIENTE] en los datos');
// Excepción aprobada (2026-11-03): APF puede nombrar sus propias redes, Instagram incluido
if (/instagram/i.test(allText.replaceAll('(Instagram, X y Facebook)', '').replaceAll('para Instagram, Facebook, X, LinkedIn, YouTube', ''))) fail('Los datos mencionan Instagram');
if (/freelance|agencia de marketing/i.test(allText)) warn('Los datos mencionan "freelance" o "agencia": revisa el discurso único');

// 4. Privacidad y peso de todos los archivos de site/
if (existsSync(SITE)) {
  const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
  for (const f of walk(SITE)) {
    const rel = relative(ROOT, f);
    const kb = statSync(f).size / 1024;
    if (STRICT && kb > 500) fail(`${rel} pesa ${Math.round(kb)} KB (máx. 500 KB; optimiza o pásalo a WebP)`);
    if (/\.(css|js|html)$/i.test(f)) {
      const txt = readFileSync(f, 'utf8');
      if (/fonts\.(googleapis|gstatic)\.com/i.test(txt)) fail(`${rel}: usa Google Fonts; aloja Kanit en site/assets/fonts/`);
      if (/@import\s+url\(\s*["']?https?:/i.test(txt) || /url\(\s*["']?https?:\/\//i.test(txt)) fail(`${rel}: carga recursos externos desde CSS`);
      if (/google-analytics|googletagmanager|gtag\(|fbq\(|hotjar|clarity\.ms/i.test(txt)) fail(`${rel}: analítica o píxel de seguimiento sin permiso`);
      const KEY_PATTERNS = [
        [/AIza[0-9A-Za-z_\-]{35}/, 'clave de Google'],
        [/ya29\.[0-9A-Za-z_\-]{20,}|1\/\/0[0-9A-Za-z_\-]{20,}|GOCSPX-[0-9A-Za-z_\-]{10,}/, 'credencial OAuth de Google'],
        [/sk-(?:ant-|proj-)?[A-Za-z0-9_\-]{20,}/, 'clave de OpenAI o Anthropic'],
        [/gh[pousr]_[A-Za-z0-9]{36,}/, 'token de GitHub'],
        [/(?:sk|rk)_live_[A-Za-z0-9]{20,}/, 'clave de Stripe'],
        [/xox[abpr]-[A-Za-z0-9-]{10,}/, 'token de Slack'],
        [/AKIA[0-9A-Z]{16}/, 'clave de AWS'],
        [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'clave privada'],
        [/(?:api[_-]?key|secret|token|password|contraseña)\s*[:=]\s*["'][^"']{12,}["']/i, 'posible clave o contraseña']
      ];
      for (const [re, what] of KEY_PATTERNS) if (re.test(txt)) fail(`${rel}: contiene una ${what}. Nunca pongas claves en site/: cualquier visitante las vería`);
    }
    if (/\.(jpe?g|png|webp)$/i.test(f)) {
      const buf = readFileSync(f);
      const head = buf.subarray(0, Math.min(buf.length, 65536)).toString('latin1');
      if (/Exif\0\0|eXIf|EXIF|GPSInfo/.test(head)) fail(`${rel}: la imagen conserva metadatos (EXIF/GPS); elimínalos`);
    }
    if (/\.svg$/i.test(f) && /<script|sodipodi:|inkscape:|xmlns:x=["']adobe:ns:meta/i.test(readFileSync(f, 'utf8'))) {
      fail(`${rel}: el SVG lleva scripts o metadatos de editor; límpialo`);
    }
  }
}

// Resultado
const print = (title, list, mark) => list.length && console.log(`${title} (${list.length})\n` + list.map((m) => `  ${mark} ${m}`).join('\n'));
print('Errores', errors, '✗');
print('Avisos', warnings, '!');
if (errors.length) { console.log(`\n✗ check-site${STRICT ? ' --strict' : ''}: no apto`); process.exit(1); }
console.log(`\n✓ check-site${STRICT ? ' --strict' : ''}: correcto${warnings.length ? ' (con avisos)' : ''}`);
