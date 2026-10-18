import Phaser from 'phaser';
import { COLORS, CSS, GAME_WIDTH, SCENES } from '../config';
import { devText, Input, inputDevice, onDevice, onPadChange, padConnected, padLabel, padName, type PadDevice } from '../systems/Input';
import { footer, goTo, keycap, stageBackdrop, text } from '../ui/ui';

/** [acción, teclas] — las teclas separadas por espacio se dibujan como keycaps; "/" y "+" se dibujan como texto. */
const BASICS: [string, string][] = [
  ['Izquierda', 'A'],
  ['Derecha', 'D'],
  ['Saltar', 'W'],
  ['Agacharse', 'S'],
  ['Bloquear (alejarse)', 'A'],
  ['Puño', 'CLIC-IZQ'],
  ['Patada', 'CLIC-DER'],
  ['Dash', 'D D'],
  ['Dash atrás', 'A A'],
  ['Ultimate', 'E'],
  ['Confirmar', 'ENTER'],
  ['Pausa / Volver', 'ESC'],
];

/** Con mando: [acción, botones] con las mismas reglas de dibujo. */
const padBasics = (d: PadDevice): [string, string][] => [
  ['Moverse', '✚'],
  ['Saltar / Agacharse', '↑ / ↓'],
  ['Bloquear (alejarse)', '←'],
  ['Puño', `${padLabel('west', d)} / ${padLabel('north', d)}`],
  ['Patada', `${padLabel('south', d)} / ${padLabel('east', d)}`],
  ['Dash', '→ →'],
  ['Dash atrás', '← ←'],
  ['Ultimate', padLabel('rb', d)],
  ['Confirmar', padLabel('south', d)],
  ['Volver', padLabel('east', d)],
  ['Pausa', padLabel('start', d)],
];

const SPECIALS: [string, string, string][] = [
  ['PODER', 'S → D + CLIC IZQ', 'Propio de cada luchador: disparo, embestida, trampa… (ver Pausa).'],
  ['UPPERCUT', 'D → S → S+D + CLIC IZQ', 'Antiaéreo invulnerable al arrancar.'],
  ['ULTIMATE', 'E', 'Barra llena. El remate solo sale si el último golpe acierta.'],
  ['BARRIDA', 'S + CLIC DER', 'Tumba. Solo se bloquea agachado.'],
  ['CADENA', 'IZQ · IZQ · DER', 'Tres clics: el tercero tumba.'],
  ['CANCELAR', 'IZQ → PODER', 'Si el golpe conecta, enlaza el poder.'],
];

export class ControlsScene extends Phaser.Scene {
  private input2!: Input;

  constructor() {
    super(SCENES.Controls);
  }

