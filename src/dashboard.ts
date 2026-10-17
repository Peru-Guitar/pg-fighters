import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore/lite';
import { dayKey, weekKey } from './systems/Analytics';
import { FIREBASE_CONFIG } from './systems/Ranking';

/** Dashboard de estadísticas (dashboard.html): lee `analytics/*`, que solo el administrador puede leer. */

type Counts = Record<string, number>;
interface Day {
  date: string;
  players?: number;
  new?: number;
  fights?: number;
  fighters?: Counts;
  stages?: Counts;
  modes?: Counts;
}

// App aparte: la sesión de Google de aquí no reemplaza la cuenta del juego en este navegador.
const app = initializeApp(FIREBASE_CONFIG, 'dashboard');
const auth = getAuth(app);
const db = getFirestore(app);

const $ = (id: string) => document.getElementById(id)!;
const fmt = (n: number) => n.toLocaleString('es-PE');
const MODE_NAMES: Record<string, string> = { story: 'Historia', versus: 'Versus' };

const read = async <T>(id: string): Promise<T | null> => {
  const snap = await getDoc(doc(db, 'analytics', id));
  return snap.exists() ? (snap.data() as T) : null;
};

const sum = (days: Day[], key: 'fighters' | 'stages' | 'modes'): [string, number][] => {
  const total: Counts = {};
  for (const d of days) for (const [k, v] of Object.entries(d[key] ?? {})) total[k] = (total[k] ?? 0) + v;
  return Object.entries(total).sort((a, b) => b[1] - a[1]);
};

const bars = (el: HTMLElement, rows: [string, number][], label = (k: string) => k.toUpperCase()) => {
  const max = rows[0]?.[1] ?? 0;
  el.innerHTML = rows.length ? '' : '<p class="note">Sin datos todavía.</p>';
  for (const [k, v] of rows) {
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `<span></span><div class="bar" style="width:${(v / max) * 100}%"></div><span class="v">${fmt(v)}</span>`;
    row.firstElementChild!.textContent = label(k);
    el.append(row);
  }
};

const lastDays = (n: number): string[] => {
  const out: string[] = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    out.unshift(dayKey(d));
    d.setDate(d.getDate() - 1);
  }
  return out;
};

const load = async () => {
  $('status').textContent = 'Cargando…';
  const keys = lastDays(30);
  const [accounts, week, month, ...days] = await Promise.all([
    read<{ total?: number }>('accounts'),
    read<{ players?: number }>(`week-${weekKey()}`),
    read<{ players?: number }>(`month-${dayKey().slice(0, 7)}`),
    ...keys.map((k) => read<Day>(`day-${k}`)),
  ]);
  const all: Day[] = days.map((d, i) => d ?? { date: keys[i] });
  const today = all[all.length - 1];
  const total = accounts?.total ?? 0;

  $('t-accounts').textContent = fmt(total);
  $('t-today').textContent = fmt(today.players ?? 0);
  $('t-week').textContent = fmt(week?.players ?? 0);
  $('t-inactive').textContent = fmt(Math.max(0, total - (month?.players ?? 0)));
  $('t-fights').textContent = fmt(today.fights ?? 0);
  $('t-new').textContent = fmt(today.new ?? 0);
  $('t-fighter').textContent = sum(all, 'fighters')[0]?.[0].toUpperCase() ?? '–';
  $('t-stage').textContent = sum(all, 'stages')[0]?.[0].toUpperCase() ?? '–';

  const max = Math.max(1, ...all.map((d) => d.players ?? 0));
  $('days').innerHTML = '';
  for (const d of all) {
    const bar = document.createElement('div');
    bar.style.height = `${((d.players ?? 0) / max) * 100}%`;
    bar.title = `${d.date}: ${d.players ?? 0} jugadores, ${d.fights ?? 0} peleas`;
    $('days').append(bar);
  }
  $('ax-from').textContent = keys[0];
  $('ax-to').textContent = 'hoy';

  const ranges = (n: number) => {
    const slice = all.slice(-n);
    bars($('fighters'), sum(slice, 'fighters'));
    bars($('stages'), sum(slice, 'stages'));
    bars($('modes'), sum(slice, 'modes'), (k) => MODE_NAMES[k] ?? k);
    for (const b of document.querySelectorAll<HTMLButtonElement>('[data-range]')) b.classList.toggle('on', b.dataset.range === String(n));
  };
  for (const b of document.querySelectorAll<HTMLButtonElement>('[data-range]')) b.onclick = () => ranges(Number(b.dataset.range));
  ranges(30);

  $('status').textContent = `Actualizado: ${new Date().toLocaleString('es-PE')}`;
  $('board').hidden = false;
};

$('login').onclick = () => void signInWithPopup(auth, new GoogleAuthProvider()).catch((e) => ($('status').textContent = `No se pudo entrar: ${e.code ?? e}`));

onAuthStateChanged(auth, (u) => {
  $('login').hidden = !!u;
  if (!u) {
    $('board').hidden = true;
    $('status').textContent = 'Entra con la cuenta de administrador.';
    return;
  }
  load().catch((e) => {
    $('status').textContent = e?.code === 'permission-denied' ? `La cuenta ${u.email} no tiene acceso.` : `Error: ${e?.code ?? e}`;
  });
});
