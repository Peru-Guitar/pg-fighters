"""Atlas livianos para los menús: public/assets/characters/<id>/menu.png + menu.json.

Los menús (título, selección, VS, resultados, finales…) solo muestran la guardia y el retrato de cada
luchador, pero el atlas completo pesa varios MB. Este script copia esos cuadros tal cual (mismos píxeles,
sin recomprimir ni cambiar colores) a un atlas chico, con el mismo formato de frames, pivotes y tamaños.
El atlas completo se carga recién antes de pelear (src/visuals/roster/RosterArt.ts).

Fuente de cada luchador, en orden: cuerpos del ultimate, atlas en public/ o atlas en codex/.

Uso: python scripts/build_menu_atlas.py [id ...]   (sin ids: todos los que tengan atlas)
"""
import json
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CHARACTERS = ROOT / 'public/assets/characters'
POSES = ('idle', 'portrait', 'win')
PAD = 2


def source(fighter: str) -> Path | None:
    for path in (
        ROOT / f'public/assets/ultimate-bodies/{fighter}-atlas.json',
        CHARACTERS / fighter / 'atlas.json',
        ROOT / f'codex/assets/characters/{fighter}/atlas.json',
    ):
        if path.exists():
            return path
    return None


def build(fighter: str) -> tuple[int, int] | None:
    src = source(fighter)
    if not src:
        return None
    data = json.loads(src.read_text())
    sheet = Image.open(src.with_name(data['meta']['image'])).convert('RGBA')
    picked = [(f'{fighter}-{pose}', data['frames'][f'{fighter}-{pose}']) for pose in POSES if f'{fighter}-{pose}' in data['frames']]
    if not picked:
        return None
    # Una sola fila: son tres cuadros.
    width = sum(f['frame']['w'] + PAD for _, f in picked)
    height = max(f['frame']['h'] for _, f in picked)
    out = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    frames = {}
    x = 0
    for name, f in picked:
        if f.get('rotated'):
            raise SystemExit(f'{name}: cuadro rotado, no soportado')
        r = f['frame']
        out.paste(sheet.crop((r['x'], r['y'], r['x'] + r['w'], r['y'] + r['h'])), (x, 0))
        frames[name] = {**f, 'frame': {'x': x, 'y': 0, 'w': r['w'], 'h': r['h']}}
        x += r['w'] + PAD
    dest = CHARACTERS / fighter
    out.save(dest / 'menu.png', optimize=True)
    meta = {**data['meta'], 'image': 'menu.png', 'size': {'w': width, 'h': height}}
    (dest / 'menu.json').write_text(json.dumps({'frames': frames, 'meta': meta}, indent=1))
    return (dest / 'menu.png').stat().st_size, src.with_name(data['meta']['image']).stat().st_size


def main() -> None:
    ids = sys.argv[1:] or sorted(p.name for p in CHARACTERS.iterdir() if p.is_dir())
    for fighter in ids:
        sizes = build(fighter)
        if sizes:
            print(f'{fighter}: {sizes[1] // 1024} KB -> {sizes[0] // 1024} KB')


if __name__ == '__main__':
    main()
