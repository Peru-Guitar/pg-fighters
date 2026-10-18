import type { Source } from './Input';

/**
 * Quién controla cada lado en el modo VERSUS: `p1` empieza a la izquierda y `p2` a la derecha (`p2: null` = la CPU).
 * `leader` es quien se unió primero en VS JUGADOR (el "P1" de los menús): elige escenario y maneja menús y diálogos.
 * Lo fija la pantalla "ELIGE TU LADO" y lo leen la selección y la pelea; los demás modos lo reinician.
 */
export const Versus = {
  p1: 'any' as Source,
  p2: null as Source | null,
  leader: 'any' as Source,

  /** ¿Pelea entre dos personas? */
  get pvp(): boolean {
    return this.p2 !== null;
  },

  /** Quién maneja menús, pausa y diálogos: en VERSUS entre dos, solo P1. */
  get lead(): Source {
    return this.p2 === null ? 'any' : this.leader;
  },

  /** Nombre del jugador de cada lado (0 = izquierda, 1 = derecha) en VS JUGADOR: P1 es el líder. */
  tag(side: 0 | 1): 'P1' | 'P2' {
    return (side === 0 ? this.p1 : this.p2) === this.leader ? 'P1' : 'P2';
  },

  /** Un jugador contra la CPU, con cualquier dispositivo. */
  reset(): void {
    this.p1 = 'any';
    this.p2 = null;
    this.leader = 'any';
  },
};
