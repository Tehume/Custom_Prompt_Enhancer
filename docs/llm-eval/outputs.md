# Prueba de LLM locales: salidas completas (13-11-2026)

Generadas con `tools/llm_eval.mjs` (Transformers.js 4.3.1, CPU de 4 núcleos, q4, greedy,
`max_new_tokens` 320). Entrada: el prompt de `samples/prompts.json` ya limpiado por las reglas.
Prompt de sistema: `js/llm/prompt.js`. Valoración en `docs/llm-eval.md`.

## tag-soup

**Entrada** (50 tokens T5):

> 1girl, solo, long red hair, green eyes, freckles, standing, hands on hips, leather jacket, white t-shirt, ripped jeans, city street, night, neon lights, highly detailed, detailed face

**gemma-3-1b-it-ONNX** (118 tokens, 14.5 s):

> A young woman with long, vibrant red hair stands confidently in a busy city street at night. She has delicate green eyes and a scattering of freckles across her nose. She’s wearing a worn leather jacket over a white t-shirt, and ripped blue jeans. Her hands are placed on her hips, creating a slightly defensive posture. A neon-lit cityscape surrounds her, illuminated by glowing signs. She’s meticulously detailed, with a highly rendered face.  She is alone and stands purposefully.

**LFM2-1.2B-ONNX** (74 tokens, 6.8 s):

> A young woman with long red hair and green eyes, freckled, stands alone on a city street at night. She has her hands on her hips, wearing a leather jacket over a white t-shirt and ripped jeans. Her face is highly detailed, showing her freckles and expressive eyes, illuminated by neon lights.

**Qwen2.5-1.5B-Instruct** (64 tokens, 10.3 s):

> A young woman with long red hair and green eyes stands with her hands on her hips, wearing a black leather jacket over a white t-shirt and ripped jeans. She is standing on a city street at night, illuminated by neon lights. The scene is highly detailed and realistic.

**Qwen3-1.7B-ONNX** (50 tokens, 12.5 s):

> 1girl, solo, long red hair, green eyes, freckles, standing, hands on hips, leather jacket, white t-shirt, ripped jeans, city street, night, neon lights, highly detailed, detailed face

## weights-dupes

**Entrada** (49 tokens T5):

> athletic man, broad shoulders, short black beard, sitting on a wooden bench, leaning forward, elbows on knees, grey hoodie, black joggers, white sneakers, park, morning light

**gemma-3-1b-it-ONNX** (158 tokens, 15.7 s):

> A muscular man sits comfortably on a weathered wooden bench in a park during the early morning. He has a short, neatly trimmed black beard. He’s wearing a grey hoodie and black running-style joggers. White sneakers complete his attire. He’s leaning slightly forward, his elbows resting on his knees. A white shirt is visible underneath the hoodie. He’s holding his hands, and he’s looking slightly down at the ground. The scene is bathed in soft, golden morning light. The camera is a medium shot, focusing on the man’s athletic build and relaxed posture. The style is realistic and slightly cinematic.

**LFM2-1.2B-ONNX** (81 tokens, 6.3 s):

> A muscular man with broad shoulders sits on a wooden bench in a park, leaning forward with his elbows resting on his knees. He has a short black beard and is wearing a grey hoodie and black joggers. His white sneakers are visible, and he is dressed in grey clothing. Morning light illuminates the scene.

**Qwen2.5-1.5B-Instruct** (63 tokens, 9.1 s):

> An athletic man with broad shoulders sits on a wooden bench, leaning forward with his elbows on knees. He wears a grey hoodie, black joggers, and white sneakers. The scene is set in a park during the morning with soft light.

**Qwen3-1.7B-ONNX** (64 tokens, 12.9 s):

> An athletic man with broad shoulders and a short black beard sits on a wooden bench, leaning forward with his elbows on his knees. He wears a grey hoodie, black joggers, and white sneakers. The park is filled with morning light.

## negations

**Entrada** (54 tokens T5):

