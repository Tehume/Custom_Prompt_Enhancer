// Aplica en orden las reglas activas y reúne cambios y avisos.

import { RULES, findWarnings } from "./rules.js";

export function enhance(text, enabled = new Set(RULES.map(r => r.id))) {
  let out = text;
  const changes = [];
  for (const rule of RULES) {
    if (!enabled.has(rule.id)) continue;
    const r = rule.apply(out);
    out = r.text;
    for (const c of r.changes) changes.push({ rule: rule.id, ...c });
  }
  return { text: out, changes, warnings: findWarnings(out) };
}
