// Interfaz: entrada → reglas → salida con diff, medidor de tokens y avisos.

import { enhance } from "./pipeline.js";
import { RULES } from "./rules.js";
import { diffWords } from "./diff.js";
import { loadCounter, SOFT_LIMIT, HARD_LIMIT } from "./tokens.js";

const $ = id => document.getElementById(id);
const el = (tag, props = {}, children = []) => {
  const n = Object.assign(document.createElement(tag), props);
  for (const c of [].concat(children)) n.append(c);
  return n;
};

const state = {
  enabled: new Set(RULES.map(r => r.id)),
  view: "result",
  counter: null,
  result: null,
};

// --- Reglas ----------------------------------------------------------------------------

function renderRules() {
  $("rules").replaceChildren(...RULES.map(r => {
    const box = el("input", { type: "checkbox", checked: state.enabled.has(r.id) });
    box.addEventListener("change", () => {
      box.checked ? state.enabled.add(r.id) : state.enabled.delete(r.id);
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

// Texto con las zonas de más de 450 y 512 tokens resaltadas.
function zonedText(text) {
  if (!state.counter) return [document.createTextNode(text)];
  const { spans } = state.counter.spans(text);
  return spans.map(s => {
    const zone = s.end > HARD_LIMIT ? "zone-hard" : s.end > SOFT_LIMIT ? "zone-soft" : "";
    return zone && !s.space ? el("span", { className: zone, textContent: s.text }) : document.createTextNode(s.text);
  });
}

// --- Salida ----------------------------------------------------------------------------

function renderOutput() {
  const input = $("input").value;
  const r = state.result;
  const out = $("output");
  if (!input.trim()) {
    out.textContent = "";
  } else if (state.view === "diff") {
    out.replaceChildren(...diffWords(input, r.text).map(d =>
      d.op === "same" ? document.createTextNode(d.text)
        : el("span", { className: d.op === "add" ? "d-add" : "d-del", textContent: d.text })));
  } else {
    out.replaceChildren(...zonedText(r.text));
  }

  $("warnings").replaceChildren(...r.warnings.map(w => el("div", { className: "warning", textContent: w.text })));

  const items = r.changes.map(c => el("li", {}, [
    c.note,
    c.before ? " " : "",
    c.before ? el("code", { textContent: c.before }) : "",
    c.after ? " → " + c.after : "",
  ]));
  $("changes").replaceChildren(...(items.length ? items
    : [el("li", { className: "empty", textContent: input.trim() ? "Ninguno." : "Escribe un prompt." })]));
}

function update() {
  const input = $("input").value;
  state.result = enhance(input, state.enabled);
  renderMeter("in-meter", input);
  renderMeter("out-meter", state.result.text);
  renderOutput();
}

function setView(view) {
  state.view = view;
  $("tab-result").setAttribute("aria-selected", String(view === "result"));
  $("tab-diff").setAttribute("aria-selected", String(view === "diff"));
  renderOutput();
}

// --- Inicio ----------------------------------------------------------------------------

async function loadSamples() {
  try {
    const samples = await (await fetch("samples/prompts.json")).json();
    const sel = $("samples");
    for (const s of samples) sel.append(el("option", { value: s.id, textContent: s.title }));
    sel.addEventListener("change", () => {
      const s = samples.find(x => x.id === sel.value);
      if (s) { $("input").value = s.prompt; update(); }
      sel.value = "";
    });
  } catch (e) {
    console.warn("No se pudieron cargar los ejemplos", e);
  }
}

let timer;
$("input").addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(update, 150); });
$("tab-result").addEventListener("click", () => setView("result"));
$("tab-diff").addEventListener("click", () => setView("diff"));
$("copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(state.result.text);
    $("copy-status").textContent = "Copiado.";
  } catch {
    $("copy-status").textContent = "No se pudo copiar; selecciona el texto a mano.";
  }
  setTimeout(() => { $("copy-status").textContent = ""; }, 2000);
});

renderRules();
update();
loadSamples();
loadCounter(async p => (await fetch(p)).json())
  .then(c => { state.counter = c; update(); })
  .catch(e => {
    console.error(e);
    $("in-meter").textContent = $("out-meter").textContent = "No se pudo cargar el tokenizador T5.";
  });
