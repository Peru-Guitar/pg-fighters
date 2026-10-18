import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, GROUND_Y } from '../../config';
import { chest, rand, finale, veil, type ShowCtx, type SuperShow } from './kit';
import { ADD, burst, colorFlash, echo, every, lensBarrel, markHit, shockwave, spark, victim } from './energy';

const GREEN = 0x4dff88;

/** Silueta de luz del propio Mimético (su cuadro actual), lista para salir volando. */
const silhouette = (c: ShowCtx, x: number, y: number, scale: number) => {
  const s = c.owner.sprite;
  return c.scene.add.image(x, y, s.texture.key, s.frame.name).setFlipX(s.flipX).setScale(s.scaleX * scale)
    .setTint(GREEN).setTintMode(Phaser.TintModes.FILL).setBlendMode(ADD).setAlpha(0.85);
};

/**
 * MIMÉTICO · COPIA EXACTA: una barra de luz verde escanea la pantalla y todo deja copias fantasma;
 * dispara siluetas verdes de sí mismo. El rival deja copias que lo imitan con retraso.
 * De fondo, un ejército de copias avanza hacia el rival sin tocarlo.
 * Remate: una copia de su tamaño corre por el piso hasta el rival y estalla en verde.
 */
export const mimetico: SuperShow = {
  aim: false,
  // La copia grande tarda en llegar y el estallido va después: que se vea entero.
  finaleMs: 1300,
  start(c: ShowCtx) {
    const scan = c.scene.add.graphics().setBlendMode(ADD);
    // Filtro verde suave de fondo, detrás de los luchadores (como el fondo de los demás ultimates).
    c.back.add(c.scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, GREEN, 0.1).setOrigin(0));
    c.front.add(scan);
    Object.assign(c.data, { scan });
  },
  update(c: ShowCtx) {
    // Barra de fotocopiadora que va y viene por toda la pantalla.
    const g = c.data.scan as Phaser.GameObjects.Graphics;
    g.clear();
    const x = (Math.sin(c.t / 380) * 0.5 + 0.5) * GAME_WIDTH;
    for (let k = 0; k < 6; k++) g.fillStyle(GREEN, k === 0 ? 0.5 : 0.06).fillRect(x - 6 - k * 22, 0, 12 + k * 44, GAME_HEIGHT);
    // Imagen repetida: un leve abombado que respira.
    const b = lensBarrel(c);
    if (b) b.amount = 1 + Math.sin(c.t / 200) * 0.018;
    // Todo deja copias: él a los lados, el rival detrás con retraso.
    if (every(c, 'copyAt', 120)) {
      echo(c.scene, c.owner.sprite, { dx: rand(-160, 160), color: GREEN, alpha: 0.35, ms: 380 });
      if (c.data.hits) for (let i = 1; i <= 3; i++) echo(c.scene, c.target.sprite, { dx: c.owner.facing * i * 40, color: GREEN, alpha: 0.4 - i * 0.1, ms: 160 + i * 80 });
    }
    // De fondo: copias que cruzan toda la pantalla de frente, a todas las alturas, sin tocar a nadie.
    if (!c.data.done && every(c, 'marchAt', 120)) {
      const s = c.owner.sprite;
      const dir = c.owner.facing;
      const far = rand(0.25, 0.55);
      const copy = c.scene.add.image(0, 0, s.texture.key, s.frame.name)
        .setScale(s.scaleX * far).setFlipX(s.flipX).setTint(GREEN).setTintMode(Phaser.TintModes.FILL).setBlendMode(ADD).setAlpha(far * 0.6);
      const half = copy.displayWidth / 2;
      copy.setPosition(dir > 0 ? -half : GAME_WIDTH + half, rand(0, GAME_HEIGHT));
      c.back.add(copy);
      (c.data.marchers ??= new Set()).add(copy);
      c.scene.tweens.add({ targets: copy, x: dir > 0 ? GAME_WIDTH + half : -half, duration: rand(900, 1500), onComplete: () => { c.data.marchers.delete(copy); copy.destroy(); } });
    }
    const since = c.t - (c.data.hitAt ?? -9999);
    victim(c, { tint: since < 150 ? GREEN : 0xc8ffd8, fill: since < 150, x: since < 200 ? rand(-6, 6) : 0 });
  },
  note(c, x, y, hit, final) {
    return hit ? silhouette(c, x, y, final ? 0.75 : 0.45) : spark(c, x, y, GREEN);
  },
  fly(c, _x, _y, _age, _final, obj) {
    obj.setAngle(0);
    if (every(c, 'flyEcho', 40)) {
      const img = obj as Phaser.GameObjects.Image;
      const ghost = c.scene.add.image(img.x, img.y, img.texture.key, img.frame.name).setFlipX(img.flipX).setScale(img.scaleX)
        .setTint(GREEN).setTintMode(Phaser.TintModes.FILL).setBlendMode(ADD).setAlpha(0.35).setDepth(31);
      c.scene.tweens.add({ targets: ghost, alpha: 0, duration: 220, onComplete: () => ghost.destroy() });
    }
  },
  impact(c, x, y, final) {
    markHit(c, final);
    burst(c, x, y, GREEN, 12, 600);
    if (!final) return;
    const scene = c.scene;
    // Tras el remate, el ejército de fondo se esfuma.
    c.data.done = true;
    for (const copy of c.data.marchers ?? []) scene.tweens.add({ targets: copy, alpha: 0, duration: 250 });
    const t = chest(c.target);
    // Remate: una copia de su mismo tamaño sale desde el piso a su lado, corre hacia el rival y estalla.
    const s = c.owner.sprite;
    const FLIGHT = 260;
    const big = scene.add.image(c.owner.x, GROUND_Y, s.texture.key, s.frame.name).setOrigin(0.5, 1)
      .setScale(s.scaleX).setFlipX(s.flipX).setTint(GREEN).setTintMode(Phaser.TintModes.FILL).setBlendMode(ADD).setAlpha(0.95).setDepth(47);
    scene.tweens.add({ targets: big, x: t.x, duration: FLIGHT, ease: 'Cubic.easeIn', onComplete: () => big.destroy() });
    // Estela: fantasmas que deja al pasar.
    for (let k = 1; k <= 5; k++) {
      scene.time.delayedCall(k * (FLIGHT / 6), () => {
        const ghost = scene.add.image(big.x, big.y, s.texture.key, s.frame.name).setOrigin(0.5, 1).setScale(big.scaleX).setFlipX(s.flipX)
          .setTint(GREEN).setTintMode(Phaser.TintModes.FILL).setBlendMode(ADD).setAlpha(0.4).setDepth(46);
        scene.tweens.add({ targets: ghost, alpha: 0, duration: 260, onComplete: () => ghost.destroy() });
      });
    }
    scene.time.delayedCall(FLIGHT, () => {
      colorFlash(scene, 'negative', 300, 0.6);
      veil(scene, GREEN, 0.4, 80, 20, 400, 48);
      shockwave(scene, 0.6, 800);
      for (let k = 0; k < 5; k++) c.fx.ring(t.x, t.y, GREEN, 240 + k * 180, 0.5);
      c.fx.hit(t.x, t.y, GREEN, true);
      scene.cameras.main.shake(500, 0.024);
      finale(scene, 'VOLVERÉ ESTE ATAQUE|UN ÉXITO EN YOUTUBE', '#4dff88');
    });
  },
};
