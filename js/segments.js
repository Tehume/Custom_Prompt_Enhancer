// Utilidades para trabajar con prompts como lista de segmentos separados por comas.
// Las comas dentro de paréntesis o llaves ({a|b} de Perchance) no cortan el segmento.

export function splitSegments(text) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (const ch of text) {
    if (ch === "(" || ch === "{" || ch === "[") depth++;
    else if ((ch === ")" || ch === "}" || ch === "]") && depth > 0) depth--;
    if (ch === "," && depth === 0) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

export function joinSegments(segments) {
  return segments.map(s => s.trim()).filter(Boolean).join(", ");
}

// Forma normalizada para comparar segmentos (minúsculas, sin espacios extra ni punto final).
export function normalize(segment) {
  return segment.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.;:!]+$/, "");
}

// ¿Está ya escrito en prosa? Media de palabras por segmento alta y al menos una frase
// terminada en punto. Sirve para no pasar al LLM prompts que ya están bien redactados.
export function looksLikeProse(text) {
  const segs = splitSegments(text).map(s => s.trim()).filter(Boolean);
  if (!segs.length) return false;
  const words = segs.reduce((n, s) => n + s.split(/\s+/).length, 0);
  return words / segs.length >= 6 && /[a-z][.!?](\s|$)/i.test(text);
}
