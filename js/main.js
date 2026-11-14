// Interfaz: entrada → reglas → (opcional) redacción con LLM → salida con diff, medidor de
// tokens, avisos y marcas de posibles invenciones.

import { enhance } from "./pipeline.js";
import { RULES } from "./rules.js";
import { diffWords } from "./diff.js";
import { loadCounter, SOFT_LIMIT, HARD_LIMIT } from "./tokens.js";
import { looksLikeProse } from "./segments.js";
import { MODELS } from "./llm/prompt.js";
import { novelWords } from "./llm/novelty.js";
import { hasWebGPU, isLoaded, loadModel, rewrite, MAX_LLM_TOKENS } from "./llm/engine.js";
import { suggest, addDescriptor, replacePhrase } from "./suggest.js";
import { looksSpanish, translate, loadTranslator, translatorLoaded, MT_MB } from "./translate.js";

const $ = id => document.getElementById(id);
const el = (tag, props = {}, children = []) => {
  const n = Object.assign(document.createElement(tag), props);
  for (const c of [].concat(children)) n.append(c);
  return n;
};

// Niveles de intensidad: conjuntos de reglas. «Máxima» además redacta con la IA
// automáticamente si el modelo ya está descargado.
const ALL_RULES = RULES.map(r => r.id);
const LEVELS = [
  { id: "min", label: "Mínima", rules: ["weights", "fillers", "dedupe", "tidy"],
    hint: "Solo limpia: pesos, muletillas, repeticiones y espacios. No cambia el orden ni el sentido." },
  { id: "mid", label: "Recomendada", rules: ALL_RULES,
    hint: "Todas las reglas: limpia, traduce etiquetas booru, pasa negaciones a positivo, resuelve contradicciones, ordena y ajusta la longitud." },
  { id: "max", label: "Máxima", rules: ALL_RULES, autoLLM: true,
    hint: "Como la recomendada y, además, redacta en prosa con la IA local cada vez que cambias el prompt (si ya has descargado el modelo con «Redactar»)." },
];

const state = {
  level: "mid",
  enabled: new Set(ALL_RULES),
  view: "result",
  counter: null,
  result: null, // salida de las reglas
  llm: null, // { source, text, novel } — redacción del LLM sobre `source`
  busy: false,
};

// Texto final: la redacción del LLM si corresponde a la salida actual de las reglas.
function finalText() {
  return state.llm && state.llm.source === state.result.text ? state.llm.text : state.result.text;
}
const usingLLM = () => !!state.llm && state.llm.source === state.result.text;

// --- Intensidad ------------------------------------------------------------------------

function levelFromRules() {
  const same = l => l.rules.length === state.enabled.size && l.rules.every(id => state.enabled.has(id));
  if (state.level === "max" && same(LEVELS[2])) return "max";
  return (LEVELS.find(same) || { id: "custom" }).id;
}

function renderLevels() {
  $("levels").replaceChildren(...LEVELS.map(l => {
    const b = el("button", { type: "button", role: "radio", textContent: l.label });
    b.setAttribute("aria-checked", String(state.level === l.id));
    b.setAttribute("aria-selected", String(state.level === l.id));
    b.addEventListener("click", () => {
      state.level = l.id;
      state.enabled = new Set(l.rules);
      try { localStorage.setItem("level", l.id); } catch { /* ignorar */ }
      renderLevels();
      renderRules();
      update();
    });
    return b;
  }));
  const l = LEVELS.find(x => x.id === state.level);
  $("level-hint").textContent = l ? l.hint : "Personalizada: has cambiado las reglas a mano.";
}

// --- Reglas ----------------------------------------------------------------------------

function renderRules() {
  $("rules").replaceChildren(...RULES.map(r => {
    const box = el("input", { type: "checkbox", checked: state.enabled.has(r.id) });
    box.addEventListener("change", () => {
      box.checked ? state.enabled.add(r.id) : state.enabled.delete(r.id);
      state.level = levelFromRules();
      renderLevels();
      update();
    });
    return el("li", {}, el("label", {}, [box, el("span", {}, [r.label, el("small", { textContent: r.description })])]));
  }));
}

// --- Medidor de tokens -----------------------------------------------------------------

