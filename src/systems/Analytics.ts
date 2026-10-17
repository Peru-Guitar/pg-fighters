import type { FighterId } from '../data/fighters';
import type { StageId } from '../data/stages';
import { connect } from './Ranking';

/**
 * Estadísticas del juego en `analytics/<id>`, un documento por tipo y período:
 * - `accounts` (type "accounts"): `total` de cuentas creadas.
 * - `day-2026-10-17` (type "day"): `players` únicos, cuentas `new`, `fights` y contadores `fighters`, `stages` y `modes`.
 * - `week-2026-W42` (type "week") y `month-2026-10` (type "month"): `players` únicos del período.
 * Todo suma con `increment` (dos jugadores a la vez no se pisan). Un jugador cuenta una vez por día, semana y mes
 * en cada navegador. Sin conexión o en local, no se registra nada.
 */
const COLLECTION = 'analytics';
const SEEN_KEY = 'pg-fighters-seen';

const pad = (n: number) => String(n).padStart(2, '0');

/** Fecha local "2026-10-17". */
export const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Semana ISO "2026-W42" (de lunes a domingo). */
export const weekKey = (d = new Date()) => {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const start = Date.UTC(t.getUTCFullYear(), 0, 1);
  return `${t.getUTCFullYear()}-W${pad(Math.ceil(((t.getTime() - start) / 86400000 + 1) / 7))}`;
};

/** Suma al documento (lo crea si no existe). `fields` lleva los contadores; los mapas se mezclan campo por campo. */
const add = async (id: string, base: Record<string, string>, fields: (inc: (n: number) => unknown) => Record<string, unknown>) => {
  if (import.meta.env.DEV) return;
  try {
    const { fs, db } = await connect();
    await fs.setDoc(fs.doc(db, COLLECTION, id), { ...base, ...fields(fs.increment) }, { merge: true });
  } catch (e) {
    console.warn('[analytics] no se pudo guardar', e);
  }
};

const today = () => {
  const date = dayKey();
  return { id: `day-${date}`, base: { type: 'day', date } };
};

const readSeen = (): { day?: string; week?: string; month?: string } => {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) ?? '{}');
  } catch {
    return {};
  }
};

export const Analytics = {
  /** Cuenta nueva: suma al total y a las nuevas del día. */
  newAccount(): void {
    void add('accounts', { type: 'accounts' }, (inc) => ({ total: inc(1) }));
    const t = today();
    void add(t.id, t.base, (inc) => ({ new: inc(1) }));
  },

  /** El jugador entró: cuenta una vez por día, por semana y por mes. */
  visit(): void {
    const seen = readSeen();
    const day = dayKey();
    const week = weekKey();
    const month = day.slice(0, 7);
    if (seen.day === day) return;
    const t = today();
    void add(t.id, t.base, (inc) => ({ players: inc(1) }));
    if (seen.week !== week) void add(`week-${week}`, { type: 'week', week }, (inc) => ({ players: inc(1) }));
    if (seen.month !== month) void add(`month-${month}`, { type: 'month', month }, (inc) => ({ players: inc(1) }));
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify({ day, week, month }));
    } catch {
      /* sin almacenamiento */
    }
  },

  /** Pelea terminada: suma a los dos personajes, al escenario y al modo. */
  fight(p1: FighterId, p2: FighterId, stage: StageId, mode: 'story' | 'versus'): void {
    const t = today();
    void add(t.id, t.base, (inc) => ({
      fights: inc(1),
      fighters: p1 === p2 ? { [p1]: inc(2) } : { [p1]: inc(1), [p2]: inc(1) },
      stages: { [stage]: inc(1) },
      modes: { [mode]: inc(1) },
    }));
  },
};
