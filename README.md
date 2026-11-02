# PG Fighters

Arcade-style 2D fighting game (Street Fighter) built with **Phaser 4 + TypeScript + Vite**. Native resolution 1920×1080. Setting: El Sótano, a rock bar in Lima. In-game text is in Spanish, so names of screens, stages and fighters are kept as they appear in the game.

```sh
npm install
npm run dev       # development server
npm run build     # typecheck + production build
```

## Screen flow

Boot → Loading → **Title** ("PRESIONA ENTER" → menu) → **Select** (roster) → **Stage** → **VS** → **Fight** + HUD → **Results** (rematch / change fighter / menu). From the title: Arcade, **Training**, Controls and Difficulty (easy, normal, hard). ESC during a fight opens the pause screen with the move list.

## Controls

| Action     | Key                                                                 |
| ---------- | ------------------------------------------------------------------- |
| Move       | A D / ← →                                                           |
| Jump       | W / ↑ (with a direction: diagonal jump)                             |
| Crouch     | S / ↓                                                               |
| Block      | hold **back** (crouching for the sweep)                             |
| Punch (P)  | J / left click                                                      |
| Kick (K)   | K / right click                                                     |
| Dash       | Space (with back: backdash) or double tap → → / ← ←                 |
| Super      | **E** with the SÚPER bar full (also cancels a hit that connects)    |
| Pause      | ESC                                                                 |

## Moves (facing right; reversed when facing left)

| Move               | Input                     | Notes                                                                                                                                                                                                                     |
| ------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Power (projectile) | ↓ ↘ → + P                 | One on screen per fighter. Dodged by jumping.                                                                                                                                                                             |
| Uppercut           | → ↓ ↘ + P                 | Anti-air, invulnerable on startup. Very punishable if it misses.                                                                                                                                                          |
| Ultimate           | **E**                     | Requires a full ULTIMATE bar. Full-screen portrait with a quote (no HUD), then a guitar solo: ERP shreds, MayinBlues plays the blues on a 5-string guitar. The notes hit and the last one knocks down. Art: `src/visuals/SUPER-ART.md`. |
| Sweep              | ↓ + K                     | Knocks down. Only blocked while crouching.                                                                                                                                                                                |
| Air attacks        | P / K while jumping       | Blocked while standing.                                                                                                                                                                                                   |
| Chain              | P P K                     | The third hit knocks down and deals 30% more.                                                                                                                                                                             |
| Cancel             | connecting hit → special  | E.g.: P, P, ↓ ↘ → + P.                                                                                                                                                                                                    |

Arcade feel: hitstop on every impact, sparks, camera shake, combo counter, combo damage scaling, red recent-damage bar, corner pushback, slow-motion K.O., PERFECT and an announcer.

## Training mode

Menu → ENTRENAMIENTO. Fight a dummy with no timer or K.O.; health refills after each combo.

- **Q** dummy: idle, crouching, blocks everything, standing block, crouching block, jumps, CPU.
- **I** infinite SÚPER bar · **T** speed (100/50/25%) · **G** hitboxes · **R** reset position.
- **1–9** demo combos (the game performs them for you).
- On screen: input history, last hit data (startup/active/recovery frames, result and damage) and current/best combo.

## Lab (`?lab`)

Open `http://localhost:5173/?lab` (or `?lab=<id>` to start with a fighter, e.g. `?lab=toxicity`). It goes straight to practice: nobody dies, health refills after each combo and the ULTIMATE bar is always full. All training mode keys work.

- **ESC** opens the roster over the fight (the 24 fighters **and El Acople**, playable for testing): arrows to choose, **ENTER** or click restarts instantly with that fighter, **TAB** switches between your fighter and the opponent, **F** changes the stage, **V** opens the sprite lab, **M** returns to the menu and **ESC** returns to the fight.

## Sprite lab (`?sprites`)

Open `http://localhost:5173/?sprites` (or press **V** from the lab). Built for reviewing art:

- **SPRITES**: each character's 28 poses, marked **ARTE** (own art) or **SIMULADA ← base** (simulated), with ground, anchor (cross), guard height (dotted line) and hit reach (red).
- **ANIMACIÓN**: player with play/pause, frame by frame (← →), speed (− +), flip (F), ghost (O), super portrait (S) and frame data (size, anchor, scale, on-screen height).
- **ESPECIALES** (key 3): the fighter against a dummy, with buttons to instantly see their power, uppercut, super (portrait + solo with its melody) and the P·P·SÚPER combo. C moves to the next fighter; ESC returns to the lab.
- **ENTRENAMIENTO** (key 4): opens practice with the chosen character. C changes character, B shows the stage background.

