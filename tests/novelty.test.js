import { test } from "node:test";
import assert from "node:assert/strict";
import { novelWords } from "../js/llm/novelty.js";
import { looksLikeProse } from "../js/segments.js";

test("no marca flexiones ni palabras de enlace", () => {
  const input = "athletic man, sitting on a wooden bench, grey hoodie, morning light";
  const output = "An athletic man sits on a wooden bench. He wears a grey hoodie. The scene has morning light.";
  assert.deepEqual(novelWords(input, output), []);
});

test("marca detalles nuevos", () => {
  const input = "a young woman, red hair, standing";
  const output = "A young woman with red hair stands in a blue dress.";
  assert.deepEqual(novelWords(input, output), ["blue", "dress"]);
});

test("detecta prosa", () => {
  assert.ok(looksLikeProse("A tall man stands at a workbench, gripping a chisel in his right hand. Soft light falls."));
  assert.ok(!looksLikeProse("man, beard, standing, workbench, chisel, soft light"));
});
