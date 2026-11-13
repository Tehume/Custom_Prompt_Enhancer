// Aplica en orden las reglas activas y reúne cambios y avisos.

import { RULES, findWarnings } from "./rules.js";

// ctx.counter (opcional): contador T5 para las reglas que miden longitud.
export function enhance(text, enabled = new Set(RULES.map(r => r.id)), ctx = {}) {
  let out = text;
  const changes = [];
  const warnings = [];
  for (const rule of RULES) {
    if (!enabled.has(rule.id)) continue;
    const r = rule.apply(out, ctx);
    out = r.text;
    for (const c of r.changes) changes.push({ rule: rule.id, ...c });
    if (r.warnings) warnings.push(...r.warnings);
  }
  return { text: out, changes, warnings: [...warnings, ...findWarnings(out)] };
}
