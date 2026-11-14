// Glosario ES→EN para términos que el traductor automático (OPUS-MT) traduce mal en
// prompts de imagen. Listas propias, escritas desde cero. Uso (ver js/translate.js): un
// segmento que es solo un término del glosario se sustituye sin traducir; si no, se traduce
// el original y luego se corrigen las traducciones erróneas conocidas del término.
//   es: expresión (sin flags; se usa con "gi", sin distinguir tildes: ver translate.js)
//   en: término inglés
//   ex: ejemplo concreto en español (para generar las traducciones erróneas del modelo con
//       tools/glossary_mt.mjs → js/data/glossary-mt.js)
// Más largas primero: se aplican en este orden.

export const GLOSSARY = [
  // Encuadre y cámara
  { es: "primerisimo primer plano", en: "extreme close-up", ex: "primerísimo primer plano" },
  { es: "primer plano", en: "close-up", ex: "primer plano" },
  { es: "plano medio corto", en: "medium close-up", ex: "plano medio corto" },
  { es: "plano medio", en: "medium shot", ex: "plano medio" },
  { es: "plano americano", en: "medium-long shot from the knees up", ex: "plano americano" },
  { es: "plano general", en: "wide shot", ex: "plano general" },
  { es: "plano entero|(?:retrato |plano )?de cuerpo entero", en: "full-body shot", ex: "plano entero" },
  { es: "contrapicado", en: "low-angle view", ex: "contrapicado" },
  { es: "picado", en: "high-angle view", ex: "picado" },
  { es: "cenital|vista cenital", en: "top-down view", ex: "cenital" },
  { es: "(?:vista )?de tres cuartos", en: "three-quarter view", ex: "de tres cuartos" },
  { es: "de perfil", en: "in profile", ex: "de perfil" },
  { es: "de espaldas", en: "seen from behind", ex: "de espaldas" },
  { es: "(?:poca|baja) profundidad de campo|profundidad de campo (?:reducida|corta|baja)", en: "shallow depth of field", ex: "poca profundidad de campo" },
  { es: "fondo desenfocado|desenfoque de fondo", en: "blurred background", ex: "fondo desenfocado" },
  { es: "objetivo de (\\d+) ?mm", en: "$1mm lens", ex: "objetivo de 85mm" },
  // Luz
  { es: "contraluz", en: "backlight", ex: "contraluz" },
  { es: "luz de borde|luz de contorno", en: "rim light", ex: "luz de borde" },
  { es: "hora dorada", en: "golden hour", ex: "hora dorada" },
  { es: "hora azul", en: "blue hour", ex: "hora azul" },
  { es: "luz cenital", en: "overhead light", ex: "luz cenital" },
  // Pose
  { es: "sentad[oa]s? con las piernas cruzadas", en: "sitting cross-legged", ex: "sentada con las piernas cruzadas" },
  { es: "piernas cruzadas", en: "crossed legs", ex: "piernas cruzadas" },
  { es: "brazos cruzados", en: "crossed arms", ex: "brazos cruzados" },
  { es: "(?:con )?las manos en (?:la cintura|las caderas)|brazos en jarra", en: "hands on hips", ex: "las manos en la cintura" },
  { es: "de rodillas", en: "kneeling", ex: "de rodillas" },
  { es: "en cuclillas", en: "crouching", ex: "en cuclillas" },
  { es: "tumbad[oa]s? boca arriba", en: "lying on the back", ex: "tumbada boca arriba" },
  { es: "tumbad[oa]s? boca abajo", en: "lying face down", ex: "tumbada boca abajo" },
  { es: "apoyad[oa]s? en", en: "leaning against", ex: "apoyada en" },
  // Pelo y rasgos
  { es: "dos coletas", en: "pigtails", ex: "dos coletas" },
  { es: "coleta", en: "ponytail", ex: "coleta" },
  { es: "mo[ñn]o", en: "bun", ex: "moño" },
  { es: "trenzas?", en: "braid", ex: "trenza" },
  { es: "flequillo", en: "bangs", ex: "flequillo" },
  { es: "mechones sueltos", en: "loose strands of hair", ex: "mechones sueltos" },
  { es: "pelo rapado|rapad[oa]", en: "buzz cut", ex: "pelo rapado" },
  { es: "pelirroj[oa]", en: "red-haired", ex: "pelirroja" },
  { es: "pecas", en: "freckles", ex: "pecas" },
  { es: "lunar", en: "beauty mark", ex: "lunar" },
  { es: "ojeras", en: "dark circles under the eyes", ex: "ojeras" },
  // Ropa
  { es: "vaqueros rotos|tejanos rotos", en: "ripped jeans", ex: "vaqueros rotos" },
  { es: "vaqueros|tejanos", en: "jeans", ex: "vaqueros" },
  { es: "zapatillas(?: deportivas)?|deportivas", en: "sneakers", ex: "zapatillas" },
  { es: "sudadera con capucha", en: "hoodie", ex: "sudadera con capucha" },
  { es: "chandal", en: "tracksuit", ex: "chándal" },
  { es: "mallas", en: "leggings", ex: "mallas" },
  { es: "camiseta de tirantes", en: "tank top", ex: "camiseta de tirantes" },
  { es: "falda lapiz", en: "pencil skirt", ex: "falda lápiz" },
  { es: "chal", en: "shawl", ex: "chal" },
  { es: "gabardina", en: "trench coat", ex: "gabardina" },
  { es: "chaqueta americana", en: "blazer", ex: "chaqueta americana" },
  { es: "peto", en: "overalls", ex: "peto" },
  { es: "tacones", en: "high heels", ex: "tacones" },
  { es: "botas altas", en: "knee-high boots", ex: "botas altas" },
  { es: "banador", en: "swimsuit", ex: "bañador" },
];