## Stages

Defined in `src/data/stages.ts`; chosen after the character (ALEATORIO, random, is also available).

| #   | Stage                                                                                                                              | Art                                   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| 01  | BARRIO BRAVO · Lima                                                                                                                | `public/assets/barrio-anime.png`      |
| 02  | ESTACIÓN DEL METRO · platform with graffiti                                                                                        | `public/assets/stages/metro.png`      |
| 03  | EL ÚLTIMO TRAGO · dive bar, tables and a live band                                                                                 | `public/assets/stages/bar.png`        |
| 04  | LA TIENDA DE INSTRUMENTOS · hanging guitars, amps and the seller counting cash                                                     | `public/assets/stages/tienda.png`     |
| 05  | EL FESTIVAL DEL CERRO · open-air Andean stage, pennants and a crowd                                                                | `public/assets/stages/festival.png`   |
| 06  | LA AZOTEA DEL ENSAYO · Lima at night, water tanks, cables and a furious neighbor                                                   | `public/assets/stages/azotea.png`     |
| 07  | LA FERIA DEL TOMATE · market in a town in the Peruvian highlands                                                                   | `public/assets/stages/tomate.png`     |
| 08  | LA BIBLIOTECA DEL ROCK · shelves of books and vinyl, stained glass with a guitar, reading table                                    | `public/assets/stages/biblioteca.png` |
| 09  | EL BARRIO CHINO · Calle Capón at night, red gate, chifas and lanterns                                                              | `public/assets/stages/chino.png`      |
| 10  | EL MALL DEL ROCK · a mall where everything is rock: guitar, vinyl and band-shirt stores, an escalator and a giant guitar           | `public/assets/stages/mall.png`       |
| 11  | EL ARENAL · desert: sand hills, half-built brick houses, a water tank and a mototaxi                                               | `public/assets/stages/arenal.png`     |
| 12  | EL SALÓN DEL VIRREY · colonial mansion in downtown Lima                                                                            | `public/assets/stages/casona.png`     |
| 13  | LA CIUDADELA DEL SOL · among the clouds, Cusco                                                                                     | `public/assets/stages/ciudadela.png`  |
| 14  | LA JUNGLA · Amazon jungle                                                                                                          | `public/assets/stages/jungla.png`     |
| 15  | EL LABORATORIO DEL ROCK · where NOSU was born                                                                                      | `public/assets/stages/laboratorio.png` |
| 16  | EL SHOW EN VIVO · Tevi's set                                                                                                       | `public/assets/stages/estudio.png`    |

The final fight against El Acople uses EL INTERIOR DEL AMPLI, which has no image yet and is drawn in code.

**La Feria del Tomate:** every week, producers from a town in the Peruvian highlands fill the square with tomatoes, baskets and vendors' calls. A challenge between guitarists became a custom: solos are fought in front of the market while the regulars make noise. Among adobe houses, weavings and mountains, the fight is for applause; the tomatoes are sold by the kilo.

Images load from the `image` field in `data/stages.ts` and are shared by thumbnails, select, VS and fight. To add one, save it to `public/assets/stages/<id>.png` and register its path in that field. The fight ground is at y = 940, where the fighters' feet rest. Each stage has its music in the `music` field (see the Audio table).

## Characters

The roster is centralized in `src/data/fighters.ts` (24 fighters and the boss El Acople): name, title, satirical bio, quote, fighting style, color, stats, move names and ultimate solo. Each one has their own basic power (`data/powers.ts`: drawing and behavior) and animated ultimate (`visuals/supers/`), with a synthesized melody (`data/solos.ts`) and the same total damage for everyone.

