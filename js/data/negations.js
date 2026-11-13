// Negaciones con arreglo conocido. Nombrar algo, aunque sea para negarlo, puede hacer que
// aparezca, así que se cambian por una descripción en positivo o se quitan.
//   re:      expresión (sin flags; se usa con "gi" y límites de palabra)
//   replace: texto en positivo; "" = quitar (solo si es un segmento completo)
// El orden importa: las frases más largas primero.

export const NEGATIONS = [
  { re: "(?:no|without)\\s+(?:any\\s+)?make-?up", replace: "a bare face" },
  { re: "(?:no|without)\\s+(?:shoes|footwear)", replace: "barefoot" },
  { re: "(?:no|without)\\s+socks", replace: "bare ankles" },
  { re: "(?:no|without)\\s+(?:a\\s+)?beard", replace: "clean-shaven" },
  { re: "(?:no|without)\\s+sleeves", replace: "sleeveless" },
  { re: "(?:no|without)\\s+(?:a\\s+)?smile|not\\s+smiling", replace: "a neutral expression" },
  { re: "(?:no|without)\\s+clouds", replace: "a clear sky" },
  { re: "(?:no|without)\\s+(?:other\\s+)?(?:people|crowds?|bystanders)", replace: "an empty, deserted setting" },
  { re: "(?:no|without)\\s+background", replace: "a plain background" },
  { re: "(?:no|without)\\s+tattoos", replace: "unmarked skin" },
  { re: "(?:no|without)\\s+(?:blur|blurriness)|not\\s+blurry", replace: "sharp focus" },
  // Sin equivalente visual útil: se quitan si forman un segmento.
  { re: "(?:no|without)\\s+(?:text|words|letters|captions?)", replace: "" },
  { re: "(?:no|without)\\s+(?:watermarks?|logos?|signatures?)", replace: "" },
  { re: "(?:no|without)\\s+(?:glasses|spectacles|eyeglasses)", replace: "" },
  { re: "(?:no|without)\\s+(?:a\\s+)?hat", replace: "" },
  { re: "(?:no|without)\\s+jewel(?:le)?ry", replace: "" },
  { re: "(?:no|without)\\s+(?:extra|missing)\\s+(?:fingers|limbs|arms|legs)", replace: "" },
  { re: "(?:no|not)\\s+(?:deformed|disfigured|ugly|bad\\s+anatomy)", replace: "" },
];
