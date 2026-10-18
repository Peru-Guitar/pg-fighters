import Phaser from 'phaser';
import { GAME_WIDTH, GROUND_Y } from '../config';
import type { MoveDef } from '../data/moves';
import { moveFor } from '../data/moveset';
import { powerFist, type ShotSpec } from '../data/powers';
import type { Fx } from '../systems/Fx';
import { resolvePose } from '../systems/FighterArt';
import { buildLook, type LookObj } from '../visuals/powers';
import type { Fighter } from './Fighter';

/** Lo que tarda en formarse un rayo lanzado saltando (ms). */
const AIR_BEAM_MS = 50;
const BASE_RADIUS = 52;
/** Alto del libro-muro de Escalas plantado (px). */
const WALL_H = 380;
/** Jaula de NOSU: barras verticales (meridianos) y horizontales (paralelos) de la esfera. */
const CAGE_MERIDIANS = 4;
const CAGE_PARALLELS = 6;
/** Capas del degradado de la esfera sin rejas. */
const ORB_STEPS = 8;
/** La esfera con rejas en vuelo mide esto respecto de la lisa. */
const CAGE_SIZE = 2;
/** La jaula se gasta al salir (pegue o no) y tarda esto en volver (ms). */
export const CAGE_RECHARGE_MS = 5000;
/** Tamaño de la esfera sin rejas respecto del radio del poder (la jaula usa 1.15). */
const ORB_SCALE = 0.75;
/** Velocidad de todos los poderes básicos (px/s); `speed` solo la cambia en los que son rápidos a propósito. */
export const POWER_SPEED = 950;
/** Gravedad de los poderes que botan o caen en arco (px/s²). */
const GRAVITY = 2600;
/** Duración del rayo encendido y de su desvanecido (s). */
const BEAM_ON = 0.12;
const BEAM_FADE = 0.22;

/**
 * Poder básico (↓ ↘ → + P): un disparo de `ShotSpec` (data/powers.ts). Sale del puño, deja su cola
 * de partículas y se mueve según su comportamiento: recto, onda, bote, arco, bumerán, trampa, rayo…
 */
/** Puño en la pose del poder [adelante, altura] × alto de guardia, para quien no encaja con el promedio. */

/** Velocidad del arranque lento (`windup`) respecto de la final. */
const WINDUP_SPEED = 0.08;

/** Duración (s) de la cola de láser del dardo. */
const TAIL_S = 0.25;

export class Projectile {
  x: number;
  z: number;
  vx: number;
  radius: number;
  readonly move: MoveDef;
  alive = true;
  private vz = 0;
  private baseZ: number;
  private x0: number;
  private readonly dir: 1 | -1;
  private readonly speed: number;
  private age = 0;
  private look: LookObj | null = null;
  private g: Phaser.GameObjects.Graphics;
  /** Todavía no salió (ráfagas). */
  private dormant: boolean;
  private hitsLeft: number;
  /** Tras pegar, no vuelve a tocar hasta este momento (bumerán). */
  private cooldown = 0;
  private returning = false;
  private hoverUntil = -1;
  private exploding = -1;
  /** Rayos: momento en que se encendió (s) y si ya pegó. */
  private beamAt = -1;
  /** Látigo: momento en que enganchó al rival (s), -1 si no. Mientras lo jala, la cuerda queda tensa. */
  private hookedAt = -1;
  private spent = false;
  /** Dardo: si ya salió del puño y los últimos puntos de su recorrido (cola). */
  private released = false;
  private tail: { x: number; y: number; t: number }[] = [];
  /** Bomba y plátano: momento en que tocó el piso (s), -1 mientras vuela. */
  private landedAt = -1;
  /** Moneda: momento en que se pegó al rival (s). */
  private stuckAt = -1;
  /** Estrella de Markus: ya dejó el piso y va hacia el rival. */
  private rising = false;
  /** Libro-muro: plantado en el piso hasta este momento (s), -1 mientras vuela. */
  private wallUntil = -1;
  /** Pegó o se lo bloquearon al menos una vez (lick de Pentalick: si no, vuelve al nivel 1). */
  connected = false;
  /** Jaula de NOSU: encierra si pega. Mientras se recarga, sale la esfera lisa (solo pega). */
  readonly caging: boolean;
  /** Se lanzó saltando (la sombra de Mimético sale a la altura del salto). */
  private readonly aerial: boolean;
  /** El clic seguía apretado al salir (látigo largo de Rematada). */
  private readonly held: boolean;
  /** Carga con la que salió (0–1), para los poderes que se cargan. */
  private readonly charge: number;
  /** Arranque lento (`windup`): ya salió disparado. */
  private wound = false;
  /** Cruz: distancia hasta donde estaba el rival al salir (crece hasta ahí). */
  private growDist = 1;
  /** Sombra: última copia fantasma que dejó (s). */
  private lastEcho = -1;

