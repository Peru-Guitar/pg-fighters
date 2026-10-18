import type { FighterId } from '../data/fighters';
import { Analytics } from './Analytics';

/** Proyecto de Firebase (la apiKey de una app web es pública; la base la protegen las reglas). */
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBQA2aMdmFfx-8kXUWuiO5SkhnRx2c7Tl8',
  authDomain: 'pg-fighters.firebaseapp.com',
  projectId: 'pg-fighters',
  storageBucket: 'pg-fighters.firebasestorage.app',
  messagingSenderId: '1048513368434',
  appId: '1:1048513368434:web:420fd685ea631792f14deb',
};

const COLLECTION = 'ranking';
/** Perfil de la cuenta: nickname fijo y una partida de la historia por personaje (`progress/<uid>`). */
const PROGRESS = 'progress';
/** Nicknames tomados: `names/<nickname>` → `{ uid }` (así no hay dos cuentas con el mismo). */
const NAMES = 'names';
const NAME_KEY = 'pg-fighters-player';
/** Id de la fila del ranking: cuenta + personaje. */
const rowId = (uid: string, fighter: FighterId) => `${uid}_${fighter}`;

/** Id del documento de un nickname: sin distinguir mayúsculas ni espacios repetidos (el prefijo evita ids reservados como "." o "__x__"). */
const nameKey = (name: string) => `n_${name.trim().toUpperCase().replace(/\s+/g, ' ')}`;

export const NAME_MAX = 12;

export interface RankEntry {
  id: string;
  name: string;
  score: number;
  /** Peleas ganadas en la historia (13 = completada). */
  level: number;
  /** Total de peleas de la historia. */
  total: number;
  fighter: FighterId;
  updatedAt: number;
}

/** "PELEA 7/13", "EL ACOPLE" o "COMPLETADO". */
export const levelLabel = (e: Pick<RankEntry, 'level' | 'total'>): string =>
  e.level >= e.total ? 'COMPLETADO' : e.level === e.total - 1 ? 'EL ACOPLE' : `PELEA ${e.level + 1}/${e.total}`;

type Lite = typeof import('firebase/firestore/lite');
type AuthMod = typeof import('firebase/auth');
interface Firebase {
  fs: Lite;
  db: import('firebase/firestore/lite').Firestore;
  am: AuthMod;
  auth: import('firebase/auth').Auth;
}

export interface Player {
  uid: string;
  /** Cuenta vinculada a Google (si no, es anónima y vive solo en este navegador). */
  google: boolean;
}

let ready: Promise<Firebase> | null = null;
/** Firebase ya cargado: el popup de Google se abre sin esperas, dentro del gesto del jugador (si no, el navegador lo bloquea). */
let loaded: Firebase | null = null;
let user: Player | null = null;
/** Credencial de Google que ya tenía cuenta propia (para `useGoogle`). */
let taken: import('firebase/auth').OAuthCredential | null = null;

const toPlayer = (u: import('firebase/auth').User): Player => ({ uid: u.uid, google: u.providerData.some((p) => p.providerId === 'google.com') });

/** Firebase se carga recién la primera vez que se usa (no pesa en el arranque del juego). */
export const connect = () => {
  ready ??= Promise.all([import('firebase/app'), import('firebase/auth'), import('firebase/firestore/lite')]).then(([app, am, fs]) => {
    const fb = app.initializeApp(FIREBASE_CONFIG);
    const auth = am.getAuth(fb);
    am.onAuthStateChanged(auth, (u) => {
      user = u ? toPlayer(u) : null;
    });
    return (loaded = { fs, db: fs.getFirestore(fb), am, auth });
  });
  return ready;
};

/**
 * Cuenta anónima de Firebase (se crea sola al abrir el menú; la sesión queda en el navegador) y Firestore: ranking global (una fila por cuenta y
 * personaje: la de su historia) y el perfil de cada cuenta (nickname y partidas). Sin conexión, todo falla en silencio.
 */
