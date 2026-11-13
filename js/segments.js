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
