# Super art (contract for the design agent)

## Integrated assets

- `public/assets/characters/<id>/portrait.png`: transparent busts shared by the super intro (full image), the roster and the HUD (square `face` frame). Load key: `super-cutin-<id>`.
- `public/assets/super-mayin.png` and `super-erp.png`: four full-body sprites playing guitar, registered as `mayin-super-0..3` / `erp-super-0..3`. Mayin has a five-string sunburst guitar; ERP a black guitar with a red edge. The renderer plays the blues at 6 fps and the shred at 12 fps. Each frame anchors to the ground and keeps a common body scale. Having these frames automatically disables the placeholder guitar.
- Generated with the built-in `imagegen` tool, using each character's base sheets as design and style reference. Notes and effects keep their existing animation.

### Production prompts

Portraits: a single waist-up bust, three-quarter view facing right, confident expression, fists near the chest, transparent background, anime outlines and cel shading. Keep the character's original design (face, hair, clothes and proportions from the base sheet): Mayin chubby, rectangular glasses, short curls, short beard and blue polo; ERP with no beard or glasses, short brown hair, black polo and a branching forearm tattoo. No guitar, text, frame or background. Use the full bust for the super and crop head/shoulders for icons.

Sprites: exactly four full-body figures in a transparent 2×2 grid, same design and clothes as the base sheets, facing right, full guitar inside each cell, feet planted and constant anatomical scale. Mayin plays a sunburst semi-hollow electric guitar: setup, downward strum, rising bend and final chord. ERP plays a pointy black electric guitar with a red edge: setup, fast downstroke, two-hand tapping and final chord. No ground shadows, auras, text or panels. Mayin correction: five strings and five tuning pegs in every pose, three on top and two below; keep the rest of the sheet.

Art under the keys below is optional: without it, the game uses markers drawn in code. Load each file with the given key; no combat code needs to change.

## Sequence
1. **Full-screen portrait** (`scenes/SuperCutInScene.ts`, about 2.3 s): the fight freezes, the HUD hides and the character's bust enters with the super's name and its quote typing out.
   - MAYINBLUES: "Hola amigo, ¿cómo estás?"
   - ERP: "Lenguaje mata shred."
2. **Guitar solo** (`entities/GuitarSolo.ts`): back to the stage, dimmed, with a spotlight. The character plays and notes fly at the opponent; some hit and the last one knocks down.
   - ERP: fast lick passage (shred), about 2.5 s, with many small, quick notes.
   - MAYINBLUES: pulls out the **5-string** guitar and plays a blues, about 2.5 s, with big, wavy notes.

## Art keys
| Key | What it is | Notes |
|---|---|---|
| `super-cutin-mayin`, `super-cutin-erp` | Bust/portrait for the full screen | Loose texture, transparent background, facing right, about 1000 px tall. Anchored bottom center. Mirrored automatically for the right side. |
| `<prefix>super` or `<prefix>super-0..n` | Guitar-playing pose (body + guitar) | Frames in the fighter's atlas (`pata-anime` / `edu-anime`, prefixes `mayin-` / `erp-`), pivot at the feet, 12 fps. **If it exists, the placeholder guitar isn't drawn.** |
| `super-guitar-mayin`, `super-guitar-erp` | Guitar alone (if there's no dedicated pose) | Loose texture, neck to the right, origin at the grip point. Mayin: 5 strings, blues style. ERP: shred guitar. |
| `super-note-mayin`, `super-note-erp` | Flying musical note | Loose texture of about 64 px. If missing, the characters ♪ ♫ ♬ are used. |

Accent colors come from `color` in `data/fighters.ts` (Mayin blue, ERP red).

## How to review
Open `/?sprites`: the SPRITES tab marks which poses have their own art, ANIMACIÓN → [S] shows the portrait, and ENTRENAMIENTO → [8] launches the full super.

## Timing and damage
The solo's notes, which ones hit and their damage are in `data/solos.ts`. A `super-0..n` animation should last about 2.5 s (the length of the solo) or loop.
