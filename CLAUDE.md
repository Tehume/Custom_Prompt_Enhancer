# Proyecto: Mejorador de prompts para FLUX (web app)

## Instrucciones para Claude
- Responde en español, de forma concisa y rigurosa. Pregunta si algo no está claro.
- El producto final NO debe usar la API de Claude.

## Objetivo
Web app de aprendizaje, sin ánimo de lucro, que ayude a mejorar prompts para
generación de imágenes con FLUX: sugerir sinónimos y descriptores, mejorar la prosa
narrativa, controlar la longitud en tokens y (opcional) traducir de español a inglés.

## Restricciones
- Sin usar la API de Claude.
- Modelo de destino: FLUX (cifras verificadas para FLUX.1 dev/schnell).
- Prompts en inglés al principio; posible traductor ES→EN con mejoras.

## Conclusiones de viabilidad
- FLUX.1 usa dos codificadores: CLIP (77 tokens) y T5 (hasta 512 en dev, 256 en schnell).
  Más que recortar, lo útil es avisar de qué parte del prompt lee cada codificador.
- FLUX responde mejor a lenguaje natural que a listas de etiquetas, así que la mejora
  de prosa es lo más valioso y lo más difícil sin un LLM.
- Viable sin ningún modelo: contar tokens (tokenizadores abiertos), sinónimos y
  descriptores por categoría (tesauros y listas curadas), detectar redundancias,
  plantillas de estructura (sujeto → acción → entorno → luz → cámara → estilo).
- Viable con modelos locales en el navegador (Transformers.js): traducción ES→EN con
  OPUS-MT (Xenova/opus-mt-es-en). Conviene un glosario para proteger términos técnicos.
- Reescritura de prosa: solo con plantillas, o con un LLM pequeño local (calidad incierta).
- Arquitectura propuesta: web estática sin backend (p. ej. GitHub Pages), coste cero.
- Referente existente: promptoMANIA (constructor de prompts sin IA).

## Decisiones (brainstorming)
- Se aceptan modelos locales en el navegador (Transformers.js / WebLLM).
- Web aparte (no integrada en Perchance). Destino de los prompts: el modelo de imagen
  de Perchance (text-to-image-plugin), que los usuarios usan p. ej. en
  Tehume/Custom_Image_Generator.
- Modelo de Perchance: «basado en FLUX.1-schnell», prefiere descripciones literales y los
  negativos funcionan peor (https://perchance.org/new-image-model-notes). La comunidad lo
  atribuye a Chroma (no confirmado; Chroma no usa CLIP).
- Límite práctico medido (Custom_Image_Generator/tests/truncation, 26-10-2026): el texto
  llega al modelo hasta ~460 tokens T5; más allá de 512, poco peso. No hay corte en 256.
  => Contar con el tokenizador T5 real; avisos a ~450 y 512. El aviso de CLIP 77 no aplica
  con seguridad (no se sabe si el modelo usa CLIP).
- Tokenizador T5 de referencia: el de ComfyUI (ver Custom_Image_Generator/tools/t5_tokens.py).
- Prompt negativo: existe en el plugin pero rinde peor; priorizar reformular en positivo.
- Objetivo prioritario: ENHANCER (entrada → prompt mejorado). El análisis es apoyo,
  no el producto.
- Listas de descriptores desde cero; Custom_Image_Generator solo como referencia,
  sin reutilizar código ni listas.
- Público: usuarios con experiencia.
- Interfaz en español; prompts de salida en inglés.

## MVP (acordado)
Entrada: prompt → salida: prompt mejorado, con diff frente al original y botón de copiar.
- Automático (reglas): limpiar muletillas SD/repeticiones/pesos; negativos → positivo;
  reordenar por importancia; etiquetas → prosa con plantillas; ajustar a ~450 tokens T5.
- Asistido: completar categorías ausentes con descriptores; nivel de intensidad.
- Análisis (tokens, avisos) como apoyo.
- Prueba temprana: 2-3 LLM locales pequeños (WebLLM, 1-3B) para reescritura de prosa.
- Después: traducción ES→EN con glosario; variantes con sintaxis {a|b} de Perchance.

## Infraestructura
- Repositorio privado por ahora; desarrollo en local con servidor estático
  (los módulos/workers no funcionan bien desde file://).
- GitHub Pages en repo privado requiere plan de pago y el sitio sería público igualmente.

## Estado
- Esqueleto hecho: entrada → reglas (pesos SD, muletillas, repeticiones, espacios) →
  salida con diff, medidor T5 (exacto, verificado contra `tokenizers` de Rust) y aviso
  de negaciones. Sin dependencias de CDN (vendor/). Pruebas: `npm test`.
- Prompts de prueba inventados en samples/prompts.json, centrados en sujetos
  (anatomía, pose, interacción, vestimenta); el estilo es secundario. Etiquetas booru
  (1girl, solo…) aparecen a veces: traducirlas a texto.
- Prueba de LLM local hecha (docs/llm-eval.md): mejoran la prosa pero no son fiables solos
  (inventan, no resuelven contradicciones ni negaciones). Candidatos: Qwen2.5-1.5B-Instruct
  y LFM2-1.2B. Laboratorio en el navegador: lab/llm.html.

## Arquitectura acordada (tras la prueba de LLM)
1. Reglas primero (deterministas): muletillas, pesos, negaciones con diccionario,
   contradicciones, etiquetas booru → texto.
2. LLM local opcional (descarga bajo demanda) solo para redactar en prosa; prompt de
   sistema sin ejemplos contaminantes, con pocos ejemplos completos.
3. Control posterior: marcar en el diff las palabras de contenido nuevas (posibles
   invenciones) para aceptarlas o quitarlas.
4. Prompts largos: no reescribirlos enteros (por frases o solo reordenar).

## Siguiente paso
Reglas nuevas (negaciones, contradicciones, booru) e integración del LLM opcional.
Pendiente: medir el laboratorio en el dispositivo del usuario (tablet).
