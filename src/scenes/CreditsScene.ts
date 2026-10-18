import Phaser from 'phaser';
import { COLORS, CSS, GAME_HEIGHT, GAME_WIDTH, SCENES } from '../config';
import { Audio, MUSIC } from '../systems/Audio';
import { Input } from '../systems/Input';
import { StoryRun } from '../systems/StoryRun';
import { bustKey } from '../systems/FighterArt';
import { FIGHTERS } from '../data/fighters';
import { bossAnnounced, markBossAnnounced } from '../data/bonus';
import { footer, goTo, logo, scanlines, speedStripes, stageBackdrop, text } from '../ui/ui';
import { DISCLAIMER } from './DisclaimerScene';

type Line = [kind: 'title' | 'big' | 'body' | 'gap', str?: string];

const CREDITS: Line[] = [
  ['title', '¿POR QUÉ "PG"?'],
  ['big', 'PG FIGHTERS = PERU GUITAR FIGHTERS'],
  ['body', 'Creado para la comunidad de Peru Guitar: los que afinan antes de criticar, los que critican sin afinar y los que solo vienen por los memes.'],
  ['gap'],
  ['title', 'UN JUEGO DE'],
  ['big', 'ERP PROJECT'],
  ['body', 'Hecho en sus ratos libres y de hueveo intenso. Full bajada de pepa.'],
  ['body', 'Entre ensayo y ensayo, a altas horas de la noche y con el ampli al mínimo para no despertar al vecino (que igual golpeó la pared).'],
  ['gap'],
  ['title', 'DESARROLLO'],
  ['big', 'CLAUDE'],
  ['body', 'Generación de la lógica del juego.'],
  ['big', 'CODEX'],
  ['body', 'Por los increíbles assets.'],
  ['gap'],
  ['title', 'PRODUCCIÓN MUSICAL'],
  ['big', 'SUNO'],
  ['body', 'Por la música que suena en cada pelea.'],
  ['gap'],
  ['title', 'AGRADECIMIENTOS'],
  ['body', 'A la comunidad de Peru Guitar, por sus licks, sus debates eternos sobre afinación y su amor por la guitarra.'],
  ['body', 'A la escena peruana, que sigue haciendo bulla aunque nadie le pague el pasaje.'],
  ['body', 'Y a ti, por jugar. Si te reíste aunque sea una vez: misión cumplida.'],
  ['gap'],
  ['body', 'Ningún amplificador resultó dañado en la creación de este juego. Bueno, solo uno: el que se convirtió en El Acople.'],
  ['gap'],
  ['title', 'AVISO LEGAL'],
  ...DISCLAIMER.map((line): Line => ['body', line]),
  ['gap'],
  ['big', '¡GRACIAS, PERU GUITAR!'],
  ['title', 'LARGA VIDA A LA ESCENA'],
];

/** Créditos: suben solos como en los arcades. ENTER/ESC vuelve al menú; W S adelanta o retrocede. */
export class CreditsScene extends Phaser.Scene {
  private input2!: Input;
  private roll!: Phaser.GameObjects.Container;
  private height = 0;
  /** Viene del final de la historia: al salir va a las partidas guardadas (o al menú) y no a los créditos del menú. */
  private fromEnding = false;
  /** Aviso de "nuevo luchador" en pantalla: el siguiente ENTER sale. */
  private unlockShown = false;

  constructor() {
    super(SCENES.Credits);
  }

