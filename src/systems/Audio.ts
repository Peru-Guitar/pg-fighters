import Phaser from 'phaser';

export const SFX = ['punch', 'kick', 'swing'] as const;
export type SfxId = (typeof SFX)[number];

/** Pistas de música: menús y pelea (El Sótano). */
export const MUSIC = {
  menu: 'music-menu',
  stage: 'music-stage-sotano',
  /** Tienda de instrumentos: "Instrumental Box". */
  tienda: 'music-stage-tienda',
  /** Barrio Bravo: "Midnight Rumble". */
  barrio: 'music-stage-barrio',
  /** El Festival del Cerro. */
  festival: 'music-stage-festival',
  /** Estación del Metro: "Neon Commuter". */
  metro: 'music-stage-metro',
  /** La Azotea del Ensayo: "Instrumental Rock". */
  azotea: 'music-stage-azotea',
  /** La Feria del Tomate: "Andes de Piedra". */
  tomate: 'music-stage-tomate',
  /** La Biblioteca del Rock. */
  biblioteca: 'music-stage-biblioteca',
  /** El Arenal: "Oriental Rock". */
  arenal: 'music-stage-arenal',
  /** El Barrio Chino: "Callejón del Club" (de RockStreet). */
  chino: 'music-stage-chino',
  /** El Mall del Rock: "La Disquería" (de RockStreet). */
  mall: 'music-stage-mall',
  /** El Salón del Virrey: "La Coronación" (de RockStreet). */
  casona: 'music-stage-casona',
  /** La Ciudadela del Sol: "Inca Rock Instrumental". */
  ciudadela: 'music-stage-ciudadela',
  /** La Jungla: "Jungle Rock Instrumental". */
  jungla: 'music-stage-jungla',
  /** El Laboratorio del Rock: "Neon Rocker". */
  laboratorio: 'music-stage-laboratorio',
  /** El Show en Vivo (set de TV de Tevi): "TV". */
  estudio: 'music-stage-estudio',
  /** Pelea final contra El Acople: "Teeth in the Sink". */
  boss: 'music-boss-acople',
} as const;
export type MusicKey = (typeof MUSIC)[keyof typeof MUSIC];

/** Archivo de cada pista. */
const MUSIC_FILES: Record<MusicKey, string> = {
  [MUSIC.menu]: 'assets/audio/music/menu.mp3',
  [MUSIC.azotea]: 'assets/audio/music/stage-azotea.mp3',
  [MUSIC.metro]: 'assets/audio/music/stage-metro.mp3',
  [MUSIC.barrio]: 'assets/audio/music/stage-barrio.mp3',
  [MUSIC.festival]: 'assets/audio/music/stage-festival.mp3',
  [MUSIC.stage]: 'assets/audio/music/stage-sotano.mp3',
  [MUSIC.tienda]: 'assets/audio/music/stage-tienda.mp3',
  [MUSIC.tomate]: 'assets/audio/music/stage-tomate.mp3',
  [MUSIC.biblioteca]: 'assets/audio/music/stage-biblioteca.mp3',
  [MUSIC.arenal]: 'assets/audio/music/stage-arenal.mp3',
  [MUSIC.chino]: 'assets/audio/music/stage-chino.mp3',
  [MUSIC.mall]: 'assets/audio/music/stage-mall.mp3',
  [MUSIC.casona]: 'assets/audio/music/stage-casona.mp3',
  [MUSIC.ciudadela]: 'assets/audio/music/stage-ciudadela.mp3',
  [MUSIC.jungla]: 'assets/audio/music/stage-jungla.mp3',
  [MUSIC.laboratorio]: 'assets/audio/music/stage-laboratorio.mp3',
  [MUSIC.estudio]: 'assets/audio/music/stage-estudio.mp3',
  [MUSIC.boss]: 'assets/audio/music/boss-acople.mp3',
};

/** Al arrancar: solo la música del menú y los efectos. La de cada escenario se carga antes de su pelea. */
export const loadAudio = (scene: Phaser.Scene) => {
  preloadMusic(scene, MUSIC.menu);
  for (const id of SFX) scene.load.audio(`sfx-${id}`, `assets/${id}.wav`);
};

/** Carga las pistas que falten (llamar desde preload); las ya cargadas quedan en caché. */
export const preloadMusic = (scene: Phaser.Scene, ...keys: MusicKey[]) => {
  for (const key of keys) if (!scene.cache.audio.exists(key)) scene.load.audio(key, MUSIC_FILES[key]);
};

