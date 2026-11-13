// Diff por palabras (LCS) entre el prompt original y el mejorado.
// Devuelve una lista de { op: "same" | "del" | "add", text }.

function split(text) {
  return text.split(/(\s+|[,.;:()])/).filter(Boolean);
}

export function diffWords(a, b) {
  const x = split(a);
  const y = split(b);
  const n = x.length;
  const m = y.length;
  // lcs[i][j] = longitud de la subsecuencia común más larga de x[i:] e y[j:]
  const lcs = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = x[i] === y[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const out = [];
  const push = (op, text) => {
    const last = out[out.length - 1];
    if (last && last.op === op) last.text += text;
    else out.push({ op, text });
  };
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (x[i] === y[j]) { push("same", x[i]); i++; j++; }
    else if (lcs[i + 1][j] >= lcs[i][j + 1]) push("del", x[i++]);
    else push("add", y[j++]);
  }
  while (i < n) push("del", x[i++]);
  while (j < m) push("add", y[j++]);
  return out;
}