  create(data?: { fromEnding?: boolean }) {
    this.fromEnding = !!data?.fromEnding;
    this.unlockShown = false;
    this.cameras.main.fadeIn(300, 11, 10, 14);
    Audio.music(this, MUSIC.menu, 0.35);
    stageBackdrop(this, 0.78, 'game-cover');
    speedStripes(this, COLORS.lime, 0.03);
    this.input2 = new Input(this);

    const cx = GAME_WIDTH / 2;
    // El fondo queda fijo mientras el logo y los créditos se desplazan.
    this.roll = this.add.container(0, 0);
    const [pg, ft] = logo(this, cx, 230, 0.8);
    this.roll.add([pg, ft]);
    let y = 470;
    for (const [kind, str = ''] of CREDITS) {
      if (kind === 'gap') {
        y += 70;
        continue;
      }
      const t =
        kind === 'title' ? text(this, cx, y, str, { size: 34, weight: '800', color: CSS.grey, origin: [0.5, 0], spacing: 8 })
        : kind === 'big' ? text(this, cx, y, str, { size: 64, italic: true, weight: '900', color: CSS.lime, origin: [0.5, 0], shadow: true, align: 'center', wrap: 1500 })
        : text(this, cx, y, str, { size: 34, font: 'body', weight: '500', color: CSS.cream, origin: [0.5, 0], align: 'center', wrap: 1300 });
      this.roll.add(t);
      y += t.height - (t.padding.top ?? 0) * 2 + (kind === 'title' ? 10 : 26);
    }
    this.height = y;

    // Franjas para que el texto entre y salga suave.
    const fade = this.add.graphics();
    fade.fillGradientStyle(COLORS.bg, COLORS.bg, COLORS.bg, COLORS.bg, 1, 1, 0, 0).fillRect(0, 0, GAME_WIDTH, 140);
    fade.fillGradientStyle(COLORS.bg, COLORS.bg, COLORS.bg, COLORS.bg, 0, 0, 1, 1).fillRect(0, GAME_HEIGHT - 200, GAME_WIDTH, 200);
    footer(this, 'W S  ADELANTAR / RETROCEDER      ENTER ESC  VOLVER');
    scanlines(this, 0.06);
  }

  /** Sale de los créditos; tras el final de la historia, antes muestra el aviso de Acople (solo la primera vez). */
  private leave(): void {
    Audio.blip(this, true);
    if (this.fromEnding && !this.unlockShown && this.showUnlock()) return;
    if (this.unlockShown) markBossAnnounced();
    if (this.fromEnding) goTo(this, StoryRun.saved.length ? SCENES.Saves : SCENES.Title, { skipPress: true });
    else goTo(this, SCENES.Title, { skipPress: true });
  }

  /** "¡NUEVO LUCHADOR DESBLOQUEADO!": solo si la historia está terminada y todavía no se avisó. */
  private showUnlock(): boolean {
    if (this.unlockShown || !StoryRun.bossUnlocked || bossAnnounced()) return false;
    this.unlockShown = true;
    this.roll.setVisible(false);
    const cx = GAME_WIDTH / 2;
    const def = FIGHTERS.acople;
    const box = this.add.container(0, 0).setDepth(800);
    box.add(this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.bg, 0.6).setOrigin(0));
    const bust = bustKey(this, def);
    if (bust) {
      const img = this.add.image(cx, 760, bust).setOrigin(0.5, 1);
      img.setScale(460 / img.frame.realHeight).setAlpha(0);
      box.add(img);
      this.tweens.add({ targets: img, alpha: 1, duration: 500 });
    }
    box.add(text(this, cx, 170, '¡NUEVO LUCHADOR DESBLOQUEADO!', { size: 76, italic: true, weight: '900', color: CSS.lime, origin: [0.5, 0.5], shadow: true }));
    box.add(text(this, cx, 830, def.name, { size: 96, italic: true, weight: '900', color: def.css, origin: [0.5, 0.5], stroke: '#000000' }));
    box.add(text(this, cx, 920, 'Tu recompensa por terminar la historia. Búscalo en BONUS al elegir luchador.', { size: 30, font: 'body', weight: '600', color: CSS.cream, origin: [0.5, 0.5] }));
    this.cameras.main.flash(300, 125, 249, 255);
    Audio.tone(this, 880, 0.35, 'sawtooth', 0.06);
    return true;
  }

  update(_: number, delta: number) {
    const i = this.input2;
    if (i.justDown('back') || i.justDown('confirm')) return this.leave();
    if (this.unlockShown) return;
    const speed = i.isDown('down') ? 420 : i.isDown('up') ? -300 : 70;
    this.roll.y -= (speed * delta) / 1000;
    // Al terminar, vuelve a empezar desde abajo (después del final de la historia, primero el aviso de Acople).
    if (this.roll.y < -this.height) {
      if (this.fromEnding && this.showUnlock()) return;
      this.roll.y = GAME_HEIGHT * 0.6;
    }
    if (this.roll.y > 0) this.roll.y = 0;
  }
}
