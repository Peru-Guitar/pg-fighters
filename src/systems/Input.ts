import Phaser from 'phaser';

export type Action = 'left' | 'right' | 'up' | 'down' | 'punch' | 'kick' | 'super' | 'confirm' | 'back' | 'pause';

/**
 * Teclas físicas (KeyboardEvent.code) → acciones. Un solo esquema para todo el juego:
 * WASD (doble toque A A / D D = dash), clic izquierdo (puño), clic derecho (patada), E (ultimate), ENTER y ESC.
 */
const BINDINGS: Record<string, Action[]> = {
  KeyA: ['left'],
  KeyD: ['right'],
  KeyW: ['up'],
  KeyS: ['down'],
  KeyE: ['super'],
  Enter: ['confirm'],
  NumpadEnter: ['confirm'],
  Escape: ['back', 'pause'],
};

/** Flechas: solo en los menús (en la pelea se juega con WASD). */
const MENU_BINDINGS: Record<string, Action[]> = {
  ...BINDINGS,
  ArrowLeft: ['left'],
  ArrowRight: ['right'],
  ArrowUp: ['up'],
  ArrowDown: ['down'],
};

/**
 * Teclas físicas apretadas ahora mismo, en todo el juego. Se registran una sola vez para que
 * una tecla mantenida desde la pantalla anterior (o durante el anuncio de la ronda) cuente
 * apenas empieza la pelea.
 */
const heldCodes = new Set<string>();
window.addEventListener('keydown', (e) => {
  heldCodes.add(e.code);
});
window.addEventListener('keyup', (e) => heldCodes.delete(e.code));
window.addEventListener('blur', () => heldCodes.clear());

// ───────────────────────────── Mando ─────────────────────────────

/** Botones del mando por POSICIÓN (diseño estándar del navegador), no por letra: así sirve igual en Xbox, PlayStation y Switch. */
export type PadButton = 'south' | 'east' | 'west' | 'north' | 'lb' | 'rb' | 'start' | 'up' | 'down' | 'left' | 'right';
const PAD_INDEX: [number, PadButton][] = [
  [0, 'south'], [1, 'east'], [2, 'west'], [3, 'north'], [4, 'lb'], [5, 'rb'], [9, 'start'],
  [12, 'up'], [13, 'down'], [14, 'left'], [15, 'right'],
];

const PAD_FIGHT: Partial<Record<PadButton, Action[]>> = {
  up: ['up'], down: ['down'], left: ['left'], right: ['right'],
  west: ['punch'], north: ['punch'], south: ['kick', 'confirm'], rb: ['super'],
  east: ['kick', 'back'], start: ['back', 'pause'],
};
const PAD_MENU: Partial<Record<PadButton, Action[]>> = {
  up: ['up'], down: ['down'], left: ['left'], right: ['right'],
  south: ['confirm'], start: ['confirm'], east: ['back'],
};

/** Con qué se está jugando: teclado o el tipo de mando (cambia las ayudas en pantalla). */
export type Device = 'keys' | 'xbox' | 'ps' | 'switch' | 'pad';
export type PadDevice = Exclude<Device, 'keys'>;
let device: Device = 'keys';
const deviceListeners = new Set<(d: Device) => void>();
export const inputDevice = () => device;
const setDevice = (d: Device) => {
  if (d === device) return;
  device = d;
  for (const fn of deviceListeners) fn(d);
};
/** Llama a `fn` ahora y cada vez que cambie el dispositivo, mientras viva la escena. */
export const onDevice = (scene: Phaser.Scene, fn: (d: Device) => void) => {
  fn(device);
  deviceListeners.add(fn);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => deviceListeners.delete(fn));
};
window.addEventListener('keydown', () => setDevice('keys'));
window.addEventListener('pointerdown', () => setDevice('keys'));

