import Phaser from 'phaser';
import { chest, finale, veil, type ShowCtx, type SuperShow } from './kit';
import { ADD, body, burst, colorFlash, comet, glowTex, markHit, orb, shockwave, spark, victim } from './energy';

const STEEL = 0x9fb0c8;
const GOLD = 0xe0b862;

/**
 * Nota musical de luz detrás del rival (como la cruz de Toxicity): aparece con rebote, late y se apaga.
 * Alterna negra, corchea y dos corcheas unidas; la del remate es grande y dorada.
 */
const noteBehind = (c: ShowCtx, n: number, final: boolean) => {
  const scene = c.scene;
  const b = body(c.target);
  const kind = final ? 2 : n % 3;
  const side = n % 2 ? 1 : -1;
  const x = final ? b.x : b.x + side * b.w * Phaser.Math.FloatBetween(0.5, 1.1);
  const y = final ? b.top + b.h * 0.4 : b.top + b.h * Phaser.Math.FloatBetween(0.15, 0.55);
  const size = final ? b.h * 0.95 : b.h * 0.42;
  const col = final ? GOLD : n % 2 ? STEEL : GOLD;
  const g = scene.add.graphics().setDepth(19.6).setBlendMode(ADD).setPosition(x, y).setAngle(side * -12);
  const glow = scene.add.image(x, y, glowTex(scene)).setDepth(19.5).setBlendMode(ADD).setTint(col).setScale(0).setAlpha(0.7);
  const head = (hx: number, hy: number, r: number) => g.fillEllipse(hx, hy, r * 2.6, r * 1.8);
  const stem = (sx: number, hy: number, w: number) => g.fillRect(sx - w / 2, hy - size, w, size);
  for (const [k, cc, a] of [[1.8, col, 0.18], [1.35, col, 0.4], [1, 0xffffff, 1]] as const) {
    g.fillStyle(cc, a);
    const r = size * 0.13 * k;
    const w = size * 0.07 * k;
    if (kind === 2) {
      // Dos corcheas unidas por una barra.
      const d = size * 0.55;
      head(-d / 2, size * 0.5, r);
      head(d / 2, size * 0.42, r);
      stem(-d / 2 + r * 1.1, size * 0.5, w);
      stem(d / 2 + r * 1.1, size * 0.42, w);
      g.fillRect(-d / 2 + r * 1.1 - w / 2, size * 0.5 - size - w, d + w, w * 2.2);
    } else {
      head(0, size * 0.5, r);
      stem(r * 1.1, size * 0.5, w);
      // Corchea: banderita.
      if (kind === 1) g.fillTriangle(r * 1.1, size * -0.5, r * 1.1 + size * 0.32, size * -0.18, r * 1.1, size * -0.2);
    }
  }
  g.setScale(0);
  scene.tweens.add({ targets: g, scale: 1, duration: 220, ease: 'Back.easeOut' });
  scene.tweens.add({ targets: g, y: y - 14, duration: 500, yoyo: true, repeat: 1, ease: 'Sine.easeInOut' });
  scene.tweens.add({ targets: glow, scale: final ? 9 : 4, duration: 260, ease: 'Cubic.easeOut' });
  scene.tweens.add({ targets: [g, glow], alpha: 0, delay: final ? 1100 : 750, duration: 400, onComplete: () => { g.destroy(); glow.destroy(); } });
  burst(c, x, y, col, final ? 20 : 8, final ? 900 : 500);
};

/**
 * ESCALAS · LA TRILOGÍA COMPLETA: dispara escaleras de puntos de luz. Cada golpe deja una nota
 * musical de luz detrás del rival. Remate: tres impactos seguidos, cada uno más grande, y FIN.
 */
export const escalas: SuperShow = {
  spread: 1.3,
  start() {},
  update(c: ShowCtx) {
    const since = c.t - (c.data.hitAt ?? -9999);
    victim(c, { tint: since < 120 ? 0xffffff : 0xdfe6f0, fill: since < 120, x: since < 200 ? (Math.floor(c.t / 40) % 2 ? 6 : -6) : 0 });
  },
  note(c, x, y, hit, final) {
    return hit ? orb(c, x, y, final ? GOLD : STEEL, final ? 44 : 24) : spark(c, x, y, STEEL);
  },
  fly(c, x, y, age, final) {
    // Escalera de puntos detrás del proyectil.
    const step = Math.floor(age * 30) % 6;
    comet(c, x - c.owner.facing * 20, y + (step - 3) * 10, final ? GOLD : 0xffffff, final ? 0.8 : 0.5, 0.5);
  },
  impact(c, x, y, final) {
    const hits = markHit(c, final);
    c.fx.ring(x, y, STEEL, 160, 0.3);
    noteBehind(c, hits, final);
    if (!final) return;
    const scene = c.scene;
    const t = chest(c.target);
    // Tomo I, II y III: tres impactos, cada uno más grande.
    for (let i = 0; i < 3; i++) {
      scene.time.delayedCall(i * 220, () => {
        const k = i + 1;
        shockwave(scene, 0.2 * k, 500 + k * 150);
        burst(c, t.x, t.y, i === 2 ? GOLD : STEEL, 14 * k, 600 + k * 300, glowTex(scene));
        for (let r = 0; r < k + 1; r++) c.fx.ring(t.x, t.y, i === 2 ? GOLD : STEEL, 200 + r * 160 + k * 60, 0.45);
        c.fx.hit(t.x, t.y, i === 2 ? GOLD : STEEL, true);
        scene.cameras.main.shake(200 + k * 120, 0.008 * k);
        if (i === 2) {
          colorFlash(scene, 'burn', 500);
          veil(scene, 0xffffff, 0.5, 80, 20, 400, 48);
          finale(scene, 'LA CLASE HA|TERMINADO', '#e0b862');
        }
      });
    }
  },
};
