import Phaser from 'phaser';
import { COLORS, CSS, GAME_WIDTH, SCENES } from '../config';
import { Audio, MUSIC } from '../systems/Audio';
import { Input } from '../systems/Input';
import { Ranking } from '../systems/Ranking';
import { StoryRun } from '../systems/StoryRun';
import { footer, goTo, logo, scanlines, speedStripes, stageBackdrop, text } from '../ui/ui';

export const Profile = {
  /** Se saltó la conexión (sin internet o sin nickname): el menú no la vuelve a pedir; la historia sí. */
  guest: false,
};

/** Al abrir el menú y al entrar a la historia sin perfil: conecta la cuenta anónima y pide el nickname si no tiene. */
export const connectProfile = (scene: Phaser.Scene): void => goTo(scene, SCENES.Login);

/**
 * "Ya tengo cuenta": entra con Google y trae su perfil. Devuelve si la cuenta ya tiene nickname (si no, hay que pedirlo).
 * Llamar dentro del gesto del jugador (tecla o clic), o el navegador bloquea el popup.
 */
export const enterWithGoogle = async (): Promise<boolean> => {
  await Ranking.enterWithGoogle();
  await StoryRun.sync();
  return !!StoryRun.name;
};

/** El jugador cerró el popup de Google (no es un error que mostrar). */
export const popupClosed = (e: unknown) => /popup-closed|cancelled-popup/.test((e as { code?: string }).code ?? '');

/**
 * Conexión de la cuenta: entra con la sesión del navegador o crea una cuenta anónima, y trae su perfil. Una cuenta nueva
 * elige: entrar con su Google (ya tiene cuenta), elegir un nickname (nuevo) o jugar sin conexión.
 */
export class LoginScene extends Phaser.Scene {
  private input2!: Input;
  private status!: Phaser.GameObjects.Text;
  private busy = false;
  private leaving = false;
  /** Cuenta nueva sin nickname: esperando que elija Google, nickname o sin conexión. */
  private choosing = false;

  constructor() {
    super(SCENES.Login);
  }

  init() {
    this.busy = false;
    this.leaving = false;
    this.choosing = false;
  }

  create() {
    this.cameras.main.fadeIn(300, 11, 10, 14);
    Audio.music(this, MUSIC.menu, 0.35);
    stageBackdrop(this, 0.8);
    speedStripes(this, COLORS.lime, 0.03);
    this.input2 = new Input(this);
    const cx = GAME_WIDTH / 2;
    logo(this, cx, 300, 0.7);
    text(this, cx, 500, 'TU CUENTA', { size: 72, italic: true, weight: '900', color: CSS.lime, origin: [0.5, 0.5], shadow: true });
    this.status = text(this, cx, 640, 'CONECTANDO…', { size: 40, italic: true, weight: '900', color: CSS.grey, origin: [0.5, 0.5], spacing: 2 });
    footer(this, 'ENTER  REINTENTAR      ESC  JUGAR SIN CONEXIÓN');
    scanlines(this, 0.06);
    // La tecla se escucha en el DOM (Phaser la procesa un frame después, fuera del gesto, y Safari bloquearía el popup).
    const onKey = (e: KeyboardEvent) => e.code === 'KeyG' && !e.repeat && this.google();
    window.addEventListener('keydown', onKey);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => window.removeEventListener('keydown', onKey));
    this.connect();
  }

  private connect(): void {
    if (this.busy || this.leaving) return;
    this.busy = true;
    this.status.setText('CONECTANDO…').setColor(CSS.grey);
    Ranking.signIn().then(
      () => this.sys.isActive() && void this.done(),
      (e: { code?: string }) => {
        console.warn('[ranking] cuenta anónima', e);
        this.busy = false;
        if (!this.sys.isActive()) return;
        this.status.setText(`Sin conexión (${e.code ?? 'error'}). ENTER para reintentar.`).setColor(CSS.red);
      },
    );
  }

  /** Ya con sesión: trae el perfil (nickname y partidas). Con nickname, al menú; con Google sin nickname, lo pide; si es nueva, elige. */
  private async done(): Promise<void> {
    if (this.leaving) return;
    this.leaving = true;
    if (!StoryRun.loaded) {
      this.status.setText('Buscando tu perfil…').setColor(CSS.grey);
      try {
        await StoryRun.sync();
      } catch (e) {
        console.warn('[progreso] no se pudo leer', e);
        if (!this.sys.isActive()) return;
        this.leaving = false;
        this.busy = false;
        this.status.setText('No se pudo traer tu perfil. ENTER para reintentar.').setColor(CSS.red);
        return;
      }
    }
    if (!this.sys.isActive()) return;
    if (StoryRun.name) goTo(this, SCENES.Title, { skipPress: true });
    else if (Ranking.user?.google) goTo(this, SCENES.NameEntry);
    else this.choose();
  }

  private choose(): void {
    this.leaving = false;
    this.busy = false;
    this.choosing = true;
    this.status.setText('¿YA TIENES CUENTA?').setColor(CSS.cream);
    const cx = GAME_WIDTH / 2;
    const option = (y: number, str: string, color: string, go: () => void) =>
      text(this, cx, y, str, { size: 34, weight: '900', italic: true, color, origin: [0.5, 0.5], spacing: 2 })
        .setInteractive({ useHandCursor: true })
        .on(Phaser.Input.Events.POINTER_DOWN, go);
    option(730, '[G]  SÍ · ENTRAR CON GOOGLE', CSS.lime, () => this.google());
    option(790, '[ENTER]  SOY NUEVO · ELEGIR NICKNAME', CSS.cream, () => this.leave(SCENES.NameEntry));
    footer(this, 'G  ENTRAR CON GOOGLE      ENTER  SOY NUEVO      ESC  JUGAR SIN CONEXIÓN');
  }

  /** Se llama desde el evento de la tecla o del clic: el popup tiene que abrirse dentro del gesto. */
  private google(): void {
    if (!this.choosing || this.busy || this.leaving) return;
    this.busy = true;
    Audio.blip(this, true);
    this.status.setText('CONECTANDO CON GOOGLE…').setColor(CSS.grey);
    enterWithGoogle().then(
      (named) => this.sys.isActive() && (named ? this.leave(SCENES.Title, { skipPress: true }) : this.leave(SCENES.NameEntry)),
      (e) => {
        console.warn('[cuenta] google', e);
        this.busy = false;
        if (!this.sys.isActive()) return;
        this.status.setText(popupClosed(e) ? '¿YA TIENES CUENTA?' : 'NO SE PUDO CONECTAR · G PARA REINTENTAR').setColor(popupClosed(e) ? CSS.cream : CSS.red);
      },
    );
  }

  private leave(key: string, data?: object): void {
    if (this.leaving) return;
    this.leaving = true;
    goTo(this, key, data);
  }

  update() {
    // Conectando la cuenta se puede salir sin conexión; con el popup de Google abierto, no.
    if (this.leaving || (this.busy && this.choosing)) return;
    if (this.input2.justDown('confirm')) {
      if (this.choosing) this.leave(SCENES.NameEntry);
      else this.connect();
    }
    if (this.input2.justDown('back')) {
      Profile.guest = true;
      this.leave(SCENES.Title, { skipPress: true });
    }
  }
}