  constructor(
    private scene: Phaser.Scene,
    private fx: Fx,
    readonly owner: Fighter,
    readonly spec: ShotSpec,
    readonly color: number,
  ) {
    const base = moveFor(owner.def.id, 'special');
    this.move = spec.low || spec.push ? { ...base, ...(spec.low ? { level: 'low' as const } : {}), ...(spec.push ? { push: spec.push } : {}) } : base;
    this.dir = owner.facing;
    this.radius = BASE_RADIUS * (spec.size ?? 1);
    // Poder cargado (Pepper): más grueso, más daño y más empuje según la carga.
    this.charge = spec.charged ? owner.shotCharge : 0;
    if (spec.charged && this.charge > 0) {
      const c = spec.charged;
      this.radius *= Phaser.Math.Linear(1, c.size, this.charge);
      this.move = { ...this.move, push: this.move.push * Phaser.Math.Linear(1, c.push, this.charge), hitstop: this.move.hitstop + 60 * this.charge };
    }
    this.speed = POWER_SPEED * (spec.speed ?? 1);
    const fist = this.fist();
    this.x = this.x0 = fist.x;
    this.z = this.baseZ = fist.z;
    this.vx = this.dir * (spec.beam ? 1 : this.speed);
    this.hitsLeft = spec.hits ?? 1;
    this.aerial = !owner.grounded;
    this.held = !!spec.holdRange && !!owner.intent.punchHeld;
    this.caging = !!spec.cage && owner.now >= owner.cageReadyAt;
    if (this.caging) owner.cageReadyAt = owner.now + CAGE_RECHARGE_MS;
    // La esfera con rejas es el doble de grande que la lisa (dibujo y zona de golpe).
    if (this.caging) this.radius *= CAGE_SIZE;
    this.dormant = !!spec.delay || spec.fork === -1;
    this.g = scene.add.graphics().setDepth(30).setBlendMode(Phaser.BlendModes.ADD);
    if (!spec.delay) this.launch();
  }

