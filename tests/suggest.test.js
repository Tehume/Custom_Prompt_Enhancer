import { test } from "node:test";
import assert from "node:assert/strict";
import { suggest, addDescriptor, replacePhrase } from "../js/suggest.js";

const ids = t => suggest(t).map(s => s.id);

test("sugiere categorías que faltan si hay sujeto", () => {
  const s = ids("a young woman, red hair, sitting on a bench, park");
  assert.ok(s.includes("framing") && s.includes("light") && s.includes("expression"));
  assert.ok(!s.includes("setting")); // «park» y «bench» ya cubren el entorno
});

test("sin sujeto no sugiere categorías", () => {
  assert.deepEqual(ids("mountains at dawn, oil painting"), []);
});

test("detecta términos vagos", () => {
  const s = suggest("girl sitting, nice pose, pretty face, cool outfit, good lighting");
  assert.deepEqual(s.filter(x => x.kind === "vague").map(x => x.phrase),
    ["nice pose", "pretty face", "cool outfit", "good lighting"]);
});

test("añade como segmento o como frase", () => {
  assert.equal(addDescriptor("a woman, red dress, ", "soft window light"), "a woman, red dress, soft window light");
  assert.equal(addDescriptor("A woman sits on a bench, reading a long letter.", "soft window light"),
    "A woman sits on a bench, reading a long letter. Soft window light.");
});

test("sustituye la frase vaga", () => {
  assert.equal(replacePhrase("girl, Nice Pose, smiling", "nice pose", "arms crossed"), "girl, arms crossed, smiling");
});
