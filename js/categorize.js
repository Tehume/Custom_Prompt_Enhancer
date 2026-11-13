// Clasifica segmentos y frases por categoría (sujeto, pose, ropa, entorno…) y reordena
// por importancia. Ver js/data/categories.js.

import { CATEGORIES, ORDER } from "./data/categories.js";

const RULES = CATEGORIES.map(c => ({ ...c, rx: new RegExp(c.re, "i") }));
const RANK = Object.fromEntries(ORDER.map((id, i) => [id, i]));

// Primera categoría (por prioridad de detección) que encaja, o null.
export function categoryOf(text) {
  for (const c of RULES) if (c.rx.test(text)) return c.id;
  return null;
}

export const labelOf = id => CATEGORIES.find(c => c.id === id)?.label || id;

// Ordena segmentos de una lista. Los segmentos sin categoría van con el anterior (p. ej.
// «laughing» tras una interacción). Orden estable dentro de cada categoría.
export function orderSegments(segments) {
  let prev = "subject";
  const tagged = segments.map((s, i) => {
    const cat = categoryOf(s) || prev;
    prev = cat;
    return { s, i, cat };
  });
  tagged.sort((a, b) => RANK[a.cat] - RANK[b.cat] || a.i - b.i);
  return tagged;
}

// En prosa no se reordenan las frases sobre personas (los pronombres dependen del orden);
// solo se mueven al final las de escena (entorno, luz, cámara, estilo) que no mencionan a
// nadie.
const PEOPLE = /\b(?:he|she|they|him|her|his|hers|their|them|woman|women|man|men|girl|boy|person|people|child|couple|friends?)\b/i;
const SCENE = new Set(["setting", "light", "camera", "style"]);

export function splitSentences(text) {
  return text.match(/[^.!?]+(?:[.!?]+|$)\s*/g) || [text];
}

const SUBJECT_RX = RULES.find(c => c.id === "subject").rx;
const SCENE_RULES = RULES.filter(c => SCENE.has(c.id));

export function isSceneSentence(sentence) {
  if (PEOPLE.test(sentence) || SUBJECT_RX.test(sentence)) return false;
  return SCENE_RULES.some(c => c.rx.test(sentence));
}