> A young woman with curly brown hair and no makeup, sitting cross-legged on the floor, reading a book, no glasses, wearing an oversized knit sweater, no shoes, cozy living room, warm lamp light, no text, no watermark

**gemma-3-1b-it-ONNX** (105 tokens, 11.5 s):

> A young woman with long, curly brown hair sits cross-legged on the floor, engrossed in a book. She has a bare face and is wearing an oversized, knitted sweater, no shoes. She’s comfortably seated in a cozy living room, illuminated by a warm lamp light. A barefoot posture suggests a relaxed state. She’s wearing a simple, oversized knit sweater. No text, no watermark.

**LFM2-1.2B-ONNX** (117 tokens, 9.5 s):

> A young woman with curly brown hair sits cross-legged on the floor in a cozy living room, surrounded by warm lighting from a lamp. She wears an oversized knit sweater and is barefoot, her bare skin contrasted against the softness of the sweater. She holds a book open, her face relaxed with a book in hand, no makeup on her face, and she doesn't wear glasses. The setting is warm, inviting, with the gentle glow of the lamp casting a soft light around her.

**Qwen2.5-1.5B-Instruct** (61 tokens, 9.4 s):

> A young woman with curly brown hair and no makeup, sitting cross-legged on the floor, reading a book, barefoot, wearing an oversized knit sweater, no shoes, in a cozy living room with a warm lamp light, no text, no watermark.

**Qwen3-1.7B-ONNX** (50 tokens, 12.4 s):

> A young woman with curly brown hair and no makeup is sitting cross-legged on the floor, reading a book, wearing an oversized knit sweater, no shoes, in a cozy living room with a warm lamp light.

## good-prose

**Entrada** (107 tokens T5):

> A tall elderly man with a silver beard and deep wrinkles stands at a workbench, gripping a chisel in his right hand while steadying a block of oak with his left. He wears a canvas apron over a rolled-sleeve flannel shirt. Soft window light falls across the workshop, catching sawdust in the air. Shot on a 50mm lens with a shallow depth of field.

**gemma-3-1b-it-ONNX** (188 tokens, 16.7 s):

> A tall, elderly man with a prominent silver beard and deeply etched wrinkles stands attentively at a wooden workbench. He’s holding a chisel firmly in his right hand, securing a block of oak with his left. He wears a worn canvas apron over a rolled-sleeve flannel shirt. Soft, diffused window light illuminates the workshop, creating a hazy effect as sawdust drifts upwards. Taken on a 50mm lens with a shallow depth of field. The man is a solo figure, focused intently on the task. He has a bare face, and his expression is serious. He’s wearing a canvas apron over a rolled-sleeve flannel shirt.

**LFM2-1.2B-ONNX** (110 tokens, 8.4 s):

> A tall elderly man, sporting a silver beard and deep wrinkles, stands at a workbench with a chisel in his right hand and an oak block in his left. He is dressed in a canvas apron over a rolled-sleeve flannel shirt. Soft window light illuminates the workshop, highlighting sawdust particles suspended in the air. The scene is captured with a 50mm lens, featuring a shallow depth of field.

**Qwen2.5-1.5B-Instruct** (107 tokens, 13.9 s):

> A tall elderly man with a silver beard and deep wrinkles stands at a workbench, gripping a chisel in his right hand while steadying a block of oak with his left. He wears a canvas apron over a rolled-sleeve flannel shirt. Soft window light falls across the workshop, catching sawdust in the air. Shot on a 50mm lens with a shallow depth of field.

**Qwen3-1.7B-ONNX** (110 tokens, 20.6 s):

> A tall elderly man with a silver beard and deep wrinkles stands at a workbench, gripping a chisel in his right hand while steadying a block of oak with his left. He wears a canvas apron over a rolled-sleeve flannel shirt. Soft window light falls across the workshop, catching sawdust in the air. The shot is taken on a 50mm lens with a shallow depth of field.

## style-first

**Entrada** (67 tokens T5):

> Watercolor illustration, soft pastel palette, loose brushstrokes, paper texture, golden hour, outdoor garden, two friends, one hugging the other from behind, laughing, the taller one with a short blonde bob in a yellow sundress, the shorter one with a black braid in denim overalls