| No. | Fighter | Title | Power (↓ ↘ → + P) |
| --- | --- | --- | --- |
| 01 | ERP PROJECT | EL MÚSICO DE CUARTO | PULSO NEGRO |
| 02 | MAYINBLUES | EL BLUESERO DEL BARRIO | PANZAZO BLUES |
| 03 | GEORGE | EL JUEZ DE LA AFINACIÓN | CUIDADO ESE BEND |
| 04 | PEPPER | LA DIVA DE LA PRODUCCIÓN | MASTERIZACIÓN PESADA |
| 05 | SLANDOR | EL HEREDERO DORADO | LLUVIA DE GUITARRAS DORADAS |
| 06 | PENTALICK | LA LEYENDA DE LOS CINCO LICKS | LICK NÚMERO UNO (OTRA VEZ) |
| 07 | MIMÉTICO | EL APRENDIZ DEL LICK | LICK PRESTADO |
| 08 | CLAVITO | EL PROFETA DEL METAL URBANO | TORMENTA DE ARPEGIOS |
| 09 | CHANTAL | EL MOZO DE LOS LICKS | BANDEJA DE ACORDES |
| 10 | JEAN-PIERRE | MONSIEUR SIX STRINGS | BONJOUR EXPRESS |
| 11 | FERDEX | DISCÍPULO DE LOS SABIOS DE CURCUMAN | PUÑO REVOLUCIONARIO |
| 12 | TURBOSHRED | LA MÁQUINA DE SHRED | TEMPO IMPOSIBLE |
| 13 | TOXICITY | LA MONJA DEL MAL GENIO | AGUA BENDITA HIRVIENDO |
| 14 | LA REMATADA | LA GUITARRA DE MAYINBLUES | OFERTA RELÁMPAGO |
| 15 | ESCALAS | EL ERUDITO DE LAS SEIS CUERDAS | ESO ESTÁ EN EL CAPÍTULO TRES |
| 16 | TAYLOY | HEREDERO DEL CLAN DE LA PÚA DE JADE | SECRETO DEL SHRED |
| 17 | JESEX | EL MAGNATE DE LA ESCUELA DEL ROCK | COBRO AL INSTANTE |
| 18 | MARKUS | EL GUARDIÁN DE LAS ESCALAS ORIENTALES | SEGUNDA AUMENTADA |
| 19 | PLATANERO | EL PROFESOR DEL VHS | PLÁTANO TELEDIRIGIDO |
| 20 | RICARDO | EL RENACIDO DEL ROCK | RIFF DE RAÍZ |
| 21 | KIMBERLY | LA INFLUENCER DEL MÁSTIL | ESCUDO DE SEGUIDORES |
| 22 | NOSU | EL PRODUCTOR AUTOMÁTICO | ONDA DE CORRECCIÓN |
| 23 | EL VIRREY | EL DUEÑO DEL ESCENARIO | DECRETO REAL |
| 24 | TEVI | EL ASISTENTE DEL SHOW | ¡CORTE! |
| ?? | EL ACOPLE | LA ENTIDAD DEL FEEDBACK | BARRIDO |

The CPU picks a random opponent from the others. The dialogue before ROUND 1 is in `data/dialogs.ts`; if a pair has no written dialogue, each fighter says their intro quote. Fighter art: `src/visuals/ROSTER-ART.md`.

## Fighter art (asset guide)

`src/systems/FighterArt.ts` resolves each **pose** to a frame in the character's atlas (`art.texture` + `art.prefix` in `fighters.ts`):

- Single frame: `<prefix><pose>`, for example `mayin-crouch`.
- Animation: `<prefix><pose>-0`, `-1`, … (12 fps).
- Optional portrait: `<prefix>portrait`. If missing, the face is cropped from `idle` (`art.face`).
- The **pivot must be at the feet**. TexturePacker JSON atlases with `pivot` apply it automatically.
- Scale is calculated so that `idle` measures `art.height` px.

Poses: `idle walk walkBack crouch jump fall dash backdash punch kick crouchPunch sweep airPunch airKick special uppercut super hurt crouchHurt block crouchBlock knockdown down getup intro win ko`.

The game loads each character's base and extra anime sheets from `public/assets/`, registered in `src/systems/AnimeAtlas.ts`. They include guard, punch, kick, hurt, steps, jump, crouch, block, uppercut, air kick, win and fall. The remaining poses use the `FALLBACK` table.

For a new per-character atlas: load it in `PreloadScene` (`this.load.atlas('mayin', ...)`) and change to `art: { texture: 'mayin', prefix: '' }`. Projectiles and effects are drawn in code (`entities/Projectile.ts`, `systems/Fx.ts`).

## Audio

