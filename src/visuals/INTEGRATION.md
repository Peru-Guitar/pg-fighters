# Fighter art integration

Art must not change inputs, hitboxes, damage, cooldowns, CPU, jump physics or round rules.

The game uses `scenes/PreloadScene.ts`, `data/fighters.ts` and `systems/FighterArt.ts`. `systems/AnimeAtlas.ts` registers the base and extra anime sheets as two multi-source textures (`pata-anime`, `edu-anime`), with the prefixes `mayin-` and `erp-`. Preload loads the neighborhood image under the `bar` key. `poseScale` preserves body scale for the supplemental poses. FighterArt resolves combat pose names automatically.
