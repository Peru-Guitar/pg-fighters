import type { FighterId } from "./fighters";

/**
 * Modo historia "EL ACOPLE": la escena del rock peruano se volvió hater de la noche a la mañana.
 * Encaras a tus amigos uno por uno; cada victoria libera a uno y te da una pista sobre la entidad.
 * Todo el texto del modo vive aquí. `{name}` se reemplaza por el nombre del luchador elegido.
 */

/** Prólogo: un panel por línea. */
export const PROLOGUE: string[] = [
  "Lima. La escena del rock peruano siempre fue una familia: ruidosa, disfuncional… pero familia.",
  "Hasta que una noche, sin aviso, todos empezaron a odiarse.",
  "Comentarios a las 3:33 de la madrugada. Críticas sin sentido. Envidia pura. Amigos de toda la vida convertidos en haters.",
  "{name} no entiende qué está pasando. Pero sabe una cosa: hay que encararlos. Uno por uno.",
];

/** Amigos que encaras antes del jefe: elegidos al azar, sin repetir, al empezar la partida. */
export const STORY_RIVALS = 12;

/** Pistas sobre la entidad, en orden de avance (la n-ésima victoria da la pista n). Una por rival. */
export const CLUES: string[] = [
  // Acto 1: ¿qué nos pasó?
  "Perdón por lo que te escribí. Ni sé qué significa «sobrevalorado»… y te lo puse cuarenta veces.",
  "Todos comentamos a las 3:33 de la madrugada. Yo a esa hora duermo. O eso creía.",
  "Antes de comentar sonaba un zumbido, como un acople. Culpé al vecino. Él también estaba comentando.",
  "Mientras más criticábamos, más fuerte zumbaba. No era ruido: era algo comiendo.",
  // Acto 2: ¿de dónde salió?
  "Todo empezó en el Gran Jam Online: toda la escena en vivo, cada uno desde su cuarto, con los amplis al máximo.",
  "A las 3:33 un micrófono quedó pegado a un parlante. El acople pasó por todas las transmisiones y las cortó.",
  "El pitido se quedó en los cables. Hasta una guitarra de Marketplace amaneció odiando: estaba enchufada.",
  "No inventó la envidia: ya la teníamos, bajita. Solo encontró la perilla y le subió el volumen.",
  // Acto 3: ¿dónde está?
  "Un foro de sonidistas de 2009 lo describe: un feedback que vive del odio. Le dicen El Acople.",
  "Cada amigo que liberas le baja el volumen. Ya se dio cuenta: anoche el zumbido desafinaba.",
  "Todos los cables terminan en el viejo depósito de equipos de sonido. Nadie lo usa hace años… pero paga luz.",
  "Está dentro del ampli más grande, con la perilla en 11. Te está esperando.",
];

export interface StoryLine {
  /** `boss` = El Acople, `player` = el luchador elegido. */
  speaker: "boss" | "player" | "narrator";
  text: string;
}

/** Revelación antes de la pelea final. */
export const REVEAL: StoryLine[] = [
  {
    speaker: "narrator",
    text: "El viejo depósito. Cientos de amplificadores encendidos, sin nadie que los toque. Un zumbido agudo sube desde el centro.",
  },
  {
    speaker: "boss",
    text: "¿Nunca te preguntaste de quién era el micrófono pegado al parlante esa noche, {name}?",
  },
  {
    speaker: "boss",
    text: "Era el tuyo. Tú me diste la voz. Ellos me dieron el hambre. Y ahora me los estás quitando.",
  },
  { speaker: "player", text: "{quote}" },
];

/** Final común al vencer a El Acople. */
export const FINALE: string[] = [
  "El chillido se apaga.",
  "Por toda Lima, los amplis se quedan en silencio… y luego vuelven a sonar. Esta vez, juntos.",
  "{name} desenchufa su micrófono. Esta vez lo guarda lejos del parlante.",
];

