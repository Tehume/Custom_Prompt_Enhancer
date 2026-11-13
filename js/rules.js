// Reglas de mejora. Cada regla recibe el texto y devuelve { text, changes, warnings? }.
// Cada cambio: { before, after, note } (note en español, para la interfaz).
// Las reglas son conservadoras: si dudan, no tocan el texto y, como mucho, avisan.

import { splitSegments, joinSegments, normalize } from "./segments.js";
import { FILLERS } from "./data/fillers.js";
import { BOORU } from "./data/booru.js";
import { NEGATIONS } from "./data/negations.js";
import { CONFLICTS } from "./data/conflicts.js";

const FILLER_SET = new Set(FILLERS);
const isList = text => splitSegments(text).length >= 2;
const wordCount = s => s.trim().split(/\s+/).filter(Boolean).length;

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

const translateBooru = {
  id: "booru",
  label: "Traducir etiquetas booru",
  description: "1girl, solo, looking at viewer… → texto normal («a young woman», «alone»).",
  apply(text) {
    const changes = [];
    if (!isList(text)) return { text, changes };
    const segs = splitSegments(text).map(seg => {
      const key = normalize(seg).replace(/_/g, " ");
      const to = BOORU[key];
      if (!to || to === key) return seg;
      changes.push({ before: seg.trim(), after: to, note: "Etiqueta booru traducida" });
      return " " + to;
    });
    return { text: changes.length ? joinSegments(segs) : text, changes };
  },
};

const removeFillers = {
  id: "fillers",
  label: "Quitar muletillas de calidad",
  description: "masterpiece, best quality, 8k…: no describen nada visible y gastan tokens. " +
    "Su efecto en FLUX no está verificado.",
  apply(text) {
    const changes = [];
    if (!isList(text)) return { text, changes };
    const kept = splitSegments(text).filter(seg => {
      if (!FILLER_SET.has(normalize(seg))) return true;
      changes.push({ before: seg.trim(), after: "", note: "Muletilla eliminada" });
      return false;
    });
    return { text: changes.length ? joinSegments(kept) : text, changes };
  },
};

const NEG_RULES = NEGATIONS.map(n => ({ ...n, rx: new RegExp("\\b(?:" + n.re + ")\\b", "i") }));

const positiveNegations = {
  id: "negations",
  label: "Negaciones en positivo",
  description: "«no makeup» → «a bare face», «no shoes» → «barefoot»; «no text», «no " +
    "watermark» se quitan. Las que no conoce, las avisa.",
  apply(text) {
    const changes = [];
    const segs = splitSegments(text);
    const out = [];
    for (let seg of segs) {
      let drop = false;
      for (const n of NEG_RULES) {
        const m = seg.match(n.rx);
        if (!m) continue;
        const whole = normalize(seg) === normalize(m[0]);
        if (n.replace) {
          seg = seg.replace(n.rx, n.replace);
          changes.push({ before: m[0], after: n.replace, note: "Negación en positivo" });
        } else if (whole) {
          drop = true;
          changes.push({ before: m[0], after: "", note: "Negación sin equivalente visual eliminada" });
          break;
        }
      }
      if (!drop) out.push(seg);
    }
    return { text: changes.length ? out.join(",").replace(/^\s+/, "") : text, changes };
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
    const kept = splitSegments(text).filter(seg => {
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

const CONFLICT_RULES = CONFLICTS.map(g => ({
  ...g,
  options: g.options.map(o => ({ ...o, rx: new RegExp(o.re, "gi") })),
}));

// Busca opciones excluyentes. Se queda con la primera que aparece; las demás se quitan si
// ocupan un segmento corto (≤ 4 palabras) y, si no, se avisa.
const contradictions = {
  id: "conflicts",
  label: "Resolver contradicciones",
  description: "Si hay opciones excluyentes (primer plano y plano entero, de día y de noche…), " +
    "se queda con la primera. Lo que no puede quitar sin romper una frase, lo avisa.",
  apply(text) {
    const changes = [];
    const warnings = [];
    let segs = splitSegments(text);
    for (const g of CONFLICT_RULES) {
      const hits = [];
      segs.forEach((seg, si) => {
        for (const o of g.options) {
          for (const m of seg.matchAll(o.rx)) hits.push({ si, pos: m.index, option: o.name, match: m[0] });
        }
      });
      if (new Set(hits.map(h => h.option)).size < 2) continue;
      hits.sort((a, b) => a.si - b.si || a.pos - b.pos);
      const keep = hits[0].option;
      const drop = new Set();
      const unresolved = [];
      for (const h of hits) {
        if (h.option === keep) continue;
        const keepInSame = hits.some(k => k.si === h.si && k.option === keep);
        if (!keepInSame && wordCount(segs[h.si]) <= 4) drop.add(h.si);
        else unresolved.push(h.match);
      }
      for (const si of drop) {
        changes.push({ before: segs[si].trim(), after: "", note: `Contradicción de ${g.label}: se mantiene «${hits[0].match}»` });
      }
      segs = segs.filter((_, si) => !drop.has(si));
      if (unresolved.length) {
        warnings.push({
          id: "conflict-" + g.id,
          text: `Contradicción de ${g.label}: «${hits[0].match}» frente a ` +
            unresolved.map(u => "«" + u + "»").join(", ") + ". Elige una.",
        });
      }
    }
    return { text: changes.length ? joinSegments(segs) : text, changes, warnings };
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

export const RULES = [stripWeights, translateBooru, removeFillers, positiveNegations, dedupe, contradictions, tidy];

// ---------------------------------------------------------------------------------------
// Avisos generales: no cambian el texto.

const NEGATION = /\b(no|without|not|never)\s+[\w-]+(?:\s+[\w-]+)?/gi;

export function findWarnings(text) {
  const warnings = [];
  const negs = [...text.matchAll(NEGATION)].map(m => m[0]);
  if (negs.length) {
    warnings.push({
      id: "negation",
      text: "Negaciones en el prompt: " + negs.map(n => "«" + n + "»").join(", ") +
        ". Nombrar algo, aunque sea para negarlo, puede hacer que aparezca. Describe lo que " +
        "sí quieres.",
    });
  }
  return warnings;
}
