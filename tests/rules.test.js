import { test } from "node:test";
import assert from "node:assert/strict";
import { enhance } from "../js/pipeline.js";
import { diffWords } from "../js/diff.js";

test("quita pesos, énfasis, muletillas y repeticiones", () => {
  const r = enhance("((athletic man)), (broad shoulders:1.4), short beard, short beard, masterpiece, 8k");
  assert.equal(r.text, "athletic man, broad shoulders, short beard");
});

test("no toca muletillas dentro de una frase", () => {
  const t = "A chef of the best quality kitchen, holding a knife";
  assert.equal(enhance(t).text, t);
});

test("respeta la sintaxis {a|b} de Perchance", () => {
  const t = "a woman in a {red, long|blue} dress, standing";
  assert.equal(enhance(t).text, t);
});

test("palabras duplicadas seguidas", () => {
  assert.equal(enhance("a very very tall man").text, "a very tall man");
});

test("prosa correcta queda intacta", () => {
  const t = "A tall man stands at a workbench, gripping a chisel. Soft window light.";
  const r = enhance(t);
  assert.equal(r.text, t);
  assert.equal(r.changes.length, 0);
});

test("avisa de negaciones desconocidas", () => {
  const r = enhance("a woman, no umbrella, standing");
  assert.ok(r.warnings.some(w => w.id === "negation"));
});

test("negaciones conocidas en positivo o fuera", () => {
  const r = enhance("a woman with curly hair and no makeup, no shoes, no text, no glasses");
  assert.equal(r.text, "a woman with curly hair and a bare face, barefoot");
  assert.ok(!r.warnings.some(w => w.id === "negation"));
});

test("«no glasses» dentro de una frase no se borra", () => {
  const r = enhance("a man who wears no glasses, standing");
  assert.match(r.text, /no glasses/);
});

test("traduce etiquetas booru solo en listas", () => {
  assert.equal(enhance("1girl, solo, looking_at_viewer, red hair").text,
    "a young woman, alone, looking at the viewer, red hair");
  assert.equal(enhance("solo").text, "solo");
});

test("contradicciones: se queda con la primera o avisa", () => {
  const r = enhance("woman, full body shot, close-up, short hair, long flowing hair, sitting and standing");
  assert.equal(r.text, "woman, full body shot, short hair, sitting and standing");
  assert.ok(r.warnings.some(w => w.id === "conflict-posture"));
});

test("sin contradicción no toca nada", () => {
  const t = "a woman sitting on a bench at night, long hair";
  assert.equal(enhance(t).text, t);
});

test("reglas desactivadas no se aplican", () => {
  const r = enhance("man, masterpiece", new Set(["tidy"]));
  assert.equal(r.text, "man, masterpiece");
});

test("diff reconstruye ambos textos", () => {
  const a = "girl, masterpiece, red hair";
  const b = "girl, red hair, smiling";
  const d = diffWords(a, b);
  assert.equal(d.filter(x => x.op !== "add").map(x => x.text).join(""), a);
  assert.equal(d.filter(x => x.op !== "del").map(x => x.text).join(""), b);
});
