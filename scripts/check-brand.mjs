#!/usr/bin/env node
// Revisa que site/ solo use la paleta y la tipografía de Al Objetivo.
// Uso:  node scripts/check-brand.mjs          → revisa todo site/
//       node scripts/check-brand.mjs --hook   → modo hook de Claude Code (lee el archivo editado por stdin)
// Sin dependencias. Sale con código 1 (o 2 en modo hook) si hay infracciones.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, relative, extname, sep } from 'node:path';

const ROOT = resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd());
const SITE = join(ROOT, 'site');
const EXT = new Set(['.html', '.css', '.js', '.svg']);

const PALETTE_HEX = ['d8851f', '1a2b32', '3d391f', 'ffffff', 'fff', '000000', '000'];
const PALETTE_RGB = ['216,133,31', '26,43,50', '61,57,31', '255,255,255', '0,0,0'];
const CSS_NAMED = ['gray','grey','silver','red','blue','green','yellow','orange','beige','ivory','cream','wheat','tan','navy','brown','gold','khaki','linen','snow','whitesmoke','gainsboro','lightgray','lightgrey','darkgray','darkgrey','dimgray','dimgrey','slategray','slategrey','floralwhite','oldlace','antiquewhite','seashell','cornsilk'];
const FORBIDDEN_WORDS = [/calibri/i, /montserrat/i, /instagram/i];

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : EXT.has(extname(p)) ? [p] : [];
  });
}

function check(file) {
  const issues = [];
  const isData = file.includes(`${sep}data${sep}`);
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const n = i + 1;
    for (const m of line.matchAll(/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g)) {
      // Ignora anclas tipo href="#arco" (no son hex puros) y entidades
      const hex = m[1].toLowerCase();
      if (!/^[0-9a-f]+$/.test(hex)) continue;
      const before = line.slice(Math.max(0, m.index - 6), m.index);
      if (/href=["']?$|=["']$/.test(before)) continue;
      const base = hex.length === 8 ? hex.slice(0, 6) : hex;
      if (!PALETTE_HEX.includes(base)) issues.push(`${n}: color fuera de paleta #${m[1]}`);
    }
    for (const m of line.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/gi)) {
      const t = `${m[1]},${m[2]},${m[3]}`;
      if (!PALETTE_RGB.includes(t)) issues.push(`${n}: color fuera de paleta rgb(${t})`);
    }
    if (/hsla?\(/i.test(line)) issues.push(`${n}: usa hsl(); usa la paleta en hex o rgba`);
    if (!isData) {
      const decl = line.match(/(?:color|background(?:-color)?|border(?:-[a-z]+)?|fill|stroke|outline(?:-color)?)\s*:\s*([^;}"']+)/i);
      if (decl) {
        for (const word of decl[1].toLowerCase().split(/[\s,()]+/)) {
          if (CSS_NAMED.includes(word)) issues.push(`${n}: color con nombre "${word}"; usa la paleta`);
        }
      }
      const ff = line.match(/font-family\s*:\s*([^;}"]+)/i);
      if (ff) {
        const fams = ff[1].split(',').map((s) => s.trim().replace(/['"]/g, '').toLowerCase());
        const bad = fams.filter((f) => !['kanit', 'sans-serif', 'inherit', 'system-ui'].includes(f));
        if (bad.length) issues.push(`${n}: tipografía no permitida (${bad.join(', ')}); solo Kanit`);
      }
    }
    // Excepción aprobada (2026-11-03): APF nombra sus propias redes
    const lineaRevisada = line.replaceAll('(Instagram, X y Facebook)', '').replaceAll('para Instagram, Facebook, X, LinkedIn, YouTube', '');
    for (const re of FORBIDDEN_WORDS) if (re.test(lineaRevisada)) issues.push(`${n}: mención prohibida (${re.source})`);
  });
  return issues;
}

async function readStdin() {
  let data = '';
  for await (const chunk of process.stdin) data += chunk;
  return data;
}

const hookMode = process.argv.includes('--hook');
let files;
if (hookMode) {
  let path = '';
  try { path = JSON.parse(await readStdin())?.tool_input?.file_path || ''; } catch { process.exit(0); }
  const abs = resolve(ROOT, path);
  if (!abs.startsWith(SITE + sep) || !EXT.has(extname(abs)) || !existsSync(abs)) process.exit(0);
  files = [abs];
} else {
  files = walk(SITE);
}

let total = 0;
const out = [];
for (const f of files) {
  const issues = check(f);
  if (issues.length) {
    total += issues.length;
    out.push(`✗ ${relative(ROOT, f)}`, ...issues.map((s) => `   ${s}`));
  }
}

if (total) {
  const msg = [`Marca Al Objetivo: ${total} infracción(es)`, ...out,
    'Paleta: #D8851F #1A2B32 #3D391F #FFFFFF #000000 (y sus rgba). Tipografía: solo Kanit.'].join('\n');
  if (hookMode) { console.error(msg); process.exit(2); }
  console.log(msg); process.exit(1);
}
if (!hookMode) console.log(`✓ Marca correcta en ${files.length} archivo(s) de site/`);
