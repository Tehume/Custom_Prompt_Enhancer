// Detecta palabras de contenido que el LLM ha añadido y no estaban en la entrada
// (posibles invenciones). Es una heurística: compara raíces simples, sin diccionario.

// Palabras de enlace que el LLM añade al redactar y no aportan detalles.
const GLUE = new Set(`a an the and or but of in on at to by for from with without into onto over under
up down off out as is are was were be been being am has have had having do does did this that these
those there here it its he him his she her hers they them their theirs who whom whose which while
where when one two other each both also very just then than so such some any all while
wear wears wearing worn dressed scene shot shown seen set setting appear appears look looks
stand stands sit sits lie lies hold holds image picture photo view behind front side`.split(/\s+/));

export function stem(word) {
  let w = word.toLowerCase().replace(/['’]s$/, "");
  if (w.length > 5 && w.endsWith("ing")) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith("ed")) w = w.slice(0, -2);
  else if (w.length > 4 && w.endsWith("es")) w = w.slice(0, -2);
  else if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) w = w.slice(0, -1);
  if (/([b-df-hj-np-tv-z])\1$/.test(w)) w = w.slice(0, -1); // sitt → sit
  return w;
}

const WORD = /[A-Za-z][A-Za-z'’-]*/g;

export function contentStems(text) {
  const out = new Set();
  for (const m of text.matchAll(WORD)) {
    for (const part of m[0].split("-")) {
      if (part.length > 2 && !GLUE.has(part.toLowerCase())) out.add(stem(part));
    }
  }
  return out;
}

// Devuelve la lista de palabras nuevas (tal como aparecen en `output`, sin repetir).
export function novelWords(input, output) {
  const known = contentStems(input);
  for (const w of [...known]) known.add(stem(w)); // tolera dobles flexiones
  const seen = new Set();
  const out = [];
  for (const m of output.matchAll(WORD)) {
    const parts = m[0].split("-").filter(p => p.length > 2 && !GLUE.has(p.toLowerCase()));
    if (!parts.length) continue;
    if (parts.every(p => known.has(stem(p)))) continue;
    const key = m[0].toLowerCase();
    if (!seen.has(key)) { seen.add(key); out.push(m[0]); }
  }
  return out;
}
