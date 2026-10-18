import Phaser from 'phaser';
import { COLORS, CSS, GAME_WIDTH, SCENES } from '../config';
import { Audio, MUSIC } from '../systems/Audio';
import { Input, connectedPads, onPadChange, sourceName, type Source } from '../systems/Input';
import { Versus } from '../systems/Versus';
import { footer, goTo, scanlines, speedStripes, stageBackdrop, text } from '../ui/ui';

const SIDE_X = [520, GAME_WIDTH - 520];

/**
 * VS JUGADOR: el primer control que pulsa ENTER / A / ✕ es P1 (izquierda) y otro control distinto es P2
 * (derecha). Da igual si es teclado o mando. Con los dos, a elegir luchadores. ESC deshace el último paso.
 */
export class SidesScene extends Phaser.Scene {
  /** Un Input por control a la vista (teclado y cada mando, también los que aparecen después). */
  private inputs = new Map<string, Input>();
  private players: Source[] = [];
  private names: Phaser.GameObjects.Text[] = [];
  private subs: Phaser.GameObjects.Text[] = [];
  private leaving = false;

  constructor() {
    super(SCENES.Sides);
  }

  create() {
    this.leaving = false;
    this.players = [];
    this.inputs.clear();
    this.names = [];
    this.subs = [];
    this.cameras.main.fadeIn(250, 11, 10, 14);
    Audio.music(this, MUSIC.menu, 0.35);
    stageBackdrop(this, 0.82);
    speedStripes(this, COLORS.lime, 0.03);
    text(this, GAME_WIDTH / 2, 110, 'VS JUGADOR', { size: 84, italic: true, weight: '900', color: CSS.lime, origin: [0.5, 0.5], shadow: true });

    SIDE_X.forEach((x, i) => {
      const color = i === 0 ? COLORS.lime : COLORS.red;
      const g = this.add.graphics();
      g.fillStyle(COLORS.panel, 0.88).fillRect(x - 330, 240, 660, 520);
      g.fillStyle(color, 1).fillRect(x - 330, 240, 660, 6);
      text(this, x, 340, `P${i + 1}`, { size: 120, italic: true, weight: '900', color: i === 0 ? CSS.lime : CSS.red, origin: [0.5, 0.5] });
      this.names.push(text(this, x, 520, '', { size: 44, italic: true, weight: '900', origin: [0.5, 0.5], spacing: 2 }));
      this.subs.push(text(this, x, 600, '', { size: 26, weight: '800', origin: [0.5, 0.5], spacing: 3 }));
    });
    text(this, GAME_WIDTH / 2, 850, 'TECLADO CON RATÓN O MANDO  ·  P1 EMPIEZA A LA IZQUIERDA', { size: 24, weight: '700', color: CSS.grey, origin: [0.5, 0.5], spacing: 3 });

    const addInputs = () => {
      for (const s of ['keys', ...connectedPads().map((p) => p.index)] as Source[]) {
        if (!this.inputs.has(String(s))) this.inputs.set(String(s), new Input(this, false, s));
      }
    };
    addInputs();
    onPadChange(this, addInputs);

    this.refresh();
    footer(this, 'ENTER  CONFIRMAR      ESC  VOLVER');
    scanlines(this, 0.06);
  }

  /** Cada panel: el control confirmado, el que toca confirmar (parpadea) o en espera. */
  private refresh(): void {
    for (let i = 0; i < 2; i++) {
      const who = this.players[i];
      const turn = this.players.length === i;
      const name = this.names[i];
      this.tweens.killTweensOf(name);
      name.setAlpha(1);
      if (who !== undefined) {
        name.setText(sourceName(who)).setColor(CSS.cream);
        this.subs[i].setText('¡LISTO!').setColor(i === 0 ? CSS.lime : CSS.red);
      } else {
        name.setText(turn ? 'PULSA UN BOTÓN' : 'ESPERANDO…').setColor(turn ? CSS.cream : CSS.grey);
        this.subs[i].setText(turn ? 'ENTER, A O ✕ CON TU CONTROL' : 'DESPUÉS DE P1').setColor(CSS.grey);
        if (turn) this.tweens.add({ targets: name, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });
      }
    }
  }

  private join(source: Source): void {
    // Un control solo puede ser un jugador.
    if (this.players.includes(source)) return;
    this.players.push(source);
    Audio.tone(this, this.players.length === 1 ? 660 : 880, 0.22, 'sawtooth', 0.06);
    this.refresh();
    if (this.players.length < 2) return;
    this.leaving = true;
    Versus.p1 = Versus.leader = this.players[0];
    Versus.p2 = this.players[1];
    this.cameras.main.flash(180, 223, 255, 0);
    this.time.delayedCall(800, () => goTo(this, SCENES.Select, {}));
  }

  update() {
    if (this.leaving) return;
    for (const [key, input] of this.inputs) {
      const source: Source = key === 'keys' ? 'keys' : Number(key);
      if (input.justDown('confirm')) return this.join(source);
      if (input.justDown('back')) {
        // ESC / B: deshace la última confirmación; sin nadie confirmado, vuelve al menú.
        if (this.players.length) {
          this.players.pop();
          Audio.blip(this);
          this.refresh();
        } else {
          this.leaving = true;
          goTo(this, SCENES.Title, { skipPress: true });
        }
        return;
      }
    }
  }
}
