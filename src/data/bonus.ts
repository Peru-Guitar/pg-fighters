/** El aviso de "Acople desbloqueado" sale una sola vez (se recuerda en este navegador). */
const KEY = 'pgf-boss-announced';

export const bossAnnounced = (): boolean => {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};

export const markBossAnnounced = (): void => {
  try {
    localStorage.setItem(KEY, '1');
  } catch {
    // Sin almacenamiento: el aviso podría repetirse, no pasa nada.
  }
};
