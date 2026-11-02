# Instructions for agents (Codex and others)

PG Fighters is a 2D fighting game in Phaser. **Codex makes the art; Claude handles the logic.** Read this before creating or moving files.

## Where everything goes

| What | Where | Goes in git? |
|---|---|---|
| Final art the game loads: `atlas.png`, `atlas.json`, `metadata.json`, `portrait.png`, `menu.png`, `menu.json` | `public/assets/characters/<id>/` | Yes |
| Animated ultimate bodies: `<id>-atlas.png`, `<id>-atlas.json` | `public/assets/ultimate-bodies/` | Yes |
| Final stages | `public/assets/stages/<id>.png` | Yes |
| **Working material**: source sheets (`sheet.png`, `movement.png`, `solo.png`, `*-sheet.png`, `portrait-source.png`…), repair crops, prompts, READMEs, notes, previews, old archives | **`codex/`** with the same structure (`codex/assets/characters/<id>/`, `codex/assets/ultimate-bodies/`, `codex/assets/stages/`, `codex/output/`) | **No** (`codex/` is in `.gitignore`) |

- `public/` holds **only what the game loads**. Everything else goes in `codex/`.
- The scripts in `scripts/` already read sheets from `codex/` and write final art to `public/`. If you create a new script, follow the same pattern.
- **After changing a character's atlas or ultimate bodies**, run `python scripts/build_menu_atlas.py <id>`: it generates `menu.png`/`menu.json`, the guard pose and the portrait used by menus (the full atlas only loads right before a fight).
- The build (`vite.config.ts`) also strips any `.md`, `.txt`, prompt, `sheet.png`, `movement.png`, `preview.jpg` or `layout.json` left in `public/` from the site, but don't rely on that: put them in `codex/`.

## Ids and names

- Each character uses **a single name everywhere**: the id (`src/data/fighters.ts`), the folder, the atlas frames (`<id>-<pose>`) and the files are all the same. Current ids: `erp`, `mayin`, `george`, `pepper`, `slandor`, `pentalick`, `mimetico`, `clavito`, `chantal`, `jeanpierre`, `ferdex`, `turboshred`, `toxicity`, `rematada`, `escalas`, `tayloy`, `jesex`, `markus`, `platanero`, `ricardo`, `kimberly`, `nosu`, `virrey`, `tevi` and the boss `acople`.
- **Don't use real people's names or nicknames** in any file, folder, prompt or note.
- To register a new character: add its id to `ROSTER_ART_IDS` (`src/visuals/roster/RosterArt.ts`) and, if it has ultimate bodies, to `ULTIMATE_BODY_IDS` (`src/visuals/roster/UltimateBodies.ts`).

## Character design

- All characters are **fictional parodies** (see the legal notice in `src/scenes/DisclaimerScene.ts`).
- Designs must be **original caricatures**: they must not reproduce the face or recognizable appearance of real people, even if the concept comes from a reference image.
- In prompts and notes, talk about "original concept" or "approved design", never a person's "identity".
- Pending art commissions: `src/visuals/ROSTER-ART.md`.
