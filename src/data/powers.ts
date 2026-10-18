import type { FighterId } from './fighters';

/** Dibujo del proyectil (visuals/powers.ts). */
export type PowerLook =
  | 'code' | 'note' | 'wave' | 'laser' | 'pick' | 'lick' | 'meteor' | 'tray' | 'kiss' | 'redStar' | 'miniNote'
  | 'flask' | 'lash' | 'banana' | 'phoenix' | 'like' | 'book' | 'pearl' | 'cheque' | 'star8' | 'firefly' | 'darkOrb' | 'feedback' | 'shriek' | 'soundwave'
  | 'decree' | 'sun' | 'drum' | 'marble' | 'cross' | 'needle' | 'coin' | 'mirror' | 'shadow' | 'ring' | 'dagger' | 'spear' | 'buster' | 'slash' | 'xslash' | 'gridball' | 'tornado';

/**
 * Un disparo del poder básico (↓ ↘ → + P). Las velocidades y tamaños multiplican los valores base
 * (velocidad común POWER_SPEED de entities/Projectile.ts, radio 52 px, daño del golpe `special`).
 * Todos los poderes avanzan a la misma velocidad: solo cambia `speed` en los que tienen que ser rápidos a propósito.
 */
export interface ShotSpec {
  look: PowerLook;
  /** Color propio del poder (estela y destellos); si no, el del luchador. */
  color?: number;
  speed?: number;
  size?: number;
  damage?: number;
  /** Sale este tiempo después (ráfagas), siempre desde el puño. */
  delay?: number;
  /** Velocidad vertical constante (px/s): abanico. */
  climb?: number;
  /** Onda vertical: amplitud (px), frecuencia y segundos hasta enderezarse (0 = nunca). */
  wave?: { amp: number; freq: number; settle?: number };
  /** Avanza dando botes en el piso. */
  bounce?: boolean;
  /** Cae en arco sobre el rival. */
  arc?: boolean;
  /** Persigue al rival (fuerza de giro). */
  homing?: number;
  /** Sale lento y acelera hasta `accel` × la velocidad, creciendo. */
  accel?: number;
  /** Arranca casi quieto estos ms y luego sale disparado de golpe a su velocidad (`speed`). */
  windup?: number;
  /** Sale esta distancia más arriba (+) o más abajo (−) del puño (px). */
  dz?: number;
  /** Crece mientras avanza: llega a `grow` × su tamaño al alcanzar donde estaba el rival (o hasta que pega). */
  grow?: number;
  /** Se hincha con el tiempo: llega a `size` × su tamaño y `damage` × su daño al acabarse `life`. */
  swell?: { size: number; damage: number };
  /** Va y vuelve (distancia de ida en px). */
  boomerang?: number;
  /** Distancia máxima (px) antes de detenerse, explotar o desaparecer. */
  range?: number;
  /** Al llegar a `range` se queda flotando estos ms (trampa); con `explode`, al final explota. */
  hover?: number;
  /** Al tocar o al llegar a `range` explota en un área de este radio (px). */
  explode?: number;
  /** Bomba: cae al piso y explota (`explode`) estos ms después de caer, salvo que pegue directo antes. */
  fuse?: number;
  /** Multiplicador del daño si pega directo, antes de explotar (bomba). */
  direct?: number;
  /**
   * Jaula: si pega limpio, encierra al rival estos ms (no se mueve ni bloquea). El primer golpe que recibe
   * dentro la rompe, y no se lo puede volver a encerrar enseguida (FightScene.cage).
   */
  cage?: number;
  /**
   * Se carga manteniendo el clic (hasta CHARGE_MS): al soltar sale con el tamaño, el daño y el empuje
   * multiplicados hasta estos valores según cuánto se cargó.
   */
  charged?: { size: number; damage: number; push: number };
  /** Con `range`: si el clic sigue apretado al salir, llega este tanto más lejos (sin cargar, al instante). */
  holdRange?: number;
  /** Velocidad vertical inicial (px/s): curvas y lanzamientos al piso. */
  vz0?: number;
  /** Se dirige solo en horizontal hacia el rival (fuerza de giro): bota o se arrastra hasta él. */
  seek?: number;
  /** Alto de la zona de golpe (px), para poderes altos y angostos como un corte de sable. */
  tall?: number;
  /** Sale apuntado en línea recta al pecho del rival, desde esta altura relativa al puño (px). */
  aimed?: number;
  /** Con `orbit`: se carga girando (crece, sin pegar ni chocar) y al terminar sale disparado al pecho del rival. */
  charge?: boolean;
  /** Viaja pegado al piso y sube hacia el rival (con `homing`) cuando está a esta distancia (px). */
  rise?: number;
  /** Se arrastra por el piso hasta el rival y pega abajo: solo se bloquea agachado, se esquiva saltando. */
  low?: boolean;
  /** Al pegar se queda pegado al rival y vuelve a pegar enseguida (con `hits: 2`). */
  stick?: boolean;
  /** Veneno: si pega (sin bloqueo), a los `delay` ms vuelve a pegar con `damage` × su daño. No se bloquea. */
  poison?: { delay: number; damage: number };
  /** Empuje propio al pegar (px/s): manda al rival hacia atrás. */
  push?: number;
  /** Con `low`: va rasante desde que sale (sin caer del puño), en línea recta. */
  skim?: boolean;
  /** Marca al rival en cada acierto; el acierto número `marks` las revienta: daño doble y derribo (FightScene). */
  marks?: number;
  /** Corrige su altura hacia el pecho del rival (fuerza), sin dejar de ir recto hacia adelante. */
  track?: number;
  /** Al llegar a `range` se planta parado en el piso estos ms: bloquea los poderes del rival y no pega. */
  wall?: number;
  /** Si pega, jala un poco al rival hacia el que lo lanzó (px aproximados). */
  tug?: number;
  /** Si pega, jala al rival hasta quedar a distancia de golpe. */
  pull?: boolean;
  /** No lanza nada: carga el próximo golpe normal, que pega `empower` × (se gasta al conectar). */
  empower?: number;
  /** Espejo: si un poder rival lo toca, lo copia y lo dispara de vuelta. */
  mirror?: boolean;
  /** Gana todos los choques de poderes y sigue de largo. */
  pierce?: boolean;
  /** Si lo destruyen en un choque, renace una vez y sigue. */
  revive?: boolean;
  /** Gira alrededor del luchador estos ms (escudo) y luego sale disparado; `phase` reparte el ángulo inicial (0–1). */
  orbit?: number;
  phase?: number;
  /** Con `orbit`: escudo puro. No se lanza nunca; al acabarse `orbit` se apaga, y al tocar al rival o un poder explota. */
  guard?: boolean;
  /** Dardo: crece en el puño estos ms y sale disparado hacia el pecho del rival dejando una cola de láser. */
  dart?: number;
  /** Rayo instantáneo: carga estos ms y cruza (hasta `range` o toda la pantalla). */
  beam?: number;
  /** Se divide: los dos disparos viajan juntos y se separan arriba/abajo a los `split` ms. */
  fork?: 1 | -1;
  split?: number;
  /** Puede pegar dos veces (bumerán: ida y vuelta). */
  hits?: number;
  knockdown?: boolean;
  /** Barra ULTIMATE que le roba al rival si pega. */
  steal?: number;
  /** Vida máxima (s). */
  life?: number;
  /** No lanza nada: por estos ms camina y golpea más rápido (Fighter.haste). */
  haste?: number;
  /** Multiplicador de velocidad según la vez que se lanza el poder (en ciclo): [1ª, 2ª, 3ª…] y vuelve a empezar. */
  speedCycle?: number[];
  /** Si pega, el que lo lanzó se cura esta fracción del daño. */
  drain?: number;
  /** Tributo: cada `every` aciertos de este poder, el disparo vuelve al que lo lanzó y lo cura `drain` × el daño. */
  tribute?: { every: number; drain: number };
  /** Fuera del aire: si pega limpio, el rival queda congelado estos ms y su silueta sale como estática de TV. */
  offAir?: number;
  /** Otra toma: cada `retake` aciertos de este poder, la recarga del poder del rival vuelve a empezar. */
  retake?: number;
  /** Si pega, el rival no puede usar su poder básico ni activar el ultimate estos ms (no se acumula mientras dura). */
  silence?: number;
}