/** Epílogo de cada luchador elegible. */
export const EPILOGUES: Partial<Record<FighterId, string>> = {
  erp: "ERP Project vuelve a su cuarto, cierra el editor de código y graba un solo de pocas notas, todas con lenguaje. Los que lo odiaban lo escuchan a escondidas. Siguen sin pensar como él. Igual le dan like.",
  mayin:
    "MayinBlues vuelve a su barrio y toca un blues en la esquina, frente a todos sus amigos. Alguien le ofrece una sexta cuerda. La rechaza con dignidad y se queda para la pollada.",
  george:
    "George reúne a la escena para un ensayo general, con himno incluido. Por primera vez en años, todo suena afinado. Igual le dice a alguien «cuidado ese bend». Pero lo dice con cariño, y con la gorra puesta.",
  pepper:
    "Pepper graba un disco en vivo con todos los liberados. Lo mezcla durante seis meses. Dice que todavía le falta producción.",
  slandor:
    "Slandor salvó la escena por mérito propio. Llama a papá para contarle. Papá ya lo sabía: había comprado los derechos de transmisión.",
  pentalick:
    "Pentalick celebra con un concierto épico. En el bis, por un instante, casi toca un sexto lick. Nadie está seguro. Él lo niega.",
  mimetico:
    "Mimético organiza un festival de la reconciliación. El afiche es igualito al de otro festival. Él dice que es influencia.",
  clavito:
    'Clavito le pone nombre a su género: "acople-tón". La escena entera lo odia… con cariño, esta vez.',
  chantal:
    'Chantal vuelve al bar y sirve una ronda para todos. En la cuenta, al final, dice: "plato de licks, cortesía de la casa".',
  jeanpierre:
    "Jean-Pierre vuelve a Europa con una historia nueva para contar. Allá nadie le cree. Pero aplauden igual, por educación.",
  ferdex:
    "Ferdex da un discurso de tres horas sobre la unidad de la escena. Al final, todos juran haber visto a Curcuman en la última fila.",
  turboshred:
    "Turboshred toca el solo de la victoria tan rápido que termina antes de empezar. El público lo aplaude por adelantado, por si acaso.",
  rematada:
    "La Rematada salvó la escena, pero no olvida. MayinBlues le ofrece cuerdas nuevas como disculpa: cinco. Ella las acepta… y sigue planeando su destierro. Con paciencia. Como un buen blues.",
  escalas:
    "Escalas escribe su segundo libro: «El Acople: anatomía de un feedback». Es su primer bestseller sin secretos de guitarra. Igual trae un capítulo de escalas, por si acaso.",
  tayloy:
    "TayLoy vuelve con el clan con la verdad entera: el último falso profeta era un ampli con resentimiento. Los maestros de la Púa de Jade lo nombran guardián del honor. Él solo pide un metrónomo más rápido.",
  jesex:
    "Jesex celebra comprando el viejo depósito de equipos de sonido. Ahora es la sede número cuarenta de la Escuela del Rock. La matrícula es gratis. El acople, dicen, toca en la banda de los viernes.",
  markus:
    "Markus enseña sus escalas orientales a toda la escena. Por primera vez, todos tocan algo distinto a la pentatónica. El primer ensayo termina en un acorde tan fuerte que se escucha en toda Lima: KABOOOM.",
  kimberly:
    "Kimberly sube un video de la pelea final: once millones de vistas. Lo edita cuarenta veces hasta que sale perfecta en cada toma. De la pelea, casi no se ve nada.",
  nosu:
    "NOSU produce el disco de reconciliación de toda la escena. Lo afina, lo cuadra y lo masteriza en treinta segundos. Es perfecto. Nadie lo escucha dos veces. Por primera vez, NOSU anota un error que no sabe corregir.",
  ricardo:
    "Ricardo graba su primer disco con su nombre en la portada. Es rock de raíz, crudo y honesto. En los créditos de cada canción dice lo mismo: Ricardo.",
  platanero:
    "Platanero relanza su curso en VHS como «edición de coleccionista». Vende tres copias: dos se las compra la abuela. Su legado queda en VHS, por si te quieres reír de lo mal que enseñaba.",
  virrey:
    "El Virrey devuelve la puerta de todos los shows. Toda, no la mitad. Después se encierra en su casona a componer su primera canción propia. Le cobra tributo a su propia inspiración. Ella no paga.",
  tevi:
    "Tevi hace un especial en vivo de tres horas con toda la escena reunida en su set. Sale cada banda, cada guitarrista y hasta el sonidista. El rating revienta. Al final se da cuenta de que él no aparece en ninguna toma. Por primera vez, la estrella no es él. Le gusta.",
  toxicity:
    "Por primera vez una banda le pide a Toxicity que se quede. Dura tres ensayos. Es su récord. Lo celebra rezando, con rabia.",
};

/** Los escenarios rotan en este orden durante la historia (se repiten si hace falta). El jefe pelea en `ampli`. */
export const STORY_STAGE_ROTATION = [
  "barrio",
  "metro",
  "bar",
  "tienda",
  "festival",
  "azotea",
  "tomate",
  "biblioteca",
  "chino",
  "mall",
  "arenal",
  "casona",
  "ciudadela",
  "jungla",
  "laboratorio",
  "estudio",
] as const;
export const BOSS_STAGE = "ampli" as const;