  /**
   * Sombra de Mimético: su propio cuerpo en verde, con los pies en el piso. El contenedor va a la
   * altura del golpe (pecho) y la figura cuelga `z` px hacia abajo.
   */
  private buildShadow(): LookObj {
    const s = this.owner.sprite;
    // Pies al nivel de los de Mimético: en el piso, o a la altura del salto si la lanzó saltando.
    const body = this.scene.add.image(0, this.z - (this.aerial ? this.owner.z : 0), s.texture.key, s.frame.name)
      .setOrigin(s.originX, s.originY).setScale(Math.abs(s.scaleX), s.scaleY).setFlipX(this.dir < 0)
      .setTint(this.color).setTintMode(Phaser.TintModes.FILL).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.85);
    return { obj: this.scene.add.container(this.x, this.y, [body]), spin: 0, aim: false };
  }

  /** La sombra corre (cuadros de caminar) y deja copias fantasma detrás. */
  private runShadow(c: Phaser.GameObjects.Container): void {
    const body = c.list[0] as Phaser.GameObjects.Image;
    const frame = resolvePose(this.scene, this.owner.def, 'walk', this.age * 1600).frame;
    if (body.texture.has(frame)) body.setFrame(frame);
    if (this.age - this.lastEcho < 0.05) return;
    this.lastEcho = this.age;
    const ghost = this.scene.add.image(c.x, c.y + body.y, body.texture.key, body.frame.name)
      .setOrigin(body.originX, body.originY).setScale(body.scaleX, body.scaleY).setFlipX(body.flipX)
      .setTint(this.color).setTintMode(Phaser.TintModes.FILL).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.3).setDepth(30);
    this.scene.tweens.add({ targets: ghost, alpha: 0, duration: 220, onComplete: () => ghost.destroy() });
  }

  /** Puño del luchador en la pose del poder (proporcional a su altura). */
  private fist(): { x: number; z: number } {
    const o = this.owner;
    const h = o.def.art.height;
    const [fx, fz] = powerFist(o.def.id);
    return { x: o.x + o.facing * h * fx, z: o.z + h * fz };
  }

  /** Sale del puño: aparece el dibujo y, según el tipo, su velocidad inicial. */
  private launch(): void {
    if (this.spec.delay) {
      const fist = this.fist();
      this.x = fist.x;
      this.z = this.baseZ = fist.z;
    }
    if (this.spec.fork !== -1) this.dormant = false;
    if (this.spec.beam || this.dormant) return;
    const s = this.spec;
    const o = this.owner;
    const rival = o.opponent;
    if (s.rise !== undefined) {
      // Arranca pegada al piso.
      this.z = this.baseZ = this.radius * 0.9 + 20;
      this.fx.dust(this.x, GROUND_Y, this.dir, 5);
    }
    if (s.aimed !== undefined) {
      // Aguja: desde su altura, en línea recta al pecho del rival.
      this.z = this.baseZ = Math.max(40, this.z + s.aimed);
      const tx = rival.x - this.x;
      const tz = rival.z + rival.def.art.height * 0.55 - this.z;
      const d = Math.hypot(tx, tz) || 1;
      this.vx = (tx / d) * this.speed;
      this.vz = (tz / d) * this.speed;
    }
    if (s.grow) this.growDist = Math.max(300, Math.abs(rival.x - this.x));
    if (this.spec.arc) {
      // Calcula el arco para caer sobre el pecho del rival.
      const t = this.owner.opponent;
      const dx = t.x - this.x;
      const T = Phaser.Math.Clamp(Math.abs(dx) / 620, 0.55, 1.15);
      this.vx = dx / T;
      this.vz = (t.z + 260 - this.z + 0.5 * GRAVITY * T * T) / T;
    }
    if (this.spec.dz) this.z = this.baseZ = this.z + this.spec.dz;
    // Arranque lento: casi quieto hasta que se cumple `windup` (ver update).
    if (this.spec.windup) this.vx = this.dir * this.speed * WINDUP_SPEED;
    if (this.spec.skim) {
      // Rasante desde que sale: pegada al piso, recta.
      this.z = this.baseZ = this.radius * 0.6 + 10;
      this.landedAt = this.age;
    } else if (this.spec.bounce || this.spec.fuse || this.spec.low) this.vz = 500;
    if (this.spec.vz0 !== undefined) this.vz = this.spec.vz0;
    if (this.spec.accel) this.radius *= 0.7;
    if (this.spec.cage) {
      // Jaula y bola se dibujan a mano cada frame (drawCage / drawOrb).
      this.fx.ring(this.x, this.y, this.color, this.radius * 1.6, 0.22);
      return;
    }
    this.look = this.spec.look === 'shadow' ? this.buildShadow() : buildLook(this.scene, this.spec.look, this.color, this.radius, this.x, this.y);
    this.look.obj.setDepth(31);
    if (!this.dormant) this.fx.ring(this.x, this.y, this.color, this.radius * 1.6, 0.22);
  }

  get y(): number {
    return GROUND_Y - this.z;
  }

  /** Daño completo antes de defensas. */
  get damage(): number {
    const direct = this.spec.direct && this.exploding < 0 ? this.spec.direct : 1;
    const charged = this.spec.charged ? Phaser.Math.Linear(1, this.spec.charged.damage, this.charge) : 1;
    const swell = this.spec.swell ? Phaser.Math.Linear(1, this.spec.swell.damage, this.swollen) : 1;
    return this.move.damage * this.owner.def.stats.damage * (this.spec.damage ?? 1) * direct * charged * swell;
  }

  /** Cuánto se hinchó (0 al salir, 1 al acabarse su tiempo). */
  private get swollen(): number {
    return this.spec.swell && this.spec.life ? Math.min(1, this.age / this.spec.life) : 0;
  }

  /** Rayos y explosiones no chocan con otros poderes. */
  get clashes(): boolean {
    return !this.dormant && !this.spec.beam && !this.charging && this.exploding < 0;
  }

  /** Libro-muro plantado: gana todos los choques sin moverse y no pega. */
  get walled(): boolean {
    return this.wallUntil >= 0 && this.alive;
  }

  /** Alcance vertical para los choques (el muro es alto). */
  get zReach(): number {
    return this.walled ? WALL_H / 2 : this.radius;
  }

  /** Sigue girando alrededor de su dueño (escudo de Kimberly). */
  get orbiting(): boolean {
    return !!this.spec.orbit && this.alive && this.age * 1000 < this.spec.orbit;
  }

  /** Se está cargando: ni pega ni choca hasta salir disparado. */
  private get charging(): boolean {
    return !!this.spec.charge && this.orbiting;
  }

  /** Escudo roto: los corazones se apagan con un destello. */
  shatter(): void {
    this.fx.hit(this.x, this.y, this.color, false);
    this.destroy();
  }

  get pierce(): boolean {
    return !!this.spec.pierce;
  }

  private revived = false;

  /**
   * Perdió un choque. Si puede renacer (Ricardo), revive una vez en el mismo lugar con un destello
   * y devuelve true; si no, se destruye.
   */
  lose(): boolean {
    // Lo que explota al contacto (cruces de Toxicity, esfera de Clavito): al chocar con un poder, explota en su sitio.
    if (this.spec.explode && !this.spec.fuse && !this.spec.hover && this.exploding < 0) {
      this.burst();
      return true;
    }
    // Las bombas (nota de Mayin) no se pierden: un poder que las toca las detona.
    if ((this.spec.fuse || (this.spec.hover && this.spec.explode)) && this.exploding < 0) {
      this.burst();
      return true;
    }
    if (this.spec.revive && !this.revived) {
      this.revived = true;
      this.cooldown = this.age + 0.2;
      for (let k = 0; k < 3; k++) this.fx.ring(this.x, this.y, k % 2 ? 0xffffff : this.color, this.radius * (1.2 + k * 0.6), 0.4);
      this.look?.obj.setScale((this.look.obj.scaleX || 1) * 1.15);
      return true;
    }
    this.destroy();
    return false;
  }

  /** Largo del rayo encendido. */
  private get reach(): number {
    // Látigo de Rematada con el clic apretado: llega más lejos.
    if (this.spec.range) return this.spec.range * (this.held ? this.spec.holdRange ?? 1 : 1);
    return this.dir > 0 ? GAME_WIDTH + 200 - this.x0 : this.x0 + 200;
  }

  /** ¿Toca a `f`? Compara con el cuerpo del rival (las piernas no cuentan: saltar a tiempo lo esquiva). */
  touches(f: Fighter): boolean {
    if (this.dormant || this.spent || this.charging || this.walled || this.age < this.cooldown) return false;
    if (this.spec.low) {
      // Pega abajo: solo mientras se arrastra por el piso y al que no está saltando.
      return this.landedAt >= 0 && this.exploding < 0 && f.z < 60 && Math.abs(f.x - this.x) < this.radius + 55;
    }
    const body = f.crouching ? 300 : 440;
    const inBand = (z: number, r: number) => z + r * 0.5 > f.z + 120 && z - r * 0.5 < f.z + body;
    if (this.spec.beam) {
      if (this.beamAt < 0 || this.age - this.beamAt > BEAM_ON) return false;
      const dx = (f.x - this.x0) * this.dir;
      return dx > -40 && dx < this.reach + 55 && inBand(this.z, this.radius * 1.4);
    }
    if (Math.abs(f.x - this.x) >= this.radius + 55) return false;
    // Lo que crece (ráfaga del Virrey) también crece en alto.
    const grown = this.spec.grow && this.spec.tall ? this.radius / (BASE_RADIUS * (this.spec.size ?? 1)) : 1;
    return inBand(this.z, (this.spec.tall ?? this.radius) * grown);
  }

  /**
   * Pegó (o lo bloquearon). Devuelve false si el poder debe desaparecer.
   * El bumerán puede pegar otra vez; los rayos se quedan en pantalla desvaneciéndose.
   */
  onHit(): boolean {
    this.connected = true;
    this.hitsLeft--;
    if (this.spec.explode && this.exploding < 0) this.burst();
    if (this.spec.beam) {
      this.spent = true;
      return true;
    }
    if (this.spec.stick && this.hitsLeft > 0) {
      // Moneda: se queda pegada y vuelve a pegar enseguida.
      this.stuckAt = this.age;
      this.cooldown = this.age + 0.12;
      return true;
    }
    if (this.hitsLeft > 0) {
      this.cooldown = this.age + 0.35;
      return true;
    }
    return false;
  }

  /** KABOOM: el poder se convierte en un área por un instante. */
  private burst(): void {
    this.exploding = this.age;
    this.radius = this.spec.explode ?? this.radius;
    for (let k = 0; k < 3; k++) this.fx.ring(this.x, this.y, k % 2 ? 0xe0b862 : this.color, this.radius * (0.6 + k * 0.35), 0.4);
    this.fx.hit(this.x, this.y, this.color, true);
    this.scene.cameras.main.shake(180, 0.008);
    this.look?.obj.setVisible(false);
  }

  update(dt: number): void {
    this.age += dt;
    const s = this.spec;
    if (this.dormant) {
      if (s.delay && this.age * 1000 >= s.delay) this.launch();
      else if (s.fork === -1 && this.age * 1000 >= (s.split ?? 0)) {
        // La otra mitad del fork aparece donde va la primera.
        this.dormant = false;
        this.x = this.x0 + this.dir * this.speed * this.age;
        this.look = buildLook(this.scene, s.look, this.color, this.radius, this.x, this.y);
        this.look.obj.setDepth(31);
        this.fx.ring(this.x, this.y, this.color, this.radius * 1.4, 0.2);
      }
      if (this.dormant) return;
    }
    const t = this.age - (s.delay ?? 0) / 1000;

    if (s.beam) return this.updateBeam(t);
    if (this.exploding >= 0) {
      if (this.age - this.exploding > 0.15) this.destroy();
      return;
    }

    if (s.dart && !this.released) {
      // Dardo: la bola crece en el puño y luego sale hacia el pecho del rival.
      const k = Math.min(1, (t * 1000) / s.dart);
      const fist = this.fist();
      this.x = fist.x;
      this.z = fist.z;
      this.look?.obj.setScale((this.radius / BASE_RADIUS) * (0.4 + 0.6 * k)).setPosition(this.x, this.y);
      if (k < 1) return;
      this.released = true;
      const target = this.owner.opponent;
      const tx = target.x - this.x;
      const tz = target.z + target.def.art.height * 0.55 - this.z;
      const d = Math.hypot(tx, tz) || 1;
      this.vx = (tx / d) * this.speed;
      this.vz = (tz / d) * this.speed;
      this.fx.ring(this.x, this.y, this.color, this.radius * 2, 0.18);
    }

    if (s.orbit && t * 1000 < s.orbit) {
      // Escudo: gira alrededor del luchador (choca con los poderes rivales y pega si el rival se acerca).
      const o = this.owner;
      const ang = (s.phase ?? 0) * Math.PI * 2 + t * 5;
      if (s.guard) {
        // Cruces: anillos horizontales a tres alturas (rodillas, cintura y hombros, según `phase`);
        // pasan por delante y por detrás de ella (perspectiva).
        const near = Math.sin(ang);
        this.x = o.x + Math.cos(ang) * 190;
        this.z = o.z + o.def.art.height * (0.28 + (s.phase ?? 0) * 0.75) - near * 22;
        this.look?.obj.setDepth(near > 0 ? 31 : 19.6).setScale((this.radius / BASE_RADIUS) * (0.85 + 0.15 * near));
      } else {
        this.x = o.x + Math.cos(ang) * 150;
        this.z = o.z + o.def.art.height * 0.55 + Math.sin(ang) * 95;
      }
      this.vx = o.facing;
      if (s.charge) {
        // Se carga: crece de la mitad a su tamaño completo mientras gira.
        const k = (t * 1000) / s.orbit;
        this.radius = BASE_RADIUS * (s.size ?? 1) * (0.5 + 0.5 * k);
        this.look?.obj.setScale(this.radius / BASE_RADIUS);
      }
    } else if (this.wallUntil >= 0) {
      // Libro-muro: parado en el piso; al final se cae y desaparece.
      if (this.age > this.wallUntil) {
        this.fx.dust(this.x, GROUND_Y, this.dir, 10);
        return this.destroy();
      }
    } else if (this.hoverUntil >= 0) {
      // Trampa: se queda flotando, meciéndose, hasta que se acaba el tiempo (y explota si es una bomba).
      this.z = this.baseZ + Math.sin(this.age * 5) * 12;
      if (s.explode) {
        // Late cada vez más fuerte y rápido a medida que se acerca la explosión.
        const k = 1 - (this.hoverUntil - this.age) / ((s.hover ?? 1) / 1000);
        const beat = Math.max(0, Math.sin(this.age * Phaser.Math.Linear(8, 30, k)));
        this.look?.obj.setScale((this.radius / BASE_RADIUS) * (1 + 0.15 * k + 0.12 * beat * k));
      }
      if (this.age > this.hoverUntil) {
        if (s.explode) this.burst();
        else this.destroy();
        return;
      }
    } else {
      const rival = this.owner.opponent;
      if (this.stuckAt >= 0) {
        this.vx = this.vz = 0;
        this.x = rival.x - this.dir * 40;
        this.z = rival.z + rival.def.art.height * 0.55;
        if (this.age - this.stuckAt > 0.5) return this.destroy();
      }
      if (s.orbit && s.guard) {
        // Escudo de cruces: se acabó el tiempo y se apaga sin lanzarse.
        this.fx.ring(this.x, this.y, this.color, this.radius * 1.4, 0.25);
        return this.destroy();
      }
      if (s.orbit && Math.abs(this.vx) <= 1) {
        if (s.charge) {
          // Sol cargado: sale disparado al pecho del rival.
          const tx = rival.x - this.x;
          const tz = rival.z + rival.def.art.height * 0.55 - this.z;
          const d = Math.hypot(tx, tz) || 1;
          this.vx = (tx / d) * this.speed;
          this.vz = (tz / d) * this.speed;
          this.fx.ring(this.x, this.y, this.color, this.radius * 2.2, 0.22);
        } else {
          // Termina el escudo: sale disparado hacia donde mira el luchador.
          this.vx = this.owner.facing * this.speed;
        }
        this.baseZ = this.z;
      }
      if (s.windup && !this.wound && t * 1000 >= s.windup) {
        // Sale disparado de golpe.
        this.wound = true;
        this.vx = this.dir * this.speed;
        this.fx.ring(this.x, this.y, this.color, this.radius * 1.8, 0.15);
      }
      if (s.accel) {
        const k = Math.min(1, t / 1.1);
        this.vx = this.dir * POWER_SPEED * Phaser.Math.Linear(s.speed ?? 0.3, s.accel, k);
        this.radius = BASE_RADIUS * (s.size ?? 1) * Phaser.Math.Linear(0.7, 1.3, k);
        this.look?.obj.setScale(this.radius / BASE_RADIUS);
      }
      if (s.track) {
        // Onda afinada: corrige su altura hacia el pecho del rival, sin dejar de avanzar.
        const want = Phaser.Math.Clamp((rival.z + rival.def.art.height * 0.55 - this.z) * 4, -520, 520);
        this.vz += (want - this.vz) * Math.min(1, s.track * dt);
      }
      if (s.seek) {
        // Solo en horizontal: va hacia donde está el rival.
        const want = Math.sign(rival.x - this.x || this.dir) * this.speed;
        this.vx += (want - this.vx) * Math.min(1, s.seek * dt);
      }
      if (s.rise !== undefined && !this.rising && Math.abs(rival.x - this.x) < s.rise) {
        this.rising = true;
        this.fx.ring(this.x, this.y, this.color, this.radius * 1.6, 0.2);
      }
      if (s.homing && (s.rise === undefined || this.rising)) {
        // Gira suavemente hacia el pecho del rival.
        const target = this.owner.opponent;
        const tx = target.x - this.x;
        const tz = target.z + 260 - this.z;
        const d = Math.hypot(tx, tz) || 1;
        const k = Math.min(1, s.homing * dt);
        this.vx += ((tx / d) * this.speed - this.vx) * k;
        this.vz += ((tz / d) * this.speed - this.vz) * k;
      }
      if (s.boomerang) {
        // Bandeja de Chantal: si el rival la esquiva (lo pasa de largo sin que pegue a la ida), se rompe y no vuelve.
        if (!this.returning && !this.connected && (rival.x - this.x) * this.dir < -rival.def.art.height * 0.2) return this.shatter();
        const a = (this.speed * this.speed) / (2 * s.boomerang);
        this.vx -= this.dir * a * dt;
        if (!this.returning && this.vx * this.dir < 0) {
          this.returning = true;
          this.cooldown = 0; // a la vuelta puede volver a pegar
        }
        if (this.returning && (this.x - this.owner.x) * this.dir < 0) return this.destroy();
      }
      if (s.bounce || s.arc || ((s.fuse || s.low) && this.landedAt < 0)) this.vz -= GRAVITY * dt;
      if (s.climb) this.vz = s.climb;
      if (!s.wave && !s.fork) this.z += this.vz * dt;
      if (s.bounce && this.z < this.radius * 0.9 + 60) {
        this.z = this.radius * 0.9 + 60;
        this.vz = 900;
        this.fx.dust(this.x, GROUND_Y, this.dir, 3);
      }
      if (s.fuse && this.tickFuse(dt)) return;
      if (s.low) {
        // Plátano: cae del puño al piso y se arrastra hasta el rival.
        const rest = this.radius * 0.6 + 10;
        if (this.landedAt < 0 && this.z <= rest) {
          this.landedAt = this.age;
          this.fx.dust(this.x, GROUND_Y, this.dir, 5);
        }
        if (this.landedAt >= 0) {
          this.z = rest;
          this.vz = 0;
        }
      }
      if (s.aimed !== undefined && this.z < 0) return this.destroy();
      if (s.arc && this.z < 40) {
        // El frasco se rompe contra el piso.
        this.fx.hit(this.x, GROUND_Y - 30, this.color, false);
        return this.destroy();
      }
      if (s.wave) {
        const settle = s.wave.settle ? Math.max(0, 1 - t / s.wave.settle) : 1;
        this.z = this.baseZ + Math.sin(t * s.wave.freq) * s.wave.amp * settle;
      }
      if (s.fork && t * 1000 > (s.split ?? 0)) this.z += (this.baseZ + s.fork * 90 - this.z) * Math.min(1, dt * 10);
      this.x += this.vx * dt;
      if (s.grow) {
        // Cruz de Toxicity: crece con la distancia hasta `grow` × su tamaño al llegar a donde estaba el rival.
        const k = Math.min(1, Math.abs(this.x - this.x0) / this.growDist);
        this.radius = BASE_RADIUS * (s.size ?? 1) * Phaser.Math.Linear(1, s.grow, k);
        this.look?.obj.setScale(this.radius / BASE_RADIUS);
      }
      if (s.range && Math.abs(this.x - this.x0) >= s.range) {
        if (s.wall) {
          // Se planta parado: alto y de canto, apoyado en el piso.
          this.wallUntil = this.age + s.wall / 1000;
          this.vx = this.vz = 0;
          this.z = this.baseZ = WALL_H / 2;
          this.look?.obj.setAngle(this.dir > 0 ? -90 : 90).setScale(WALL_H / 140);
          this.fx.dust(this.x, GROUND_Y, this.dir, 14);
          this.scene.cameras.main.shake(120, 0.005);
        } else if (s.hover) {
          this.hoverUntil = this.age + s.hover / 1000;
          this.vx = 0;
          this.baseZ = this.z;
        } else if (s.explode) this.burst();
        else return this.destroy();
      }
    }
    if (s.swell && this.exploding < 0) {
      // Esfera de Clavito: crece con el tiempo.
      this.radius = BASE_RADIUS * (s.size ?? 1) * Phaser.Math.Linear(1, s.swell.size, this.swollen);
      this.look?.obj.setScale(this.radius / BASE_RADIUS);
    }
    // Esfera de Clavito: se le acaba el tiempo y se apaga con un anillo, sin explotar.
    if (s.life && s.explode && t > s.life && this.exploding < 0) {
      this.fx.ring(this.x, this.y, this.color, this.radius * 1.6, 0.3);
      return this.destroy();
    }
    if ((s.life && t > s.life) || this.x < -200 || this.x > GAME_WIDTH + 200 || this.z > 1300) return this.destroy();

    if (s.dart) this.drawTail();
    else if (this.landedAt >= 0 && s.fuse) this.drawFuse();
    else if (Math.random() < 0.9) this.fx.trail(this.x - Math.sign(this.vx || this.dir) * this.radius * 0.6, this.y, this.color, this.radius);
    // Sin poder encerrar: la misma esfera, sin rejas.
    if (s.cage) {
      const r = this.radius * (this.caging ? 1.15 : ORB_SCALE);
      drawCage(this.g.clear(), this.x, this.y, r, r, this.color, this.age, 1, this.caging);
    }
    const obj = this.look?.obj;
    if (!obj) return;
    obj.setPosition(this.x, this.y);
    if (s.look === 'shadow') this.runShadow(obj as Phaser.GameObjects.Container);
    if (this.owner.def.id === 'erp' && s.look === 'buster') {
      // Crecimiento solo visual: radio de colisión y daño permanecen constantes.
      const travel = Phaser.Math.Clamp(Math.abs(this.x - this.x0) / 900, 0, 1);
      const growth = Phaser.Math.SmoothStep(travel, 0, 1);
      obj.setScale((this.radius / BASE_RADIUS) * (1 + 0.25 * growth));
    }
    if (this.walled) {
      // El muro queda quieto (ni gira ni se voltea).
    } else if (this.look!.jitter) {
      // Cruz: se mantiene vertical, con un temblor leve.
      const j = this.look!.jitter;
      obj.setAngle(Math.sin(this.age * 55) * j).setPosition(this.x + Math.sin(this.age * 71) * j, this.y + Math.cos(this.age * 63) * j);
    } else if (this.look!.spin) obj.setAngle(obj.angle + this.look!.spin * this.dir * dt);
    else if (this.look!.aim) obj.setAngle(Phaser.Math.RadToDeg(Math.atan2(-this.vz, this.vx)));
    // Lo que apunta (agujas, dagas, lanza) ya gira hacia donde va: voltearlo además lo dejaría al revés.
    if (obj instanceof Phaser.GameObjects.Image && !this.walled) obj.setFlipX(this.vx < 0 && !this.look!.spin && !this.look!.aim);
  }

  /** Bomba: cae al piso, frena y cuenta la mecha. Devuelve true si explotó en este frame. */
  private tickFuse(dt: number): boolean {
    const rest = this.radius * 0.8;
    if (this.landedAt < 0) {
      if (this.z > rest) return false;
      this.landedAt = this.age;
      this.vx *= 0.35;
      this.fx.dust(this.x, GROUND_Y, this.dir, 6);
    }
    this.z = rest;
    this.vz = 0;
    this.vx *= Math.max(0, 1 - 6 * dt);
    this.x = Phaser.Math.Clamp(this.x, 80, GAME_WIDTH - 80);
    if (this.age - this.landedAt < (this.spec.fuse ?? 0) / 1000) return false;
    this.burst();
    return true;
  }

  /** Espejo: la copia sale desde el espejo, no desde el puño. */
  placeAt(x: number, z: number): void {
    this.x = this.x0 = x;
    this.z = this.baseZ = z;
    this.look?.obj.setPosition(x, this.y);
  }

  /** Mecha encendida: late cada vez más rápido y se pone roja. */
  private drawFuse(): void {
    const k = Math.min(1, (this.age - this.landedAt) / ((this.spec.fuse ?? 1) / 1000));
    const beat = Math.sin((this.age - this.landedAt) * Phaser.Math.Linear(9, 40, k));
    const obj = this.look?.obj;
    if (obj) {
      obj.setScale((this.radius / BASE_RADIUS) * (1 + 0.1 * k + 0.12 * Math.max(0, beat)));
      if ('setTint' in obj) {
        if (beat > 0.3) obj.setTint(0xff3b3b);
        else obj.clearTint();
      }
    }
    const g = this.g;
    g.clear();
    g.lineStyle(3, 0xff3b3b, 0.25 + 0.5 * k).strokeCircle(this.x, GROUND_Y - 4, (this.spec.explode ?? this.radius) * (0.4 + 0.6 * k));
  }

  /** Látigo de La Rematada: enganchó al rival y lo va a jalar (la cuerda se queda tensa hasta acercarlo). */
  hook(): void {
    this.hookedAt = this.age;
  }

  /** Rayos (láser, latigazo, feedback): cargan en el puño, se encienden un instante y se desvanecen. */
  private updateBeam(t: number): void {
    const s = this.spec;
    const g = this.g;
    g.clear();
    const fist = this.fist();
    if (this.beamAt < 0) {
      this.x = fist.x;
      this.z = this.baseZ = fist.z;
      // Saltando, el rayo se forma casi al instante.
      const k = Math.min(1, t / ((this.owner.grounded ? s.beam ?? 200 : AIR_BEAM_MS) / 1000));
      g.fillStyle(this.color, 0.25 + k * 0.4).fillCircle(this.x, this.y, this.radius * (0.4 + k * 0.6));
      g.fillStyle(0xffffff, 0.8).fillCircle(this.x, this.y, this.radius * 0.35 * k);
      if (k >= 1) {
        this.beamAt = this.age;
        this.scene.cameras.main.shake(90 + 160 * this.charge, 0.004 + 0.01 * this.charge);
      }
      return;
    }
    const on = this.age - this.beamAt;
    // Látigo: si el rival está dentro del alcance, la punta se queda en él (y lo sigue mientras lo jala).
    const rival = this.owner.opponent;
    const toRival = (rival.x - this.x0) * this.dir - 30;
    // Enganchado: la cuerda sigue tensa mientras lo trae (hasta tenerlo cerca o 0,6 s como mucho).
    const reeling = this.hookedAt >= 0 && this.age - this.hookedAt < 0.6 && toRival > 200;
    if (reeling) this.beamAt = Math.min(this.beamAt, this.age - 0.01);
    if (on > BEAM_ON + BEAM_FADE && !reeling) return this.destroy();
    const fade = on < BEAM_ON || reeling ? 1 : 1 - (on - BEAM_ON) / BEAM_FADE;
    const reach = s.look === 'lash' && toRival > 60 && toRival < this.reach ? toRival : this.reach;
    const len = reach * (s.look === 'lash' ? Math.min(1, on / 0.06) : 1);
    const x1 = this.x0 + this.dir * len;
    const h = this.radius * 1.4;
    // Látigo: el punto A sigue la mano de Rematada (si cae del salto, la cuerda la sigue); la punta queda donde llegó.
    const ax = fist.x;
    const ay = GROUND_Y - fist.z;
    if (s.look === 'laser') {
      // Rayo óptico del color del luchador: grueso, con núcleo casi blanco que tiembla.
      const left = Math.min(this.x0, x1);
      const flick = 1 + Math.sin(this.age * 90) * 0.06;
      // Con la carga, el color se intensifica: más saturado y más opaco, con un halo más ancho.
      const q = this.charge;
      const base = Phaser.Display.Color.ValueToColor(this.color).saturate(45 * q).color;
      const light = Phaser.Display.Color.ValueToColor(base).lighten(25 - 10 * q).color;
      for (const [w, c, a] of [[h * (2.2 + 0.6 * q), base, 0.22 + 0.3 * q], [h * 1.5, base, 0.55 + 0.35 * q], [h * 0.95, light, 0.9], [h * 0.4, 0xf2fffd, 1]] as const) {
        g.fillStyle(c, Math.min(1, a) * fade).fillRect(left, this.y - (w * flick) / 2, len, w * flick);
      }
      // Destello donde nace el rayo.
      g.fillStyle(base, (0.5 + 0.3 * q) * fade).fillCircle(this.x0, this.y, h * 1.3 * flick);
      g.fillStyle(0xffffff, 0.95 * fade).fillCircle(this.x0, this.y, h * 0.55);
    } else if (s.look === 'lash' && this.hookedAt >= 0) {
      // Enganchado: cuerda de guitarra tensa hasta el rival, vibrando como recién pulsada.
      const ty = GROUND_Y - rival.z - rival.def.art.height * 0.55;
      const tx = this.x0 + this.dir * len;
      const vib = 16 * Math.max(0, 1 - (this.age - this.hookedAt) / 0.8);
      g.lineStyle(12, this.color, 0.3 * fade).lineBetween(ax, ay, tx, ty);
      for (let n = 0; n < 3; n++) {
        g.lineStyle(n === 1 ? 4 : 2, n === 1 ? 0xffffff : 0xf2d0a0, fade * (n === 1 ? 1 : 0.7));
        g.beginPath();
        for (let i = 0; i <= 30; i++) {
          const k = i / 30;
          const wave = Math.sin(k * Math.PI) * Math.sin(this.age * 90 + n * 2.1) * vib * (n === 1 ? 1 : 0.6);
          g.lineTo(Phaser.Math.Linear(ax, tx, k), Phaser.Math.Linear(ay, ty, k) + wave);
        }
        g.strokePath();
      }
      // Gancho en el rival.
      g.fillStyle(0xffffff, fade).fillCircle(tx, ty, 10);
      g.lineStyle(3, this.color, fade).strokeCircle(tx, ty, 18);
    } else if (s.look === 'lash') {
      // Cuerda que latiguea con una chispa en la punta.
      g.lineStyle(14, this.color, 0.35 * fade);
      g.beginPath();
      for (let i = 0; i <= 24; i++) {
        const k = i / 24;
        g.lineTo(Phaser.Math.Linear(ax, x1, k), Phaser.Math.Linear(ay, this.y, k) + Math.sin(k * Math.PI * 3 + this.age * 60) * 14 * (1 - k));
      }
      g.strokePath();
      g.lineStyle(4, 0xf2d0a0, fade).lineBetween(ax, ay, x1, this.y);
      g.fillStyle(0xffffff, fade).fillCircle(x1, this.y, 12);
    } else {
      // Feedback: rayo rojo y violeta vibrando.
      for (const [w, c, a] of [[h * 1.6, 0x6a00ff, 0.3], [h, 0xff173d, 0.7], [h * 0.3, 0xffffff, 1]] as const) {
        g.fillStyle(c, a * fade).fillRect(Math.min(this.x0, x1), this.y - w / 2 + Math.sin(this.age * 80) * 4, len, w);
      }
    }
    if (on < BEAM_ON && Math.random() < 0.8) this.fx.trail(x1, this.y, this.color, this.radius);
  }

  /** Cola de láser del dardo: los últimos puntos del recorrido, más finos y tenues cuanto más viejos. */
  private drawTail(): void {
    this.tail.push({ x: this.x, y: this.y, t: this.age });
    while (this.tail.length && this.age - this.tail[0].t > TAIL_S) this.tail.shift();
    const g = this.g;
    g.clear();
    for (let i = 1; i < this.tail.length; i++) {
      const a = this.tail[i - 1];
      const b = this.tail[i];
      const k = 1 - (this.age - b.t) / TAIL_S;
      g.lineStyle(this.radius * 0.9 * k, this.color, 0.35 * k).lineBetween(a.x, a.y, b.x, b.y);
      g.lineStyle(this.radius * 0.3 * k, 0xffffff, 0.8 * k).lineBetween(a.x, a.y, b.x, b.y);
    }
  }

  destroy(): void {
    // Lick que no pegó (se perdió o lo destruyeron): Pentalick vuelve al nivel 1.
    this.alive = false;
    this.g.destroy();
    this.look?.obj.destroy();
  }
}

