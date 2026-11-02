# Roster art: contract for Claude

Scope: visual resources, atlases and loading only. Don't edit combat, physics, controls, hitboxes, damage, AI or selection to incorporate this art.

`RosterArt.ts` exposes `preloadRosterArt(scene)` and `registerRosterArt(scene)`. The first loads atlases and portraits. The second changes only `def.art.texture`, `prefix`, `placeholder` and `tint` for characters already present. It keeps `art.height`, which also affects current combat.

Keys: `roster-<id>`, frames `<id>-<pose>` compatible with `FighterArt.ts`, portraits `super-cutin-<id>` and frame `face`. Each character lives in `public/assets/characters/<id>/`: generated sources, PNG/JSON atlas, 512×512 RGBA portrait and crop/scale metadata. `chantal` is Chantal's existing ID.

The sources include 20 figures in the main sheet: guard, two steps, jump, crouch, punch, kick, special, hurt, block, crouching punch, sweep, air punch, air kick, uppercut, fall, defeat, victory, guitar solo and portrait. A supplemental sheet adds three dash frames, three backdash frames, get-up, crouching hurt and crouching block. Walk-back poses reverse the existing steps; air fall shares jump; intro shares guard; ground shares defeat; grab shares the special gesture. Low attacks keep the guard → hit → guard visual sequence the game uses.

The packer `scripts/package_roster_art.py` detects silhouettes from alpha, extracts each figure keeping its pixels, separates contiguous rectangles and creates a conventional Phaser atlas. It applies no background removal, chroma key or procedural drawing. Pivots are derived from the feet. Metadata normalizes the resolution of movement sheets relative to each character's guard. To regenerate: Python with Pillow, run the script with the desired IDs.

The sheets are keyframes painted for the current system; they are not animations drawn at 12 unique frames per second. Don't change their durations or mechanics to use this art. Current playable heights are kept; any `art.height` adjustment must be coordinated with logic because it affects the current vertical reach.

Design prompts and specs: `codex/assets/characters/` (for example `repair-prompts.json`).
