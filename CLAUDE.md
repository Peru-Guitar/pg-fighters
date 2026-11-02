# PG Fighters

2D arcade fighting game built with Phaser 4, TypeScript and Vite, at a native 1920×1080. See `README.md` for controls, moves and game modes.

@AGENTS.md

## Roles

Codex makes the art and Claude handles the logic. `AGENTS.md` above defines where files go, how characters are named and registered, and the design rules for characters.

## Verify

```bash
npm run typecheck
npm run build   # typecheck + production build
```

There is no test suite or linter, and deploy CI only runs the build. To check gameplay, use `?lab` (practice with any fighter) and `?sprites` (art review), described in the README.

## Pushing and versions

- Pushing to `main` publishes the game. Never push unless the current message explicitly asks for it, and follow the workspace push skill (`../.claude/skills/push/SKILL.md`).
- Propose the version and the Novedades notes (`src/data/changelog.ts`), then wait for confirmation.
- Commit messages are in Spanish, as the workspace push skill requires.
- Firestore rules are not deployed by CI.

## Real people

Characters are fictional parodies. Never use real people's names or nicknames in files, folders, prompts, notes or changelog entries.