  /** Pestaña TECLADO o MANDO: abre en la del dispositivo que se está usando. */
  create(data?: { tab?: 'keys' | 'pad' }) {
    const tab = data?.tab ?? (inputDevice() === 'keys' ? 'keys' : 'pad');
    if (!data?.tab) this.cameras.main.fadeIn(250, 11, 10, 14);
    this.tab = tab;
    stageBackdrop(this, 0.82);
    this.input2 = new Input(this);
    // Si se cambia de teclado a mando (o al revés), salta a su pestaña.
    let first = true;
    onDevice(this, (d) => {
      if (!first) this.showTab(d === 'keys' ? 'keys' : 'pad');
      first = false;
    });
    text(this, GAME_WIDTH / 2, 74, 'MANUAL DE SUPERVIVENCIA', { size: 72, italic: true, weight: '900', color: CSS.lime, origin: [0.5, 0.5] });

    // Pestañas.
    (['keys', 'pad'] as const).forEach((t, i) => {
      const on = t === tab;
      const x = GAME_WIDTH / 2 + (i ? 130 : -130);
      const g = this.add.graphics();
      g.fillStyle(on ? COLORS.lime : COLORS.panel, on ? 1 : 0.92).fillRect(x - 120, 126, 240, 50);
      text(this, x, 151, t === 'keys' ? 'TECLADO' : 'MANDO', { size: 28, weight: '900', italic: true, color: on ? CSS.dark : CSS.grey, origin: [0.5, 0.5], spacing: 2 });
      const hit = this.add.zone(x, 151, 240, 50).setInteractive({ useHandCursor: true });
      hit.on(Phaser.Input.Events.POINTER_DOWN, () => this.showTab(t));
    });

    const pad = tab === 'pad';
    const dev: PadDevice = padConnected() ?? 'xbox';
    const panel = (x: number, w: number, title: string) => {
      const g = this.add.graphics();
      g.fillStyle(COLORS.panel, 0.92).fillRect(x, 200, w, 730);
      g.fillStyle(COLORS.lime, 1).fillRect(x, 200, w, 6);
      text(this, x + 36, 248, title, { size: 38, italic: true, weight: '900', origin: [0, 0.5], spacing: 2 });
    };

    panel(80, 720, 'BÁSICOS');
    (pad ? padBasics(dev) : BASICS).forEach(([label, keys], i) => {
      const y = 308 + i * 46;
      text(this, 116, y, label.toUpperCase(), { size: 28, weight: '700', origin: [0, 0.5] });
      let x = 764;
      for (const k of keys.split(' ').reverse()) {
        if (k === '/' || k === '+') {
          const t = text(this, x, y, k, { size: 28, color: CSS.grey, origin: [1, 0.5] });
          x -= t.width - (t.padding.left ?? 0) * 2 + 6;
          continue;
        }
        const cap = keycap(this, 0, y, k, 20);
        cap.container.x = x - cap.width / 2;
        x -= cap.width + 8;
      }
    });

    text(this, 116, 900, pad ? 'Mirando a la izquierda: bloquear, dash y dash atrás invierten ← y →.' : 'Mirando a la izquierda: bloquear, dash y dash atrás invierten A y D.', { size: 22, font: 'body', color: '#b9b6aa', origin: [0, 0.5] });

    panel(840, 1000, 'ESPECIALES  ·  MIRANDO A LA DERECHA');
    SPECIALS.forEach(([name, input, desc], i) => {
      const y = 324 + i * (pad ? 78 : 96);
      text(this, 876, y - 14, name, { size: 32, italic: true, weight: '900', color: CSS.lime, origin: [0, 0.5] });
      text(this, 876, y + 20, desc, { size: 22, font: 'body', color: '#b9b6aa', origin: [0, 0.5] });
      text(this, 1804, y, pad ? devText(input, dev) : input, { size: 32, weight: '800', origin: [1, 0.5], spacing: 2 });
    });

    if (pad) {
      // Estado en vivo del mando y qué hacer si no aparece.
      const mx = 876;
      this.add.graphics().fillStyle(COLORS.lime, 0.35).fillRect(mx, 790, 928, 2);
      text(this, mx, 818, 'CONEXIÓN', { size: 28, italic: true, weight: '900', origin: [0, 0.5], spacing: 2 });
      const status = text(this, 1804, 818, '', { size: 24, weight: '800', origin: [1, 0.5], spacing: 2 });
      onPadChange(this, () => {
        const p = padConnected();
        status.setText(p ? `● ${padName(p)} DETECTADO` : '● PULSA UN BOTÓN DEL MANDO').setColor(p ? CSS.lime : CSS.grey);
      });
      [
        'Conéctalo por USB o Bluetooth y pulsa cualquier botón con el juego abierto.',
        '¿No aparece? Logitech: pon el switch de atrás en "D" y vuelve a conectarlo.',
        'Xbox en Mac: conéctalo por Bluetooth.  ·  Si nada funciona, prueba en Chrome.',
      ].forEach((t, i) => text(this, mx, 854 + i * 27, t, { size: 20, font: 'body', color: '#b9b6aa', origin: [0, 0.5] }));
    }

    footer(this, 'A D  TECLADO / MANDO      ESC  VOLVER');
  }

  private tab: 'keys' | 'pad' = 'keys';

  private showTab(tab: 'keys' | 'pad') {
    if (tab !== this.tab) this.scene.restart({ tab });
  }

  update() {
    const i = this.input2;
    if (i.justDown('left')) this.showTab('keys');
    if (i.justDown('right')) this.showTab('pad');
    if (i.justDown('back') || i.justDown('confirm')) goTo(this, SCENES.Title, { skipPress: true });
  }
}
