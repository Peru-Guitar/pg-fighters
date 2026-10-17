import Phaser from 'phaser';
import { FONTS, GAME_HEIGHT, GAME_WIDTH } from '../../config';
import { chest, emit, rand, finale, veil, type ShowCtx, type SuperShow } from './kit';
import { burst, colorFlash, comet, glintTex, lensColor, lensVignette, markHit, pixelFlash, shockwave, spark, victim } from './energy';
import { buildLook } from '../powers';

const RED = 0xff2a3d;
const WHITE = 0xffffff;
/** Margen del visor y largo de los brazos de sus esquinas. */
const INSET = 70;
const ARM = 150;

/** Esquinas en L de un recuadro: el [ ] del visor de cámara. */
const corners = (g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, arm: number, width: number, color: number, alpha = 1) => {
  g.lineStyle(width, color, alpha);
  for (const [cx, cy, dx, dy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) {
    g.lineBetween(cx, cy, cx + dx * arm, cy);
    g.lineBetween(cx, cy, cx, cy + dy * arm);
  }
};

/** Contador de cinta: horas:minutos:segundos:cuadros. */
const timecode = (ms: number) => {
  const f = Math.floor((ms / 1000) * 30) % 30;
  const s = Math.floor(ms / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`;
};

/**
 * TEVI · AL AIRE: toda la pantalla se vuelve el visor de una cámara grabando. Esquinas [ ] gigantes,
 * ● REC que parpadea, contador de cinta, batería y la cuadrícula de tercios; un recuadro de enfoque
 * persigue al rival y se cierra sobre él con cada golpe. Remate: la imagen se congela como cuadro
 * final, flash de obturador y «MAÑANA, NUEVO EPISODIO».
 */
export const tevi: SuperShow = {
  spin: 200,
  start(c: ShowCtx) {
    const s = c.scene;
    // Visor fijo: esquinas, cuadrícula de tercios y cruz central.
    const frame = s.add.graphics().setAlpha(0);
    corners(frame, INSET, INSET, GAME_WIDTH - INSET * 2, GAME_HEIGHT - INSET * 2, ARM, 10, WHITE);
    frame.lineStyle(2, WHITE, 0.18);
    for (const k of [1, 2]) {
      frame.lineBetween((GAME_WIDTH * k) / 3, INSET + 40, (GAME_WIDTH * k) / 3, GAME_HEIGHT - INSET - 40);
      frame.lineBetween(INSET + 40, (GAME_HEIGHT * k) / 3, GAME_WIDTH - INSET - 40, (GAME_HEIGHT * k) / 3);
    }
    frame.lineStyle(3, WHITE, 0.7).lineBetween(GAME_WIDTH / 2 - 26, GAME_HEIGHT / 2, GAME_WIDTH / 2 + 26, GAME_HEIGHT / 2).lineBetween(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 26, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 26);
    // Batería arriba a la derecha.
    const bx = GAME_WIDTH - INSET - 150;
    const by = INSET + 34;
    frame.lineStyle(4, WHITE, 1).strokeRect(bx, by, 96, 40).fillStyle(WHITE, 1).fillRect(bx + 96, by + 12, 8, 16);
    for (let k = 0; k < 3; k++) frame.fillRect(bx + 8 + k * 29, by + 8, 22, 24);
    // ● REC, contador de cinta y modo.
    const dot = s.add.circle(INSET + 70, INSET + 56, 20, RED);
    const rec = s.add.text(INSET + 104, INSET + 56, 'REC', { fontFamily: FONTS.head, fontSize: '60px', fontStyle: '900', color: '#ffffff' }).setOrigin(0, 0.5);
    const tc = s.add.text(GAME_WIDTH / 2, INSET + 56, '', { fontFamily: 'Menlo, Consolas, monospace', fontSize: '44px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
    const mode = s.add.text(INSET + 40, GAME_HEIGHT - INSET - 50, 'EN VIVO   ISO 800   F2.8   4K', { fontFamily: 'Menlo, Consolas, monospace', fontSize: '30px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0, 0.5);
    // Recuadro de enfoque que persigue al rival.
    const focus = s.add.graphics();
    c.front.add([frame, dot, rec, tc, mode, focus]);
    s.tweens.add({ targets: frame, alpha: 1, duration: 160 });
    Object.assign(c.data, { frame, dot, rec, tc, focus, lock: 0, zoom: 1.8 });
  },
  update(c: ShowCtx, dt: number) {
    const blink = Math.floor(c.t / 500) % 2 === 0;
    (c.data.dot as Phaser.GameObjects.Arc).setAlpha(blink ? 1 : 0.15);
    (c.data.tc as Phaser.GameObjects.Text).setText(timecode(c.data.frozen ? c.data.frozen : c.t));
    // El enfoque se achica sobre el rival y salta un poco más con cada golpe (lock).
    const t = chest(c.target);
    c.data.lock = Math.max(0, c.data.lock - dt * 3);
    c.data.zoom = Phaser.Math.Linear(c.data.zoom, 1 - Math.min(0.35, (c.data.hits ?? 0) * 0.07), dt * 6);
    const w = 300 * c.data.zoom * (1 + c.data.lock * 0.25);
    const h = 420 * c.data.zoom * (1 + c.data.lock * 0.25);
    const g = (c.data.focus as Phaser.GameObjects.Graphics).clear();
    const color = c.data.lock > 0.3 ? 0x7dff7a : WHITE;
    corners(g, t.x - w / 2, t.y - h / 2, w, h, 44, 5, color);
    g.lineStyle(2, color, 0.8).strokeCircle(t.x, t.y, 10);
    // Chispas blancas de luz de set, pocas: el protagonista es el visor.
    if (Math.random() < dt * 14) emit(c, glintTex(c.scene), rand(0, GAME_WIDTH), rand(0, GAME_HEIGHT), { life: 0.45, scale: rand(0.3, 0.7), grow: -1.2, spin: 120, tint: WHITE, add: true });
    // Imagen de cámara: un poco más contrastada y con bordes oscuros.
    const cm = lensColor(c);
    if (cm) {
      cm.colorMatrix.contrast(0.25);
      cm.colorMatrix.alpha = c.data.frozen ? 0 : 0.3;
    }
    const vig = lensVignette(c, 0x000000);
    if (vig) vig.strength = 0.22;
    const since = c.t - (c.data.hitAt ?? -9999);
    victim(c, { tint: since < 140 ? WHITE : undefined, fill: since < 140 });
  },
  note(c, x, y, hit, final) {
    if (!hit) return spark(c, x, y, WHITE);
    // Los orbes de su ¡CORTE!: salen tres a la vez, a distintas alturas (el remate, uno grande).
    if (final) return buildLook(c.scene, 'darkOrb', RED, 52, x, y).obj;
    return c.scene.add.container(x, y, [-90, 0, 90].map((dy) => buildLook(c.scene, 'darkOrb', RED, 22, 0, dy).obj));
  },
  fly(c, x, y, age, final, obj) {
    comet(c, x, y, final ? WHITE : RED, final ? 1.3 : 0.8);
    // Oscilan un poco, cada uno a su ritmo.
    if (obj instanceof Phaser.GameObjects.Container) obj.list.forEach((o, i) => (o as Phaser.GameObjects.Image).setY((i - 1) * 90 + Math.sin(age * 9 + i * 2) * 14));
  },
  impact(c, x, y, final) {
    markHit(c, final);
    c.data.lock = 1;
    burst(c, x, y, WHITE, 10, 650, glintTex(c.scene));
    if (!final) return;
    const scene = c.scene;
    const t = chest(c.target);
    // Cuadro final: el contador se congela, flash de obturador…
    c.data.frozen = c.t;
    (c.data.rec as Phaser.GameObjects.Text).setText('■ STOP');
    veil(scene, WHITE, 0.9, 40, 10, 260, 48);
    colorFlash(scene, 'gray', 380);
    scene.time.delayedCall(260, () => {
      // …y la toma revienta.
      pixelFlash(scene, 24, 300);
      colorFlash(scene, 'saturate', 450);
      shockwave(scene, 0.6, 850);
      burst(c, t.x, t.y, RED, 46, 1500, glintTex(scene));
      for (let k = 0; k < 4; k++) c.fx.ring(t.x, t.y, k % 2 ? WHITE : RED, 240 + k * 180, 0.5);
      c.fx.hit(t.x, t.y, RED, true);
      scene.cameras.main.shake(500, 0.024);
      finale(scene, 'MAÑANA|NUEVO EPISODIO', '#ff3355');
    });
  },
};
