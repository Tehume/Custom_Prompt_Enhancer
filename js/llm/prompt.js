// Prompt de sistema para reescribir prompts con un LLM local.
// Lo comparten la página de laboratorio (lab/llm.html) y tools/llm_eval.mjs.

export const SYSTEM = `You rewrite prompts for the FLUX text-to-image model.
Rewrite the user's prompt as clear, literal, natural English prose (full sentences, no tag lists).
Rules:
- Keep every visual detail: body and face, hair, pose, interaction between people, clothing, setting, lighting, camera, style.
- Do not invent new details. Do not add quality words like "masterpiece" or "highly detailed".
- Order: main subjects and their appearance first, then pose and interaction, then clothing, then setting and lighting, then camera, and art style last.
- Convert tags into sentences. Booru tags: "1girl" means "a young woman", "1boy" means "a young man", "solo" means "alone".
- Replace negations with positive descriptions (for example "no makeup" becomes "a bare face", "no shoes" becomes "barefoot"). Drop "no text" and "no watermark".
- If two details contradict each other, keep the first one.
- Keep it under 180 words.
Output only the rewritten prompt, with no introduction or explanation.`;

// Modelos candidatos (ONNX, cuantizados a 4 bits; tamaño aproximado de descarga).
export const MODELS = [
  { id: "onnx-community/gemma-3-1b-it-ONNX", label: "Gemma 3 1B", mb: 760, license: "Gemma Terms of Use" },
  { id: "onnx-community/LFM2-1.2B-ONNX", label: "LFM2 1.2B", mb: 760, license: "LFM Open License" },
  { id: "onnx-community/Qwen2.5-1.5B-Instruct", label: "Qwen2.5 1.5B Instruct", mb: 1220, license: "Apache-2.0" },
  { id: "onnx-community/Qwen3-1.7B-ONNX", label: "Qwen3 1.7B", mb: 1430, license: "Apache-2.0" },
];

// Mensajes para la plantilla de chat. Qwen3 tiene modo de razonamiento: /no_think lo apaga.
export function buildMessages(modelId, prompt) {
  const user = /qwen3/i.test(modelId) ? prompt + " /no_think" : prompt;
  return [{ role: "system", content: SYSTEM }, { role: "user", content: user }];
}

export function cleanOutput(text) {
  return text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}