/**
 * Jaula de NOSU: esfera enrejada con meridianos (verticales) que giran despacio y paralelos (horizontales)
 * en perspectiva. Se usa en vuelo (Projectile) y alrededor del rival encerrado (FightScene); sin `bars`, la esfera lisa rellena en degradado.
 */
export const drawCage = (g: Phaser.GameObjects.Graphics, x: number, y: number, rx: number, ry: number, color: number, t: number, alpha: number, bars = true): void => {
  const pulse = 0.5 + 0.5 * Math.sin(t * 7);
  rx *= 1 + pulse * 0.03;
  ry *= 1 + pulse * 0.03;
  g.fillStyle(color, (0.08 + 0.05 * pulse) * alpha).fillEllipse(x, y, rx * 2, ry * 2);
  const bar = Math.max(2, rx / 70);
  g.lineStyle(bar * 1.6, 0xffffff, (0.35 + 0.3 * pulse) * alpha).strokeEllipse(x, y, rx * 2, ry * 2);
  if (!bars) {
    // Relleno en degradado: del morado del borde a uno más claro en el centro.
    const edge = Phaser.Display.Color.ValueToColor(color);
    const core = Phaser.Display.Color.ValueToColor(0xe6c2ff);
    for (let k = 0; k < ORB_STEPS; k++) {
      const c = Phaser.Display.Color.Interpolate.ColorWithColor(edge, core, ORB_STEPS - 1, k);
      const f = 1 - k / ORB_STEPS;
      g.fillStyle(Phaser.Display.Color.GetColor(c.r, c.g, c.b), 0.22 * alpha).fillEllipse(x, y, rx * 2 * f, ry * 2 * f);
    }
    return;
  }
  const spin = t * 1.2;
  for (let i = 0; i < CAGE_MERIDIANS; i++) {
    const w = Math.sin(spin + (i * Math.PI) / CAGE_MERIDIANS);
    g.lineStyle(bar, color, (0.35 + 0.4 * Math.abs(w)) * alpha).strokeEllipse(x, y, Math.abs(w) * rx * 2, ry * 2);
  }
  for (let j = 1; j < CAGE_PARALLELS; j++) {
    const phi = -Math.PI / 2 + (j * Math.PI) / CAGE_PARALLELS;
    const r = Math.cos(phi) * rx;
    g.lineStyle(bar, color, 0.7 * alpha).strokeEllipse(x, y + Math.sin(phi) * ry, r * 2, r * 0.3);
  }
};