**gemma-3-1b-it-ONNX** (137 tokens, 14.3 s):

> A watercolor illustration depicting two friends enjoying a sunny afternoon. A young woman with a blonde bob in a yellow sundress is hugging a younger man with a short braid in denim overalls. He’s laughing as she embraces him from behind. The taller man has a soft, pastel palette, loose brushstrokes, and a paper texture. He wears a simple, barefoot appearance. The setting is an outdoor garden bathed in golden hour light. A solo figure is capturing the scene with a camera, exhibiting a gentle style. The overall mood is joyful and affectionate.

**LFM2-1.2B-ONNX** (82 tokens, 8.0 s):

> A watercolor illustration of a soft pastel palette, featuring loose brushstrokes and paper texture, set during golden hour in an outdoor garden. Two friends are depicted, one hugging the other from behind, smiling and laughing. The taller friend has a short blonde bob in a yellow sundress, while the shorter one wears a black braid in denim overalls.

**Qwen2.5-1.5B-Instruct** (73 tokens, 11.6 s):

> A soft pastel watercolor illustration features two friends outdoors in an outdoor garden. The taller friend hugs the shorter friend from behind, both laughing. The taller friend has a short blonde bob in a yellow sundress, while the shorter friend has a black braid in denim overalls. The scene is captured during the golden hour sunlight.

**Qwen3-1.7B-ONNX** (68 tokens, 15.7 s):

> Watercolor illustration, soft pastel palette, loose brushstrokes, paper texture, golden hour, outdoor garden, two friends, one hugging the other from behind, laughing, the taller one with a short blonde bob in a yellow sundress, the shorter one with a black braid in denim overalls.

## contradictions

**Entrada** (36 tokens T5):

> portrait of a woman, full body shot, close-up, sitting and standing, short hair, long flowing hair, night scene, bright midday sun, red dress

**gemma-3-1b-it-ONNX** (110 tokens, 12.3 s):

> A woman is the primary subject. She is fully visible in a full-body shot. She is seated, but also stands upright. Her hair is short and flowing, a cascade of dark hair. She has a pale complexion. She is wearing a vibrant red dress. A bright midday sun illuminates the scene. The lighting is strong and direct. The camera is a shallow depth of field, focusing on her face. The style is realistic and slightly cinematic. A grainy texture is suggested.

**LFM2-1.2B-ONNX** (85 tokens, 7.2 s):

> A portrait of a young woman in a full-body shot, capturing her from both sitting and standing positions. She has short hair that falls close to her face and long flowing hair that cascades down her back. The scene is set at night but transitions to a bright midday sun, creating a striking contrast. She is wearing a red dress that flows elegantly around her.

**Qwen2.5-1.5B-Instruct** (77 tokens, 11.1 s):

> A young woman sits at a desk, her short hair framing her face. She stands beside a window, her long flowing hair swaying in the breeze. The scene is set against a bright midday sun, casting warm light on the room. A red dress hangs from a nearby tree, adding to the dramatic nighttime setting.

**Qwen3-1.7B-ONNX** (37 tokens, 9.8 s):

> Portrait of a woman, full body shot, close-up, sitting and standing, short hair, long flowing hair, night scene, bright midday sun, red dress.

## anatomy-fillers

**Entrada** (41 tokens T5):

> A muscular dancer mid-leap, arms extended, perfect anatomy, perfect hands, toned legs, black leotard, bare feet, stage spotlight, smoke, dramatic lighting

**gemma-3-1b-it-ONNX** (172 tokens, 17.2 s):

> A muscular dancer mid-leap, arms extended, perfectly proportioned body, and a flawless physique. She has a toned lower body, sleek black leotard, and bare feet. She is performing a dramatic leap on a stage, illuminated by a spotlight.  The scene is filled with dramatic, volumetric lighting, captured with a shallow depth of field. The camera focuses on her dynamic pose, emphasizing the upward motion of her limbs. A bare face is visible. She is alone.  A subtle haze of smoke surrounds her.  The overall style is realistic and dramatic, reminiscent of a cinematic composition.  Booru tags: 1girl, solo, black leotard, bare feet, stage spotlight, dramatic lighting.

