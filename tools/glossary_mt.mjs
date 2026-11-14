// Genera js/data/glossary-mt.js: cómo traduce OPUS-MT cada término del glosario por sí
// solo y en dos contextos. Esas traducciones (si no coinciden con la buena) se corrigen
// después de traducir. Hay que volver a ejecutarlo al cambiar el glosario.
// Requiere: npm i --no-save @huggingface/transformers@4.3.1
// Uso: node tools/glossary_mt.mjs   (tras un proxy: NODE_USE_ENV_PROXY=1)

import { pipeline, env } from "@huggingface/transformers";
import { writeFile } from "node:fs/promises";

const REPO = new URL("../", import.meta.url).pathname;
const { GLOSSARY } = await import(REPO + "js/data/glossary.js");
if (process.env.HF_CACHE) env.cacheDir = process.env.HF_CACHE;
const tr = await pipeline("translation", "Xenova/opus-mt-es-en", { dtype: "q8" });

const norm = s => s.toLowerCase().replace(/[.!?]+$/, "").replace(/^(?:a|an|the)\s+/, "").trim();
const CONTEXTS = [x => x, x => "una mujer con " + x, x => x + ", luz suave"];
// Partes de las traducciones de contexto que no son el término.
const STRIP = [/^(?:a|one)\s+woman\s+(?:with|in)\s+/i, /,\s*(?:soft light|light soft)$/i];
// Demasiado genéricas para corregirlas en cualquier parte del texto.
const GENERIC = new Set(["hair", "back", "her back", "profile", "light", "woman", "face up", "face down"]);

const out = {};
for (const g of GLOSSARY) {
  const wrong = new Set();
  for (const ctx of CONTEXTS) {
    const [r] = await tr(ctx(g.ex), { max_new_tokens: 64 });
    let t = r.translation_text;
    for (const rx of STRIP) t = t.replace(rx, "");
    t = norm(t);
    if (t && t !== norm(g.en) && !GENERIC.has(t) && t.split(/\s+/).length <= 6) wrong.add(t);
  }
  out[g.es] = [...wrong];
  console.log(g.ex, "→", [...wrong].join(" | ") || "(bien)");
}
await writeFile(REPO + "js/data/glossary-mt.js",
  "// Generado por tools/glossary_mt.mjs con Xenova/opus-mt-es-en (q8). No editar a mano.\n" +
  "// Clave: expresión «es» del glosario; valor: traducciones erróneas del modelo.\n" +
  "export const MT_WRONG = " + JSON.stringify(out, null, 1) + ";\n");
