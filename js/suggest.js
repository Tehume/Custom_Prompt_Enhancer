// Sugerencias asistidas: categorías que faltan y términos vagos. No cambian el prompt por sí
// solas; la interfaz las aplica al texto de entrada cuando el usuario elige una.

import { MISSING, VAGUE } from "./data/descriptors.js";
import { categoryOf } from "./categorize.js";
import { looksLikeProse, splitSegments } from "./segments.js";

const MISSING_RULES = MISSING.map(m => ({ ...m, rx: new RegExp(m.check, "i") }));
const VAGUE_RULES = VAGUE.map(v => ({ ...v, rx: new RegExp("\\b" + v.re + "\\b", "i") }));

const hasSubject = text =>
  splitSegments(text).some(s => categoryOf(s) === "subject") || /\b(?:he|she|they)\b/i.test(text);

// Devuelve [{ kind: "missing"|"vague", id, label, phrase?, options }].
export function suggest(text) {
  if (!text.trim()) return [];
  const out = [];
  for (const v of VAGUE_RULES) {
    const m = text.match(v.rx);
    if (m) out.push({ kind: "vague", id: "vague-" + v.label, label: v.label, phrase: m[0], options: v.options });
  }
  if (hasSubject(text)) {
    for (const m of MISSING_RULES) {
      if (!m.rx.test(text)) out.push({ kind: "missing", id: m.id, label: m.label, options: m.options });
    }
  }
  return out;
}

// Añade un descriptor al texto: como segmento en listas, como frase en prosa.
export function addDescriptor(text, descriptor) {
  const t = text.trimEnd();
  if (!t) return descriptor;
  if (looksLikeProse(t) || /[.!?]$/.test(t)) {
    const sentence = descriptor.charAt(0).toUpperCase() + descriptor.slice(1) + ".";
    return (/[.!?]$/.test(t) ? t : t + ".") + " " + sentence;
  }
  return t.replace(/[,\s]+$/, "") + ", " + descriptor;
}

// Sustituye la primera aparición de `phrase` (sin distinguir mayúsculas).
export function replacePhrase(text, phrase, replacement) {
  const i = text.toLowerCase().indexOf(phrase.toLowerCase());
  return i < 0 ? text : text.slice(0, i) + replacement + text.slice(i + phrase.length);
}
