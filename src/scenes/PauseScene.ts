import Phaser from 'phaser';
import { COLORS, CSS, GAME_HEIGHT, GAME_WIDTH, SCENES } from '../config';
import { Audio } from '../systems/Audio';
import { devText, Input } from '../systems/Input';
import { Versus } from '../systems/Versus';
import { Menu, footer, fullscreenItem, text } from '../ui/ui';
import { FIGHTERS, type FighterDef } from '../data/fighters';
import { TRAITS, powerInfo, superInfo } from '../data/moveset';
import type { FightData } from './FightScene';

/** El laboratorio de sprites se abre con ?sprites en la URL. */
const LAB = new URLSearchParams(location.search).has('sprites');

/** [tipo, entrada, nombre, qué hace] de cada movimiento propio del luchador. */
export const movesOf = (def: FighterDef): [string, string, string, string][] => {
  const trait = TRAITS[def.id];
  return [
    ['PODER', devText('S → D + CLIC IZQ'), def.moves.special, def.id === 'acople' ? 'Tres bolas de feedback que salen rápido, cada una ondulando distinto.' : powerInfo(def.id)],
    // El Acople tiene un segundo poder, con patada.
    ...(def.id === 'acople' ? [['PODER 2', devText('S → D + CLIC DER'), 'ORBE DE ARRASTRE', 'Un orbe oscuro que, si toca, te trae al rival a distancia de golpe.'] as [string, string, string, string]] : []),
    ['UPPERCUT', devText('D → S → S+D + CLIC IZQ'), def.moves.uppercut, 'Antiaéreo invulnerable al arrancar.'],
    ['ULTIMATE', devText('E'), def.moves.super, superInfo(def.id)],
    ...(trait ? [['RASGO', '', trait.name, trait.desc] as [string, string, string, string]] : []),
  ];
};


/** Pausa sobre la pelea: continuar, reiniciar, cambiar de luchador o salir. Muestra los movimientos de tu luchador. */
export class PauseScene extends Phaser.Scene {
  private input2!: Input;
  private menu!: Menu;
  private fight!: FightData;

  constructor() {
    super(SCENES.Pause);
  }

  /** Quién pausó (0 = P1, 1 = P2 en VS JUGADOR): maneja el menú y ve sus movimientos. */
  private by: 0 | 1 = 0;

  init(data: { fight: FightData; by?: 0 | 1 }) {
    this.fight = data.fight;
    this.by = data.by ?? 0;
  }

  create() {
    this.sound.pauseAll();
    this.input2 = new Input(this, false, Versus.p2 === null ? 'any' : this.by === 1 ? Versus.p2 : Versus.p1);
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.bg, 0.78).setOrigin(0);
    const p2 = Versus.p2 !== null && Versus.tag(this.by) === 'P2';
    const title = text(this, 140, 200, 'PAUSA', { size: 170, italic: true, weight: '900', color: p2 ? CSS.red : CSS.lime, origin: [0, 0.5] });
    if (p2) text(this, title.x + title.width - (title.padding.left ?? 0) * 2 + 60, 236, 'P2', { size: 64, italic: true, weight: '900', color: CSS.red, origin: [0, 0.5] });
    this.menu = new Menu(this, [
      { label: 'SEGUIR PELEANDO', onSelect: () => this.resume() },
      { label: 'REINICIAR PELEA', onSelect: () => this.leave(SCENES.Fight, this.fight) },
      ...(this.fight.story ? [] : [{ label: 'CAMBIAR LUCHADOR', onSelect: () => this.leave(SCENES.Select, { last: this.fight.p1, mode: this.fight.training ? 'training' : 'arcade' }) }]),
      ...(LAB ? [{ label: 'LABORATORIO', onSelect: () => this.leave(SCENES.Lab, { char: this.fight.p1 }) }] : []),
      fullscreenItem(this, () => this.menu),
      { label: this.fight.story ? 'MENÚ (PROGRESO GUARDADO)' : 'MENÚ PRINCIPAL', onSelect: () => this.leave(SCENES.Title, { skipPress: true }) },
    ], 170, 400, 76, 48, 'left');

    const px = 1040;
    const g = this.add.graphics();
    g.fillStyle(COLORS.panel, 0.95).fillRect(px, 150, 760, 760);
    g.fillStyle(COLORS.lime, 1).fillRect(px, 150, 760, 6);
    const def = FIGHTERS[this.by === 1 ? this.fight.p2 : this.fight.p1];
    text(this, px + 40, 200, `MOVIMIENTOS  ·  ${def.name}`, { size: 30, italic: true, weight: '900', origin: [0, 0.5], spacing: 2 });
    text(this, px + 40, 236, 'Mirando a la derecha', { size: 20, font: 'body', color: CSS.grey, origin: [0, 0.5] });
    let y = 272;
    for (const [kind, input, name, desc] of movesOf(def)) {
      text(this, px + 40, y + 12, kind, { size: 20, weight: '800', color: CSS.grey, origin: [0, 0.5], spacing: 3 });
      if (input) text(this, px + 720, y + 12, input, { size: 24, weight: '700', origin: [1, 0.5] });
      const n = text(this, px + 40, y + 30, name, { size: 30, italic: true, weight: '900', color: CSS.lime, origin: [0, 0], wrap: 680 });
      y = n.y + n.height + 4;
      const d = text(this, px + 40, y, desc, { size: 21, font: 'body', color: '#cfccc0', origin: [0, 0], wrap: 680 }).setLineSpacing(3);
      y = d.y + d.height + 22;
    }
    text(this, px + 40, 876, 'Golpes básicos, barrida, cadena y dash: menú CONTROLES.', { size: 20, font: 'body', color: CSS.grey, origin: [0, 0.5] });
    footer(this, 'W S  ELEGIR      A D  CAMBIAR      ENTER  CONFIRMAR      ESC  CONTINUAR');
  }

  private resume(): void {
    this.sound.resumeAll();
    this.scene.resume(SCENES.Fight);
    this.scene.resume(SCENES.Hud);
    this.scene.resume(SCENES.TrainingHud);
    this.scene.stop();
  }

  private leave(key: string, data?: object): void {
    this.sound.resumeAll();
    if (key !== SCENES.Fight) Audio.stopMusic(300);
    this.scene.stop(SCENES.Hud);
    this.scene.stop(SCENES.TrainingHud);
    this.scene.stop(SCENES.Fight);
    this.scene.start(key, data);
  }

  update() {
    const i = this.input2;
    if (i.justDown('up')) this.menu.move(-1);
    if (i.justDown('down')) this.menu.move(1);
    if (i.justDown('left')) this.menu.side(-1);
    if (i.justDown('right')) this.menu.side(1);
    if (i.justDown('confirm')) this.menu.select();
    if (i.justDown('back')) this.resume();
  }
}
