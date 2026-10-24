import Phaser from 'phaser';
import { COLORS, CSS, GAME_WIDTH, SCENES } from '../config';
import { Audio } from '../systems/Audio';
import { NAME_MAX, Ranking } from '../systems/Ranking';
import { StoryRun } from '../systems/StoryRun';
import { enterWithGoogle, popupClosed } from './LoginScene';
import { footer, goTo, logo, scanlines, speedStripes, stageBackdrop, text } from '../ui/ui';

/** Solo letras, números, Ñ, guion y guion bajo: sin espacios ni caracteres raros. */
const ALLOWED = /^[A-Z0-9Ñ_-]$/;

const clean = (s: string) => s.toUpperCase().split('').filter((c) => ALLOWED.test(c)).join('').trim().slice(0, NAME_MAX);

/** Primera vez de la cuenta, después de conectar: el nickname con el que sales en el ranking. Queda fijo para siempre. */
export class NameEntryScene extends Phaser.Scene {
  private name = '';
  private field!: Phaser.GameObjects.Text;
  private warn!: Phaser.GameObjects.Text;
  private leaving = false;
  /** Revisando si el nickname está libre. */
  private checking = false;

  constructor() {
    super(SCENES.NameEntry);
  }

  init() {
    this.name = clean(Ranking.savedName);
    this.leaving = false;
    this.checking = false;
  }

  create() {
    this.cameras.main.fadeIn(300, 11, 10, 14);
    stageBackdrop(this, 0.8);
    speedStripes(this, COLORS.lime, 0.03);
    const cx = GAME_WIDTH / 2;

    logo(this, cx, 300, 0.7);
    text(this, cx, 470, 'TU NICKNAME', { size: 72, italic: true, weight: '900', color: CSS.lime, origin: [0.5, 0.5], shadow: true });
    text(this, cx, 535, 'Así sales en el ranking  ·  No se puede cambiar después', { size: 28, weight: '700', color: CSS.grey, origin: [0.5, 0.5], spacing: 2 });

    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.75).fillRect(cx - 520, 600, 1040, 160);
    g.lineStyle(4, COLORS.lime, 1).strokeRect(cx - 520, 600, 1040, 160);
    this.field = text(this, cx, 680, '', { size: 104, italic: true, weight: '900', color: CSS.cream, origin: [0.5, 0.5], spacing: 6 });
    this.warn = text(this, cx, 810, `Hasta ${NAME_MAX} letras o números`, { size: 26, weight: '700', color: CSS.grey, origin: [0.5, 0.5], spacing: 2 });
    if (this.anonymous) {
      text(this, cx, 870, 'Juegas como invitado  ·  Sincroniza con Google desde el menú para no perder tus datos', { size: 24, weight: '700', color: CSS.grey, origin: [0.5, 0.5], spacing: 2 });
      footer(this, 'A-Z  ESCRIBIR      ENTER  CONFIRMAR      TAB  ENTRAR CON GOOGLE      ESC  VOLVER');
    } else {
      footer(this, 'A-Z  ESCRIBIR      BACKSPACE  BORRAR      ENTER  CONFIRMAR      ESC  VOLVER');
    }
    scanlines(this, 0.06);
    this.refresh();
    this.time.addEvent({ delay: 450, loop: true, callback: () => this.refresh() });

    const onKey = (e: KeyboardEvent) => this.key(e);
    window.addEventListener('keydown', onKey);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => window.removeEventListener('keydown', onKey));
  }

  /** Cuenta anónima (sin Google): puede entrar con su Google si ya tiene cuenta (TAB: la G es una letra del nickname). */
  private get anonymous(): boolean {
    return !!Ranking.user && !Ranking.user.google;
  }

  private refresh(): void {
    const cursor = this.name.length < NAME_MAX && Math.floor(this.time.now / 450) % 2 === 0 ? '_' : ' ';
    this.field.setText(this.name + cursor);
  }

  private key(e: KeyboardEvent): void {
    if (this.leaving || this.checking) return;
    if (e.key === 'Enter') return void this.confirm();
    if (e.key === 'Tab') {
      e.preventDefault();
      if (this.anonymous && !e.repeat) this.google();
      return;
    }
    if (e.key === 'Escape') return this.back();
    if (e.key === 'Backspace') {
      e.preventDefault();
      this.name = this.name.slice(0, -1);
    } else {
      const ch = e.key.toUpperCase();
      if (ch.length !== 1 || !ALLOWED.test(ch) || this.name.length >= NAME_MAX) return;
      this.name += ch;
    }
    Audio.blip(this);
    this.refresh();
  }

  private leave(key: string, data?: object): void {
    this.leaving = true;
    Audio.blip(this, true);
    goTo(this, key, data);
  }

  /** Reserva el nickname (único entre todas las cuentas) y lo deja fijo en el perfil. */
  private async confirm(): Promise<void> {
    const name = this.name.trim();
    if (!name) return this.reject('Escribe un nickname');
    this.checking = true;
    this.warn.setText('Revisando…').setColor(CSS.grey);
    let free: boolean;
    try {
      free = await Ranking.claimName(name);
    } catch (e) {
      console.warn('[nickname] no se pudo reservar', e);
      if (this.sys.isActive()) this.reject('Sin conexión. ENTER para reintentar');
      this.checking = false;
      return;
    }
    this.checking = false;
    if (!this.sys.isActive()) return;
    if (!free) return this.reject(this.anonymous ? `${name} ya está en uso  ·  ¿Es tuyo? TAB para entrar con Google` : `${name} ya está en uso. Prueba otro`);
    Ranking.savedName = name;
    StoryRun.setName(name);
    this.leave(SCENES.Title, { skipPress: true });
  }

  /**
   * El nickname es obligatorio: ESC vuelve a elegir cómo conectarse. Si entró con un Google sin nickname, cierra esa
   * sesión (la conexión crea una anónima nueva y vuelve a preguntar).
   */
  private back(): void {
    if (!Ranking.user?.google) return this.leave(SCENES.Login);
    this.checking = true;
    Ranking.signOut().then(
      () => {
        StoryRun.reset();
        this.checking = false;
        if (this.sys.isActive()) this.leave(SCENES.Login);
      },
      (e) => {
        console.warn('[cuenta] cerrar sesión', e);
        this.checking = false;
        if (this.sys.isActive()) this.reject('No se pudo volver. ESC para reintentar');
      },
    );
  }

  /** Se llama desde el evento de la tecla: el popup tiene que abrirse dentro del gesto. */
  private google(): void {
    this.checking = true;
    Audio.blip(this, true);
    this.warn.setText('Conectando con Google…').setColor(CSS.grey);
    enterWithGoogle().then(
      (named) => {
        this.checking = false;
        if (!this.sys.isActive()) return;
        if (named) return this.leave(SCENES.Title, { skipPress: true });
        // Google nuevo: la cuenta ya quedó guardada en Google; falta el nickname.
        this.scene.restart();
      },
      (e) => {
        console.warn('[cuenta] google', e);
        this.checking = false;
        if (!this.sys.isActive()) return;
        if (popupClosed(e)) this.warn.setText(`Hasta ${NAME_MAX} letras o números`).setColor(CSS.grey);
        else this.reject('No se pudo conectar con Google. TAB para reintentar');
      },
    );
  }

  private reject(msg: string): void {
    this.warn.setText(msg).setColor(CSS.red);
    this.cameras.main.shake(120, 0.004);
  }
}