| File                                              | Use                                                                         |
| ------------------------------------------------- | --------------------------------------------------------------------------- |
| `public/assets/audio/music/menu.mp3`              | Menus, character and stage select, results and story ("Instrumental Rock")  |
| `public/assets/audio/music/stage-sotano.mp3`      | El Último Trago ("Instrumental Blues")                                      |
| `public/assets/audio/music/stage-barrio.mp3`      | Barrio Bravo ("Midnight Rumble")                                            |
| `public/assets/audio/music/stage-festival.mp3`    | El Festival del Cerro                                                       |
| `public/assets/audio/music/stage-metro.mp3`       | Estación del Metro ("Neon Commuter")                                        |
| `public/assets/audio/music/stage-azotea.mp3`      | La Azotea del Ensayo ("Instrumental Rock")                                  |
| `public/assets/audio/music/stage-tomate.mp3`      | La Feria del Tomate ("Andes de Piedra")                                     |
| `public/assets/audio/music/stage-laboratorio.mp3` | El Laboratorio del Rock ("Neon Rocker")                                     |
| `public/assets/audio/music/stage-tienda.mp3`      | La Tienda de Instrumentos ("Instrumental Box")                              |
| `public/assets/audio/music/boss-acople.mp3`       | Final fight against El Acople, in El Interior del Ampli ("Teeth in the Sink") |
| `public/assets/audio/music/stage-biblioteca.mp3`  | La Biblioteca del Rock                                                      |
| `public/assets/audio/music/stage-arenal.mp3`      | El Arenal ("Oriental Rock")                                                 |
| `public/assets/audio/music/stage-chino.mp3`       | El Barrio Chino ("Callejón del Club", by RockStreet)                        |
| `public/assets/audio/music/stage-mall.mp3`        | El Mall del Rock ("La Disquería", by RockStreet)                            |
| `public/assets/audio/music/stage-casona.mp3`      | El Salón del Virrey ("La Coronación", by RockStreet)                        |
| `public/assets/audio/music/stage-ciudadela.mp3`   | La Ciudadela del Sol ("Inca Rock Instrumental")                             |
| `public/assets/audio/music/stage-jungla.mp3`      | La Jungla                                                                   |
| `public/assets/audio/music/stage-estudio.mp3`     | El Show en Vivo                                                             |
| `public/assets/{punch,kick,swing}.wav`            | Effects (generated by `scripts/audio.py`)                                   |

Announcer and impact tones are synthesized with WebAudio (`systems/Audio.ts`).

## Notice

PG Fighters is a parody made with love for the Peru Guitar community. All characters, names, stories and situations are fictional. Any resemblance to real people, living or dead, is pure coincidence. This game does not aim to discredit, offend or mock anyone: it is humor among musicians, nothing more. The notice is shown when the game opens (`scenes/DisclaimerScene.ts`) and in the credits.

## Story mode, account and Firestore

A new account chooses how to connect in `scenes/LoginScene.ts`: **with Google** (progress stays in the Google account) or **as a guest** (a Firebase anonymous account whose progress lives only in that browser). A guest can later link Google and keep the same account (`systems/Ranking.ts`). An account then picks a nickname, which is mandatory, **unique** (no other account can have it) and **fixed forever**. Without a connection (or with ESC) you can play arcade and training; story mode asks for the connection again. Each run (13 fights: 12 friends and El Acople) draws 12 random friends (no repeats, excluding the chosen fighter) and ends with El Acople. The number is in `STORY_RIVALS` (`src/data/story.ts`), with one hint per friend.

Each account keeps **one story run per fighter** (`systems/StoryRun.ts`).

Firestore (project `pg-fighters`, rules in `firestore.rules`) keeps these collections:

- `ranking/<uid>_<fighter>`: one row per account and fighter, reflecting that fighter's story run.
- `progress/{uid}`: account profile with the nickname and runs.
- `names/n_<NICKNAME>`: `{ uid, name, createdAt }`, the nickname reservation. It is created once and never changed or deleted.
- `analytics/{id}`: usage counters (`systems/Analytics.ts`), readable only by the admin in `dashboard.html`.

## Structure

```
src/
  config.ts              resolution, ground, palette, fonts, scenes, rounds
  data/fighters.ts       roster and characters
  data/moves.ts          timing, damage, reach, heights and chains for each hit
  entities/Fighter.ts    states, physics, motion input reading (↓↘→), buffer, block, dash
  entities/Cpu.ts        AI by difficulty (blocks, anti-airs, punishes, combos, super)
  entities/Projectile.ts power
  entities/GuitarSolo.ts super's guitar solo (notes that hit)
  data/solos.ts          notes, timing and damage for each solo
  data/stages.ts         stages (name, image, music, color)
  systems/StageArt.ts    stage background (image) or, if missing, one drawn in code
  scenes/SuperCutInScene full-screen super portrait
  systems/               Input, Audio, Settings, FighterArt, Fx
  scenes/                Boot, Preload, Title, Login, NameEntry, Controls, Select, Versus, Fight, Hud, Pause, Results
  ui/ui.ts               text, menus, keycaps, backgrounds, transitions
```

In development, the game is available at `window.game`.