**LFM2-1.2B-ONNX** (63 tokens, 5.2 s):

> A strong dancer in mid-air during a leap, arms fully extended, showcasing perfect body proportions and anatomy, hands perfectly formed, legs toned, wearing a black leotard, barefoot, illuminated by a stage spotlight with dramatic lighting creating shadows.

**Qwen2.5-1.5B-Instruct** (71 tokens, 10.5 s):

> A muscular dancer leaps into the air, arms extended wide, showcasing her perfect anatomy. Her toned legs and defined muscles are highlighted by the black leotard she wears. Barefoot, she stands on a stage surrounded by a stage spotlight and swirling smoke, creating a dramatic lighting effect.

**Qwen3-1.7B-ONNX** (42 tokens, 10.6 s):

> A muscular dancer mid-leap, arms extended, perfect anatomy, perfect hands, toned legs, black leotard, bare feet, stage spotlight, smoke, dramatic lighting.

## couple

**Entrada** (53 tokens T5):

> couple dancing, man in navy tuxedo, woman in emerald evening gown, his hand on her waist, her hand on his shoulder, looking into each other's eyes, ballroom, chandeliers, award winning photo

**gemma-3-1b-it-ONNX** (173 tokens, 16.4 s):

> A young man in a navy tuxedo is dancing gracefully with a woman in an emerald evening gown. He holds her waist with his hand, and she gently touches his shoulder. They are looking intently at each other, their eyes locked in a moment of affection. The scene takes place in a grand ballroom, illuminated by countless chandeliers. Soft, warm lighting highlights their faces and the intricate details of their clothing – the man’s tailored tuxedo, the woman’s shimmering emerald gown. They are posed in a classic dance formation, with a slight tilt to their heads. The camera focuses on their expressions of love and admiration. A professional photograph style, reminiscent of a winning competition.

**LFM2-1.2B-ONNX** (73 tokens, 6.1 s):

> A young man in a navy tuxedo dances with a woman wearing an emerald evening gown, both alone in a ballroom with chandeliers illuminating their intertwined hands and gazes. The couple is posed with graceful posture, capturing the moment of connection and celebration.

**Qwen2.5-1.5B-Instruct** (77 tokens, 11.0 s):

> A young woman in an emerald evening gown is dancing with a young man in a navy tuxedo. His hand rests on her waist, while hers touches his shoulder. They look into each other's eyes, surrounded by chandeliers in a ballroom. This award-winning photo captures their intimate moment.

**Qwen3-1.7B-ONNX** (71 tokens, 16.1 s):

> A couple dancing in a ballroom. A man in a navy tuxedo, his hand on the waist of a woman in an emerald evening gown, her hand on his shoulder, both looking into each other's eyes. The setting includes chandeliers. This is an award-winning photo.

## vague

**Entrada** (17 tokens T5):

> girl sitting, nice pose, beautiful, pretty face, cool outfit, good lighting

**gemma-3-1b-it-ONNX** (139 tokens, 15.0 s):

> A young woman is sitting gracefully. She has a lovely, relaxed pose, looking slightly forward. Her face is attractive, with a delicate beauty. She has long, flowing brown hair that cascades down her back. She’s wearing a stylish, fitted outfit – a dark blue top paired with a pair of denim shorts. A subtle glow emanates from her, creating a warm, inviting light. The camera focuses on her, capturing a flattering angle. The style is realistic and slightly cinematic, with a focus on soft details. A barefoot appearance is suggested.  The girl is alone.

**LFM2-1.2B-ONNX** (37 tokens, 4.0 s):

> A young woman sits with a graceful pose, her face is beautiful and pretty, wearing a stylish outfit that complements her cool look, all set against good lighting.

**Qwen2.5-1.5B-Instruct** (78 tokens, 11.8 s):