/** Poder básico de cada luchador. El Acople usa uno de sus tres al azar. */
export const POWERS: Partial<Record<FighterId, ShotSpec[]>> = {
  // Disparo de buster azul, recto y rapidísimo desde el puño: el poder más simple del juego.
  erp: [{ look: 'buster', color: 0x168bff, speed: 2.2, size: 1.3, damage: 0.85 }],
  // Onda de silencio: va recta. Si pega, silencia al rival 2 s.
  escalas: [{ look: 'wave', damage: 0.7, silence: 2000 }],
  // Rayo grueso del color de su aura (estilo rayo óptico) que cruza la pantalla. Manteniendo el clic se carga (hasta 2 s) y sale más grueso y fuerte.
  // Saltando sale al instante, sin carga.
  pepper: [{ look: 'laser', size: 0.6, damage: 0.75, beam: 260, charged: { size: 2.4, damage: 2, push: 2.5 } }],
  // Golpe de oro: su próximo golpe normal pega el doble (se gasta al conectar).
  slandor: [{ look: 'pick', empower: 2 }],
  // El lick marcado: cada acierto deja una marca en el rival; el tercero las revienta (daño doble y derribo).
  pentalick: [{ look: 'lick', color: 0xff7a2b, size: 0.75, damage: 0.8, marks: 3 }],
  // Bandeja en bumerán, rápida: atraviesa poderes y pega a la ida y a la vuelta. Si el rival la esquiva, se rompe.
  chantal: [{ look: 'tray', speed: 2.4, size: 0.8, damage: 0.55, boomerang: 1000, hits: 2, pierce: true }],
  // Tres canicas seguidas y rápidas que van de frente ondulando arriba y abajo; cada una empuja un poco al rival.
  jeanpierre: [0, 60, 120].map((delay, i) => ({
    // Cada canica empuja un poco al rival hacia atrás.
    look: 'marble' as const, speed: 2, size: 0.42, damage: 0.32, delay, wave: { amp: i === 1 ? -70 : 70, freq: 11 }, push: 520,
  })),
  // MayinBlues y Ferdex no lanzan nada: su poder es una embestida (data/moveset.ts, `rush`).
  // Tempo imposible: no lanza nada; por 3 s camina y golpea más rápido (la recarga corre al terminar).
  turboshred: [{ look: 'miniNote', haste: 3000 }],
  // Cruz que crece hasta llegar al rival.
  // Cruces benditas: tres giran a su alrededor como escudo 2,5 s. No se lanzan: la que toca al rival o a un poder explota
  // (poco daño, mucho empuje). Si a ella le pegan limpio, se rompen. La recarga empieza cuando no queda ninguna.
  // Esfera de colores: sale chica y crece mientras avanza (de la mitad a 1,8× el tamaño base, y un poco más de daño). Explota al tocar al rival
  // o a un poder; si no toca nada, se apaga sola a los 2,6 s.
  clavito: [{ look: 'gridball', speed: 0.45, size: 0.5, damage: 0.9, explode: 150, life: 2.6, swell: { size: 3.6, damage: 1.35 } }],
  toxicity: [0, 1 / 3, 2 / 3].map((phase) => ({ look: 'cross' as const, size: 0.75, damage: 0.35, push: 950, orbit: 2500, guard: true, explode: 90, phase })),
  // Latigazo de cuerda: si pega, jala al rival hacia ella.
  // Con el clic apretado, el látigo llega más lejos (al instante, sin cargar).
  rematada: [{ look: 'lash', size: 0.7, damage: 1.2, beam: 120, range: 560, pull: true, holdRange: 1.6 }],
  // George no lanza nada: su poder es un contraataque (data/moveset.ts, `counter`).
  // Tres agujas de jade rápidas, una detrás de otra a la misma altura.
  tayloy: [0, 90, 180].map((delay) => ({ look: 'needle' as const, speed: 2.2, size: 0.5, damage: 0.35, delay })),
  // Moneda rápida: si pega, le roba un poco de vida al rival (se cura el 60 % del daño). Sale cada vez más rápida: normal, +10 % y +25 %, y vuelve a empezar.
  jesex: [{ look: 'coin', speed: 2.3, size: 0.5, damage: 0.7, drain: 0.6, speedCycle: [1, 1.1, 1.25] }],
  // Tornado de arena: avanza recto y, si pega, jala un poco al rival hacia Markus.
  markus: [{ look: 'tornado', speed: 1.3, size: 2.1, damage: 0.9, tall: 420, tug: 260 }],
  // Plátano que se arrastra recto por el piso y pega abajo.
  platanero: [{ look: 'banana', size: 0.6, damage: 0.7, low: true, life: 3.2 }],
  // Tres aros de corazón, de grande a pequeño, uno detrás de otro: pegan y empujan lejos.
  ricardo: [[0, 2.6, 0.45], [90, 1.9, 0.3], [180, 1.3, 0.2]].map(([delay, size, damage]) => ({ look: 'ring' as const, color: 0xb04dff, size, damage, delay, push: 1100 })),
  // Corazones de seguidores que giran a su alrededor como escudo y después salen disparados.
  kimberly: [0, 1 / 3, 2 / 3].map((phase) => ({ look: 'like' as const, size: 0.6, damage: 0.4, orbit: 2000, phase })),
  // Jaula de corrección: esfera enrejada que, si pega, encierra al rival un momento (se gasta al salir; mientras se recarga, esfera lisa).
  nosu: [{ look: 'soundwave', color: 0xb04dff, size: 0.9, damage: 0.45, cage: 1100 }],
  // Sombra: una copia verde de Mimético sale corriendo por el piso y le pega al rival al llegar.
  mimetico: [{ look: 'shadow', size: 1.2, damage: 0.9, speed: 1.4 }],
  // Corte en X: dos tajos cruzados que crecen hasta el rival. Tributo: al tercer acierto, el corte vuelve a él y lo cura (FightScene.tribute).
  // ¡CORTE!: orbe negro recto; si pega, el rival queda congelado y su silueta sale como estática de TV.
  tevi: [{ look: 'darkOrb', size: 0.9, damage: 0.8, offAir: 500, retake: 3 }],
  virrey: [{ look: 'xslash', size: 0.48, damage: 0.9, speed: 1.5, tall: 240, grow: 1.5, tribute: { every: 3, drain: 0.8 } }],
};

