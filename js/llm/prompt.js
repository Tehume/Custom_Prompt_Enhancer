// Instrucciones para redactar en prosa con un LLM local.
// Lo comparten la app (js/llm/engine.js), el laboratorio (lab/llm.html) y
// tools/llm_eval.mjs. Las reglas ya han hecho antes lo determinista (muletillas, pesos,
// negaciones, contradicciones, booru), así que aquí solo se pide redactar.
//
// v1 (13-11-2026) llevaba ejemplos dentro de las reglas («no makeup» → «a bare face») y los
// modelos los copiaban donde no tocaba. v2 usa ejemplos completos aparte (few-shot), con
// contenido que no se parece a los prompts reales.

export const PROMPT_VERSION = 2;

export const SYSTEM = `You turn image prompts written as tag lists into clear, literal English prose for the FLUX image model.
- Use only the details in the input. Never add anything new: no new colors, clothing, hair, body features, places, names, lighting, camera or style.
- Keep every detail of the input.
- Order: main subjects and their appearance first, then pose and interaction, then clothing, then setting and light, then camera and art style last.
- Write short, plain sentences.
Output only the rewritten prompt, with no introduction, explanation or quotes.`;

export const EXAMPLES = [
  {
    input: "an old fisherman, grey stubble, yellow raincoat, sitting on an overturned boat, mending a net, harbor, overcast morning, 35mm photo",
    output: "An old fisherman with grey stubble sits on an overturned boat, mending a net. He wears a yellow raincoat. The scene is a harbor on an overcast morning, shot as a 35mm photo.",
  },
  {
    input: "pencil sketch, two children, a girl with pigtails and a boy in a striped shirt, sitting back to back, sharing an apple, meadow",
    output: "A girl with pigtails and a boy in a striped shirt sit back to back in a meadow, sharing an apple. Drawn as a pencil sketch.",
  },
];

// Modelos candidatos (ONNX, 4 bits). mb: descarga aproximada con WebGPU (q4f16).
export const MODELS = [
  { id: "onnx-community/LFM2-1.2B-ONNX", label: "LFM2 1.2B (recomendado)", mb: 760, license: "LFM Open License" },
  { id: "onnx-community/Qwen2.5-1.5B-Instruct", label: "Qwen2.5 1.5B", mb: 1220, license: "Apache-2.0" },
  { id: "onnx-community/LFM2-700M-ONNX", label: "LFM2 700M (ligero, inventa más)", mb: 500, license: "LFM Open License" },
];
// Descartados (docs/llm-eval.md): Gemma 3 1B y Qwen2.5 0.5B (inventan o entran en bucle),
// Qwen3 1.7B (no reescribe), LFM3 1.7B (Transformers.js 4.3.1 aún no lo admite).

export function buildMessages(modelId, prompt) {
  const msgs = [{ role: "system", content: SYSTEM }];
  for (const ex of EXAMPLES) {
    msgs.push({ role: "user", content: ex.input }, { role: "assistant", content: ex.output });
  }
  // Qwen3 tiene modo de razonamiento: /no_think lo apaga.
  msgs.push({ role: "user", content: /qwen3/i.test(modelId) ? prompt + " /no_think" : prompt });
  return msgs;
}

export function cleanOutput(text) {
  return text
    .replace(/<think>[\s\S]*?<\/think>/g, "")
    .replace(/^\s*(?:here is|here's|sure|rewritten prompt)[^:\n]*:\s*/i, "")
    .replace(/^["“]|["”]$/g, "")
    .trim();
}
