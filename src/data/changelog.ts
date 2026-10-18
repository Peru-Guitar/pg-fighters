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
    version: '1.8.0',
    date: '2026-10-17',
    notes: [
      'Animaciones nuevas, hechas desde cero: Rematada, Escalas, Jesex y Tayloy.',
      'El silencio de Escalas dura menos.',
    ],
  },
  {
    version: '1.7.2',
    date: '2026-10-17',
    notes: ['Ultimate de Escalas renovado: cada golpe deja una nota musical de luz.'],
  },
  {
    version: '1.7.1',
    date: '2026-10-17',
    notes: ['El primer poder de El Acople ahora se llama Barrido.'],
  },
  {
    version: '1.7.0',
    date: '2026-10-17',
    notes: [
      'Nuevo VS JUGADOR: dos jugadores en la misma compu.',
      'Termina la historia y desbloquea a El Acople.',
      'El Acople: un poder con puño y otro con patada.',
      'Créditos al final de la historia.',
      'El ultimate pega completo si ya te alcanzó.',
      'Nuevo sonido para los golpes al aire.',
      'En pantalla completa, ESC ya no te saca.',
      'Fondo de menú distinto en cada partida.',
      'Las historias terminadas ya no se pierden.',
    ],
  },
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