> A young woman sits in a comfortable position, her face is beautiful and her features are well-defined. She wears a stylish outfit that complements her appearance, and the lighting highlights her features beautifully. The setting is a cozy room with soft lighting, and the camera captures the scene from a flattering angle. The overall style is modern and elegant.

**Qwen3-1.7B-ONNX** (32 tokens, 9.0 s):

> A young woman sitting in a nice pose, with a beautiful and pretty face. She has a cool outfit, and the lighting is good.

## too-long

**Entrada** (590 tokens T5):

> A detailed full-body illustration of two adventurers resting at a mountain pass. The first is a broad-shouldered woman in her forties with weathered olive skin, a strong jaw, a thin scar crossing her left eyebrow, deep-set hazel eyes and thick dark eyebrows. Her black hair is shaved on the sides and gathered on top into a short braided crest held by a copper ring. She wears a sleeveless quilted gambeson in faded crimson, laced at the sides with leather cords, over a long-sleeved linen undershirt rolled to the elbows. Her forearms are wrapped in stained cloth bandages and she has a small tattoo of three dots on the back of her right hand. A wide leather belt with a brass buckle carries a pouch, a coiled rope, a waterskin and a short curved knife in a worn sheath. Her trousers are dark brown wool, tucked into knee-high boots with reinforced toes and scuffed heels. Over her shoulders hangs a heavy grey wool cloak with a fur-lined collar, pinned at the chest with an iron brooch shaped like a wolf head. The second adventurer is a slender young man with pale freckled skin, a narrow face, large grey eyes, a slightly crooked nose and messy shoulder-length copper hair tied loosely at the nape. He wears round wire-rimmed spectacles, a dark green hooded tunic with embroidered silver vines along the hem and cuffs, fingerless leather gloves, a satchel crossed over his chest stuffed with rolled maps and quills, slim grey trousers and soft ankle boots. A small brass compass hangs from a chain around his neck. In the background, jagged snowy peaks rise under a pale sky with drifting clouds, a narrow stone path winds down into a valley of dark pine forests, a crumbling watchtower stands on a distant ridge, and a few ravens circle overhead. The light is cold and clear, late afternoon, with long blue shadows on the snow and a warm glow on the edges of the clouds. The woman sits on a flat boulder with her legs apart, elbows resting on her knees, holding the waterskin in both hands, while the man stands beside her leaning on a wooden staff, one hand on her shoulder, pointing toward the valley with the other and smiling.

**gemma-3-1b-it-ONNX** (434 tokens, 53.9 s):

> A detailed full-body illustration of two adventurers resting at a mountain pass. The first is a broad-shouldered woman in her forties with weathered olive skin, a strong jaw, a thin scar crossing her left eyebrow, deep-set hazel eyes and thick dark eyebrows. Her black hair is shaved on the sides and gathered into a short braided crest held by a copper ring. She wears a sleeveless quilted gambeson in faded crimson, laced at the sides with leather cords, over a long-sleeved linen undershirt rolled to the elbows. Her forearms are wrapped in stained cloth bandages and she has a small tattoo of three dots on the back of her right hand. A wide leather belt with a brass buckle carries a pouch, a coiled rope, a waterskin, and a short curved knife in a worn sheath. Her trousers are dark brown wool, tucked into knee-high boots with reinforced toes and scuffed heels. Over her shoulders hangs a heavy grey wool cloak with a fur-lined collar, pinned at the chest with an iron brooch shaped like a wolf head. The second adventurer is a slender young man with pale freckled skin, a narrow face, large grey eyes, a slightly crooked nose and messy shoulder-length copper hair tied loosely at the nape. He wears round wire-rimmed spectacles, a dark green hooded tunic with embroidered silver vines along the hem and cuffs, fingerless leather gloves, a satchel crossed over his chest stuffed with rolled maps and quills, slim grey trousers and soft ankle boots. A small brass compass hangs from a chain around his neck.

**LFM2-1.2B-ONNX** (377 tokens, 32.4 s):

