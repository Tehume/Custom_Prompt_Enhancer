# Custom Prompt Enhancer

Mejorador de prompts para FLUX (modelo de imagen de Perchance). Web estática: todo se
ejecuta en el navegador, sin servidor ni API externas.

## Uso en local

Hace falta servirla por HTTP (desde `file://` no cargan los módulos):

```bash
python3 -m http.server 8000
```

y abrir <http://localhost:8000>.

## Estructura

- `index.html`, `css/app.css`, `js/main.js`: interfaz.
- `js/pipeline.js`, `js/rules.js`, `js/segments.js`, `js/data/`: reglas de mejora.
- `js/tokens.js`: recuento de tokens T5 (límites 450 / 512).
- `js/diff.js`: diff por palabras entre original y mejorado.
- `samples/prompts.json`: prompts de prueba inventados.
- `vendor/`: tokenizador y librería incluidos (ver `vendor/README.md`).

## Pruebas

```bash
npm test
```

`tests/fixtures/t5_counts.json` son recuentos de referencia generados con la librería
Rust `tokenizers` (`python3 tools/t5_reference.py`); el recuento en JS debe coincidir.
