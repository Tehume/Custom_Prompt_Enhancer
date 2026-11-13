// Evalúa la reescritura con LLM locales en Node (CPU), con los prompts de samples/.
// Requiere: npm i --no-save @huggingface/transformers@4.3.1
// Uso: node tools/llm_eval.mjs <modelo> <salida.json>
// (Detrás de un proxy: NODE_USE_ENV_PROXY=1.)

import { pipeline, env } from "@huggingface/transformers";
import { readFile, writeFile } from "node:fs/promises";
const REPO = new URL("../", import.meta.url).pathname;
const { enhance } = await import(REPO + "js/pipeline.js");
const { buildMessages, cleanOutput } = await import(REPO + "js/llm/prompt.js");
const { loadCounter } = await import(REPO + "js/tokens.js");
const counter = await loadCounter(async p => JSON.parse(await readFile(REPO + p, "utf-8")), "vendor/t5/");
const samples = JSON.parse(await readFile(REPO + "samples/prompts.json", "utf-8"));
env.cacheDir = process.env.HF_CACHE || "./cache";

const model = process.argv[2];
const outFile = process.argv[3];
const t0 = Date.now();
const gen = await pipeline("text-generation", model, { dtype: "q4" });
const loadMs = Date.now() - t0;
const results = [];
for (const s of samples) {
  const cleaned = enhance(s.prompt).text;
  const msgs = buildMessages(model, cleaned);
  const t = Date.now();
  const out = await gen(msgs, { max_new_tokens: 320, do_sample: false, repetition_penalty: 1.05 });
  const text = cleanOutput(out[0].generated_text.at(-1).content);
  results.push({ id: s.id, input: cleaned, output: text, ms: Date.now() - t, t5in: counter.count(cleaned), t5out: counter.count(text) });
  console.log(`[${model}] ${s.id} ${Date.now() - t}ms\n${text}\n`);
}
await writeFile(outFile, JSON.stringify({ model, loadMs, results }, null, 1));
