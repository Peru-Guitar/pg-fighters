import Phaser from 'phaser';
import { COLORS, CSS, GAME_HEIGHT, GAME_WIDTH, SCENES } from '../config';
import { FIGHTERS } from '../data/fighters';
import { addPortrait } from '../systems/FighterArt';
import { Input } from '../systems/Input';
import { fitText, footer, text } from '../ui/ui';
import type { FightData } from './FightScene';
import { movesOf } from './PauseScene';
import { demoEnding } from './EndingScene';
import { StoryRun } from '../systems/StoryRun';

const RATINGS: [keyof (typeof FIGHTERS)['erp']['rating'], string][] = [
  ['potencia', 'POTENCIA'], ['velocidad', 'VELOCIDAD'], ['alcance', 'ALCANCE'], ['tecnica', 'TÉCNICA'],
];

/**
 * Laboratorio: ESC durante la práctica muestra todo de tu luchador de una vez: el lore a la izquierda
 * y los movimientos (poder, uppercut, ultimate y rasgo) a la derecha. ESC vuelve; C y F cambian luchador y escenario.
 */
export class LabInfoScene extends Phaser.Scene {
  private input2!: Input;
  private fight!: FightData;

  constructor() {
    super(SCENES.LabInfo);
  }

  init(data: { fight: FightData }) {
    this.fight = data.fight;
  }

  create() {
    this.input2 = new Input(this);
    const def = FIGHTERS[this.fight.p1];
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.bg, 0.9).setOrigin(0);

    // Lore
    const lx = 80;
    const g = this.add.graphics();
    g.fillStyle(COLORS.panel, 0.95).fillRect(lx, 70, 820, 880);
    g.fillStyle(def.color, 1).fillRect(lx, 70, 820, 6);
    g.fillStyle(0x000000, 0.4).fillRect(lx + 40, 110, 220, 220);
    g.lineStyle(3, def.color, 1).strokeRect(lx + 40, 110, 220, 220);
    addPortrait(this, def, lx + 150, 220, 210);
    text(this, lx + 290, 130, `N.º ${def.number}`, { size: 22, weight: '800', color: CSS.grey, origin: [0, 0], spacing: 3 });
    fitText(text(this, lx + 290, 160, def.name, { size: 64, italic: true, weight: '900', color: def.css, origin: [0, 0] }), 500, 30);
    text(this, lx + 290, 238, def.tag, { size: 24, weight: '800', color: CSS.cream, origin: [0, 0], wrap: 500, spacing: 1 });
    text(this, lx + 290, 296, def.style, { size: 18, weight: '700', color: CSS.grey, origin: [0, 0], wrap: 500 });
    let y = 360;
    const q = text(this, lx + 40, y, `“${def.quote}”`, { size: 28, italic: true, weight: '900', color: CSS.lime, origin: [0, 0], wrap: 740 });
    y = q.y + q.height + 18;
    const bio = text(this, lx + 40, y, def.bio, { size: 22, font: 'body', color: '#cfccc0', origin: [0, 0], wrap: 740 }).setLineSpacing(4);
    fitText(bio, 740, 16, 860 - y - 150);
    y = Math.min(bio.y + bio.height + 28, 790);
    RATINGS.forEach(([key, label], i) => {
      const ry = y + i * 34;
      text(this, lx + 40, ry, label, { size: 18, weight: '800', color: CSS.grey, origin: [0, 0.5], spacing: 2 });
      for (let k = 0; k < 5; k++) {
        g.fillStyle(k < def.rating[key] ? def.color : 0x3a3a44, 1).fillRect(lx + 200 + k * 46, ry - 9, 40, 18);
      }
    });

    // Movimientos
    const px = 960;
    g.fillStyle(COLORS.panel, 0.95).fillRect(px, 70, 880, 880);
    g.fillStyle(COLORS.lime, 1).fillRect(px, 70, 880, 6);
    text(this, px + 40, 120, `MOVIMIENTOS  ·  ${def.name}`, { size: 30, italic: true, weight: '900', origin: [0, 0.5], spacing: 2 });
    text(this, px + 40, 156, 'Mirando a la derecha', { size: 20, font: 'body', color: CSS.grey, origin: [0, 0.5] });
    y = 196;
    for (const [kind, input, name, desc] of movesOf(def)) {
      text(this, px + 40, y + 12, kind, { size: 20, weight: '800', color: CSS.grey, origin: [0, 0.5], spacing: 3 });
      if (input) text(this, px + 840, y + 12, input, { size: 24, weight: '700', origin: [1, 0.5] });
      const n = text(this, px + 40, y + 30, name, { size: 30, italic: true, weight: '900', color: CSS.lime, origin: [0, 0], wrap: 800 });
      y = n.y + n.height + 4;
      const d = text(this, px + 40, y, desc, { size: 21, font: 'body', color: '#cfccc0', origin: [0, 0], wrap: 800 }).setLineSpacing(3);
      y = d.y + d.height + 22;
    }
    const basics = [
      'CLIC IZQ  puño    CLIC DER  patada    S + CLIC DER  barrida    IZQ·IZQ·DER  cadena',
      'D D / A A  dash    W  saltar    A (alejarse)  bloquear    S  agacharse    IZQ → PODER  cancelar',
    ];
    basics.forEach((l, i) => text(this, px + 40, 880 + i * 32, l, { size: 20, weight: '700', color: CSS.grey, origin: [0, 0.5] }));

    footer(this, 'ESC  VOLVER      C  CAMBIAR LUCHADOR      F  CAMBIAR ESCENARIO      V  VER FINAL');

    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === 'KeyC') this.pick('p1');
      else if (e.code === 'KeyF') this.pick('stage');
      else if (e.code === 'KeyV') this.ending();
    };
    window.addEventListener('keydown', onKey);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => window.removeEventListener('keydown', onKey));
  }

  /** Pasa a la selección de tu luchador o del escenario. */
  private pick(section: 'p1' | 'stage'): void {
    this.scene.launch(SCENES.LabPick, { fight: this.fight, section });
    this.scene.stop();
  }

  /** Final del modo historia con tu luchador (partida de muestra: no se guarda ni va al ranking). */
  private ending(): void {
    StoryRun.state = demoEnding(this.fight.p1);
    this.scene.stop(SCENES.Hud);
    this.scene.stop(SCENES.Fight);
    this.scene.start(SCENES.Ending, { lab: this.fight });
  }

  private resume(): void {
    this.scene.resume(SCENES.Fight);
    this.scene.resume(SCENES.Hud);
    this.scene.stop();
  }

  update() {
    if (this.input2.justDown('back')) this.resume();
  }
}
