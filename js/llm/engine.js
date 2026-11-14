// Motor del LLM local (opcional). Transformers.js se carga bajo demanda desde jsDelivr y
// el modelo desde Hugging Face; ambos quedan en la caché del navegador.

import { buildMessages, cleanOutput } from "./prompt.js";

const TRANSFORMERS_URL = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1/dist/transformers.min.js";

export const hasWebGPU = () => typeof navigator !== "undefined" && !!navigator.gpu;

// Cuándo no merece la pena reescribir con el LLM.
export const MAX_LLM_TOKENS = 350;

let lib = null;
let current = { key: null, gen: null, dtype: null };

// q4f16 (más ligero) necesita que la GPU admita «shader-f16»; muchas GPU de móvil y algunas
// de ordenador no lo admiten. Sin él se usa q4 (algo más pesado, sin f16).
let f16Support = null;
export async function supportsF16() {
  if (f16Support !== null) return f16Support;
  try {
    const adapter = hasWebGPU() ? await navigator.gpu.requestAdapter() : null;
    f16Support = !!adapter && adapter.features.has("shader-f16");
  } catch {
    f16Support = false;
  }
  return f16Support;
}

const pickDtype = async device => (device === "webgpu" && await supportsF16() ? "q4f16" : "q4");
export const currentDtype = () => current.dtype;

// onProgress(loadedBytes, totalBytes)
export async function loadModel(modelId, device, onProgress = () => {}) {
  const key = modelId + "|" + device;
  if (current.key === key) return current.gen;
  lib ||= await import(TRANSFORMERS_URL);
  const dtype = await pickDtype(device);
  const files = {};
  const gen = await lib.pipeline("text-generation", modelId, {
    device,
    dtype,
    progress_callback: p => {
      if (p.status !== "progress" || !p.total) return;
      files[p.file] = [p.loaded, p.total];
      let a = 0;
      let b = 0;
      for (const [l, t] of Object.values(files)) { a += l; b += t; }
      onProgress(a, b);
    },
  });
  current = { key, gen, dtype };
  return gen;
}

export const isLoaded = (modelId, device) => current.key === modelId + "|" + device;

// Reescribe en prosa. onToken(textoAcumulado) para ir mostrando el resultado.
export async function rewrite(modelId, device, prompt, onToken = () => {}) {
  try {
    return await generate(modelId, device, prompt, onToken);
  } catch (e) {
    // Si la GPU rechaza f16 aunque diga admitirlo, se reintenta una vez con q4.
    if (device === "webgpu" && current.dtype === "q4f16" && /f16/i.test(String(e?.message || e))) {
      f16Support = false;
      current = { key: null, gen: null, dtype: null };
      return generate(modelId, device, prompt, onToken);
    }
    throw e;
  }
}

async function generate(modelId, device, prompt, onToken) {
  const gen = await loadModel(modelId, device);
  let streamed = "";
  const streamer = new lib.TextStreamer(gen.tokenizer, {
    skip_prompt: true,
    skip_special_tokens: true,
    callback_function: t => { streamed += t; onToken(streamed); },
  });
  const out = await gen(buildMessages(modelId, prompt), {
    max_new_tokens: 400,
    do_sample: false,
    repetition_penalty: 1.05,
    streamer,
  });
  return cleanOutput(out[0].generated_text.at(-1).content);
}