/** Los dos poderes robados de El Acople: con puño, tres bolas de feedback que ondulan; con patada, el orbe que atrae. */
export const ACOPLE_POWERS: Record<'punch' | 'kick', ShotSpec[]> = {
  // Tres bolas de feedback chicas, con su cola de láser, una tras otra desde el puño; cada una ondula distinto.
  punch: [
    { delay: 0, wave: { amp: 45, freq: 9 } },
    { delay: 80, wave: { amp: -70, freq: 6.5 } },
    { delay: 160, wave: { amp: 30, freq: 13 } },
  ].map((shot) => ({ look: 'feedback' as const, size: 0.75, damage: 0.38, speed: 3, ...shot })),
  // Hace poco daño: su valor es traer al rival a distancia de golpe.
  kick: [{ look: 'darkOrb', speed: 1, size: 1.1, damage: 0.5, pull: true }],
};
/** Recarga del orbe que atrae (más larga que la de las bolas). */
export const ACOPLE_PULL_COOLDOWN = 2000;

/**
 * De dónde sale el poder: puño en la pose del poder, como fracción de la altura del luchador
 * ([adelante, arriba]). Por defecto [0.34, 0.58].
 */
const FIST: Partial<Record<FighterId, [number, number]>> = {
  // El Acople lanza con la mano abierta y el brazo alto, y su arte se ve más grande que su alto de guardia.
  acople: [0.38, 0.77],
  // ERP dispara el buster desde la mano, ligeramente por debajo del pecho.
  erp: [0.36, 0.69],
  // Pepper: el rayo nace un poco por delante de la mano.
  pepper: [0.58, 0.64],
  // Tayloy: las agujas salen un poco más arriba y por delante de la mano.
  tayloy: [0.42, 0.64],
  // Rematada: el látigo sale un poco más adelante.
  rematada: [0.5, 0.58],
  // Escalas: la onda sale un poco más adelante.
  escalas: [0.44, 0.64],
  // Pentalick: el orbe sale un poco más adelante.
  pentalick: [0.5, 0.64],
  // Clavito: la esfera sale más arriba y más adelante.
  clavito: [0.44, 0.64],
  // Chantal: la bandeja sale más arriba.
  chantal: [0.34, 0.64],
  // Jesex: la moneda sale más arriba y más adelante.
  jesex: [0.5, 0.7],
  // Markus: el tornado sale más adelante.
  markus: [0.44, 0.58],
  // Platanero: el plátano sale más adelante y un poco más arriba.
  platanero: [0.44, 0.62],
};
export const powerFist = (id: FighterId): [number, number] => FIST[id] ?? [0.34, 0.58];

/** Disparos del poder de `id` (El Acople: según el botón con que lo lanzó). */
export const powerFor = (id: FighterId, button: 'punch' | 'kick' = 'punch'): ShotSpec[] => {
  if (id === 'acople') return ACOPLE_POWERS[button];
  // Clavito: caos, cada vez distinto.
  return POWERS[id] ?? POWERS.escalas!;
};