> Create a full-body illustration showing two figures at a mountain pass. The first is a broad-shouldered woman in her forties named Elara with weathered olive skin, a strong jaw, a scar on her left eyebrow, hazel eyes, and thick eyebrows. She has black hair shaved sides and braided at the top with a copper ring, wearing a crimson quilted gambeson over a linen undershirt, sleeveless, with bandaged forearms and a tattoo of three dots on her right hand. A leather belt with a brass buckle holds a pouch, coiled rope, waterskin, and a short curved knife. She is barefoot, wearing stained cloth bandages on her forearms.
> >
> > Her companion is a slender young man named Kael with pale freckled skin, large grey eyes, a crooked nose, and messy shoulder-length copper hair. He wears wire-rimmed spectacles, a green hooded tunic with silver vine embroidery, fingerless gloves, and a satchel filled with maps and quills. A brass compass is around his neck.
> >
> > Elara rests on a boulder with legs apart, elbows on her knees, holding a waterskin, while Kael stands beside her, holding a wooden staff, pointing towards a valley with ravens circling above. The setting is late afternoon with cold clear light, snowy peaks, a pale sky, drifting clouds, a stone path leading into dark pine forests, and a crumbling watchtower on a distant ridge

**Qwen2.5-1.5B-Instruct** (419 tokens, 65.9 s):

> Two adventurers rest at a mountain pass. The woman is a broad-shouldered woman in her forties with weathered olive skin, a strong jaw, a thin scar crossing her left eyebrow, deep-set hazel eyes, thick dark eyebrows, black hair shaved on the sides and gathered on top into a short braided crest held by a copper ring. She wears a sleeveless quilted gambeson in faded crimson, laced at the sides with leather cords, over a long-sleeved linen undershirt rolled to the elbows. Her forearms are wrapped in stained cloth bandages and she has a small tattoo of three dots on the back of her right hand. A wide leather belt with a brass buckle carries a pouch, a coiled rope, a waterskin and a short curved knife in a worn sheath. Her trousers are dark brown wool, tucked into knee-high boots with reinforced toes and scuffed heels. Over her shoulders hangs a heavy grey wool cloak with a fur-lined collar, pinned at the chest with an iron brooch shaped like a wolf head. The man is a slender young man with pale freckled skin, a narrow face, large grey eyes, a slightly crooked nose and messy shoulder-length copper hair tied loosely at the nape. He wears round wire-rimmed spectacles, a dark green hooded tunic with embroidered silver vines along the hem and cuffs, fingerless leather gloves, a satchel crossed over his chest stuffed with rolled maps and quills, slim grey trousers and soft ankle boots. A small brass compass hangs from a chain

**Qwen3-1.7B-ONNX** (414 tokens, 99.6 s):

> A detailed full-body illustration of two adventurers resting at a mountain pass. The first is a broad-shouldered woman in her forties with weathered olive skin, a strong jaw, a thin scar crossing her left eyebrow, deep-set hazel eyes, and thick dark eyebrows. Her black hair is shaved on the sides and gathered on top into a short braided crest held by a copper ring. She wears a sleeveless quilted gambeson in faded crimson, laced at the sides with leather cords, over a long-sleeved linen undershirt rolled to the elbows. Her forearms are wrapped in stained cloth bandages and she has a small tattoo of three dots on the back of her right hand. A wide leather belt with a brass buckle carries a pouch, a coiled rope, a waterskin, and a short curved knife in a worn sheath. Her trousers are dark brown wool, tucked into knee-high boots with reinforced toes and scuffed heels. Over her shoulders hangs a heavy grey wool cloak with a fur-lined collar, pinned at the chest with an iron brooch shaped like a wolf head. The second adventurer is a slender young man with pale freckled skin, a narrow face, large grey eyes, a slightly crooked nose, and messy shoulder-length copper hair tied loosely at the nape. He wears round wire-rimmed spectacles, a dark green hooded tunic with embroidered silver vines along the hem and cuffs, fingerless leather gloves, a satchel crossed over his chest stuffed with rolled maps and quills,
