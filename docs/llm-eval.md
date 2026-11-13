# Prueba de LLM locales para reescribir prompts (13-11-2026)

Objetivo: saber si un LLM pequeño, ejecutado en el navegador, puede convertir un prompt
(limpiado antes por las reglas) en prosa clara sin perder ni inventar detalles.

Montaje: 4 modelos ONNX de 1–1,7B parámetros, cuantizados a 4 bits, con Transformers.js
4.3.1 en CPU (4 núcleos), decodificación greedy. 10 prompts inventados centrados en sujetos
(`samples/prompts.json`). Salidas completas en `docs/llm-eval/outputs.md`.

## Resumen

| Modelo | Descarga (q4f16) | Licencia | s/prompt (CPU) | Prosa | Fidelidad |
|---|---|---|---|---|---|
| Gemma 3 1B | ~760 MB | Gemma Terms | 18,8 | Buena | Mala: inventa mucho |
| LFM2 1.2B | ~760 MB | LFM Open License | 9,4 | Buena | Media: inventa algo |
| Qwen2.5 1.5B Instruct | ~1,2 GB | Apache-2.0 | 16,4 | Buena | Media-alta |
| Qwen3 1.7B | ~1,4 GB | Apache-2.0 | 21,9 | Poca: a menudo no reescribe | Alta |

Los tiempos son de CPU en un servidor; en el navegador con WebGPU deberían ser menores
(no medido: probar con `lab/llm.html`).

## Observaciones por modelo

- **Gemma 3 1B**: descartado. Inventa pelo, ropa, cámara y estilo («dark blue top», «a white
  shirt is visible»), cambia el sexo de un personaje, copia ejemplos del prompt de sistema
  («bare face», «barefoot») donde no tocan y filtra instrucciones («Booru tags: 1girl…»).
- **LFM2 1.2B**: el más rápido y con la prosa más natural. Pone la pose al principio en el
  prompt largo (lo correcto). Pero inventa nombres («Elara», «Kael»), empieza con
  «Create a…», añade «barefoot» sin motivo y mantiene contradicciones.
- **Qwen2.5 1.5B**: buen equilibrio. Reescribe casi todos los prompts sin inventar mucho.
  Fallos: deja «no makeup», «no shoes»; con las contradicciones inventa una escena absurda
  («a red dress hangs from a nearby tree»); en «vague» añade escenario y estilo.
- **Qwen3 1.7B** (sin razonamiento): el más fiel pero el más perezoso. En 4 de 10 prompts
  devuelve la misma lista de etiquetas. Su alta cobertura de palabras (95 %) se debe a eso.

## Fallos comunes

1. **Contradicciones**: ninguno aplica «quédate con la primera».
2. **Negaciones**: solo resuelven bien las del ejemplo del prompt de sistema.
3. **Invención** ante prompts vagos: rellenan con detalles propios.
4. **Contaminación** por los ejemplos del prompt de sistema.
5. **Prompts largos**: con 320 tokens de salida, los > 400 tokens se cortan (y se pierde
   lo del final, que en el ejemplo era la pose).

## Conclusión

Un LLM local de 1–1,5B **sí mejora la prosa** de listas de etiquetas, pero **no es fiable
solo**. Propuesta:

1. Las **reglas** hacen lo determinista antes del LLM: muletillas, pesos, negaciones con
   diccionario, contradicciones (avisar o elegir), etiquetas booru → texto.
2. El **LLM** solo reescribe en prosa, con un prompt de sistema sin ejemplos contaminantes y
   pocos ejemplos completos (few-shot).
3. **Control posterior**: marcar en el diff las palabras de contenido que no estaban en la
   entrada (posibles invenciones) para que el usuario las acepte o quite.
4. Prompts largos: no pasarlos enteros; reescribir por frases o solo reordenar.

Candidatos para seguir: **Qwen2.5 1.5B** (fidelidad, Apache-2.0) y **LFM2 1.2B** (velocidad,
prosa). Pendiente probar LFM3 1.7B (publicado 27-10-2026) y medir en navegador con WebGPU.

---

# Ronda 2 (13-11-2026): reglas nuevas + prompt de sistema v2

Cambios: las reglas resuelven antes negaciones, contradicciones y etiquetas booru; el prompt
de sistema (v2, `js/llm/prompt.js`) ya no lleva ejemplos dentro de las reglas, sino dos
ejemplos completos aparte; la app no pasa al LLM prompts que ya están en prosa o que superan
350 tokens. Salidas en `docs/llm-eval/v2/`.

| Modelo | s/prompt (CPU) | Resultado |
|---|---|---|
| LFM2 1.2B | ~4,8 | El mejor: prosa natural y fiel. Inventa poco (verbos de enlace); en un caso copia «sitting back to back» del ejemplo y en otro omite «white sneakers». |
| Qwen2.5 1.5B | ~7,4 | Fiel, pero menos prosa (deja trozos de lista); pierde parte de la interacción en «couple» y cambia el sexo del bailarín. |
| LFM2 700M | ~3,4 | Inventa bastante (flores, «around her neck…»). Solo como opción ligera. |
| Qwen2.5 0.5B | ~6,6 | Descartado: entra en bucle y copia «pencil sketch» del ejemplo. |
| LFM3 1.7B | — | No ejecutable: Transformers.js 4.3.1 no admite su arquitectura. |

Conclusiones:
- Con las reglas por delante, **LFM2 1.2B** da salidas utilizables; queda como predeterminado.
- Los ejemplos del prompt de sistema aún se cuelan a veces: la marca de posibles invenciones
  los detecta («sitting», «back», «pencil», «sketch»).
- Las interacciones entre personas (manos, contacto) son lo que más se pierde: vigilar.
