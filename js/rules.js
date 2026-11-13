// Reglas de mejora. Cada regla recibe el texto y devuelve { text, changes }.
// Cada cambio: { rule, before, after, note } (note en español, para la interfaz).
// Las reglas son conservadoras: si dudan, no tocan el texto.

import { splitSegments, joinSegments, normalize } from "./segments.js";
import { FILLERS } from "./data/fillers.js";

const FILLER_SET = new Set(FILLERS);

// (palabra:1.3) → palabra; ((palabra)) o (palabra) como segmento completo → palabra.
const stripWeights = {
  id: "weights",
  label: "Quitar pesos de Stable Diffusion",
  description: "(texto:1.3), ((texto)): FLUX no interpreta esta sintaxis; los paréntesis y " +
    "números se leen como texto.",
  apply(text) {
    const changes = [];
    let out = text.replace(/\(+\s*([^():]+?)\s*:\s*\d+(?:\.\d+)?\s*\)+/g, (m, inner) => {
      changes.push({ before: m, after: inner, note: "Peso eliminado" });
      return inner;
    });
    const segs = splitSegments(out).map(seg => {
      const m = seg.match(/^(\s*)\(+([^()]+)\)+(\s*)$/);
      if (!m) return seg;
      changes.push({ before: seg.trim(), after: m[2].trim(), note: "Paréntesis de énfasis eliminados" });
      return m[1] + m[2].trim() + m[3];
    });
    if (changes.length) out = segs.join(",");
    return { text: out, changes };
  },
};

const removeFillers = {
  id: "fillers",
  label: "Quitar muletillas de calidad",
  description: "masterpiece, best quality, 8k…: no describen nada visible y gastan tokens. " +
    "Su efecto en FLUX no está verificado.",
  apply(text) {
    const changes = [];
    const segs = splitSegments(text);
    if (segs.length < 2) return { text, changes };
    const kept = segs.filter(seg => {
      if (!FILLER_SET.has(normalize(seg))) return true;
      changes.push({ before: seg.trim(), after: "", note: "Muletilla eliminada" });
      return false;
    });
    return { text: changes.length ? joinSegments(kept) : text, changes };
  },
};

const dedupe = {
  id: "dedupe",
  label: "Quitar repeticiones",
  description: "Segmentos repetidos («short beard, short beard») y palabras duplicadas " +
    "seguidas («very very»).",
  apply(text) {
    const changes = [];
    const seen = new Set();
    const segs = splitSegments(text);
    const kept = segs.filter(seg => {
      const key = normalize(seg);
      if (!key) return true;
      if (seen.has(key)) {
        changes.push({ before: seg.trim(), after: "", note: "Segmento repetido" });
        return false;
      }
      seen.add(key);
      return true;
    });
    let out = changes.length ? joinSegments(kept) : text;
    out = out.replace(/\b(\w+)(\s+\1\b)+/gi, (m, w) => {
      changes.push({ before: m, after: w, note: "Palabra duplicada" });
      return w;
    });
    return { text: out, changes };
  },
};

const tidy = {
  id: "tidy",
  label: "Ordenar espacios y comas",
  description: "Espacios dobles, comas sobrantes, espacio antes de signos.",
  apply(text) {
    const out = text
      .replace(/[ \t]+/g, " ")
      .replace(/\s+([,.;:!?])/g, "$1")
      .replace(/,(\s*,)+/g, ",")
      .replace(/([,.;:!?])(?=[^\s\d,.;:!?)}\]])/g, "$1 ")
      .replace(/^[\s,]+|[\s,]+$/g, "");
    const changes = out === text ? [] : [{ before: "", after: "", note: "Espacios y comas normalizados" }];
    return { text: out, changes };
  },
};

export const RULES = [stripWeights, removeFillers, dedupe, tidy];

// ---------------------------------------------------------------------------------------
// Avisos: no cambian el texto, señalan lo que las reglas aún no saben arreglar.

const NEGATION = /\b(no|without|not|never)\s+[\w-]+(?:\s+[\w-]+)?/gi;

export function findWarnings(text) {
  const warnings = [];
  const negs = [...text.matchAll(NEGATION)].map(m => m[0]);
  if (negs.length) {
    warnings.push({
      id: "negation",
      text: "Negaciones en el prompt: " + negs.map(n => "«" + n + "»").join(", ") +
        ". Nombrar algo, aunque sea para negarlo, puede hacer que aparezca. Describe lo que " +
        "sí quieres (p. ej. «bare face» en vez de «no makeup»).",
    });
  }
  return warnings;
}
