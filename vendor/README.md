# Dependencias incluidas

- `tokenizers/`: [@huggingface/tokenizers](https://www.npmjs.com/package/@huggingface/tokenizers)
  0.2.0 (`dist/tokenizers.min.mjs`), licencia Apache-2.0 (ver `tokenizers/LICENSE`).
- `t5/`: tokenizador T5 (`tokenizer.json`, `tokenizer_config.json`) tal como lo distribuye
  [ComfyUI](https://github.com/comfyanonymous/ComfyUI/tree/master/comfy/text_encoders/t5_tokenizer).
  Es el vocabulario SentencePiece de T5 de Google (licencia Apache-2.0).

Se incluyen en el repositorio para que la app funcione sin CDN ni conexión.
