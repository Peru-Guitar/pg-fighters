import Phaser from 'phaser';
import { chest, finale, veil, type ShowCtx, type SuperShow } from './kit';
import { ADD, bolt, burst, colorFlash, glowTex, jag, markHit, shockPose, shockwave, spark, victim, zapArcs } from './energy';

const COPPER = 0xc8742b;
const HOT = 0xffb066;
/** Color de la cuerda del latigazo. */
const ROPE = 0xf2d0a0;

/**
 * LA REMATADA · LA SEXTA CUERDA: una línea de energía cobriza une a los dos y vibra cada vez más tensa;
 * lanza latigazos de luz en zigzag y la corriente electrocuta al rival.
 * Remate: la línea se suelta, ¡TWANG!, y lo lanza.
 */
export const rematada: SuperShow = {
  aim: true,
  spread: 1.4,
  start(c: ShowCtx) {
    const g = c.scene.add.graphics().setBlendMode(ADD);
    c.front.add(g);
    Object.assign(c.data, { g, snap: 0 });
  },
  update(c: ShowCtx) {
    const a = chest(c.owner);
    const b = chest(c.target);
    const u = Math.min(1, c.t / c.duration);
    const g = c.data.g as Phaser.GameObjects.Graphics;
    g.clear();
    // Cuerda tensa: amplitud que crece y frecuencia que sube.
    const snapped = c.data.finalAt !== undefined;
    const amp = snapped ? c.data.snap * 160 : 6 + u * 26 + (c.t - (c.data.hitAt ?? -9999) < 150 ? 30 : 0);
    const freq = snapped ? 0.02 : 0.05 + u * 0.12;
    const pts: Phaser.Math.Vector2[] = [];
    for (let i = 0; i <= 40; i++) {
      const k = i / 40;
      const env = Math.sin(k * Math.PI);
      pts.push(new Phaser.Math.Vector2(a.x + (b.x - a.x) * k, a.y + (b.y - a.y) * k + Math.sin(c.t * freq + k * 9) * amp * env));
    }
    if (!snapped || c.data.snap > 0.02) {
      g.lineStyle(26, COPPER, 0.18).strokePoints(pts);
      g.lineStyle(8, HOT, 0.6).strokePoints(pts);
      g.lineStyle(3, 0xffffff, 0.9).strokePoints(pts);
    }
    // La corriente del ampli lo electrocuta tras cada golpe.
    const since = c.t - (c.data.hitAt ?? -9999);
    if (since < 380) zapArcs(g, c.target, HOT, 4, 3);
    victim(c, since < 380 ? shockPose(c.t, COPPER, 1.2) : { x: Math.sin(c.t * freq) * 3 });
  },
  note(c, x, y, hit, final) {
    // Chispa de corriente: núcleo del color de la cuerda (las ramas eléctricas se dibujan en fly).
    return hit ? c.scene.add.image(x, y, glowTex(c.scene)).setTint(final ? 0xffffff : ROPE).setBlendMode(ADD).setScale(final ? 1.4 : 0.8) : spark(c, x, y, HOT);
  },
  fly(c, x, y, _age, final) {
    const g = c.data.g as Phaser.GameObjects.Graphics;
    // Corriente: rayos cortos que chisporrotean alrededor y una cola eléctrica, con los colores de la cuerda.
    const reach = final ? 90 : 55;
    for (let k = 0; k < 3; k++) {
      const a = Math.random() * Math.PI * 2;
      bolt(g, jag(x, y, x + Math.cos(a) * reach, y + Math.sin(a) * reach, 4, 14), k ? COPPER : ROPE, k ? 2 : 3, 0.9);
    }
    bolt(g, jag(x, y, x - c.owner.facing * 160, y + (Math.random() - 0.5) * 50, 6, 24), ROPE, final ? 4 : 2.5, 0.85);
  },
  impact(c, x, y, final) {
    markHit(c, final);
    burst(c, x, y, HOT, 10, 600);
    if (!final) return;
    const scene = c.scene;
    const t = chest(c.target);
    // ¡TWANG!: la cuerda se suelta y latiguea hasta apagarse.
    c.data.snap = 1;
    scene.tweens.add({ targets: c.data, snap: 0, duration: 700, ease: 'Quad.easeOut' });
    colorFlash(scene, 'burn', 500);
    veil(scene, HOT, 0.4, 60, 10, 400, 48);
    shockwave(scene, 0.75, 900);
    burst(c, t.x, t.y, COPPER, 40, 1400);
    for (let k = 0; k < 5; k++) c.fx.ring(t.x, t.y, k % 2 ? HOT : COPPER, 240 + k * 170, 0.5);
    c.fx.hit(t.x, t.y, HOT, true);
    scene.cameras.main.shake(600, 0.028);
    finale(scene, 'TE DEJÉ BIEN|REMATADO', '#e0914a');
  },
};
