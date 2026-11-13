import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { loadCounter } from "../js/tokens.js";

const root = new URL("../", import.meta.url);
const fetchJson = async p => JSON.parse(await readFile(new URL(p, root), "utf-8"));
const counter = await loadCounter(fetchJson);
const fixtures = await fetchJson("tests/fixtures/t5_counts.json");

test("el recuento coincide con la librería de referencia", () => {
  for (const f of fixtures) assert.equal(counter.count(f.text), f.count, f.text.slice(0, 40));
});

test("las posiciones por palabra suman el total", () => {
  for (const f of fixtures) {
    const r = counter.spans(f.text);
    assert.equal(r.total, f.count);
    assert.ok(r.exact, "posiciones inexactas: " + f.text.slice(0, 40));
  }
});
