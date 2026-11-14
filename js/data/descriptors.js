// Descriptores para completar lo que falta y sustituir términos vagos. Listas propias,
// escritas desde cero. Texto en inglés (va al prompt) y etiqueta en español (interfaz).

// Categorías que se sugieren si el prompt tiene sujeto pero no dice nada de ellas.
// check: expresión (sin flags, se usa con "i") que indica que la categoría ya está cubierta.
export const MISSING = [
  {
    id: "framing",
    label: "Encuadre",
    check: "\\b(?:close-?up|headshot|full[- ]body|upper[- ]body|half[- ]body|waist up|thighs up|medium shot|wide shot|long shot|portrait|three-quarter view|profile view)\\b",
    options: [
      { text: "full-body shot", label: "cuerpo entero" },
      { text: "medium shot from the waist up", label: "plano medio" },
      { text: "close-up portrait", label: "primer plano" },
      { text: "three-quarter view", label: "vista de tres cuartos" },
    ],
  },
  {
    id: "expression",
    label: "Expresión",
    check: "\\b(?:smil\\w*|laugh\\w*|grin\\w*|frown\\w*|expression|pensive|serious|crying|tears|blush\\w*|pout\\w*|smirk\\w*|eyes closed|closed eyes|calm face|neutral face)\\b",
    options: [
      { text: "a gentle smile", label: "sonrisa suave" },
      { text: "a calm, neutral expression", label: "expresión neutra" },
      { text: "a pensive look", label: "mirada pensativa" },
      { text: "laughing with eyes half closed", label: "riendo" },
    ],
  },
  {
    id: "light",
    label: "Luz",
    check: "\\b(?:light|lights|lighting|lit|lamp|sun|sunlight|moonlight|shadows?|glow|neon|spotlight|backlight|golden hour|blue hour|overcast)\\b",
    options: [
      { text: "soft window light from the side", label: "luz de ventana" },
      { text: "warm golden hour sunlight", label: "hora dorada" },
      { text: "diffused overcast daylight", label: "día nublado" },
      { text: "rim light from behind", label: "contraluz de borde" },
      { text: "soft studio lighting", label: "luz de estudio" },
    ],
  },
  {
    id: "setting",
    label: "Entorno",
    check: "\\b(?:street|city|park|room|bedroom|kitchen|office|studio|ballroom|garden|beach|forest|mountains?|desert|field|meadow|interior|outdoors?|indoors|background|backdrop|stage|cafe|bar|library|workshop|floor|bench|landscape|sky)\\b",
    options: [
      { text: "a plain neutral grey background", label: "fondo neutro" },
      { text: "a cozy, lived-in living room", label: "salón" },
      { text: "a quiet city street", label: "calle" },
      { text: "a sunlit park", label: "parque" },
      { text: "a minimalist photo studio", label: "estudio" },
    ],
  },
  {
    id: "camera",
    label: "Cámara",
    check: "\\b(?:\\d+\\s?mm|lens|depth of field|bokeh|angle|eye level|f/\\d)\\b",
    options: [
      { text: "shot at eye level", label: "a la altura de los ojos" },
      { text: "shot on a 50mm lens", label: "objetivo 50 mm" },
      { text: "shallow depth of field", label: "poca profundidad de campo" },
      { text: "low-angle view", label: "contrapicado" },
    ],
  },
  {
    id: "style",
    label: "Estilo",
    check: "\\b(?:illustration|painting|watercolou?r|oil|sketch|drawing|drawn|anime|manga|comic|cartoon|render|3d|photo|photograph|photography|photorealistic|realistic|cinematic|style|film|artwork|vector)\\b",
    options: [
      { text: "photorealistic photograph", label: "foto realista" },
      { text: "35mm film photograph with fine grain", label: "foto de carrete" },
      { text: "digital painting", label: "pintura digital" },
      { text: "clean anime illustration", label: "ilustración anime" },
    ],
  },
];

// Términos vagos (no describen nada visible) y alternativas concretas.
// re: expresión sin flags; se busca con límites de palabra y sin distinguir mayúsculas.
export const VAGUE = [
  {
    re: "(?:nice|good|cool|great)\\s+pose",
    label: "pose",
    options: [
      { text: "relaxed contrapposto stance", label: "contrapposto" },
      { text: "one hand resting on the hip", label: "mano en la cadera" },
      { text: "arms crossed over the chest", label: "brazos cruzados" },
      { text: "leaning against a wall", label: "apoyada en la pared" },
    ],
  },
  {
    re: "(?:pretty|beautiful|nice|cute|perfect)\\s+face",
    label: "cara",
    options: [
      { text: "soft, symmetrical features", label: "rasgos suaves" },
      { text: "high cheekbones and full lips", label: "pómulos marcados" },
      { text: "a heart-shaped face with large eyes", label: "cara en corazón" },
    ],
  },
  {
    re: "(?:cool|nice|stylish|cute|beautiful)\\s+(?:outfit|clothes|clothing)",
    label: "ropa",
    options: [
      { text: "black leather jacket over a white t-shirt", label: "chaqueta de cuero" },
      { text: "oversized denim jacket and cargo pants", label: "vaquera y cargo" },
      { text: "tailored grey wool suit", label: "traje gris" },
      { text: "flowing linen summer dress", label: "vestido de lino" },
    ],
  },
  {
    re: "(?:good|nice|great|beautiful|perfect)\\s+light(?:ing)?",
    label: "luz",
    options: [
      { text: "soft window light from the side", label: "luz de ventana" },
      { text: "warm golden hour sunlight", label: "hora dorada" },
      { text: "soft studio lighting", label: "luz de estudio" },
    ],
  },
  {
    re: "(?:perfect|good|nice)\\s+anatomy",
    label: "anatomía",
    options: [
      { text: "natural, well-proportioned body", label: "proporciones naturales" },
      { text: "athletic build with defined muscles", label: "atlético" },
    ],
  },
  {
    re: "(?:perfect|good|nice)\\s+hands",
    label: "manos",
    options: [
      { text: "relaxed hands with five fingers each", label: "manos relajadas" },
      { text: "hands loosely clasped in front", label: "manos entrelazadas" },
    ],
  },
  {
    re: "(?:highly\\s+)?detailed\\s+face",
    label: "detalle de la cara",
    options: [
      { text: "visible skin texture and fine pores", label: "textura de piel" },
      { text: "sharp detail in the eyes and eyelashes", label: "ojos nítidos" },
    ],
  },
];
