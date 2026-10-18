/**
 * Novedades del juego, la más nueva primero. Una línea corta por mejora, en palabras del jugador.
 * `date` es el día del pase (AAAA-MM-DD): la pantalla junta todas las versiones del mismo día.
 */
export interface ChangelogEntry {
  version: string;
  date: string;
  notes: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.6.0',
    date: '2026-10-17',
    notes: [
      'Se juega con mando.',
      'Controles para teclado y para mando.',
      'Menú principal nuevo.',
      'Pantalla de novedades.',
      'Pantalla completa en Opciones y en la pausa.',
      'El ultimate sale del lado de tu luchador.',
    ],
  },
  {
    version: '1.5.0',
    date: '2026-10-17',
    notes: ['Estadísticas del juego.'],
  },
  {
    version: '1.4.3',
    date: '2026-10-17',
    notes: ['Guion nuevo del modo historia.', 'Clic en las partidas guardadas.', 'Cerrar sesión de Google.'],
  },
  {
    version: '1.4.1',
    date: '2026-10-17',
    notes: ['Guarda tu cuenta con Google desde el menú.'],
  },
];

export const LATEST = CHANGELOG[0].version;

const SEEN_KEY = 'pgf-changelog-seen';

/** ¿Hay novedades que el jugador todavía no abrió? */
export const changelogUnseen = (): boolean => {
  try {
    return localStorage.getItem(SEEN_KEY) !== LATEST;
  } catch {
    return false;
  }
};

export const markChangelogSeen = (): void => {
  try {
    localStorage.setItem(SEEN_KEY, LATEST);
  } catch {
    // Sin almacenamiento: el punto volverá a salir, no pasa nada.
  }
};
