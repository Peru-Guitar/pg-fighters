# Roster art

Data for each fighter (name, title, bio, quote, style, colors, power and ultimate) is in `src/data/fighters.ts`.

| No. | id | Name | Art |
|---|---|---|---|
| 01 | `erp` | ERP PROJECT | `public/assets/characters/erp/animations/` (27 animations, 216 frames) |
| 02 | `mayin` | MAYINBLUES | `public/assets/characters/mayin/animations/` (27 animations, 216 frames) |
| 03 | `george` | GEORGE | `public/assets/characters/george/` |
| 04 | `pepper` | PEPPER | `public/assets/characters/pepper/animations/` (27 animations, 216 frames) |
| 05 | `slandor` | SLANDOR | `public/assets/characters/slandor/` |
| 06 | `pentalick` | PENTALICK | `public/assets/characters/pentalick/animations/` (27 animations, 216 frames) |
| 07 | `mimetico` | MIMÉTICO | `public/assets/characters/mimetico/` |
| 08 | `clavito` | CLAVITO | `public/assets/characters/clavito/` |
| 09 | `chantal` | CHANTAL | `public/assets/characters/chantal/` |
| 10 | `jeanpierre` | JEAN-PIERRE | `public/assets/characters/jeanpierre/` |
| 11 | `ferdex` | FERDEX | `public/assets/characters/ferdex/animations/` (27 animations, 216 frames) |
| 12 | `turboshred` | TURBOSHRED | `public/assets/characters/turboshred/animations/` (27 animations, 216 frames) |
| 13 | `toxicity` | TOXICITY | `public/assets/characters/toxicity/animations/` (27 animations, 216 frames) |
| 14 | `rematada` | LA REMATADA | `public/assets/characters/rematada/animations/` (27 animations, 216 frames) |
| 15 | `escalas` | ESCALAS | `public/assets/characters/escalas/animations/` (27 animations, 216 frames) |
| 16 | `tayloy` | TAYLOY | `public/assets/characters/tayloy/animations/` (27 animations, 216 frames) |
| 17 | `jesex` | JESEX | `public/assets/characters/jesex/animations/` (27 animations, 216 frames) |
| 18 | `markus` | MARKUS | `public/assets/characters/markus/animations/` (27 animations, 216 frames) |
| 19 | `platanero` | PLATANERO | `public/assets/characters/platanero/animations/` (27 animations, 216 frames) |
| 20 | `ricardo` | RICARDO | `public/assets/characters/ricardo/animations/` (27 animations, 216 frames) |
| 21 | `kimberly` | KIMBERLY | `public/assets/characters/kimberly/animations/` (27 animations, 216 frames) |
| 22 | `nosu` | NOSU | `public/assets/characters/nosu/animations/` and portrait |
| 23 | `virrey` | EL VIRREY | `public/assets/characters/virrey/animations/` and portrait |
| 24 | `tevi` | TEVI | `public/assets/characters/tevi/animations/` (27 animations, 216 frames) and portrait |
| ?? | `acople` | EL ACOPLE | `public/assets/characters/acople/animations/` (27 animations, 216 frames) |

## Pending

- **`jungla` stage:** `public/assets/stages/jungla.png` shows a river dock and must be redone. Dense Amazon jungle at night, original concept: giant trees with vines, huge roots forming the fight floor, low fog, fireflies and glowing flowers, and old amps and speakers covered in moss. **Wild animals in the background**, always behind the fight zone: a jaguar on a branch, macaws, monkeys on vines, a toucan and a distant waterfall. No dock or river in the foreground. 1920×1080; source sheet in `codex/assets/stages/jungla-source.png`, prompt in `codex/assets/stages/jungla-prompt.json`.
- **`win` poses:** paint them at the same body scale as the guard. Some are corrected in code (`WIN_FIT` in `RosterArt.ts`, `VICTORY_SPLIT` in `AnimeAtlas.ts`); when one is repainted, remove its correction.
- **`ricardo`:** small crop of the hair's right outline in the last `down` frame.

## Designs to keep

- **`george`:** stocky body and visible belly, medium-length wavy, messy black hair, dark rectangular glasses, black beard and mustache with gray on the chin. Open black hooded jacket, black T-shirt with a pick and guitar print, baggy blue jeans and black skate sneakers.
- **`nosu`:** sleek android, white ceramic armor, black mechanical joints, angular magenta visor with no human face, integrated circular headphones and two long antennas. Magenta rings on ears, shoulders and knees. Ultimate: plays a plain unbranded guitar connected to its chest.
- **`tevi`:** stocky body, curly black afro, rectangular glasses, long braided beard, production headset, sleeveless black T-shirt, tattooed arms, badge, baggy blue jeans, unbranded sneakers and a radio on the belt. Ultimate: arm raised directing the broadcast, clipboard in hand, no guitar.
- **`virrey`:** thin, stiff colonial viceroy, nose in the air, curled white powdered wig, long garnet velvet coat with gold embroidery, lace ruff, short cape, white stockings and gold-buckled shoes. Command staff and a gold baroque electric guitar. Accent `#e0b53a`.

## What each character delivers
1. **Pose art**, facing right on a transparent background: `animations/` (27 eight-frame animations) or `atlas.png` + `atlas.json` (frames `<id>-<pose>`). Pose list in `systems/FighterArt.ts` (`POSES`); missing poses are simulated automatically.
2. **Portrait** `portrait.png` (512×512) and `metadata.json` with the scales.
3. **Optional**: four ultimate frames playing guitar in `public/assets/ultimate-bodies/<id>-atlas.*`.

## How to connect it
Add the id to `ROSTER_ART_IDS` in `src/visuals/roster/RosterArt.ts` (and to `ULTIMATE_BODY_IDS` if it has ultimate bodies). Review with `/?sprites` and by playing in `/?lab=<id>`. Working material (source sheets, prompts, notes) goes in `codex/`: see `AGENTS.md`.

No faces or recognizable appearance of real people: these are original caricatures.

## Adding a stage

1920×1080, no characters, free horizontal ground in the bottom 35%, feet at 87% height. Sources in `codex/assets/stages/`, finals in `public/assets/stages/<id>.png`. Then set its `image` in `src/data/stages.ts`.
