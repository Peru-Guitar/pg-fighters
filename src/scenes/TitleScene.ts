import Phaser from 'phaser';
import { COLORS, CSS, GAME_HEIGHT, GAME_WIDTH, SCENES } from '../config';
import { CHANGELOG, changelogUnseen } from '../data/changelog';
import { FIGHTERS, ROSTER } from '../data/fighters';
import { Audio, MUSIC } from '../systems/Audio';
import { artScale } from '../systems/FighterArt';
import { devText, Input, onDevice, onPadChange, padConnected, padName } from '../systems/Input';
import { Ranking } from '../systems/Ranking';
import { StoryRun } from '../systems/StoryRun';
import { Profile, connectProfile } from './LoginScene';
import { Menu, type MenuItem, footer, fullscreenItem, goTo, logo, scanlines, speedStripes, stageBackdrop, text } from '../ui/ui';

/** Pantalla de título: "PRESIONA ENTER" y luego el menú principal. */
export class TitleScene extends Phaser.Scene {
  private input2!: Input;
  private menu: Menu | null = null;
  private pressHint!: Phaser.GameObjects.Text;
  private press!: Phaser.GameObjects.Text;
  private leaving = false;
  /** Lo de la pantalla "PRESIONA ENTER" que se va o se acomoda al abrir el menú. */
  private intro: { logo: Phaser.GameObjects.Text[]; extra: Phaser.GameObjects.GameObject[] } = { logo: [], extra: [] };
  private desc!: Phaser.GameObjects.Text;
  private help: Phaser.GameObjects.Container | null = null;
  private descs: string[] = [];

  constructor() {
    super(SCENES.Title);
  }

