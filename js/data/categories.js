// Categorías para ordenar un prompt por importancia. Lo que más pesa en la imagen va
// primero, porque el final del prompt pierde peso (ver CLAUDE.md, límite medido).
// Cada categoría: { id, label, re } (re sin flags; se usa con "i"). Un segmento se asigna a
// la primera categoría de CATEGORIES (en este orden de prioridad) cuyo patrón encaje.
// ORDER es el orden de salida.

const w = list => "\\b(?:" + list.join("|") + ")\\b";

export const CATEGORIES = [
  {
    id: "subject",
    label: "sujeto",
    re: w([
      "woman", "women", "man", "men", "girl", "girls", "boy", "boys", "person", "people",
      "child", "children", "kid", "kids", "lady", "gentleman", "couple", "friends?",
      "dancer", "adventurers?", "warrior", "knight", "soldier", "elf", "teen(?:ager)?s?",
      "(?:the|a|an)\\s+(?:\\w+\\s+)?one", "figure", "character", "portrait\\s+of",
    ]),
  },
  {
    id: "framing",
    label: "encuadre",
    re: w([
      "close-?ups?", "extreme close-?up", "headshot", "full[- ]body(?: shot)?", "upper[- ]body(?: shot)?",
      "half[- ]body", "medium shot", "wide shot", "long shot", "cowboy shot", "portrait shot",
      "medium shot from the thighs up",
    ]),
  },
  {
    id: "interaction",
    label: "interacción",
    re: w([
      "each other(?:'s)?", "one another", "hugging", "hugs?", "embrac(?:e|es|ing)", "kiss(?:es|ing)?",
      "holding hands", "hand in hand", "his hand", "her hand", "their hands", "arm in arm",
      "carrying (?:him|her)", "leaning on (?:him|her)", "dancing with", "facing each other",
    ]),
  },
  {
    id: "pose",
    label: "pose y expresión",
    re: w([
      "sitting", "seated", "sits", "standing", "stands", "lying", "kneeling", "crouching",
      "leaning", "walking", "running", "jumping", "dancing", "mid-leap", "mid-air", "reading",
      "holding", "pointing", "reaching", "looking", "gazing", "smiling", "laughing", "crying",
      "blushing", "pose", "posture", "hands? on", "arms?", "legs?", "elbows?", "knees?",
      "cross-legged", "contrapposto", "expression", "alone",
    ]),
  },
  {
    id: "appearance",
    label: "rasgos físicos",
    re: w([
      "hair", "bob", "braids?", "ponytail", "bun", "bangs", "beard", "stubble", "mustache",
      "eyes", "eyebrows?", "lips", "freckles", "skin", "complexion", "scar", "tattoos?",
      "face", "jaw", "nose", "muscular", "athletic", "slender", "tall", "short", "petite",
      "curvy", "broad shoulders", "shoulders", "toned", "build", "physique", "wrinkles",
      "anatomy", "hands", "fingers",
    ]),
  },
  {
    id: "clothing",
    label: "ropa",
    re: w([
      "wearing", "dressed", "shirt", "t-shirt", "blouse", "top", "jacket", "coat", "hoodie",
      "sweater", "dress", "gown", "skirt", "jeans", "trousers", "pants", "shorts", "joggers",
      "leotard", "overalls", "apron", "uniform", "suit", "tuxedo", "boots", "shoes", "sneakers",
      "heels", "sandals", "hat", "cap", "scarf", "gloves", "belt", "cloak", "armor", "armour",
      "jewel(?:le)?ry", "necklace", "earrings", "glasses", "spectacles", "barefoot", "bare feet",
      "sundress", "outfit", "clothes", "clothing", "bikini", "swimsuit", "lingerie",
    ]),
  },
  {
    id: "setting",
    label: "entorno",
    re: w([
      "street", "city", "park", "room", "bedroom", "kitchen", "living room", "office", "studio",
      "ballroom", "garden", "beach", "forest", "mountains?", "desert", "field", "meadow",
      "interior", "exterior", "outdoors?", "indoors", "background", "backdrop", "stage",
      "cafe", "bar", "library", "workshop", "floor", "bench", "chandeliers?", "landscape",
      "sky", "clouds", "snow", "rain", "smoke", "fog", "water", "sea", "river", "valley",
    ]),
  },
  {
    id: "light",
    label: "luz y momento",
    re: w([
      "light", "lights", "lighting", "lit", "lamp", "sun", "sunlight", "moonlight", "shadows?",
      "glow", "neon", "spotlight", "backlight", "rim light", "golden hour", "blue hour",
      "night", "dawn", "dusk", "sunset", "sunrise", "morning", "afternoon", "evening", "midday",
      "overcast",
    ]),
  },
  {
    id: "camera",
    label: "cámara",
    re: w([
      "shot", "lens",
      "\\d+\\s?mm", "f/\\d+(?:\\.\\d+)?", "depth of field", "bokeh", "angle", "low angle",
      "high angle", "from behind", "from above", "from below", "seen from", "framing",
      "composition", "focus",
    ]),
  },
  {
    id: "style",
    label: "estilo",
    re: w([
      "illustration", "painting", "watercolor", "watercolour", "oil", "sketch", "drawing",
      "drawn", "anime", "manga", "comic", "cartoon", "render", "3d", "photo", "photograph",
      "photography", "photorealistic", "realistic", "cinematic", "style", "palette",
      "brushstrokes", "texture", "grain", "film", "art", "artwork", "vector", "cel",
      "detailed", "pastel",
    ]),
  },
];

export const ORDER = ["subject", "framing", "appearance", "interaction", "pose", "clothing", "setting", "light", "camera", "style"];
