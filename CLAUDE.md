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
- Modelo de destino: FLUX.1 schnell, posiblemente Chroma (derivado de schnell).
  Diseñar con "perfiles de modelo" configurables:
  - schnell: CLIP 77 + T5 256 tokens; sin negative prompt (destilado).
  - Chroma: solo T5 (sin CLIP), max_sequence_length 512 por defecto en diffusers;
    admite negative prompt (usa CFG real).
- Público: usuarios con experiencia.
- Interfaz en español; prompts de salida en inglés.

## Siguiente paso
Cerrar el alcance del MVP.
