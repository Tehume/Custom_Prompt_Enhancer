import { test } from "node:test";
import assert from "node:assert/strict";
import { looksSpanish, findTerms, fixTranslation, translate, fixPronouns } from "../js/translate.js";

test("detecta español", () => {
  assert.ok(looksSpanish("una mujer pelirroja con flequillo, sentada en un banco"));
  assert.ok(!looksSpanish("a red-haired woman with bangs, sitting on a bench"));
  assert.ok(!looksSpanish("rim light, bokeh"));
});

test("encuentra términos sin tildes y sin solapes", () => {
  const t = findTerms("niña pelirroja con moño, sentada con las piernas cruzadas");
  assert.deepEqual(t.map(x => x.en), ["sitting cross-legged", "bun", "red-haired"]);
});

test("corrige traducciones erróneas conocidas", () => {
  const r = fixTranslation("chico con vaqueros rotos y zapatillas", "boy with broken jeans and slippers");
  assert.equal(r.text, "boy with ripped jeans and sneakers");
  assert.ok(r.applied.every(a => a.how === "corregido"));
});

test("segmentos que son solo un término no pasan por el modelo", async () => {
  const calls = [];
  const fake = async p => { calls.push(p); return [{ translation_text: "TRANSLATED" }]; };
  const r = await translate("plano medio, contrapicado, una mujer sonriendo", fake);
  assert.equal(r.text, "medium shot, low-angle view, TRANSLATED");
  assert.deepEqual(calls, ["una mujer sonriendo"]);
});

test("cambia «your» por el pronombre del sujeto", () => {
  assert.equal(fixPronouns("a woman, hand on your knee"), "a woman, hand on her knee");
  assert.equal(fixPronouns("a man resting your head"), "a man resting his head");
  assert.equal(fixPronouns("a man and a woman, your hands"), "a man and a woman, their hands");
});