/** El `id` del mando trae el fabricante (nombre o código USB). */
const padKind = (id: string): Exclude<Device, 'keys'> => {
  if (/054c|playstation|dualsense|dualshock|wireless controller/i.test(id)) return 'ps';
  if (/057e|nintendo|pro controller|joy-con/i.test(id)) return 'switch';
  // Logitech (F310, F710…) trae impresas las letras de Xbox.
  if (/045e|046d|xbox|xinput|logitech/i.test(id)) return 'xbox';
  return 'pad';
};

/** Mando a la vista del navegador (el tipo del último conectado) o `null`. Solo aparece tras pulsar algo. */
let connected: Exclude<Device, 'keys'> | null = null;
const padListeners = new Set<() => void>();
export const padConnected = () => connected;
/** Llama a `fn` ahora y cada vez que se conecte o desconecte un mando, mientras viva la escena. */
export const onPadChange = (scene: Phaser.Scene, fn: () => void) => {
  fn();
  padListeners.add(fn);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => padListeners.delete(fn));
};
const PAD_NAMES: Record<Exclude<Device, 'keys'>, string> = { xbox: 'XBOX', ps: 'PLAYSTATION', switch: 'SWITCH', pad: 'GENÉRICO' };
export const padName = (d: Exclude<Device, 'keys'>) => PAD_NAMES[d];

/** Aviso corto arriba a la derecha, sobre el juego (DOM, para que se vea en cualquier escena). */
const toast = (msg: string) => {
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.cssText =
    'position:fixed;top:16px;right:16px;z-index:9999;padding:10px 18px;background:#0b0a0eee;color:#dfff00;' +
    'border:2px solid #dfff00;border-radius:6px;font:800 15px/1.2 system-ui,sans-serif;letter-spacing:1px;' +
    'pointer-events:none;transition:opacity .4s;';
  document.body.appendChild(el);
  setTimeout(() => (el.style.opacity = '0'), 2200);
  setTimeout(() => el.remove(), 2700);
};

const refreshPads = () => {
  const pads = [...(navigator.getGamepads?.() ?? [])].filter((p): p is Gamepad => !!p);
  connected = pads.length ? padKind(pads[pads.length - 1].id) : null;
  if (!connected) setDevice('keys');
  for (const fn of padListeners) fn();
};
window.addEventListener('gamepadconnected', (e) => {
  refreshPads();
  toast(`🎮  MANDO ${padName(padKind(e.gamepad.id))} CONECTADO`);
});
window.addEventListener('gamepaddisconnected', () => {
  refreshPads();
  toast('🎮  MANDO DESCONECTADO');
});

const heldPad = new Set<PadButton>();
const padPressListeners = new Set<(b: PadButton) => void>();

const pollPads = () => {
  requestAnimationFrame(pollPads);
  const now = new Set<PadButton>();
  let kind: Device | null = null;
  for (const pad of navigator.getGamepads?.() ?? []) {
    if (!pad) continue;
    const before = now.size;
    for (const [i, b] of PAD_INDEX) if (pad.buttons[i]?.pressed) now.add(b);
    const [ax = 0, ay = 0] = pad.axes;
    if (ax < -0.5) now.add('left');
    if (ax > 0.5) now.add('right');
    if (ay < -0.5) now.add('up');
    if (ay > 0.5) now.add('down');
    if (now.size > before) kind = padKind(pad.id);
  }
  for (const b of now) if (!heldPad.has(b)) for (const fn of padPressListeners) fn(b);
  heldPad.clear();
  for (const b of now) heldPad.add(b);
  if (kind && now.size) setDevice(kind);
};
requestAnimationFrame(pollPads);

/**
 * Entrada por acciones: teclado + ratón (clic izquierdo = puño, derecho = patada) + mando.
 * `justDown` vale solo durante el frame en que se pulsó; se limpia tras cada update de la escena.
 */