  create(data: { skipPress?: boolean }) {
    this.menu = null;
    this.intro = { logo: [], extra: [] };
    this.leaving = false;
    // Se carga Firebase de fondo mientras se ve el título (la conexión de la cuenta va antes del menú).
    Ranking.init().catch(() => undefined);
    this.cameras.main.fadeIn(400, 11, 10, 14);
    Audio.music(this, MUSIC.menu, 0.35);
    stageBackdrop(this, 0.68);
    speedStripes(this, COLORS.lime, 0.035);
    this.input2 = new Input(this);

    // Los dos luchadores a los lados, en silueta iluminada.
    const sides: [keyof typeof FIGHTERS, number, boolean][] = [['mayin', 330, false], ['erp', GAME_WIDTH - 330, true]];
    for (const [id, x, flip] of sides) {
      const def = FIGHTERS[id];
      const s = artScale(this, def) * 1.55;
      const glow = this.add.image(x, GAME_HEIGHT + 40, def.art.texture, `${def.art.prefix}idle`).setScale(s * 1.03).setFlipX(flip);
      glow.setTint(def.color).setTintMode(Phaser.TintModes.FILL).setAlpha(0.55).setBlendMode(Phaser.BlendModes.ADD);
      const fig = this.add.image(x, GAME_HEIGHT + 40, def.art.texture, `${def.art.prefix}idle`).setScale(s).setFlipX(flip).setTint(0xffffff);
      this.tweens.add({ targets: [glow, fig], y: '-=12', duration: 1600 + (flip ? 300 : 0), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      fig.x += flip ? 260 : -260;
      glow.x = fig.x;
      this.tweens.add({ targets: [fig, glow], x, duration: 700, ease: 'Cubic.easeOut' });
      this.intro.extra.push(fig, glow);
    }

    const [pg, ft] = logo(this, GAME_WIDTH / 2, 330);
    this.intro.logo.push(pg, ft);
    for (const [i, t] of [pg, ft].entries()) {
      t.setScale(0.6).setAlpha(0);
      this.tweens.add({ targets: t, scale: 1, alpha: 1, duration: 420, delay: 150 + i * 120, ease: 'Back.easeOut' });
    }
    // Sello BETA en la esquina del logo: el juego todavía está en pruebas.
    const beta = this.add.container(GAME_WIDTH / 2 + ft.width / 2 - 40, ft.y + 18).setAngle(-8).setScale(0);
    beta.add(this.add.rectangle(0, 0, 190, 64, COLORS.red).setStrokeStyle(4, 0xffffff));
    beta.add(text(this, 0, 2, 'BETA', { size: 44, italic: true, weight: '900', color: '#ffffff', origin: [0.5, 0.5], spacing: 6 }));
    this.tweens.add({ targets: beta, scale: 1, duration: 360, delay: 520, ease: 'Back.easeOut' });
    this.intro.extra.push(beta);
    const vol = text(this, GAME_WIDTH / 2, 600, 'VOL. 01  ·  BARRIO BRAVO  ·  LIMA', { size: 34, weight: '700', color: CSS.cream, origin: [0.5, 0.5], spacing: 8 });
    this.intro.extra.push(vol);

    this.press = text(this, GAME_WIDTH / 2, 800, 'PRESIONA  ENTER', { size: 56, italic: true, weight: '900', color: CSS.lime, origin: [0.5, 0.5], spacing: 4, shadow: true });
    onDevice(this, () => this.press.setText(`PRESIONA  ${devText('ENTER')}`));
    this.tweens.add({ targets: this.press, alpha: 0.15, duration: 520, yoyo: true, repeat: -1 });
    // Debajo, más discreto: invita a usar el mando o confirma que ya está listo.
    const padHint = text(this, GAME_WIDTH / 2, 870, '', { size: 26, weight: '700', color: CSS.grey, origin: [0.5, 0.5], spacing: 2 });
    onPadChange(this, () => {
      if (!padHint.active) return;
      const pad = padConnected();
      padHint.setText(pad ? `MANDO ${padName(pad)} LISTO` : 'O PULSA UN BOTÓN DE TU MANDO').setColor(pad ? CSS.lime : CSS.grey);
    });
    this.pressHint = padHint;
    text(this, 24, GAME_HEIGHT - 26, '© 2026 PG FIGHTERS', { size: 20, weight: '600', color: CSS.grey, origin: [0, 0.5], spacing: 2 });
    this.versionCorner();
    scanlines(this, 0.08);

    this.input.once(Phaser.Input.Events.POINTER_DOWN, () => this.openMenu());
    if (data?.skipPress) this.openMenu(true);
  }

  /** Del "PRESIONA ENTER" al menú: el logo se achica arriba a la izquierda y entra el luchador de vitrina a la derecha. */
  private openMenu(instant = false): void {
    if (this.menu || this.leaving) return;
    // Antes del menú: la cuenta y el nickname (una sola vez por sesión, salvo que se haya saltado).
    if (!StoryRun.ready && !Profile.guest) {
      this.leaving = true;
      Audio.blip(this, true);
      connectProfile(this);
      return;
    }
    if (!instant) Audio.blip(this, true);
    this.press.destroy();
    this.pressHint.destroy();
    if (StoryRun.ready) this.account();

    const ms = instant ? 0 : 450;
    // El logo apilado se va y queda "PG FIGHTERS" en una línea arriba a la izquierda.
    // (El "PG" grande queda invisible: sirve de ancla para poner el fondo y la vitrina debajo del menú.)
    const [pg] = this.intro.logo;
    for (const o of [...this.intro.logo, ...this.intro.extra]) this.tweens.killTweensOf(o);
    const pgLine = text(this, 110, 130, 'PG', { size: 88, italic: true, weight: '900', color: CSS.cream, origin: [0, 0.5], shadow: true });
    const ftLine = text(this, pgLine.x + pgLine.width - (pgLine.padding.left ?? 0) * 2 + 40, 130, 'FIGHTERS', { size: 88, italic: true, weight: '900', color: CSS.lime, origin: [0, 0.5], glow: '#dfff0066' });
    for (const t of [pgLine, ftLine]) {
      t.setAlpha(0);
      this.tweens.add({ targets: t, alpha: 1, duration: ms, delay: ms * 0.4 });
    }
    const gone = [...this.intro.logo, ...this.intro.extra];
    this.tweens.add({ targets: gone, alpha: 0, duration: ms * 0.6, onComplete: () => gone.forEach((o) => o !== pg && o.destroy()) });

    // Columna izquierda, sin caja: el fondo oscurece hacia ese lado para que se lea.
    const shade = this.add.graphics();
    shade.fillGradientStyle(COLORS.bg, COLORS.bg, COLORS.bg, COLORS.bg, 0.85, 0, 0.85, 0).fillRect(0, 0, GAME_WIDTH * 0.6, GAME_HEIGHT);
    this.children.moveBelow(shade as never, pg as never);
    this.showcase(instant);

    this.desc = text(this, 110, 975, '', { size: 28, font: 'body', color: '#d8d5c8', origin: [0, 0.5] });
    this.showMenu();
  }

  /** Una sola lista ordenada por secciones; abajo, la descripción de la opción elegida. */
  private showMenu(): void {
    this.menu?.destroy();
    this.help?.destroy();
    const saved = StoryRun.ready && StoryRun.saved.length > 0;
    // Sin perfil, la historia vuelve a pedir la conexión. CONTINUAR abre las partidas guardadas; NUEVA HISTORIA
    // elige luchador y queda deshabilitada con todos los espacios ocupados.
    const story = (resume: boolean) => () => {
      if (!StoryRun.ready) return connectProfile(this);
      if (resume) return goTo(this, SCENES.Saves);
      goTo(this, SCENES.Select, { mode: 'story', last: StoryRun.saved[0]?.player });
    };
    const full = StoryRun.ready && StoryRun.full;
    const items: (MenuItem & { desc: string })[] = [
      ...(saved ? [{ header: 'JUGAR', label: 'CONTINUAR HISTORIA', onSelect: story(true), desc: 'Retoma una de tus partidas guardadas.' }] : []),
      {
        header: saved ? undefined : 'JUGAR',
        label: saved ? 'NUEVA HISTORIA' : 'HISTORIA',
        onSelect: story(false),
        enabled: !full,
        desc: full ? 'Tus espacios de partida están llenos: borra una para empezar otra.' : 'Pelea contra todo el barrio hasta llegar al jefe.',
      },
      { label: 'VS CPU', onSelect: () => goTo(this, SCENES.Select), desc: 'Pelea contra la CPU con cualquier luchador.' },
      { label: 'ENTRENAMIENTO', onSelect: () => goTo(this, SCENES.Select, { mode: 'training' }), desc: 'Practica combos y poderes sin presión.' },
      { header: 'COMUNIDAD', label: 'RANKING', onSelect: () => goTo(this, SCENES.Ranking), desc: 'Los mejores del barrio.' },
      { label: changelogUnseen() ? 'NOVEDADES  ●' : 'NOVEDADES', onSelect: () => goTo(this, SCENES.Changelog), desc: `Qué cambió en la versión ${CHANGELOG[0].version}.` },
      { header: 'OPCIONES', label: 'CONTROLES', onSelect: () => goTo(this, SCENES.Controls), desc: 'Teclado y mando: todos los movimientos.' },
      { ...fullscreenItem(this, () => this.menu), desc: 'Juega sin las barras del navegador.' },
      { label: 'CRÉDITOS', onSelect: () => goTo(this, SCENES.Credits), desc: 'Quién hizo PG Fighters.' },
    ];
    this.descs = items.map((it) => it.desc);
    this.menu = new Menu(this, items, 140, 270, saved ? 56 : 60, 40, 'left');
    this.help = footer(this, 'W S  ELEGIR      A D  CAMBIAR      ENTER  CONFIRMAR');
  }

  /** Derecha: un luchador del roster en guardia que va cambiando solo. */
  private showcase(instant: boolean): void {
    const ids = Phaser.Utils.Array.Shuffle([...ROSTER]);
    let n = 0;
    let current: Phaser.GameObjects.GameObject[] = [];
    const x = GAME_WIDTH * 0.73;
    const show = () => {
      const def = FIGHTERS[ids[n++ % ids.length]];
      for (const o of current) {
        this.tweens.add({ targets: o, alpha: 0, x: '+=120', duration: 300, onComplete: () => o.destroy() });
      }
      const s = artScale(this, def) * 1.7;
      const frame = `${def.art.prefix}idle`;
      const glow = this.add.image(x, GAME_HEIGHT + 40, def.art.texture, frame).setScale(s * 1.03).setFlipX(true).setOrigin(0.5, 1);
      glow.setTint(def.color).setTintMode(Phaser.TintModes.FILL).setAlpha(0.5).setBlendMode(Phaser.BlendModes.ADD);
      const fig = this.add.image(x, GAME_HEIGHT + 40, def.art.texture, frame).setScale(s).setFlipX(true).setOrigin(0.5, 1);
      const name = text(this, GAME_WIDTH - 110, GAME_HEIGHT - 190, def.name, { size: 64, italic: true, weight: '900', color: def.css, origin: [1, 0.5], stroke: '#000000' });
      current = [glow, fig, name];
      for (const o of current) {
        const t = o as Phaser.GameObjects.Image;
        t.setAlpha(0);
        // Entre el fondo y el logo, para que el menú quede siempre encima.
        this.children.moveBelow(t as never, this.intro.logo[0] as never);
        t.x -= 120;
        this.tweens.add({ targets: t, alpha: t === glow ? 0.5 : 1, x: t.x + 120, duration: 380, ease: 'Cubic.easeOut' });
      }
    };
    if (instant) show();
    else this.time.delayedCall(250, show);
    this.time.addEvent({ delay: 4000, loop: true, callback: show });
  }

  /** Abajo a la derecha: la versión, que abre las novedades (clic o N). El punto avisa si hay algo sin ver. */
  private versionCorner(): void {
    const label = `v${__APP_VERSION__} BETA  ·  NOVEDADES${changelogUnseen() ? '  ●' : ''}  [N]`;
    const t = text(this, GAME_WIDTH - 24, GAME_HEIGHT - 26, label, { size: 20, weight: '700', color: changelogUnseen() ? CSS.lime : CSS.grey, origin: [1, 0.5], spacing: 2 }).setDepth(950);
    const open = () => !this.leaving && goTo(this, SCENES.Changelog);
    t.setInteractive({ useHandCursor: true }).on(Phaser.Input.Events.POINTER_DOWN, open);
    this.input.keyboard?.on('keydown-N', open);
  }

  /** Esquina superior: la cuenta. Anónima → "GUARDAR CON GOOGLE" (G o clic); con Google, solo la confirma. */
  private account(): void {
    const x = GAME_WIDTH - 24;
    if (Ranking.user?.google) {
      text(this, x, 30, `✓ ${StoryRun.name}  ·  GOOGLE`, { size: 24, weight: '800', color: CSS.lime, origin: [1, 0.5], spacing: 2 });
      this.signOutButton(x, 66);
      return;
    }
    text(this, x, 30, `JUGANDO COMO  ${StoryRun.name}`, { size: 24, weight: '800', color: CSS.lime, origin: [1, 0.5], spacing: 2 });
    const idle = '☁ GUARDAR CON GOOGLE  [G]';
    const link = text(this, x, 66, idle, { size: 24, weight: '800', color: CSS.cream, origin: [1, 0.5], spacing: 2 });
    const pulse = this.tweens.add({ targets: link, alpha: 0.45, duration: 700, yoyo: true, repeat: -1 });
    const say = (str: string, color: string = CSS.cream) => link.setText(str).setColor(color).setAlpha(1);
    let busy = false;
    let taken = false;
    const fail = (e: unknown) => {
      busy = false;
      const code = (e as { code?: string }).code ?? '';
      console.warn('[cuenta] google', e);
      if (!this.sys.isActive()) return;
      say(/popup-closed|cancelled-popup/.test(code) ? idle : 'NO SE PUDO CONECTAR  ·  [G] REINTENTAR', CSS.red);
    };
    // Se llama desde el evento de la tecla o del clic: el popup tiene que abrirse dentro del gesto.
    const go = () => {
      if (busy || this.leaving) return;
      busy = true;
      pulse.pause();
      Audio.blip(this, true);
      if (taken) {
        say('ENTRANDO…', CSS.grey);
        Ranking.useGoogle()
          .then(() => StoryRun.sync())
          .then(() => {
            if (!this.sys.isActive()) return;
            this.leaving = true;
            goTo(this, SCENES.Title, { skipPress: true });
          }, fail);
        return;
      }
      say('CONECTANDO CON GOOGLE…', CSS.grey);
      Ranking.linkGoogle().then((r) => {
        busy = false;
        if (!this.sys.isActive()) return;
        if (r === 'linked') {
          window.removeEventListener('keydown', onKey);
          link.disableInteractive();
          say(`✓ GUARDADO EN GOOGLE`, CSS.lime);
          return;
        }
        taken = true;
        say('ESA CUENTA YA TIENE PROGRESO  ·  [G] USARLA', CSS.red);
      }, fail);
    };
    link.setInteractive({ useHandCursor: true }).on(Phaser.Input.Events.POINTER_DOWN, go);
    // La tecla se escucha en el DOM (Phaser la procesa un frame después, fuera del gesto, y Safari bloquearía el popup).
    const onKey = (e: KeyboardEvent) => e.code === 'KeyG' && !e.repeat && go();
    window.addEventListener('keydown', onKey);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => window.removeEventListener('keydown', onKey));
  }

  /** "SALIR" de la cuenta de Google: la primera X pide confirmar y la segunda cierra la sesión. Al volver se crea una anónima nueva con otro nickname. */
  private signOutButton(x: number, y: number): void {
    const idle = '[X] CERRAR SESIÓN';
    const btn = text(this, x, y, idle, { size: 22, weight: '800', color: CSS.grey, origin: [1, 0.5], spacing: 2 });
    let armed: Phaser.Time.TimerEvent | null = null;
    let busy = false;
    const go = () => {
      if (busy || this.leaving) return;
      Audio.blip(this, true);
      if (!armed) {
        btn.setText('¿CERRAR SESIÓN? TU PROGRESO QUEDA EN GOOGLE  ·  [X] SÍ').setColor(CSS.red);
        armed = this.time.delayedCall(4000, () => {
          armed = null;
          btn.setText(idle).setColor(CSS.grey);
        });
        return;
      }
      armed.remove();
      busy = true;
      btn.setText('CERRANDO SESIÓN…').setColor(CSS.grey);
      Ranking.signOut().then(
        () => {
          StoryRun.reset();
          Profile.guest = false;
          if (!this.sys.isActive()) return;
          this.leaving = true;
          connectProfile(this);
        },
        (e) => {
          console.warn('[cuenta] cerrar sesión', e);
          busy = false;
          armed = null;
          if (this.sys.isActive()) btn.setText('NO SE PUDO CERRAR SESIÓN  ·  [X] REINTENTAR').setColor(CSS.red);
        },
      );
    };
    btn.setInteractive({ useHandCursor: true }).on(Phaser.Input.Events.POINTER_DOWN, (p: Phaser.Input.Pointer) => !p.rightButtonDown() && go());
    this.input.keyboard?.on('keydown-X', go);
  }

  update() {
    const i = this.input2;
    if (this.leaving) return;
    if (!this.menu) {
      if (i.justDown('confirm') || i.justDown('punch')) this.openMenu();
      return;
    }
    if (i.justDown('up')) this.menu.move(-1);
    if (i.justDown('down')) this.menu.move(1);
    if (i.justDown('left')) this.menu.side(-1);
    if (i.justDown('right')) this.menu.side(1);
    if (i.justDown('confirm')) this.menu.select();
    this.desc?.setText(this.descs[this.menu.index] ?? '');
  }
}
