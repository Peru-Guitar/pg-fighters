import Phaser from 'phaser';
import { COLORS, CSS, GAME_HEIGHT, GAME_WIDTH, SCENES } from '../config';
import { CHANGELOG, markChangelogSeen } from '../data/changelog';
import { Input } from '../systems/Input';
import { footer, goTo, stageBackdrop, text } from '../ui/ui';

const TOP = 200;
const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
/** '2026-10-17' → '17 OCT 2026'. */
const dayLabel = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};
const BOTTOM = GAME_HEIGHT - 110;

/** Novedades: una lista corta por versión, la más nueva arriba. W S (o la rueda) desplaza si no entra. */
export class ChangelogScene extends Phaser.Scene {
  private input2!: Input;
  private list!: Phaser.GameObjects.Container;
  private minY = 0;

  constructor() {
    super(SCENES.Changelog);
  }

  create() {
    this.cameras.main.fadeIn(250, 11, 10, 14);
    stageBackdrop(this, 0.86);
    this.input2 = new Input(this);
    markChangelogSeen();
    text(this, GAME_WIDTH / 2, 100, 'NOVEDADES', { size: 84, italic: true, weight: '900', color: CSS.lime, origin: [0.5, 0.5] });

    // Un bloque por día: la fecha una sola vez y debajo cada versión que salió ese día.
    const x = GAME_WIDTH / 2 - 560;
    this.list = this.add.container(0, TOP);
    let y = 0;
    const days = new Map<string, typeof CHANGELOG>();
    for (const e of CHANGELOG) days.set(e.date, [...(days.get(e.date) ?? []), e]);
    let first = true;
    for (const [date, entries] of days) {
      const day = text(this, x, y + 22, dayLabel(date), { size: 30, weight: '900', color: first ? CSS.lime : CSS.cream, origin: [0, 0.5], spacing: 3 });
      const line = this.add.graphics().fillStyle(first ? COLORS.lime : COLORS.grey, 0.6).fillRect(x + day.width - (day.padding.left ?? 0) * 2 + 20, y + 21, 1120 - day.width, 2);
      this.list.add([day, line]);
      y += 66;
      for (const entry of entries) {
        this.list.add(text(this, x + 20, y, `v${entry.version}`, { size: 26, weight: '800', color: CSS.grey, origin: [0, 0.5], spacing: 1 }));
        for (const note of entry.notes) {
          this.list.add(text(this, x + 170, y, `·  ${note}`, { size: 26, font: 'body', color: '#d8d5c8', origin: [0, 0.5] }));
          y += 38;
        }
        y += 12;
      }
      y += 30;
      first = false;
    }
    this.minY = Math.min(TOP, BOTTOM - y);
    const mask = this.make.graphics({}, false).fillRect(0, TOP - 10, GAME_WIDTH, BOTTOM - TOP + 10);
    this.list.setMask(mask.createGeometryMask());

    this.input.on(Phaser.Input.Events.POINTER_WHEEL, (_p: unknown, _o: unknown, _dx: number, dy: number) => this.scroll(-dy));
    footer(this, 'W S  DESPLAZAR      ESC  VOLVER');
  }

  private scroll(dy: number) {
    this.list.y = Phaser.Math.Clamp(this.list.y + dy, this.minY, TOP);
  }

  update(_t: number, delta: number) {
    const i = this.input2;
    if (i.isDown('down')) this.scroll(-delta * 0.8);
    if (i.isDown('up')) this.scroll(delta * 0.8);
    if (i.justDown('back') || i.justDown('confirm')) goTo(this, SCENES.Title, { skipPress: true });
  }
}
