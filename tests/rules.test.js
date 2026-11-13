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

test("avisa de negaciones", () => {
  const r = enhance("a woman with no makeup, no shoes");
  assert.equal(r.warnings[0].id, "negation");
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
