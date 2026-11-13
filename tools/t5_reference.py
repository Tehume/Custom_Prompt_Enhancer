"""Genera tests/fixtures/t5_counts.json: recuento T5 de referencia (librería Rust
`tokenizers`, la misma que usa ComfyUI) para los prompts de samples/prompts.json.

Uso: pip install tokenizers && python3 tools/t5_reference.py
"""
import json
import os

from tokenizers import Tokenizer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tk = Tokenizer.from_file(os.path.join(ROOT, "vendor/t5/tokenizer.json"))
samples = json.load(open(os.path.join(ROOT, "samples/prompts.json"), encoding="utf-8"))
extra = ["", "Hello world", "a  double  space\nand newline", "café, naïve — “quotes” 50mm f/1.8",
         "((athletic man)), (broad shoulders:1.4)", "{red|blue} dress"]
texts = [s["prompt"] for s in samples] + extra
out = [{"text": t, "count": len(tk.encode(t).ids) if t.strip() else 0} for t in texts]
json.dump(out, open(os.path.join(ROOT, "tests/fixtures/t5_counts.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
for o in out:
    print(o["count"], o["text"][:50])