export const Ranking = {
  /** Cuenta conectada (null = sin sesión o todavía no se sabe). */
  get user(): Player | null {
    return user;
  },

  /** Carga Firebase y espera a saber si hay una sesión guardada. */
  async init(): Promise<Player | null> {
    const { auth } = await connect();
    await auth.authStateReady();
    return user;
  },

  /** Sesión guardada del navegador o, si no hay, una cuenta anónima nueva. Lanza sin conexión. */
  async signIn(): Promise<Player> {
    const { am, auth } = await connect();
    if (await this.init()) {
      Analytics.visit();
      return user!;
    }
    const cred = await am.signInAnonymously(auth);
    user = toPlayer(cred.user);
    Analytics.newAccount();
    Analytics.visit();
    return user;
  },

  /**
   * Guarda la cuenta con Google: vincula la anónima (mismo uid, no se pierde nada). Si ese Google ya tiene su propia
   * cuenta, devuelve 'taken' y `useGoogle` entra a esa. Llamar dentro del gesto del jugador (tecla o clic).
   */
  async linkGoogle(): Promise<'linked' | 'taken'> {
    const { am, auth } = loaded ?? (await connect());
    const current = auth.currentUser;
    if (!current) throw new Error('sin sesión');
    try {
      const cred = await am.linkWithPopup(current, new am.GoogleAuthProvider());
      await cred.user.reload();
      user = toPlayer(auth.currentUser ?? cred.user);
      return 'linked';
    } catch (e) {
      if ((e as { code?: string }).code !== 'auth/credential-already-in-use') throw e;
      taken = am.GoogleAuthProvider.credentialFromError(e as import('firebase/app').FirebaseError);
      if (!taken) throw e;
      return 'taken';
    }
  },

  /** Cierra la sesión del navegador (la cuenta y su progreso quedan en Firebase). La próxima conexión crea una anónima nueva. */
  async signOut(): Promise<void> {
    const { am, auth } = await connect();
    await am.signOut(auth);
    user = null;
    taken = null;
  },

  /** Cambia a la cuenta de Google que ya existía (la anónima de este navegador se abandona). */
  async useGoogle(): Promise<Player> {
    const { am, auth } = loaded ?? (await connect());
    if (!taken) throw new Error('sin credencial');
    const cred = await am.signInWithCredential(auth, taken);
    taken = null;
    user = toPlayer(cred.user);
    return user;
  },

  /** Perfil guardado de la cuenta conectada (null = no tiene). Lanza si no se pudo leer. */
  async loadProgress<T>(): Promise<T | null> {
    const { fs, db } = await connect();
    if (!(await this.init())) return null;
    const snap = await fs.getDoc(fs.doc(db, PROGRESS, user!.uid));
    return snap.exists() ? (snap.data() as T) : null;
  },

  async saveProgress(state: object): Promise<void> {
    try {
      const { fs, db } = await connect();
      if (!(await this.init())) return;
      // Firestore no acepta campos `undefined`: el viaje por JSON los quita.
      await fs.setDoc(fs.doc(db, PROGRESS, user!.uid), JSON.parse(JSON.stringify(state)));
    } catch (e) {
      console.warn('[progreso] no se pudo guardar', e);
    }
  },

  /**
   * Reserva el nickname para la cuenta conectada. Devuelve false si ya es de otra cuenta. Lanza sin conexión.
   * La transacción evita que dos cuentas lo tomen a la vez.
   */
  async claimName(name: string): Promise<boolean> {
    const { fs, db } = await connect();
    if (!(await this.init())) throw new Error('sin sesión');
    const uid = user!.uid;
    const ref = fs.doc(db, NAMES, nameKey(name));
    return fs.runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (snap.exists()) return snap.data().uid === uid;
      tx.set(ref, { uid, name, createdAt: Date.now() });
      return true;
    });
  },

  /** Fila de la historia de `fighter` en el ranking: siempre refleja esa partida (una fila por cuenta y personaje). */
  async submit(entry: Omit<RankEntry, 'id'>): Promise<void> {
    // Las partidas de prueba en local no van al ranking mundial.
    if (import.meta.env.DEV) return;
    try {
      const { fs, db } = await connect();
      if (!(await this.init())) return;
      await fs.setDoc(fs.doc(db, COLLECTION, rowId(user!.uid, entry.fighter)), entry);
    } catch (e) {
      console.warn('[ranking] no se pudo guardar', e);
    }
  },

  /** Quita del ranking la fila de la historia de `fighter` (al reiniciarla o eliminarla). */
  async remove(fighter: FighterId): Promise<void> {
    if (import.meta.env.DEV) return;
    try {
      const { fs, db } = await connect();
      if (!(await this.init())) return;
      await fs.deleteDoc(fs.doc(db, COLLECTION, rowId(user!.uid, fighter)));
    } catch (e) {
      console.warn('[ranking] no se pudo borrar', e);
    }
  },

  /** ¿Alguna fila propia del ranking dice COMPLETADO? (Recupera el desbloqueo del jefe de historias que ya no están en el perfil.) */
  async anyCompleted(fighters: FighterId[]): Promise<boolean> {
    try {
      const { fs, db } = await connect();
      if (!(await this.init())) return false;
      const snaps = await Promise.all(fighters.map((f) => fs.getDoc(fs.doc(db, COLLECTION, rowId(user!.uid, f)))));
      return snaps.some((s) => {
        const e = s.exists() ? (s.data() as Partial<RankEntry>) : null;
        return !!e && typeof e.level === 'number' && typeof e.total === 'number' && e.level >= e.total;
      });
    } catch (e) {
      console.warn('[ranking] no se pudo revisar el ranking', e);
      return false;
    }
  },

  /** La fila es de la cuenta conectada. */
  isMine(id: string): boolean {
    const uid = user?.uid;
    return !!uid && id.startsWith(`${uid}_`);
  },

  /** Mejores puntajes (espera a saber la sesión para poder marcar la fila propia). */
  async top(n = 20): Promise<RankEntry[]> {
    const { fs, db } = await connect();
    await this.init();
    const snap = await fs.getDocs(fs.query(fs.collection(db, COLLECTION), fs.orderBy('score', 'desc'), fs.limit(n)));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<RankEntry, 'id'>) }));
  },

  /** Último nombre usado en este navegador. */
  get savedName(): string {
    try {
      return localStorage.getItem(NAME_KEY) ?? '';
    } catch {
      return '';
    }
  },

  set savedName(name: string) {
    try {
      localStorage.setItem(NAME_KEY, name);
    } catch {
      /* sin almacenamiento */
    }
  },
};
