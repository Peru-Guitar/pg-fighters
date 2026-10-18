import Phaser from 'phaser';
import { FONTS, GAME_HEIGHT, GAME_WIDTH } from '../../config';
import { chest, emit, rand, finale, veil, type ShowCtx, type SuperShow } from './kit';
import { burst, colorFlash, comet, glintTex, glowTex, lensColor, lensVignette, markHit, pixelFlash, shockwave, shot, spark, victim } from './energy';

const PINK = 0xff7ad9;
const SOFT = 0xffd0f0;

/**
 * KIMBERLY · TRANSMISIÓN EN VIVO: un aro de luz rosa enorme detrás de ella y brillos por todas partes,
 * como un filtro de belleza sobre toda la pantalla; dispara destellos rosados. El rival queda
 * sobreexpuesto, blanco y quemado por la luz. Remate: se "cae" la transmisión… y vuelve con un estallido rosa.
 */
export const kimberly: SuperShow = {
  spin: 240,
  start(c: ShowCtx) {
    // Transmisión: insignia EN VIVO y contador de likes que sube de a millones.
    const live = c.scene.add.text(70, 210, '● EN VIVO', { fontFamily: FONTS.head, fontSize: '56px', fontStyle: 'italic 900', color: '#ffffff', backgroundColor: '#e8173d', padding: { x: 18, y: 6 } });
    const likes = c.scene.add.text(70, 300, '', { fontFamily: FONTS.head, fontSize: '64px', fontStyle: 'italic 900', color: '#ff7ad9', stroke: '#000000', strokeThickness: 8 });
    const viewers = c.scene.add.text(70, 382, '', { fontFamily: FONTS.head, fontSize: '36px', fontStyle: '900', color: '#ffffff', stroke: '#000000', strokeThickness: 6 });
    c.front.add([live, likes, viewers]);
    Object.assign(c.data, { live, likes, viewers, count: 2_000_000, pop: 0, auraAt: -999 });
  },
  update(c: ShowCtx, dt: number) {
    // Aura rosa que sale de su silueta mientras toca (sigue su dibujo, no un círculo fijo).
    if (c.t - c.data.auraAt > 70) {
      c.data.auraAt = c.t;
      c.fx.ghost(c.owner.sprite, Math.floor(c.t / 140) % 2 ? SOFT : PINK, 0.5, 300, 0.04);
    }
    // Los likes suben sin parar (y saltan con cada golpe).
    c.data.count += dt * 1_800_000;
    c.data.pop = Math.max(0, c.data.pop - dt * 4);
    (c.data.likes as Phaser.GameObjects.Text).setText(`♥ ${Math.floor(c.data.count).toLocaleString('es-PE')} likes`).setScale(1 + c.data.pop * 0.25);
    (c.data.viewers as Phaser.GameObjects.Text).setText(`${Math.floor(c.data.count / 7.3).toLocaleString('es-PE')} viendo ahora`);
    (c.data.live as Phaser.GameObjects.Text).setAlpha(Math.floor(c.t / 450) % 2 ? 1 : 0.55);
    if (Math.random() < dt * 30) emit(c, glintTex(c.scene), rand(0, GAME_WIDTH), rand(0, GAME_HEIGHT), { life: 0.6, scale: rand(0.3, 0.9), grow: -1.2, spin: 140, tint: Math.random() < 0.6 ? PINK : 0xffffff, add: true });
    if (Math.random() < dt * 25) emit(c, glowTex(c.scene), c.owner.x + rand(-400, 400), GAME_HEIGHT + 20, { vy: -rand(200, 420), life: 2.4, scale: rand(0.3, 0.7), tint: PINK, add: true, layer: 'back' });
    // Filtro de belleza: todo más brillante y suave, bordes rosas.
    const cm = lensColor(c);
    if (cm) {
      cm.colorMatrix.brightness(1.25);
      cm.colorMatrix.alpha = c.data.down ? 0 : 0.35;
    }
    const vig = lensVignette(c, 0xff4fc0);
    if (vig) vig.strength = 0.15;
    // Sobreexpuesto: cada golpe lo quema más de luz.
    const hits = c.data.hits ?? 0;
    const since = c.t - (c.data.hitAt ?? -9999);
    const burn = Math.min(1, hits / 5);
    victim(c, { tint: since < 150 || Math.random() < burn * 0.4 ? 0xffffff : SOFT, fill: since < 150 || burn > 0.7, alpha: 1 - burn * 0.25 });
  },
  note(c, x, y, hit, final) {
    return hit ? shot(c, glintTex(c.scene), x, y, final ? 0xffffff : PINK, final ? 1.8 : 1) : spark(c, x, y, PINK);
  },
  fly(c, x, y, _age, final) {
    comet(c, x, y, PINK, final ? 1.3 : 0.8);
  },
  impact(c, x, y, final) {
    markHit(c, final);
    c.data.count += final ? 25_000_000 : 3_500_000;
    c.data.pop = 1;
    burst(c, x, y, PINK, 12, 700, glintTex(c.scene));
    if (!final) return;
    const scene = c.scene;
    const t = chest(c.target);
    // Se cae la transmisión: pantalla pixelada y en gris…
    c.data.down = true;
    pixelFlash(scene, 40, 500);
    colorFlash(scene, 'gray', 450);
    scene.time.delayedCall(380, () => {
      // …y vuelve en vivo.
      c.data.down = false;
      colorFlash(scene, 'saturate', 500);
      veil(scene, PINK, 0.5, 80, 20, 450, 48);
      shockwave(scene, 0.6, 850);
      burst(c, t.x, t.y, PINK, 50, 1500, glintTex(scene));
      for (let k = 0; k < 5; k++) c.fx.ring(t.x, t.y, k % 2 ? 0xffffff : PINK, 240 + k * 170, 0.5);
      c.fx.hit(t.x, t.y, PINK, true);
      scene.cameras.main.shake(500, 0.024);
      finale(scene, 'ESTO SE VUELVE|VIRAL', '#ff7ad9');
    });
  },
};
