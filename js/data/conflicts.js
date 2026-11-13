// Grupos de opciones excluyentes. Si en un prompt aparecen dos opciones distintas del
// mismo grupo, es una contradicción. Cada opción: { name, re } (re sin flags; se usa con
// "gi"). Las expresiones son deliberadamente estrechas para evitar falsos positivos.

export const CONFLICTS = [
  {
    id: "framing",
    label: "encuadre",
    options: [
      { name: "primer plano", re: "\\b(?:extreme\\s+)?close-?ups?\\b|\\bheadshot\\b" },
      { name: "plano entero", re: "\\bfull[- ]body(?:\\s+shot)?\\b|\\bwide\\s+shot\\b" },
    ],
  },
  {
    id: "posture",
    label: "postura",
    options: [
      { name: "sentado", re: "\\b(?:sitting|seated|sits)\\b" },
      { name: "de pie", re: "\\b(?:standing|stands)\\b" },
      { name: "tumbado", re: "\\b(?:lying|lies|reclining)\\b" },
    ],
  },
  {
    id: "hair-length",
    label: "largo del pelo",
    options: [
      { name: "pelo corto", re: "\\b(?:short|cropped|pixie[- ]cut)\\s+(?:[\\w-]+\\s+){0,2}hair\\b|\\bbuzz\\s*cut\\b" },
      { name: "pelo largo", re: "\\b(?:long|waist-length|very\\s+long)\\s+(?:[\\w-]+\\s+){0,2}hair\\b" },
    ],
  },
  {
    id: "time",
    label: "momento del día",
    options: [
      { name: "noche", re: "\\b(?:night(?:time)?|midnight)\\b" },
      { name: "día", re: "\\b(?:midday|noon|daylight|daytime|midday\\s+sun)\\b" },
    ],
  },
];
