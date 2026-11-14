// Traducción ES→EN en el navegador con OPUS-MT (Transformers.js), con glosario previo.
// El modelo (~110 MB) se descarga solo cuando el usuario pide traducir.

import { GLOSSARY } from "./data/glossary.js";
import { MT_WRONG } from "./data/glossary-mt.js";
import { splitSegments, looksLikeProse } from "./segments.js";
import { splitSentences } from "./categorize.js";

const TRANSFORMERS_URL = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1/dist/transformers.min.js";
export const MT_MODEL = "Xenova/opus-mt-es-en";
export const MT_MB = 110;

// --- Detección de español --------------------------------------------------------------

const ES_WORDS = new Set(("de la el los las un una unos unas con y en del al por para su sus " +
  "que es muy pelo ojos mujer hombre chica chico sentada sentado lleva luz fondo sobre entre " +
  "cara piel manos brazos piernas vestido camisa").split(" "));
const EN_WORDS = new Set(("the a an with and in of on at to her his she he wearing hair eyes " +
  "woman man girl boy light background").split(" "));

// ¿Parece español? Cuenta palabras frecuentes de cada idioma (y letras con tilde o ñ).
export function looksSpanish(text) {
  const words = text.toLowerCase().match(/[a-záéíóúüñ]+/g) || [];
  if (words.length < 3) return false;
  let es = 0;
  let en = 0;
  for (const w of words) {
    if (ES_WORDS.has(w) || /[áéíóúñ]/.test(w)) es++;
    if (EN_WORDS.has(w)) en++;
  }
  return es >= 2 && es > en * 1.5;
}

// --- Glosario --------------------------------------------------------------------------

// Quita tildes para comparar sin distinguirlas (la ñ también: «moño» = «mono»). Con
// caracteres precompuestos (lo normal), el texto plegado tiene la misma longitud.
const fold = s => s.normalize("NFC").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const RULES = GLOSSARY.map(g => ({ ...g, rx: new RegExp("\\b(?:" + g.es + ")\\b", "gi") }));

// Términos del glosario presentes en un trozo de texto (sin distinguir tildes).
export function findTerms(text) {
  const folded = fold(text.normalize("NFC"));
  const found = [];
  const covered = []; // tramos ya cubiertos por un término más largo (el glosario va de largo a corto)
  for (const g of RULES) {
    for (const m of folded.matchAll(g.rx)) {
      const a = m.index;
      const b = a + m[0].length;
      if (covered.some(([x, y]) => a >= x && b <= y)) continue;
      covered.push([a, b]);
      const en = g.en.replace(/\$(\d)/g, (_, i) => m[+i] ?? "");
      found.push({ g, es: text.slice(m.index, m.index + m[0].length), en, whole: m[0].length === folded.trim().length });
    }
  }
  return found;
}

const escapeRx = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Corrige en la traducción las versiones erróneas conocidas de los términos del original.
// Devuelve { text, applied }; applied: [{ es, en, how: "corregido" | "bien" | "sin corregir" }].
export function fixTranslation(source, translated) {
  let out = translated;
  const applied = [];
  for (const t of findTerms(source)) {
    const enRx = new RegExp("\\b" + escapeRx(t.en) + "\\b", "i");
    const wrongs = [...(MT_WRONG[t.g.es] || [])].sort((a, b) => b.length - a.length);
    let fixed = false;
    for (const w of wrongs) {
      const rx = new RegExp("\\b" + escapeRx(w) + "\\b", "i");
      if (rx.test(out)) { out = out.replace(rx, t.en); fixed = true; break; }
    }
    applied.push({ es: t.es, en: t.en, how: fixed ? "corregido" : enRx.test(out) ? "bien" : "sin corregir" });
  }
  return { text: out, applied };
}

// --- Traducción ------------------------------------------------------------------------

let translator = null;

export async function loadTranslator(onProgress = () => {}) {
  if (translator) return translator;
  const lib = await import(TRANSFORMERS_URL);
  const files = {};
  translator = await lib.pipeline("translation", MT_MODEL, {
    dtype: "q8",
    progress_callback: p => {
      if (p.status !== "progress" || !p.total) return;
      files[p.file] = [p.loaded, p.total];
      let a = 0;
      let b = 0;
      for (const [l, t] of Object.values(files)) { a += l; b += t; }
      onProgress(a, b);
    },
  });
  return translator;
}

export const translatorLoaded = () => !!translator;

// Traduce por trozos (frases en prosa, segmentos en listas) para conservar la estructura.
// Un trozo que es solo un término del glosario se sustituye sin pasar por el modelo; el
// resto se traduce y luego se corrige con el glosario. `tr` permite inyectar el traductor.
export async function translate(text, tr = null) {
  tr ||= await loadTranslator();
  const prose = looksLikeProse(text) || /[.!?]\s*$/.test(text.trim());
  const pieces = (prose ? splitSentences(text) : splitSegments(text)).map(p => p.trim()).filter(Boolean);
  const out = [];
  const applied = [];
  for (const p of pieces) {
    const terms = findTerms(p);
    if (terms.length === 1 && terms[0].whole) {
      out.push(terms[0].en);
      applied.push({ es: terms[0].es, en: terms[0].en, how: "directo" });
      continue;
    }
    const [r] = await tr(p, { max_new_tokens: 256 });
    const fixed = fixTranslation(p, r.translation_text.trim());
    out.push(fixed.text);
    applied.push(...fixed.applied);
  }
  return { text: fixPronouns(out.join(prose ? " " : ", ")), applied };
}

// «su» se traduce a menudo como «your», que no tiene sentido en un prompt de imagen. Se
// cambia por her/his si el texto habla claramente de una mujer o de un hombre, y si no por
// their.
export function fixPronouns(text) {
  if (!/\byour\b/i.test(text)) return text;
  const fem = /\b(?:woman|women|girl|girls|she|her|lady|mother|wife)\b/i.test(text);
  const masc = /\b(?:man|men|boy|boys|he|his|him|gentleman|father|husband)\b/i.test(text);
  const pr = fem && !masc ? "her" : masc && !fem ? "his" : "their";
  return text.replace(/\byour\b/g, pr).replace(/\bYour\b/g, pr[0].toUpperCase() + pr.slice(1));
}
