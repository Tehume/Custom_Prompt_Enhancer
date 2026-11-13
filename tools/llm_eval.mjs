// Evalúa la redacción con LLM locales en Node (CPU), con los prompts de samples/.
// Aplica lo mismo que la app: primero las reglas; se salta los prompts ya en prosa o
// demasiado largos; cuenta las posibles invenciones.
// Requiere: npm i --no-save @huggingface/transformers@4.3.1
// Uso: node tools/llm_eval.mjs <modelo> <salida.json>   (tras un proxy: NODE_USE_ENV_PROXY=1)

import { pipeline, env } from "@huggingface/transformers";
import { readFile, writeFile } from "node:fs/promises";

const REPO = new URL("../", import.meta.url).pathname;
const { enhance } = await import(REPO + "js/pipeline.js");
const { looksLikeProse } = await import(REPO + "js/segments.js");
const { buildMessages, cleanOutput, PROMPT_VERSION } = await import(REPO + "js/llm/prompt.js");
const { novelWords } = await import(REPO + "js/llm/novelty.js");
const { MAX_LLM_TOKENS } = await import(REPO + "js/llm/engine.js");
const { loadCounter } = await import(REPO + "js/tokens.js");
const counter = await loadCounter(async p => JSON.parse(await readFile(REPO + p, "utf-8")), "vendor/t5/");
const samples = JSON.parse(await readFile(REPO + "samples/prompts.json", "utf-8"));
if (process.env.HF_CACHE) env.cacheDir = process.env.HF_CACHE;

const [model, outFile] = process.argv.slice(2);
const t0 = Date.now();
const gen = await pipeline("text-generation", model, { dtype: "q4" });
const loadMs = Date.now() - t0;
const results = [];
for (const s of samples) {
  const input = enhance(s.prompt).text;
  const t5in = counter.count(input);
  if (looksLikeProse(input) || t5in > MAX_LLM_TOKENS) {
    results.push({ id: s.id, input, skipped: looksLikeProse(input) ? "prosa" : "largo", t5in });
    console.log(`[${model}] ${s.id}: omitido`);
    continue;
  }
  const t = Date.now();
  const out = await gen(buildMessages(model, input), { max_new_tokens: 400, do_sample: false, repetition_penalty: 1.05 });
  const output = cleanOutput(out[0].generated_text.at(-1).content);
  const novel = novelWords(input, output);
  results.push({ id: s.id, input, output, novel, ms: Date.now() - t, t5in, t5out: counter.count(output) });
  console.log(`[${model}] ${s.id} ${Date.now() - t}ms\n${output}\nNUEVAS: ${novel.join(", ")}\n`);
}
await writeFile(outFile, JSON.stringify({ model, promptVersion: PROMPT_VERSION, loadMs, results }, null, 1));
