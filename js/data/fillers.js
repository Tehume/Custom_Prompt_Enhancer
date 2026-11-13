// Muletillas de calidad heredadas de Stable Diffusion / boorus.
// Solo se eliminan cuando forman un segmento completo (entre comas), nunca dentro de una
// frase. Su efecto real en FLUX no está verificado: se quitan porque ocupan tokens sin
// describir nada visible. La lista crecerá; cada entrada es un segmento normalizado.

export const FILLERS = [
  "masterpiece",
  "best quality",
  "high quality",
  "highest quality",
  "top quality",
  "ultra quality",
  "amazing quality",
  "absurdres",
  "highres",
  "hires",
  "4k",
  "8k",
  "16k",
  "uhd",
  "ultra hd",
  "trending on artstation",
  "artstation",
  "award winning",
  "award-winning",
  "ultra detailed",
  "ultra-detailed",
  "extremely detailed",
  "very detailed",
  "very very detailed",
  "score_9",
  "score_8_up",
  "score_7_up",
  "amazing",
];