type Track = Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound;
let current: Track | null = null;
let currentVolume = 0.5;
/** Volumen de la música durante el súper, respecto del normal. */
const ULTIMATE_MUSIC = 1.2;

/** Fundido independiente de las escenas (sus tweens mueren al cambiar de escena). */
const fade = (track: Track, to: number, ms: number, done?: () => void) => {
  const from = track.volume;
  const start = performance.now();
  const id = window.setInterval(() => {
    const t = Math.min(1, (performance.now() - start) / ms);
    track.setVolume(from + (to - from) * t);
    if (t >= 1) {
      window.clearInterval(id);
      done?.();
    }
  }, 30);
};

/** Música global y efectos. El SoundManager es del juego, así que la música sigue entre escenas. */
export const Audio = {
  init(scene: Phaser.Scene): void {
    scene.sound.mute = false;
  },

  /** Cambia de pista con fundido; si ya suena, solo ajusta el volumen. */
  music(scene: Phaser.Scene, key: MusicKey, volume = 0.5): void {
    currentVolume = volume;
    if (current?.key === key && !current.pendingRemove) {
      fade(current, volume, 400);
      return;
    }
    this.stopMusic();
    if (!scene.cache.audio.exists(key)) return;
    const track = scene.sound.add(key, { loop: true, volume: 0 }) as Track;
    current = track;
    track.play(); // si el navegador bloquea el audio, Phaser lo inicia al primer clic o tecla
    fade(track, volume, 600);
  },

  /** Durante el súper la música sube un poco (y luego vuelve a su volumen). */
  boost(on: boolean): void {
    if (current) fade(current, on ? currentVolume * ULTIMATE_MUSIC : currentVolume, on ? 150 : 600);
  },

  stopMusic(ms = 500): void {
    const track = current;
    current = null;
    if (track) fade(track, 0, ms, () => track.destroy());
  },

  sfx(scene: Phaser.Scene, id: SfxId, volume = 0.6, rate = 1): void {
    if (scene.sound.locked) return;
    scene.sound.play(`sfx-${id}`, { volume, rate });
  },

  /** Tono sintetizado corto (impactos, anunciador, menús). */
  tone(scene: Phaser.Scene, freq: number, duration = 0.08, type: OscillatorType = 'square', vol = 0.05): void {
    const ctx = (scene.sound as Phaser.Sound.WebAudioSoundManager).context;
    if (!ctx || scene.sound.mute || ctx.state !== 'running') return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const t = ctx.currentTime;
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(25, freq / 3), t + duration);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t);
    o.stop(t + duration);
  },

  /** Estática de TV (ruido blanco filtrado que se corta a ratos), para la señal fuera del aire de Tevi. */
  tvStatic(scene: Phaser.Scene, duration = 0.5, vol = 0.09): void {
    const ctx = (scene.sound as Phaser.Sound.WebAudioSoundManager).context;
    if (!ctx || scene.sound.mute || ctx.state !== 'running') return;
    const len = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    // Ruido con cortes: cada ~30 ms la señal sube, baja o se apaga, como una antena mal puesta.
    const chunk = Math.floor(ctx.sampleRate * 0.03);
    let level = 1;
    for (let i = 0; i < len; i++) {
      if (i % chunk === 0) level = Math.random() < 0.2 ? 0.15 : 0.6 + Math.random() * 0.4;
      data[i] = (Math.random() * 2 - 1) * level;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3200;
    filter.Q.value = 0.6;
    const g = ctx.createGain();
    const t = ctx.currentTime;
    g.gain.setValueAtTime(vol, t);
    g.gain.setValueAtTime(vol, t + duration * 0.75);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    src.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);
    src.start(t);
    // Zumbido agudo del televisor de tubo debajo del ruido.
    const hum = ctx.createOscillator();
    const hg = ctx.createGain();
    hum.type = 'sine';
    hum.frequency.value = 7800;
    hg.gain.setValueAtTime(vol * 0.12, t);
    hg.gain.exponentialRampToValueAtTime(0.001, t + duration);
    hum.connect(hg);
    hg.connect(ctx.destination);
    hum.start(t);
    hum.stop(t + duration);
  },

  /** "Blip" de menú. */
  blip(scene: Phaser.Scene, high = false): void {
    this.tone(scene, high ? 880 : 520, 0.06, 'square', 0.03);
  },
};