export class Input {
  private pressed = new Set<Action>();
  private bindings: Record<string, Action[]>;
  private pad: Partial<Record<PadButton, Action[]>>;

  /** `mouseAttacks`: la pelea (clic = puño / patada, sin flechas). Si no, un menú (también con flechas). */
  constructor(scene: Phaser.Scene, mouseAttacks = false) {
    const bindings = (this.bindings = mouseAttacks ? BINDINGS : MENU_BINDINGS);
    const down = (e: KeyboardEvent) => {
      if (e.repeat) return;
      for (const a of bindings[e.code] ?? []) this.pressed.add(a);
    };
    window.addEventListener('keydown', down);
    const pad = (this.pad = mouseAttacks ? PAD_FIGHT : PAD_MENU);
    const padDown = (b: PadButton) => {
      for (const a of pad[b] ?? []) this.pressed.add(a);
    };
    padPressListeners.add(padDown);

    const pointer = (p: Phaser.Input.Pointer) => {
      if (!mouseAttacks) return;
      this.pressed.add(p.rightButtonDown() ? 'kick' : 'punch');
    };
    scene.input.mouse?.disableContextMenu();
    scene.input.on(Phaser.Input.Events.POINTER_DOWN, pointer);

    const clear = () => this.pressed.clear();
    scene.events.on(Phaser.Scenes.Events.POST_UPDATE, clear);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener('keydown', down);
      padPressListeners.delete(padDown);
      scene.input.off(Phaser.Input.Events.POINTER_DOWN, pointer);
      scene.events.off(Phaser.Scenes.Events.POST_UPDATE, clear);
    });
  }

  isDown(a: Action): boolean {
    for (const code of heldCodes) if (this.bindings[code]?.includes(a)) return true;
    for (const b of heldPad) if (this.pad[b]?.includes(a)) return true;
    return false;
  }

  justDown(a: Action): boolean {
    return this.pressed.has(a);
  }

  /** Olvida pulsaciones pendientes (al reanudar una escena pausada). */
  reset(): void {
    this.pressed.clear();
  }
}

/** Nombre de cada botón según el mando. */
const PAD_LABELS: Record<Exclude<Device, 'keys'>, Record<'south' | 'east' | 'west' | 'north' | 'rb' | 'start', string>> = {
  xbox: { south: 'A', east: 'B', west: 'X', north: 'Y', rb: 'RB', start: 'MENU' },
  ps: { south: '✕', east: '○', west: '□', north: '△', rb: 'R1', start: 'OPTIONS' },
  switch: { south: 'B', east: 'A', west: 'Y', north: 'X', rb: 'R', start: '+' },
  pad: { south: '▼', east: '▶', west: '◀', north: '▲', rb: 'R1', start: 'START' },
};
export const padLabel = (b: keyof (typeof PAD_LABELS)['xbox'], d = device) => (d === 'keys' ? '' : PAD_LABELS[d][b]);

/** Tecla → su equivalente en el mando actual (`null` si no tiene). */
export const padKey = (key: string, d = device): string | null => {
  if (d === 'keys') return key;
  const map: Record<string, string> = {
    W: '↑', A: '←', S: '↓', D: '→', IZQ: padLabel('west', d), DER: padLabel('south', d),
    'CLIC-IZQ': padLabel('west', d), 'CLIC IZQ': padLabel('west', d), 'CLIC-DER': padLabel('south', d), 'CLIC DER': padLabel('south', d),
    E: padLabel('rb', d), ENTER: padLabel('south', d), ESC: padLabel('east', d),
  };
  return map[key] ?? null;
};

/** Traduce las teclas de un texto de entrada ("S → D + CLIC IZQ") al mando actual. */
export const devText = (str: string, d = device) =>
  d === 'keys' ? str : str.replace(/CLIC[ -](IZQ|DER)|ENTER|ESC|\b(IZQ|DER)\b|\b[WASDE]\b/g, (k) => padKey(k, d) ?? k);