function renderMeter(target, text) {
  const box = $(target);
  if (!state.counter) {
    box.textContent = "Cargando tokenizador T5…";
    return;
  }
  const n = state.counter.count(text);
  const scale = Math.max(n, HARD_LIMIT * 1.15);
  const cls = n > HARD_LIMIT ? "hard" : n > SOFT_LIMIT ? "soft" : "";
  const note = n > HARD_LIMIT ? " · lo que pasa de 512 apenas llega al modelo"
    : n > SOFT_LIMIT ? " · a partir de 450 el final pierde peso" : "";
  box.replaceChildren(
    el("div", { className: "meter-legend" }, [
      el("span", { textContent: n + " tokens T5" + note }),
      el("span", { textContent: "límites 450 / 512" }),
    ]),
    el("div", { className: "meter-bar" }, [
      el("div", { className: "meter-fill " + cls, style: "width:" + (100 * n / scale) + "%" }),
      el("div", { className: "meter-mark", style: "left:" + (100 * SOFT_LIMIT / scale) + "%" }),
      el("div", { className: "meter-mark", style: "left:" + (100 * HARD_LIMIT / scale) + "%" }),
    ]),
  );
}

// Texto con las zonas de más de 450 y 512 tokens y las posibles invenciones resaltadas.
function decoratedText(text, novel) {
  const isNovel = w => novel.has(w.replace(/^[^A-Za-z]+|[^A-Za-z'’-]+$/g, "").toLowerCase());
  const spans = state.counter ? state.counter.spans(text).spans
    : text.split(/(\s+)/).filter(Boolean).map(t => ({ text: t, space: /^\s+$/.test(t), end: 0 }));
  return spans.map(s => {
    if (s.space) return document.createTextNode(s.text);
    const cls = [s.end > HARD_LIMIT ? "zone-hard" : s.end > SOFT_LIMIT ? "zone-soft" : "",
      isNovel(s.text) ? "novel" : ""].filter(Boolean).join(" ");
    return cls ? el("span", { className: cls, textContent: s.text, title: isNovel(s.text) ? "No estaba en tu prompt" : "" })
      : document.createTextNode(s.text);
  });
}

// --- Salida ----------------------------------------------------------------------------

function renderOutput() {
  const input = $("input").value;
  const r = state.result;
  const text = finalText();
  const novel = new Set(usingLLM() ? state.llm.novel.map(w => w.toLowerCase()) : []);
  const out = $("output");
  if (!input.trim()) {
    out.textContent = "";
  } else if (state.view === "diff") {
    out.replaceChildren(...diffWords(input, text).map(d => {
      if (d.op === "same") return document.createTextNode(d.text);
      if (d.op === "del") return el("span", { className: "d-del", textContent: d.text });
      return el("span", { className: "d-add" }, decoratedText(d.text, novel));
    }));
  } else {
    out.replaceChildren(...decoratedText(text, novel));
  }

  $("source").textContent = !input.trim() ? ""
    : usingLLM() ? "Reglas + redacción con " + state.llm.label + "."
    : state.llm ? "Solo reglas (la redacción con IA es de una versión anterior: vuelve a redactar)."
    : "Solo reglas.";

  const warnings = [...translationWarnings(), ...r.warnings];
  if (usingLLM() && state.llm.novel.length) {
    warnings.unshift({
      id: "novel",
      text: "Posibles invenciones del modelo (no estaban en tu prompt): " +
        state.llm.novel.map(w => "«" + w + "»").join(", ") + ". Revísalas antes de copiar.",
    });
  }
  $("warnings").replaceChildren(...warnings.map(w => el("div", { className: "warning", textContent: w.text })));

  const items = r.changes.map(c => el("li", {}, [
    c.note,
    c.before ? " " : "",
    c.before ? el("code", { textContent: c.before }) : "",
    c.after ? " → " + c.after : "",
  ]));
  if (usingLLM()) items.push(el("li", { textContent: "Redactado en prosa con " + state.llm.label }));
  $("changes").replaceChildren(...(items.length ? items
    : [el("li", { className: "empty", textContent: input.trim() ? "Ninguno." : "Escribe un prompt." })]));
  $("llm-clear").hidden = !state.llm;
}

// --- Sugerencias -----------------------------------------------------------------------

function applyToInput(newText) {
  $("input").value = newText;
  inputChanged();
}

function renderSuggestions() {
  const list = suggest(state.result.text);
  const box = $("suggestions");
  if (!list.length) {
    box.replaceChildren(el("p", { className: "hint", textContent: $("input").value.trim() ? "Nada que sugerir." : "" }));
    return;
  }
  box.replaceChildren(...list.map(sg => {
    const title = sg.kind === "vague"
      ? `«${sg.phrase}» es vago (${sg.label}). Cámbialo por:`
      : `Falta: ${sg.label.toLowerCase()}. Añade:`;
    const chips = sg.options.map(o => {
      const b = el("button", { type: "button", className: "chip", title: o.text }, [o.text, el("small", { textContent: o.label })]);
      b.addEventListener("click", () => {
        const input = $("input").value;
        let next = sg.kind === "vague" ? replacePhrase(input, sg.phrase, o.text) : input;
        if (next === input) next = addDescriptor(input, o.text);
        applyToInput(next);
      });
      return b;
    });
    return el("div", { className: "suggestion" }, [el("span", { textContent: title }), el("div", { className: "chips" }, chips)]);
  }));
}

function update() {
  const input = $("input").value;
  state.result = enhance(input, state.enabled, { counter: state.counter });
  renderMeter("in-meter", input);
  renderMeter("out-meter", finalText());
  renderOutput();
  renderSuggestions();
  renderTranslate();
  scheduleAutoLLM();
}

// Intensidad máxima: redacta sola cuando el prompt deja de cambiar, si el modelo ya está.
let autoTimer;
function scheduleAutoLLM() {
  clearTimeout(autoTimer);
  if (state.level !== "max" || state.busy) return;
  if (!isLoaded($("llm-model").value, $("llm-device").value)) return;
  const src = state.result.text;
  if (!src.trim() || (state.llm && state.llm.source === src) || looksLikeProse(src)) return;
  autoTimer = setTimeout(runLLM, 1200);
}

function setView(view) {
  state.view = view;
  $("tab-result").setAttribute("aria-selected", String(view === "result"));
  $("tab-diff").setAttribute("aria-selected", String(view === "diff"));
  renderOutput();
}

// --- Redacción con LLM -----------------------------------------------------------------

function setupLLM() {
  const sel = $("llm-model");
  for (const m of MODELS) sel.append(new Option(`${m.label} · ~${m.mb} MB`, m.id));
  if (!hasWebGPU()) {
    $("llm-device").value = "wasm";
    $("llm-device").options[0].disabled = true;
    $("llm-device").options[0].text = "WebGPU (no disponible)";
  }
  try {
    const saved = JSON.parse(localStorage.getItem("llm") || "{}");
    if (MODELS.some(m => m.id === saved.model)) sel.value = saved.model;
  } catch { /* sin almacenamiento: valores por defecto */ }

  $("llm-run").addEventListener("click", runLLM);
  $("llm-clear").addEventListener("click", () => { state.llm = null; update(); });
}

async function runLLM() {
  if (state.busy) return;
  const source = state.result.text;
  const status = $("llm-status");
  if (!source.trim()) { status.textContent = "Escribe un prompt primero."; return; }
  if (looksLikeProse(source)) {
    status.textContent = "El prompt ya está en prosa: no hace falta redactarlo.";
    return;
  }
  if (state.counter && state.counter.count(source) > MAX_LLM_TOKENS) {
    status.textContent = `Demasiado largo para redactarlo con IA (más de ${MAX_LLM_TOKENS} tokens): ` +
      "los modelos pequeños lo cortan o pierden detalles.";
    return;
  }
  const modelId = $("llm-model").value;
  const device = $("llm-device").value;
  const model = MODELS.find(m => m.id === modelId);
  try { localStorage.setItem("llm", JSON.stringify({ model: modelId })); } catch { /* ignorar */ }

  state.busy = true;
  $("llm-run").disabled = true;
  try {
    if (!isLoaded(modelId, device)) {
      status.textContent = "Preparando el modelo…";
      await loadModel(modelId, device, (a, b) => {
        status.textContent = `Descargando ${model.label}: ${Math.round(a / 1e6)} / ${Math.round(b / 1e6)} MB`;
      });
    }
    status.textContent = "Redactando…";
    const t0 = performance.now();
    const text = await rewrite(modelId, device, source, partial => {
      $("output").textContent = partial;
    });
    const secs = (performance.now() - t0) / 1000;
    state.llm = { source, text, label: model.label, novel: novelWords(source, text) };
    status.textContent = `Hecho en ${secs.toFixed(1)} s.`;
  } catch (e) {
    console.error(e);
    status.textContent = "Error con el modelo: " + (e.message || e) +
      (device === "webgpu" ? " Prueba con CPU o con un modelo ligero." : "");
  } finally {
    state.busy = false;
    $("llm-run").disabled = false;
    update();
  }
}

// --- Traducción ES→EN ------------------------------------------------------------------

const translation = { original: null, applied: [], busy: false };

function renderTranslate() {
  const input = $("input").value;
  $("translate-box").hidden = !(translation.busy || looksSpanish(input));
  if (!translation.busy) {
    $("translate-msg").textContent = "Parece español. Los prompts funcionan mejor en inglés" +
      (translatorLoaded() ? "." : ` (el traductor se descarga una vez, ~${MT_MB} MB).`);
  }
  const orig = $("translate-orig");
  orig.hidden = translation.original === null;
  if (translation.original !== null) {
    $("orig-text").textContent = translation.original;
    const how = { directo: "sustituido", corregido: "corregido", bien: "ya bien traducido", "sin corregir": "⚠ el traductor lo perdió: revísalo" };
    const items = translation.applied.map(a => el("li", {}, [
      el("code", { textContent: a.es }), " → " + a.en + " (" + how[a.how] + ")",
    ]));
    $("glossary-applied").replaceChildren(...(items.length ? items
      : [el("li", { className: "empty", textContent: "Ningún término del glosario." })]));
  }
}

async function runTranslate() {
  if (translation.busy) return;
  const original = $("input").value;
  translation.busy = true;
  $("translate-run").disabled = true;
  const status = $("translate-status");
  try {
    if (!translatorLoaded()) {
      status.textContent = "Descargando el traductor…";
      await loadTranslator((a, b) => {
        status.textContent = `Descargando el traductor: ${Math.round(a / 1e6)} / ${Math.round(b / 1e6)} MB`;
      });
    }
    status.textContent = "Traduciendo…";
    const r = await translate(original);
    translation.original = original;
    translation.applied = r.applied;
    status.textContent = "";
    $("input").value = r.text;
    state.llm = null;
    inputChanged();
  } catch (e) {
    console.error(e);
    status.textContent = "Error al traducir: " + (e.message || e);
  } finally {
    translation.busy = false;
    $("translate-run").disabled = false;
    renderTranslate();
  }
}

// Avisos propios de la traducción (se añaden a los de las reglas).
function translationWarnings() {
  if (translation.original === null) return [];
  const w = [];
  if (/\bsus?\b/i.test(translation.original)) {
    w.push({ id: "tr-su", text: "El original usa «su/sus», que puede ser de él o de ella: revisa his/her/their en la traducción." });
  }
  const lost = translation.applied.filter(a => a.how === "sin corregir");
  if (lost.length) {
    w.push({ id: "tr-lost", text: "El traductor perdió o cambió: " + lost.map(a => "«" + a.es + "» (" + a.en + ")").join(", ") + ". Revísalo." });
  }
  return w;
}

$("translate-run").addEventListener("click", runTranslate);
$("translate-restore").addEventListener("click", () => {
  $("input").value = translation.original;
  translation.original = null;
  translation.applied = [];
  state.llm = null;
  inputChanged();
});

// --- Inicio ----------------------------------------------------------------------------

async function loadSamples() {
  try {
    const samples = await (await fetch("samples/prompts.json")).json();
    const sel = $("samples");
    for (const s of samples) sel.append(el("option", { value: s.id, textContent: s.title }));
    sel.addEventListener("change", () => {
      const s = samples.find(x => x.id === sel.value);
      if (s) { $("input").value = s.prompt; inputChanged(); }
      sel.value = "";
    });
  } catch (e) {
    console.warn("No se pudieron cargar los ejemplos", e);
  }
}

function inputChanged() {
  if (!state.busy) $("llm-status").textContent = "";
  update();
}

let timer;
$("input").addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(inputChanged, 150); });
$("tab-result").addEventListener("click", () => setView("result"));
$("tab-diff").addEventListener("click", () => setView("diff"));
$("copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(finalText());
    $("copy-status").textContent = "Copiado.";
  } catch {
    $("copy-status").textContent = "No se pudo copiar; selecciona el texto a mano.";
  }
  setTimeout(() => { $("copy-status").textContent = ""; }, 2000);
});

try {
  const saved = localStorage.getItem("level");
  const l = LEVELS.find(x => x.id === saved);
  if (l) { state.level = l.id; state.enabled = new Set(l.rules); }
} catch { /* sin almacenamiento */ }
renderLevels();
renderRules();
setupLLM();
update();
loadSamples();
loadCounter(async p => (await fetch(p)).json())
  .then(c => { state.counter = c; update(); })
  .catch(e => {
    console.error(e);
    $("in-meter").textContent = $("out-meter").textContent = "No se pudo cargar el tokenizador T5.";
  });
