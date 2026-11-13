// Recuento de tokens T5 (el codificador de texto de FLUX).
//
// Usa el tokenizador T5 que distribuye ComfyUI (vendor/t5) con la librería
// @huggingface/tokenizers (vendor/tokenizers). El recuento incluye el token final </s>,
// igual que la tokenización que recibe el modelo.
//
// Límites prácticos medidos en Perchance (ver CLAUDE.md): el texto llega al modelo hasta
// ~460 tokens; a partir de 512 apenas pesa.

import { Tokenizer } from "../vendor/tokenizers/tokenizers.min.mjs";

export { SOFT_LIMIT, HARD_LIMIT } from "./limits.js";

export class T5Counter {
  constructor(tokenizerJson, tokenizerConfig) {
    this.tk = new Tokenizer(tokenizerJson, tokenizerConfig);
  }

  // Total exacto, con </s>.
  count(text) {
    if (!text.trim()) return 0;
    return this.tk.encode(text).ids.length;
  }

  // Divide el texto en palabras (conservando los espacios) y anota en qué token empieza y
  // termina cada una. El pre-tokenizador de T5 (Metaspace) corta por espacios, así que
  // cada palabra se tokeniza igual sola que dentro de la frase. `exact` indica si la suma
  // por palabras coincide con el total; si no, las posiciones son aproximadas.
  spans(text) {
    const parts = text.split(/(\s+)/);
    const out = [];
    let pos = 0;
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        out.push({ text: part, space: true, start: pos, end: pos });
        continue;
      }
      const n = this.tk.encode(part, { add_special_tokens: false }).ids.length;
      out.push({ text: part, space: false, start: pos, end: pos + n });
      pos += n;
    }
    const total = this.count(text);
    return { spans: out, total, exact: total === 0 || pos + 1 === total };
  }
}

// Carga los archivos del tokenizador. `fetchJson(path)` permite usarlo en el navegador
// (fetch) y en Node (lectura de disco) con el mismo código.
export async function loadCounter(fetchJson, base = "vendor/t5/") {
  const [json, config] = await Promise.all([
    fetchJson(base + "tokenizer.json"),
    fetchJson(base + "tokenizer_config.json"),
  ]);
  return new T5Counter(json, config);
}
