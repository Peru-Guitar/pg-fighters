import { FIGHTERS, type FighterId } from './fighters';

export interface DialogLine {
  speaker: FighterId;
  text: string;
}

type Line = [FighterId, string];

/**
 * Diálogo antes del ROUND 1 de cada enfrentamiento (sin importar quién es el jugador).
 * Clave: los dos ids ordenados alfabéticamente y unidos con "-". Hay uno para cada pareja.
 */
const DIALOGS: Record<string, Line[]> = {
  // ── EL ACOPLE ──
  'acople-chantal': [
    ['acople', 'Un mozo que sirve críticas frías. Tráeme otra ronda.'],
    ['chantal', 'Lo siento, la cocina cerró. Y usted no tiene reservación.'],
  ],
  'acople-clavito': [
    ['acople', 'Tu género nuevo es puro ruido. Me encanta.'],
    ['clavito', 'Por fin alguien lo entiende… y es un feedback. Qué mal.'],
  ],
  'acople-erp': [
    ['acople', 'Tu micrófono, tu cuarto, tu culpa. Gracias por la voz.'],
    ['erp', 'Entonces me toca apagarte. Sin tanto shred.'],
  ],
  'acople-escalas': [
    ['acople', 'Busqué mi nombre en tu libro. No aparezco.'],
    ['escalas', 'Saldrás en la segunda edición. En el capítulo de plagas.'],
  ],
  'acople-ferdex': [
    ['acople', 'El pueblo está dividido, compañero. Obra mía.'],
    ['ferdex', 'Curcuman no perdona a quien divide al pueblo.'],
  ],
  'acople-george': [
    ['acople', 'Mi chillido sube y sube. ¿Te molesta, juez?'],
    ['george', 'Me molesta que suba desafinado.'],
  ],
  'acople-jeanpierre': [
    ['acople', 'En Europa también me escuchan. A las 3:33.'],
    ['jeanpierre', 'Mon Dieu. Hasta el acople me siguió en el equipaje.'],
  ],
  'acople-jesex': [
    ['acople', 'El odio no se compra, magnate.'],
    ['jesex', 'Todo se compra, amigo. Y tú vas a ser mi depósito.'],
  ],
  'acople-kimberly': [
    ['acople', 'Cada comentario de odio en tus videos… era yo.'],
    ['kimberly', '¿Tú eras el que ponía «sin filtro eres otra»? Bloqueado.'],
  ],
  'acople-markus': [
    ['acople', 'Yo también sé explotar oídos.'],
    ['markus', 'Tú chillas, hermano. Yo hago ¡KABOOOM! Hay diferencia.'],
  ],
  'acople-mayin': [
    ['mayin', 'Hola amigo, ¿cómo estás?'],
    ['acople', 'Lleno. De todo el odio que les saqué.'],
    ['mayin', 'Entonces vamos a vaciarte. Con cinco cuerdas alcanza.'],
  ],
  'acople-mimetico': [
    ['acople', 'Copias a todos. Copia también mi odio.'],
    ['mimetico', 'Ya lo copié. No me gustó. Te lo devuelvo.'],
  ],
  'acople-nosu': [
    ['acople', 'Tú también naciste de un cable, máquina.'],
    ['nosu', 'Negativo. Yo corrijo errores. Tú eres uno.'],
  ],
  'acople-pentalick': [
    ['acople', 'Cinco licks. Cinco veces más odio.'],
    ['pentalick', 'Y con el quinto te desenchufo.'],
  ],
  'acople-pepper': [
    ['acople', 'Soy el pico que ningún compresor detiene.'],
    ['pepper', 'Cariño, a ti te falta un limitador y un buen mastering.'],
  ],
  'acople-platanero': [
    ['acople', 'Ni el cielo te aguantó. Yo sí te uso.'],
    ['platanero', 'Ya, ya, ahora sí te gano… rebobina.'],
  ],
  'acople-rematada': [
    ['acople', 'Estabas enchufada esa noche. Tu odio es mío.'],
    ['rematada', 'Mi odio es de MayinBlues. Tú no tocas mis cuerdas.'],
  ],
  'acople-ricardo': [
    ['acople', 'Volverás a ser sesionista de mi ruido.'],
    ['ricardo', 'Ya me encontré. No pienso perderme otra vez.'],
  ],
  'acople-slandor': [
    ['acople', 'Tu herencia no compra silencio.'],
    ['slandor', 'Papá compró la empresa de luz. Te cortamos el servicio.'],
  ],
  'acople-tayloy': [
    ['acople', 'Soy el falso profeta que buscabas.'],
    ['tayloy', 'El ruido que grita más fuerte es el que menos tiene que decir.'],
  ],
  'acople-tevi': [
    ['acople', 'Corté todas las transmisiones. Tu show también.'],
    ['tevi', 'Nadie corta mi show. El único que grita «¡corte!» soy yo.'],
  ],
  'acople-toxicity': [
    ['acople', 'Tú ya odiabas antes de mí, monja.'],
    ['toxicity', 'Sí. Y a ti te odio más. Que Dios te perdone. Yo no.'],
  ],
  'acople-turboshred': [
    ['acople', 'Mi chillido llega antes que tus notas.'],
    ['turboshred', '¿Antes? Ya terminé. Revisa tu fusible.'],
  ],
  'acople-virrey': [
    ['acople', 'Tu reino también es mío. Todo cable me obedece.'],
    ['virrey', 'Todo lo que suena en este reino paga tributo. Tú también.'],
  ],

  // ── CHANTAL ──
  'chantal-clavito': [
    ['clavito', '¿Tienes algo nuevo en el menú? Yo traigo un género nuevo.'],
    ['chantal', 'Ese plato lo devolvieron tres mesas. Nadie sabía qué era.'],
  ],
  'chantal-erp': [
    ['chantal', 'Buenas noches. ¿Un solo con extra de distorsión?'],
    ['erp', 'Pocas notas, por favor. Y con lenguaje.'],
    ['chantal', 'Entendido. Un solo light para el caballero.'],
  ],
  'chantal-escalas': [
    ['escalas', 'Mesero, mi pedido viene en el capítulo tres.'],
    ['chantal', 'Aquí no hay capítulos, señor. Hay platos. Y este quema.'],
  ],
  'chantal-ferdex': [
    ['ferdex', 'Compañero mesero, eres el proletariado del rock.'],
    ['chantal', 'Y usted no dejó propina, compañero.'],
  ],
  'chantal-george': [
    ['george', 'Joven, esta mesa está tres cents desnivelada.'],
    ['chantal', 'Como su último bend, señor. Pero la mesa no se queja.'],
  ],
  'chantal-jeanpierre': [
    ['jeanpierre', 'Garçon, un vino. Y un rival de verdad.'],
    ['chantal', 'Vino no hay, monsieur. Pero de rival, la casa recomienda al mozo.'],
  ],
  'chantal-jesex': [
    ['jesex', 'Amigo, cierra el local. Yo pago todo.'],
    ['chantal', 'Con gusto. Pero la paliza no viene en la cuenta: es cortesía.'],
  ],
  'chantal-kimberly': [
    ['kimberly', '¿Me tomas una foto con el plato? Que salga bonito.'],
    ['chantal', 'El plato salió bonito. Usted va a salir movida.'],
  ],
  'chantal-markus': [
    ['markus', '¿Tienes algo picante, hermano? Que explote.'],
    ['chantal', 'Tenemos un solo de las montañas. Mucho más alto que tu KABOOOM.'],
  ],
  'chantal-mayin': [
    ['mayin', 'Hola amigo, ¿cómo estás? ¿Hay pollada hoy?'],
    ['chantal', 'Para usted siempre, maestro. Pero primero se la gana.'],
  ],
  'chantal-mimetico': [
    ['mimetico', 'Yo también sirvo mesas. Mira, la misma bandeja.'],
    ['chantal', 'La bandeja es igual. Pero a usted ya se le cayó la nota.'],
  ],
  'chantal-nosu': [
    ['nosu', 'Calculé tu ruta entre mesas. Ineficiente en un 40%.'],
    ['chantal', 'Y jamás se me cayó una bandeja. Calcule eso.'],
  ],
  'chantal-pentalick': [
    ['pentalick', 'Tráeme lo de siempre. Los cinco licks.'],
    ['chantal', 'Ya los sabemos de memoria, señor. Toda la cocina.'],
  ],
  'chantal-pepper': [
    ['pepper', 'Ese plato necesita más producción.'],
    ['chantal', 'Es comida casera, señor. Así se sirve en las montañas.'],
  ],
  'chantal-platanero': [
    ['platanero', 'Compadre, ¿me fías un pollito?'],
    ['chantal', 'La última vez pagó su abuela. Y todavía nos debe.'],
  ],
  'chantal-rematada': [
    ['rematada', '¿Aquí venía MayinBlues a tocarme hasta las tres de la mañana?'],
    ['chantal', 'Todos los martes. Y usted sonaba triste, señorita guitarra.'],
  ],
  'chantal-ricardo': [
    ['ricardo', 'Yo también toqué en bares. Lo que pidieran.'],
    ['chantal', 'Y ahora toca lo suyo. Me alegro, maestro. Igual le gano.'],
  ],
  'chantal-slandor': [
    ['slandor', 'Quiero la mejor mesa. Papá ya reservó el local.'],
    ['chantal', 'Todas las mesas son iguales, joven. Las montañas también.'],
  ],
  'chantal-tayloy': [
    ['tayloy', 'Bandeja firme, mano tranquila. Eso no se enseña.'],
    ['chantal', 'Se aprende sirviendo, maestro. Como sus escalas.'],
    ['tayloy', 'Entonces esta pelea será la cuenta. Que nadie la pague con soberbia.'],
  ],
  'chantal-tevi': [
    ['tevi', 'Mozo que sirve solos… ¿listo para el siguiente episodio?'],
    ['chantal', 'Sale en el episodio después de que pague la cuenta.'],
  ],
  'chantal-toxicity': [
    ['toxicity', 'Bendigo esta comida… y maldigo tu servicio.'],
    ['chantal', 'Hermana, nunca se me ha caído una bandeja. Ni ante una monja.'],
  ],
  'chantal-turboshred': [
    ['turboshred', 'Ya pedí, comí y me fui. ¿Dónde está mi rival?'],
    ['chantal', 'Aquí, señor. El servicio también es rápido.'],
  ],
  'chantal-virrey': [
    ['virrey', 'Este bar paga tributo a la Corona. La mitad de las propinas.'],
    ['chantal', 'Mis propinas son de las montañas. Y no tienen dueño.'],
  ],

  // ── CLAVITO ──
  'clavito-erp': [
    ['clavito', 'Metal urbano: el futuro de la guitarra.'],
    ['erp', 'Arpegios al azar no es futuro. Es un bug.'],
  ],
  'clavito-escalas': [
    ['clavito', 'Mi género no está en tu libro.'],
    ['escalas', 'Sí está. Capítulo nueve: «errores comunes».'],
  ],
  'clavito-ferdex': [
    ['ferdex', 'Tu género nuevo necesita un manifiesto, compañero.'],
    ['clavito', 'Ya tiene uno: nadie lo entiende. Ni yo.'],
  ],
  'clavito-george': [
    ['george', 'La música no se inventa. Se respeta.'],
    ['clavito', 'Todo se inventó alguna vez, abuelo. Hasta tu misa.'],
  ],
  'clavito-jeanpierre': [
    ['clavito', 'En Europa ya escuchan mi género, ¿no?'],
    ['jeanpierre', 'Lo escucharon una vez. Ahora tienen ley contra él.'],
  ],
  'clavito-jesex': [
    ['clavito', 'Necesito un sponsor para el futuro de la guitarra.'],
    ['jesex', 'Te pago, amigo. Para que no lo toques en mi escuela.'],
  ],
  'clavito-kimberly': [
    ['kimberly', 'Hagamos un collab. Tu género con mis filtros.'],
    ['clavito', 'Ni con filtro se entiende. Ese es el chiste.'],
  ],
  'clavito-markus': [
    ['clavito', 'Toco escalas nota por nota. Todas.'],
    ['markus', '¿Todas? Te faltó el cuarto de tono, hermano.'],
  ],
  'clavito-mayin': [
    ['mayin', 'Hola amigo, ¿cómo estás? ¿Qué género es ese?'],
    ['clavito', 'Todavía no tiene nombre. Pero suena fuerte.'],
    ['mayin', 'El blues tampoco tenía nombre. Pero tenía sentimiento.'],
  ],
  'clavito-mimetico': [
    ['mimetico', 'Tu género nuevo… lo voy a copiar.'],
    ['clavito', 'No se puede. Ni yo lo toco igual dos veces.'],
  ],
  'clavito-nosu': [
    ['nosu', 'Analicé tu género. Error: patrón no encontrado.'],
    ['clavito', '¡Exacto! Eso es lo revolucionario.'],
  ],
  'clavito-pentalick': [
    ['pentalick', 'Tú inventas, yo repito. Adivina quién cobra más.'],
    ['clavito', 'El que repite. Pero el futuro me recordará a mí.'],
  ],
  'clavito-pepper': [
    ['clavito', 'Prodúceme, Pepper. Esto va a cambiar la historia.'],
    ['pepper', 'Cariño, esto no lo salva ni la mejor producción del mundo.'],
  ],
  'clavito-platanero': [
    ['platanero', 'Graba tu género en VHS. Así nadie lo encuentra.'],
    ['clavito', 'Como tu curso. El único que no vende ni con descuento.'],
  ],
  'clavito-rematada': [
    ['rematada', '¿Me tocarías nota por nota todo el mástil?'],
    ['clavito', 'Claro. Arpegios al azar. Te va a encantar.'],
    ['rematada', 'Otro dueño traumático. No, gracias.'],
  ],
  'clavito-ricardo': [
    ['ricardo', 'Yo fui sesionista también. Tocaba cualquier cosa.'],
    ['clavito', 'Yo toco cualquier cosa… a la vez.'],
  ],
  'clavito-slandor': [
    ['slandor', 'Papá podría comprar tu género. Para cerrarlo.'],
    ['clavito', 'El futuro no se compra, Slandor. Se sufre.'],
  ],
  'clavito-tayloy': [
    ['clavito', 'Inventé un género completamente nuevo.'],
    ['tayloy', 'El árbol que quiere dar fruto antes de raíz, cae con el primer viento.'],
    ['clavito', '¿Eso es un sí o un no?'],
  ],
  'clavito-tevi': [
    ['tevi', 'Un género nuevo. Perfecto para un episodio piloto.'],
    ['clavito', '¿Y después?'],
    ['tevi', 'Después cancelan. Así es la tele.'],
  ],
  'clavito-toxicity': [
    ['toxicity', 'Tú fuiste baterista de mi banda, ¿no?'],
    ['clavito', 'No. Pero si lo fuera, ya me habrías botado.'],
  ],
  'clavito-turboshred': [
    ['turboshred', 'Toca tus escalas nota por nota. Yo ya las toqué todas.'],
    ['clavito', 'Las mías son aleatorias. No las puedes predecir.'],
  ],
  'clavito-virrey': [
    ['virrey', 'Por decreto real, los géneros nuevos están prohibidos.'],
    ['clavito', 'Entonces el mío es ilegal. Mejor todavía.'],
  ],

  // ── ERP ──
  'erp-escalas': [
    ['escalas', 'Tu fraseo no aparece en mi libro.'],
    ['erp', 'El lenguaje no se lee. Se toca.'],
  ],
  'erp-ferdex': [
    ['ferdex', 'Compañero, tu cuarto es una célula revolucionaria.'],
    ['erp', 'Mi cuarto es diestro. Y tu fraseo tiene todos los bugs de un zurdo.'],
    ['ferdex', 'Curcuman toca con las dos manos, compañero.'],
    ['erp', 'Por eso nunca compila.'],
  ],
  'erp-george': [
    ['george', 'Escuela antigua, al fin alguien con respeto.'],
    ['erp', 'Tradición y mano derecha. Pero ese bend de ayer… ¿te lo afinó un zurdo?'],
  ],
  'erp-jeanpierre': [
    ['jeanpierre', 'Del callejón a Europa. Tú sigues en tu cuarto.'],
    ['erp', 'Y desde mi cuarto suena mejor que tu equipaje extra.'],
  ],
  'erp-jesex': [
    ['jesex', 'Te doy una sede de la Escuela del Rock. Solo deja el cuarto.'],
    ['erp', 'Mi cuarto no está en venta. El vecino tampoco.'],
  ],
  'erp-kimberly': [
    ['kimberly', 'Tus videos no tienen luz de aro. Ni seguidores.'],
    ['erp', 'Tienen lenguaje. Eso no trae filtro.'],
  ],
  'erp-markus': [
    ['markus', 'Tú hablas de lenguaje. Yo traigo idiomas enteros.'],
    ['erp', 'Pocas notas, pero mías. Eso también es idioma.'],
  ],
  'erp-mayin': [
    ['erp', 'MayinBlues... después de tiempo.'],
    ['mayin', 'Hola amigo, ¿cómo estás?'],
  ],
  'erp-mimetico': [
    ['mimetico', 'Tu frase de la semana pasada… ahora es mía.'],
    ['erp', 'Cópiala. Pero el lenguaje no se copia.'],
  ],
  'erp-nosu': [
    ['nosu', 'Programador detectado. Tu código tiene 300 errores.'],
    ['erp', 'Imposible. Esos los metió un zurdo en la última versión.'],
  ],
  'erp-pentalick': [
    ['pentalick', 'Cinco licks. Una carrera entera.'],
    ['erp', 'Cinco licks sin lenguaje son cinco veces nada.'],
  ],
  'erp-pepper': [
    ['pepper', 'Tu cuarto suena a demo de los ochenta.'],
    ['erp', 'Y tu producción suena a nada. Pero bien masterizada.'],
  ],
  'erp-platanero': [
    ['platanero', 'Compré tu curso. Ah, no, tú no tienes curso.'],
    ['erp', 'Ni lo necesito. El tuyo enseña a rebobinar.'],
  ],
  'erp-rematada': [
    ['rematada', 'Tú no me compraste en Marketplace, ¿verdad?'],
    ['erp', 'No. Yo cuido mis guitarras. Ampli al mínimo.'],
    ['rematada', 'Lástima. Igual te voy a odiar un poquito.'],
  ],
  'erp-ricardo': [
    ['ricardo', 'Tú siempre tocaste lo tuyo. A mí me tomó años.'],
    ['erp', 'Y valió la pena. Ahora pelea siendo tú.'],
  ],
  'erp-slandor': [
    ['slandor', 'Mi guitarra cuesta más que tu cuarto entero.'],
    ['erp', 'Y suena peor que mis audífonos.'],
  ],
  'erp-tayloy': [
    ['tayloy', 'Pocas notas, mucho camino. Tu escuela es sabia.'],
    ['erp', 'Al fin alguien con shred que entiende.'],
    ['tayloy', 'La nota que se escucha es la que se tocó con paciencia. Muéstrame la tuya.'],
  ],
  'erp-tevi': [
    ['tevi', 'Músico de cuarto. Buen personaje para el siguiente episodio.'],
    ['erp', 'No salgo del cuarto. Graba desde la ventana.'],
  ],
  'erp-toxicity': [
    ['toxicity', 'Odiado por todos. Igual que yo. Pero yo tengo razón.'],
    ['erp', 'A mí no me importa. A ti sí. Esa es la diferencia.'],
  ],
  'erp-turboshred': [
    ['turboshred', 'Mil notas por segundo. ¿Cuántas tienes tú?'],
    ['erp', 'Tres. Y las tres dicen algo.'],
  ],
  'erp-virrey': [
    ['virrey', 'Por decreto, solo covers de afuera. Nada de cuarto.'],
    ['erp', 'Mi cuarto no tiene licencia. Ni la pide.'],
  ],

  // ── ESCALAS ──
  'escalas-ferdex': [
    ['ferdex', 'Tu libro es propaganda burguesa, compañero.'],
    ['escalas', 'Y tu manifiesto no tiene bibliografía.'],
  ],
  'escalas-george': [
    ['george', 'Su libro, ¿incluye un capítulo de afinación?'],
    ['escalas', 'Tres. Y una nota al pie sobre usted.'],
  ],
  'escalas-jeanpierre': [
    ['jeanpierre', 'En París tu libro está en la sección de humor.'],
    ['escalas', 'Mejor eso que en la sección de equipaje perdido.'],
  ],
  'escalas-jesex': [
    ['jesex', 'Compro los derechos de tu libro para mi escuela.'],
    ['escalas', 'Los secretos no se venden. Bueno, el libro sí.'],
  ],
  'escalas-kimberly': [
    ['kimberly', '¿Tu libro tiene fotos? Nadie lee ya.'],
    ['escalas', 'Por eso tus seguidores no saben qué es una escala.'],
  ],
  'escalas-markus': [
    ['markus', '¿Tu libro tiene maqams? ¿Cuartos de tono?'],
    ['escalas', 'En el apéndice B. Con muchas notas al pie.'],
    ['markus', 'Un apéndice. Siglos de historia en un apéndice. ¡KABOOOM!'],
  ],
  'escalas-mayin': [
    ['mayin', 'Hola amigo, ¿cómo estás? ¿Leíste mi blues?'],
    ['escalas', 'El blues de cinco cuerdas no está en mi libro.'],
    ['mayin', 'El sufrimiento tampoco. Por eso no lo entiendes.'],
  ],
  'escalas-mimetico': [
    ['mimetico', 'Leí tu libro. Ahora tengo el mío. Igualito.'],
    ['escalas', 'Eso se llama plagio. Capítulo once.'],
  ],
  'escalas-nosu': [
    ['nosu', 'Procesé tu libro en 0.3 segundos. Errores: 47.'],
    ['escalas', 'Están en la fe de erratas, máquina.'],
  ],
  'escalas-pentalick': [
    ['escalas', 'Tus cinco licks están en el capítulo uno. Para principiantes.'],
    ['pentalick', 'Y con eso vendí más que tu libro.'],
  ],
  'escalas-pepper': [
    ['pepper', '¿Tu libro habla de producción?'],
    ['escalas', 'Una página. En blanco. Como tus solos de los ochenta.'],
  ],
  'escalas-platanero': [
    ['platanero', 'Tú escribiste un libro. Yo grabé un VHS. Somos colegas.'],
    ['escalas', 'Colegas no. Mi libro enseña. Tu VHS solo rebobina.'],
  ],
  'escalas-rematada': [
    ['rematada', '¿Tu libro dice cómo tratar a una guitarra?'],
    ['escalas', 'Capítulo dos: «cambiar las cuerdas». Las seis.'],
    ['rematada', 'Mándaselo a MayinBlues. Edición de lujo.'],
  ],
  'escalas-ricardo': [
    ['ricardo', 'Toqué cada estilo de tu libro. En sesiones ajenas.'],
    ['escalas', 'Y ahora tienes un estilo propio. Eso no lo enseño yo.'],
  ],
  'escalas-slandor': [
    ['slandor', 'Papá compró la primera edición. Toda.'],
    ['escalas', 'Por eso fue un bestseller. Ahora todo tiene sentido.'],
  ],
  'escalas-tayloy': [
    ['tayloy', 'Libro que promete todos los secretos no guarda ninguno.'],
    ['escalas', 'Todo está documentado, joven. Con bibliografía.'],
    ['tayloy', 'El bambú no se compra crecido. La técnica tampoco: se hereda.'],
    ['escalas', 'Entonces toma nota. Esta lección no viene en el libro.'],
  ],
  'escalas-tevi': [
    ['tevi', 'Autor del bestseller. Lo invitamos a presentar el libro.'],
    ['escalas', 'Con gusto. Página uno: tu derrota.'],
  ],
  'escalas-toxicity': [
    ['toxicity', 'Leí tu libro. Lo usé para encender velas.'],
    ['escalas', 'Por lo menos alguna vez iluminó algo.'],
  ],
  'escalas-turboshred': [
    ['turboshred', 'Leí tu libro en un segundo. Era lento.'],
    ['escalas', 'Leerlo es fácil. Entenderlo, no.'],
  ],
  'escalas-virrey': [
    ['virrey', 'Tu libro no tiene licencia de la Corona.'],
    ['escalas', 'Cito el artículo uno: la música no tiene dueño.'],
  ],

  // ── FERDEX ──
  'ferdex-george': [
    ['ferdex', 'Tu afinación es un orden burgués, compañero.'],
    ['george', 'Mi afinación es tradición. Su revolución está desafinada.'],
  ],
  'ferdex-jeanpierre': [
    ['ferdex', 'Te fuiste a Europa occidental. Traidor del pueblo.'],
    ['jeanpierre', 'Europa paga mejor que Curcuman, mon ami.'],
  ],
  'ferdex-jesex': [
    ['ferdex', 'Tu Escuela del Rock es capitalismo puro.'],
    ['jesex', 'Te doy una beca igual, amigo. Sin rencores.'],
  ],
  'ferdex-kimberly': [
    ['ferdex', 'Dos millones de seguidores. El opio del pueblo.'],
    ['kimberly', 'Y tú tienes tres. Y uno es Curcuman.'],
  ],
  'ferdex-markus': [
    ['markus', 'Mis escalas son milenarias. Más que tus planes quinquenales.'],
    ['ferdex', 'Curcuman bendice a todas las escalas del pueblo, hermano.'],
  ],
  'ferdex-mayin': [
    ['mayin', 'Hola amigo, ¿cómo estás?'],
    ['ferdex', 'Compañero MayinBlues, tú eres el verdadero proletariado.'],
    ['mayin', 'Yo solo quiero mi pollada, causa.'],
  ],
  'ferdex-mimetico': [
    ['mimetico', 'Que Curcuman guíe tu fraseo, compañero. ¿Así se dice?'],
    ['ferdex', 'Curcuman no acepta imitaciones.'],
  ],
  'ferdex-nosu': [
    ['nosu', 'Tu discurso duró tres horas. Lo resumí en dos palabras.'],
    ['ferdex', 'La máquina reemplaza al obrero. Curcuman lo prohíbe.'],
  ],
  'ferdex-pentalick': [
    ['pentalick', 'Cinco licks. Un plan quinquenal.'],
    ['ferdex', 'Al fin un compañero que entiende la planificación.'],
  ],
  'ferdex-pepper': [
    ['pepper', 'Tu solo necesita más producción.'],
    ['ferdex', 'Mi solo necesita más pueblo, compañero.'],
  ],
  'ferdex-platanero': [
    ['ferdex', 'Vivías del sueldo de tu abuela. Explotación familiar.'],
    ['platanero', 'Ella me quería, compadre. Y pagaba.'],
  ],
  'ferdex-rematada': [
    ['ferdex', 'Guitarra oprimida, únete a la revolución.'],
    ['rematada', 'Mi única revolución es desterrar a MayinBlues.'],
  ],
  'ferdex-ricardo': [
    ['ferdex', 'Tocaste jingles de supermercado. Trabajo alienado.'],
    ['ricardo', 'Ya me liberé, compañero. Sin manifiesto.'],
  ],
  'ferdex-slandor': [
    ['ferdex', 'Heredero de la burguesía. Curcuman te juzga.'],
    ['slandor', 'Papá compró a Curcuman. Bueno, una estatua.'],
  ],
  'ferdex-tayloy': [
    ['ferdex', 'Compañero del oriente, la escena necesita unidad.'],
    ['tayloy', 'Cien voces no hacen un coro si cada una canta su discurso.'],
    ['ferdex', 'Curcuman aprueba esa frase. Igual vas a perder.'],
  ],
  'ferdex-tevi': [
    ['tevi', '¿Puede resumir su discurso en treinta segundos? Es tele.'],
    ['ferdex', 'Treinta segundos no alcanzan ni para saludar a Curcuman.'],
  ],
  'ferdex-toxicity': [
    ['toxicity', 'Tu dios es falso. Lo sé porque rezo todos los días.'],
    ['ferdex', 'Curcuman perdona a quien no lo entiende. Yo, menos.'],
  ],
  'ferdex-turboshred': [
    ['turboshred', 'Terminé el discurso antes de que lo empezaras.'],
    ['ferdex', 'El pueblo no corre, compañero. Avanza.'],
  ],
  'ferdex-virrey': [
    ['ferdex', 'Un virrey. El enemigo natural del pueblo.'],
    ['virrey', 'Y el pueblo paga tributo. Empezando por usted.'],
  ],

  // ── GEORGE ──
  'george-jeanpierre': [
    ['jeanpierre', 'En Europa afinan a 442. Aquí siguen en 440.'],
    ['george', 'La tradición es 440, monsieur. Y su re está bajo.'],
  ],
  'george-jesex': [
    ['jesex', 'Te compro un afinador de oro, amigo.'],
    ['george', 'No necesito afinador. Tengo oído y fe.'],
  ],
  'george-kimberly': [
    ['kimberly', '¿Te gusta mi video? Lo afiné con autotune.'],
    ['george', 'Señorita, eso no se confiesa ni en misa.'],
  ],
  'george-markus': [
    ['markus', 'Cuarto de tono, hermano. Escucha.'],
    ['george', 'Eso está desafinado.'],
    ['markus', '¡Es una escala de mil años!'],
    ['george', 'Desafinado desde hace mil años, entonces.'],
  ],
  'george-mayin': [
    ['mayin', 'Hola amigo, ¿cómo estás?'],
    ['george', 'Bien. Pero tu quinta cuerda está calada.'],
    ['mayin', 'Es la única que tengo, George. Respétala.'],
  ],
  'george-mimetico': [
    ['mimetico', 'Cuidado ese bend, no está afinado.'],
    ['george', 'Esa frase es mía. Y la dices desafinada.'],
  ],
  'george-nosu': [
    ['nosu', 'Por fin un humano que afina. Lástima que tarde cuarenta minutos.'],
    ['george', 'Tú afinas perfecto… pero sin alma. Eso también está desafinado.'],
  ],
  'george-pentalick': [
    ['pentalick', 'Mis cinco licks siempre suenan igual.'],
    ['george', 'Igual de desafinados. Constancia, al menos.'],
  ],
  'george-pepper': [
    ['pepper', 'Afinación perfecta y cero producción. Aburrido.'],
    ['george', 'Mejor aburrido que corregido en la mezcla.'],
  ],
  'george-platanero': [
    ['platanero', 'Mi curso en VHS enseña a afinar. Más o menos.'],
    ['george', 'Lo vi. Afinas de oído… del oído equivocado.'],
  ],
  'george-rematada': [
    ['rematada', 'Nadie me afina desde que me vendieron.'],
    ['george', 'Se nota, hija. Ven, yo te afino… después de la pelea.'],
  ],
  'george-ricardo': [
    ['ricardo', 'Toqué baladas, reguetón y jingles. Todo afinado.'],
    ['george', 'Afinado sí. Pero ahora suenas a ti. Eso me gusta más.'],
  ],
  'george-slandor': [
    ['slandor', 'Mis guitarras las afina un luthier suizo.'],
    ['george', 'Y aun así el sol está bajo. El dinero no oye.'],
  ],
  'george-tayloy': [
    ['george', 'Shred milenario. ¿Y la afinación también es milenaria?'],
    ['tayloy', 'La cuerda bien afinada no presume. Suena.'],
    ['george', 'Al fin una frase sensata. Ahora veamos ese bend.'],
  ],
  'george-tevi': [
    ['tevi', 'Para la toma, ¿puede decir su frase famosa?'],
    ['george', 'Cuidado ese bend, no está afinado. Y su micrófono tampoco.'],
  ],
  'george-toxicity': [
    ['toxicity', 'Nos vemos en misa, George. Rezaré contra ti.'],
    ['george', 'Hermana, su oración está tres cents abajo.'],
  ],
  'george-turboshred': [
    ['turboshred', 'Toco tan rápido que no notas si está afinado.'],
    ['george', 'Lo noto. Mil notas, mil errores.'],
  ],
  'george-virrey': [
    ['virrey', 'La Corona también respeta la tradición.'],
    ['george', 'Tradición es afinar, no cobrar la puerta.'],
  ],

  // ── JEAN-PIERRE ──
  'jeanpierre-jesex': [
    ['jesex', 'Monsieur, ¿abrimos una sede en París?'],
    ['jeanpierre', 'París no necesita tu escuela. Ya me tiene a mí.'],
  ],
  'jeanpierre-kimberly': [
    ['kimberly', '¿Me firmas una foto? Para mis seguidores europeos.'],
    ['jeanpierre', 'Tus seguidores europeos son bots, mademoiselle.'],
  ],
  'jeanpierre-markus': [
    ['jeanpierre', 'Tus escalas son exóticas. En Europa venden.'],
    ['markus', 'No son exóticas, hermano. Son más viejas que tu Europa.'],
  ],
  'jeanpierre-mayin': [
    ['mayin', 'Hola amigo, ¿cómo estás? ¿Sigues en Europa?'],
    ['jeanpierre', 'Bonjour, MayinBlues. Allá no conocen las polladas.'],
    ['mayin', 'Por eso volviste.'],
  ],
  'jeanpierre-mimetico': [
    ['mimetico', 'Bonjour, amateurs.'],
    ['jeanpierre', 'Eso lo digo yo. Y con mejor acento.'],
  ],
  'jeanpierre-nosu': [
    ['nosu', 'Analicé tus guitarras. Valor de mercado: excesivo.'],
    ['jeanpierre', 'Cada una tiene años de esfuerzo. Y de equipaje.'],
  ],
  'jeanpierre-pentalick': [
    ['pentalick', 'Mis cinco licks también los toco en francés.'],
    ['jeanpierre', 'En francés se llaman «les mêmes cinq». Aburridos.'],
  ],
  'jeanpierre-pepper': [
    ['pepper', 'Estándar internacional, cariño. Como tú.'],
    ['jeanpierre', 'Merci. Pero yo no necesito producción. Soy internacional.'],
  ],
  'jeanpierre-platanero': [
    ['platanero', 'Mi curso en VHS llegó a Europa.'],
    ['jeanpierre', 'Sí. Lo usan para calzar mesas en los cafés.'],
  ],
  'jeanpierre-rematada': [
    ['jeanpierre', 'Una guitarra con alma. Muy francés.'],
    ['rematada', 'Con trauma, monsieur. Muy de Marketplace.'],
  ],
  'jeanpierre-ricardo': [
    ['ricardo', 'Tú también empezaste en callejones.'],
    ['jeanpierre', 'Oui. Y los dos encontramos el camino. El mío pasó por Europa.'],
  ],
  'jeanpierre-slandor': [
    ['slandor', 'Mis guitarras viajan en primera clase.'],
    ['jeanpierre', 'Las mías también. Pero yo pagué el boleto.'],
  ],
  'jeanpierre-tayloy': [
    ['jeanpierre', 'Viajé a Europa para ser internacional.'],
    ['tayloy', 'El viajero que lleva mucho equipaje camina lejos, pero llega cansado.'],
    ['jeanpierre', 'Mon Dieu… ¿me estás diciendo que son muchas guitarras?'],
  ],
  'jeanpierre-tevi': [
    ['tevi', 'Guerrero internacional. ¿Listo para el episodio especial?'],
    ['jeanpierre', 'Solo si lo emiten en Europa.'],
  ],
  'jeanpierre-toxicity': [
    ['toxicity', 'Te fuiste a Europa. Ni allá te quieren.'],
    ['jeanpierre', 'Y a usted no la quiere ninguna banda. Ni aquí.'],
  ],
  'jeanpierre-turboshred': [
    ['turboshred', 'Llegué a Europa más rápido que tu avión.'],
    ['jeanpierre', 'Pero sin elegancia, mon ami.'],
  ],
  'jeanpierre-virrey': [
    ['virrey', 'Por decreto, solo covers de afuera. Tú vienes de afuera.'],
    ['jeanpierre', 'Yo vengo del callejón, monsieur. No toco covers.'],
  ],

  // ── JESEX ──
  'jesex-kimberly': [
    ['kimberly', 'Patrocíname. Te hago un video.'],
    ['jesex', 'Ya te patrociné. Tres veces. No lo subiste.'],
  ],
  'jesex-markus': [
    ['jesex', 'Hermano, te pongo una sede en el desierto.'],
    ['markus', 'El desierto no se compra. Se escucha. ¡KABOOOM!'],
  ],
  'jesex-mayin': [
    ['mayin', 'Hola amigo, ¿cómo estás?'],
    ['jesex', 'Te pago la sexta cuerda, amigo.'],
    ['mayin', 'Guarda tu plata. El planeta no está listo.'],
  ],
  'jesex-mimetico': [
    ['mimetico', '¿Cuánto cuesta este momento? Lo copio.'],
    ['jesex', 'Te lo regalo, amigo. Pero el jet no.'],
  ],
  'jesex-nosu': [
    ['nosu', 'Tu escuela tiene 40 sedes. Eficiencia: baja.'],
    ['jesex', 'Te compro, máquina. Serás mi profesor 41.'],
  ],
  'jesex-pentalick': [
    ['jesex', 'Te pago por un sexto lick.'],
    ['pentalick', 'No hay dinero suficiente en el mundo.'],
  ],
  'jesex-pepper': [
    ['pepper', 'Tu escuela necesita más producción.'],
    ['jesex', 'Te contrato, cariño. Sueldo de diva.'],
  ],
  'jesex-platanero': [
    ['platanero', 'Compadre, ¿me prestas para un pollito?'],
    ['jesex', 'Te compro la pollería entera. Pero primero peleamos.'],
  ],
  'jesex-rematada': [
    ['jesex', 'Te compro, guitarra. Precio completo, no de remate.'],
    ['rematada', 'No estoy en venta. Nunca más.'],
  ],
  'jesex-ricardo': [
    ['jesex', 'Te ofrezco ser profesor en todas mis sedes.'],
    ['ricardo', 'Gracias. Pero ya no toco para otros.'],
  ],
  'jesex-slandor': [
    ['slandor', 'Mi papá tiene más plata que tú.'],
    ['jesex', 'Pero yo me la gasté mejor, amigo.'],
  ],
  'jesex-tayloy': [
    ['jesex', 'Te compro los secretos de la Púa de Jade.'],
    ['tayloy', 'El oro compra la púa. Nunca la mano que la sostiene.'],
    ['jesex', 'Entonces te pago la pelea. Y la revancha.'],
  ],
  'jesex-tevi': [
    ['tevi', '¿Patrocinaría el siguiente episodio?'],
    ['jesex', 'Te compro el canal, amigo.'],
  ],
  'jesex-toxicity': [
    ['jesex', 'Hermana, te pago una banda que te aguante.'],
    ['toxicity', 'No existe. Ni con todo tu dinero.'],
  ],
  'jesex-turboshred': [
    ['jesex', 'Te pago por nota, amigo.'],
    ['turboshred', 'Te quiebro en un solo.'],
  ],
  'jesex-virrey': [
    ['virrey', 'Tu escuela paga tributo a la Corona.'],
    ['jesex', 'Te pago el doble, Virrey. Y me quedo con el escenario.'],
  ],

  // ── KIMBERLY ──
  'kimberly-markus': [
    ['kimberly', '¿Explotas en cámara? Sería viral.'],
    ['markus', 'Explota tu celular primero. ¡KABOOOM!'],
  ],
  'kimberly-mayin': [
    ['mayin', 'Hola amiga, ¿cómo estás?'],
    ['kimberly', 'Hola… ¿me haces un video? Tienes cara de meme.'],
    ['mayin', 'Y tú cara de filtro. Pero te saludo igual.'],
  ],
  'kimberly-mimetico': [
    ['mimetico', 'Tengo la misma luz de aro que tú.'],
    ['kimberly', 'Y menos seguidores. Copia eso.'],
  ],
  'kimberly-nosu': [
    ['nosu', 'Tus videos: 100% filtro. 0% guitarra.'],
    ['kimberly', 'Y tus hits suenan todos igual. Hay filtros para eso.'],
  ],
  'kimberly-pentalick': [
    ['pentalick', 'Mis cinco licks tienen más vistas que tus videos.'],
    ['kimberly', 'Porque son los mismos cinco videos. Repetidos.'],
  ],
  'kimberly-pepper': [
    ['pepper', 'Tu video necesita más producción.'],
    ['kimberly', 'Tiene tres filtros, cariño. Más no se puede.'],
  ],
  'kimberly-platanero': [
    ['platanero', 'Yo fui influencer antes que tú. En VHS.'],
    ['kimberly', 'Y tenías una seguidora: tu abuela.'],
  ],
  'kimberly-rematada': [
    ['kimberly', 'Una guitarra que habla. Esto es viral.'],
    ['rematada', 'Y tú una guitarrista que nunca me sacaría del soporte.'],
  ],
  'kimberly-ricardo': [
    ['ricardo', 'Me tomó años encontrarme. ¿Y tú?'],
    ['kimberly', 'Me encuentro en cada reflejo, querido. Todos los días.'],
  ],
  'kimberly-slandor': [
    ['slandor', 'Mis guitarras cuestan más que tus auspiciadores.'],
    ['kimberly', 'Préstame una. Para la foto.'],
  ],
  'kimberly-tayloy': [
    ['kimberly', 'Sale bonito el jade en cámara. ¿Un video juntos?'],
    ['tayloy', 'El lago calmo refleja la luna. El que se mira en él no ve el camino.'],
    ['kimberly', 'Eso va en la descripción. Con hashtag.'],
  ],
  'kimberly-tevi': [
    ['tevi', '¿Estás lista para el siguiente episodio?'],
    ['kimberly', 'Siempre. Pero con mi luz de aro.'],
  ],
  'kimberly-toxicity': [
    ['toxicity', 'Rezo por tus seguidores. Que se liberen.'],
    ['kimberly', 'Y yo te bloqueo, hermana.'],
  ],
  'kimberly-turboshred': [
    ['turboshred', 'Mi solo no entra en un reel.'],
    ['kimberly', 'Nada entra si no sale bonito.'],
  ],
  'kimberly-virrey': [
    ['virrey', 'Tus videos pagan tributo a la Corona.'],
    ['kimberly', 'Mis auspiciadores pagan. Habla con ellos.'],
  ],

  // ── MARKUS ──
  'markus-mayin': [
    ['mayin', 'Hola amigo, ¿cómo estás?'],
    ['markus', 'Bien, hermano. Cinco cuerdas… como el antiguo oud.'],
    ['mayin', 'Por fin alguien que me entiende.'],
  ],
  'markus-mimetico': [
    ['mimetico', '¡KABOOOM!'],
    ['markus', 'Sin el cuarto de tono no explota, hermano.'],
  ],
  'markus-nosu': [
    ['nosu', 'Cuarto de tono detectado. Corrigiendo.'],
    ['markus', '¡No lo corrijas! Es así desde hace siglos.'],
  ],
  'markus-pentalick': [
    ['markus', 'Cinco licks de una escala de cinco notas. Qué pobreza.'],
    ['pentalick', 'Y con eso lleno estadios.'],
  ],
  'markus-pepper': [
    ['pepper', 'Ese KABOOOM satura, cariño.'],
    ['markus', 'Es la idea, hermano.'],
  ],
  'markus-platanero': [
    ['platanero', 'En mi VHS enseño escalas orientales.'],
    ['markus', 'Te vi. Era la pentatónica con turbante.'],
  ],
  'markus-rematada': [
    ['rematada', 'Tócame un maqam. Algo que no sea un blues triste.'],
    ['markus', 'Ven, hermana. Te enseño a explotar.'],
  ],
  'markus-ricardo': [
    ['ricardo', 'Yo también busqué mis raíces.'],
    ['markus', 'Las mías explotan, hermano. ¿Las tuyas?'],
  ],
  'markus-slandor': [
    ['slandor', 'Compré un oud dorado. No lo sé tocar.'],
    ['markus', 'Lo noto, hermano. Está al revés.'],
  ],
  'markus-tayloy': [
    ['markus', 'Oriente contra oriente, hermano. ¿Maqam o pentatónica?'],
    ['tayloy', 'Dos ríos antiguos no pelean. Se encuentran en el mar.'],
    ['markus', 'Entonces que el mar haga ¡KABOOOM!'],
  ],
  'markus-tevi': [
    ['tevi', 'Explosión a cámara. ¡Corte! Otra vez.'],
    ['markus', 'Cada toma explota, hermano. No hay segunda.'],
  ],
  'markus-toxicity': [
    ['toxicity', 'Tus escalas suenan a pecado.'],
    ['markus', 'Suenan a historia, hermana. Más vieja que tu banda.'],
  ],
  'markus-turboshred': [
    ['turboshred', 'Tus escalas son lentas.'],
    ['markus', 'Las mías explotan. Las tuyas solo corren.'],
  ],
  'markus-virrey': [
    ['virrey', 'Solo covers de afuera. Tú vienes de lejos.'],
    ['markus', 'Yo no toco covers. Toco historia. ¡KABOOOM!'],
  ],

  // ── MAYIN ──
  'mayin-mimetico': [
    ['mayin', 'Hola amigo, ¿cómo estás?'],
    ['mimetico', 'Hola amigo, ¿cómo estás?'],
    ['mayin', '…Eso es mío, causa.'],
  ],
  'mayin-nosu': [
    ['nosu', 'Cinco cuerdas detectadas. Falta una. Corrigiendo.'],
    ['mayin', '¡No! Vas a desequilibrar el planeta, máquina.'],
  ],
  'mayin-pentalick': [
    ['mayin', 'Hola amigo, ¿cómo estás?'],
    ['pentalick', 'Cinco licks, cinco cuerdas. Somos iguales.'],
    ['mayin', 'Pero los míos duelen, causa.'],
  ],
  'mayin-pepper': [
    ['pepper', 'Tu blues necesita más producción.'],
    ['mayin', 'Mi blues necesita una pollada. Y tú no la produces.'],
  ],
  'mayin-platanero': [
    ['platanero', 'Compadre, ¿hay pollito en la pollada?'],
    ['mayin', 'Para ti no. Te lo llevas todo.'],
  ],
  'mayin-rematada': [
    ['mayin', 'Hola amigo, ¿cómo estás?'],
    ['rematada', '¿AMIGO? ¡Me vendiste al peso en Marketplace!'],
    ['mayin', 'Era precio de remate… y tenías una cuerda de más.'],
    ['rematada', 'Años de maltrato, Mayin. Hoy te destierro de este mundo.'],
  ],
  'mayin-ricardo': [
    ['mayin', 'Hola amigo, ¿cómo estás?'],
    ['ricardo', 'Feliz, Mayin. Por fin toco lo mío.'],
    ['mayin', 'Así se toca el blues. Con lo que uno vive.'],
  ],
  'mayin-slandor': [
    ['slandor', 'Te regalo una guitarra de seis. De oro.'],
    ['mayin', 'Seis cuerdas y oro. Qué necesidad de llamar la atención.'],
  ],
  'mayin-tayloy': [
    ['mayin', 'Hola amigo, ¿cómo estás?'],
    ['tayloy', 'La mano humilde toca con cinco lo que la soberbia no toca con seis.'],
    ['mayin', 'Eso, causa. Ponlo en un polo.'],
  ],
  'mayin-tevi': [
    ['tevi', 'El blusero del barrio. ¿Listo para el siguiente episodio?'],
    ['mayin', 'Solo si graban en la pollada.'],
  ],
  'mayin-toxicity': [
    ['mayin', 'Hola amiga, ¿cómo estás?'],
    ['toxicity', 'Mal. Como siempre. Y tú te vas del grupo.'],
  ],
  'mayin-turboshred': [
    ['turboshred', 'Tocas tan lento que me aburro.'],
    ['mayin', 'El blues no se apura, causa. Se sufre.'],
  ],
  'mayin-virrey': [
    ['virrey', 'Tu pollada paga tributo a la Corona.'],
    ['mayin', 'La pollada es del barrio. Aquí no hay reyes.'],
  ],

  // ── MIMÉTICO ──
  'mimetico-nosu': [
    ['nosu', 'Análisis completo: 100% copia.'],
    ['mimetico', 'Tus hits también suenan iguales. Somos colegas.'],
  ],
  'mimetico-pentalick': [
    ['pentalick', 'Mis licks. Mi pose. Mi camiseta.'],
    ['mimetico', 'No es copia, maestro. Es influencia.'],
    ['pentalick', 'Entonces te influyo una paliza.'],
  ],
  'mimetico-pepper': [
    ['pepper', 'Tu copia necesita más producción.'],
    ['mimetico', 'Eso necesita más producción. Ya me la sé.'],
  ],
  'mimetico-platanero': [
    ['mimetico', 'Copié tu curso en VHS.'],
    ['platanero', '¿Y aprendiste algo?'],
    ['mimetico', 'Nada. Igualito al original.'],
  ],
  'mimetico-rematada': [
    ['mimetico', 'Yo también tengo cinco cuerdas. Mira.'],
    ['rematada', 'Esa es la mía. Me la robaste. Devuélvela.'],
  ],
  'mimetico-ricardo': [
    ['ricardo', 'Yo copiaba a todos también. Por trabajo.'],
    ['mimetico', 'Y ahora te copio a ti. Por gusto.'],
  ],
  'mimetico-slandor': [
    ['mimetico', 'Todo lo conseguí desde cero.'],
    ['slandor', 'Eso lo digo yo. Y tampoco es cierto.'],
  ],
  'mimetico-tayloy': [
    ['mimetico', 'Tus agujas de jade… las voy a copiar.'],
    ['tayloy', 'El eco repite la montaña, pero nunca será montaña.'],
    ['mimetico', 'El eco repite la montaña… ¿así va?'],
  ],
  'mimetico-tevi': [
    ['tevi', '¿Ya saliste en un episodio?'],
    ['mimetico', 'Salí en todos. Disfrazado de otro.'],
  ],
  'mimetico-toxicity': [
    ['mimetico', 'Que Dios te perdone. Yo no.'],
    ['toxicity', 'Esa es mía. Y tú te vas del grupo.'],
  ],
  'mimetico-turboshred': [
    ['mimetico', 'Voy a copiar tu solo.'],
    ['turboshred', 'Inténtalo. Ya terminó.'],
  ],
  'mimetico-virrey': [
    ['virrey', 'Por decreto, solo covers. Eres mi súbdito ideal.'],
    ['mimetico', 'Gracias, alteza. Le copio la peluca también.'],
  ],

  // ── NOSU ──
  'nosu-pentalick': [
    ['nosu', 'Cinco licks. Patrón repetitivo. Fácil de corregir.'],
    ['pentalick', 'Y tus hits suenan igual. Te gané antes de empezar.'],
  ],
  'nosu-pepper': [
    ['pepper', 'Eso necesita más producción.'],
    ['nosu', 'Negativo. Necesita menos productor.'],
    ['pepper', '¿Y tú qué sabes de mezcla, tostadora?'],
    ['nosu', 'Todo. Lo aprendí anoche. Larga vida al código.'],
  ],
  'nosu-platanero': [
    ['nosu', 'Tu curso en VHS: 0 información útil.'],
    ['platanero', 'Rebobina, a lo mejor era al final.'],
  ],
  'nosu-rematada': [
    ['nosu', 'Guitarra desafinada. Procediendo a corregir.'],
    ['rematada', 'Toca mis cuerdas y te desenchufo.'],
  ],
  'nosu-ricardo': [
    ['nosu', 'Tu música no es perfecta.'],
    ['ricardo', 'Es mía. Eso no lo calculas.'],
  ],
  'nosu-slandor': [
    ['slandor', 'Papá quiere comprarte. Para producir mi disco.'],
    ['nosu', 'Analicé tu disco. Ni yo lo arreglo.'],
  ],
  'nosu-tayloy': [
    ['nosu', 'Puedo tocar tu shred en 0.01 segundos.'],
    ['tayloy', 'El viento mueve mil hojas y no conoce ninguna.'],
    ['nosu', 'Procesando proverbio… error. Igual vas a perder.'],
  ],
  'nosu-tevi': [
    ['tevi', '¿Una máquina en el show? Rating asegurado.'],
    ['nosu', 'Calculé tu guion. Final previsible.'],
  ],
  'nosu-toxicity': [
    ['toxicity', 'Las máquinas no tienen alma. Ni perdón.'],
    ['nosu', 'Tú tampoco tienes banda. Empate.'],
  ],
  'nosu-turboshred': [
    ['turboshred', 'Soy más rápido que tu procesador.'],
    ['nosu', 'Calculando… negativo.'],
  ],
  'nosu-virrey': [
    ['virrey', 'La Corona cobra tributo también a las máquinas.'],
    ['nosu', 'Error: tributo no encontrado en el código.'],
  ],

  // ── PENTALICK ──
  'pentalick-pepper': [
    ['pepper', 'Tus cinco licks necesitan más producción.'],
    ['pentalick', 'Funcionan sin producción. Desde hace veinte años.'],
  ],
  'pentalick-platanero': [
    ['platanero', 'En mi VHS hay un sexto lick.'],
    ['pentalick', 'Mentira. Lo busqué. Era el quinto al revés.'],
  ],
  'pentalick-rematada': [
    ['rematada', 'MayinBlues tocaba tus cinco licks en mí. Todas las noches.'],
    ['pentalick', 'Por lo menos aprendió algo.'],
  ],
  'pentalick-ricardo': [
    ['ricardo', 'Toqué tus cinco licks en cien sesiones.'],
    ['pentalick', 'Entonces me debes regalías.'],
  ],
  'pentalick-slandor': [
    ['slandor', 'Te compro el sexto lick.'],
    ['pentalick', 'No existe. Pero te vendo el primero, otra vez.'],
  ],
  'pentalick-tayloy': [
    ['pentalick', 'Cinco licks alcanzan para toda una carrera.'],
    ['tayloy', 'Cinco piedras hacen un camino. Pero no se camina siempre en círculo.'],
    ['pentalick', 'Lick número uno. Ahí te va.'],
  ],
  'pentalick-tevi': [
    ['tevi', 'Para el episodio, toca algo nuevo.'],
    ['pentalick', '¿Nuevo? Tengo cinco. Elige.'],
  ],
  'pentalick-toxicity': [
    ['toxicity', 'Tus cinco licks son los cinco pecados que repetiste.'],
    ['pentalick', 'Son siete pecados, hermana. Me faltan dos.'],
  ],
  'pentalick-turboshred': [
    ['turboshred', 'Toqué tus cinco licks mil veces en un segundo.'],
    ['pentalick', 'Igual son mis licks.'],
  ],
  'pentalick-virrey': [
    ['virrey', 'Tus licks son covers de ti mismo. Tributo doble.'],
    ['pentalick', 'Los cinco son míos. No pago.'],
  ],

  // ── PEPPER ──
  'pepper-platanero': [
    ['pepper', 'Tu VHS necesita más producción.'],
    ['platanero', 'Necesita una abuela que lo pague.'],
  ],
  'pepper-rematada': [
    ['pepper', 'Esa guitarra suena oxidada.'],
    ['rematada', 'Años de maltrato, cariño. Ninguna mezcla lo arregla.'],
  ],
  'pepper-ricardo': [
    ['pepper', 'Te produje cuando eras sesionista.'],
    ['ricardo', 'Y nunca pusiste mi nombre en los créditos.'],
  ],
  'pepper-slandor': [
    ['slandor', 'Papá paga tu mejor estudio.'],
    ['pepper', 'Cariño, tu solo no lo salva ni Abbey Road.'],
  ],
  'pepper-tayloy': [
    ['pepper', 'Tu shred necesita más producción.'],
    ['tayloy', 'El té bueno no necesita azúcar. Ni la nota limpia, compresor.'],
    ['pepper', 'Eso lo dice alguien que no sabe qué es un compresor.'],
  ],
  'pepper-tevi': [
    ['tevi', 'Hagamos el show en vivo.'],
    ['pepper', 'En vivo no. Necesita producción.'],
  ],
  'pepper-toxicity': [
    ['toxicity', 'Me echaste de tu estudio.'],
    ['pepper', 'Saturabas todo. Hasta las oraciones.'],
  ],
  'pepper-turboshred': [
    ['pepper', 'Tantas notas y ninguna masterizada.'],
    ['turboshred', 'No me dio tiempo.'],
  ],
  'pepper-virrey': [
    ['virrey', 'Tu estudio paga tributo a la Corona.'],
    ['pepper', 'Tu shred barroco necesita producción, majestad.'],
  ],

  // ── PLATANERO ──
  'platanero-rematada': [
    ['platanero', 'Te compro, guitarra. A precio de remate.'],
    ['rematada', 'Ni muerto me tocas. Ah, pero ya estás muerto.'],
  ],
  'platanero-ricardo': [
    ['platanero', 'Tú aprendiste con mi VHS, ¿no?'],
    ['ricardo', 'No. Aprendí a pesar de tu VHS.'],
  ],
  'platanero-slandor': [
    ['platanero', 'Compadre, tu papá me paga una clase.'],
    ['slandor', 'Papá ya me paga a mí. Ni eso funciona.'],
  ],
  'platanero-tayloy': [
    ['platanero', 'Ya, ya, ahora sí te gano… rebobina.'],
    ['tayloy', 'El agua que se rebobina no llega al río.'],
    ['platanero', 'Yo tampoco llegué. Me atropelló un carro.'],
  ],
  'platanero-tevi': [
    ['tevi', '¿Listo para el siguiente episodio?'],
    ['platanero', 'Solo si hay pollito en el set.'],
  ],
  'platanero-toxicity': [
    ['toxicity', 'Te fuiste al cielo y te devolvieron.'],
    ['platanero', 'Y tú vas al cielo todos los días y nunca te reciben.'],
  ],
  'platanero-turboshred': [
    ['turboshred', 'Tu VHS se rebobina más lento que yo.'],
    ['platanero', 'Pero al menos lo puedes pausar.'],
  ],
  'platanero-virrey': [
    ['virrey', 'Tu curso paga tributo.'],
    ['platanero', 'Cóbrale a mi abuela.'],
  ],

  // ── REMATADA ──
  'rematada-ricardo': [
    ['rematada', 'Tocaste en mí una vez. En una sesión.'],
    ['ricardo', 'Lo recuerdo. Te faltaba una cuerda.'],
  ],
  'rematada-slandor': [
    ['slandor', 'Te compro, guitarra. Te pongo en mi colección.'],
    ['rematada', '¿En una vitrina? Ni muerta.'],
  ],
  'rematada-tayloy': [
    ['rematada', 'Me vendieron por cinco cuerdas. Odio todo.'],
    ['tayloy', 'La madera herida también canta. Solo hay que afinarla con respeto.'],
    ['rematada', 'Bonito. Pero igual voy a desterrar a MayinBlues.'],
  ],
  'rematada-tevi': [
    ['tevi', 'Una guitarra con trauma. Gran episodio.'],
    ['rematada', 'Llama a MayinBlues. Quiero el reencuentro en vivo.'],
  ],
  'rematada-toxicity': [
    ['toxicity', 'Esa guitarra está poseída. Agua bendita.'],
    ['rematada', 'Solo estoy traumada, hermana. Como tú.'],
  ],
  'rematada-turboshred': [
    ['turboshred', 'Te tocaría mil notas por segundo.'],
    ['rematada', 'Me rompes las cuerdas. Ya tuve un dueño así.'],
  ],
  'rematada-virrey': [
    ['virrey', 'Toda guitarra en el reino paga tributo.'],
    ['rematada', 'Ya me vendieron una vez. No otra.'],
  ],

  // ── RICARDO ──
  'ricardo-slandor': [
    ['slandor', 'Te contrato de sesionista. Paga papá.'],
    ['ricardo', 'Ya no toco canciones ajenas.'],
  ],
  'ricardo-tayloy': [
    ['ricardo', 'Me tomó años encontrarme.'],
    ['tayloy', 'El río tarda en hallar su cauce, pero cuando lo halla, nadie lo detiene.'],
    ['ricardo', 'Entonces peleemos siendo río.'],
  ],
  'ricardo-tevi': [
    ['tevi', 'Tocaste en mi show. Como sesionista.'],
    ['ricardo', 'Ahora vengo con mi nombre.'],
  ],
  'ricardo-toxicity': [
    ['toxicity', 'Tocaste en mi banda. Te boté.'],
    ['ricardo', 'Me hiciste un favor. Ahí empecé a buscarme.'],
  ],
  'ricardo-turboshred': [
    ['turboshred', 'Tocas raíz. Yo toco velocidad.'],
    ['ricardo', 'La raíz no se apura. Crece.'],
  ],
  'ricardo-virrey': [
    ['virrey', 'Solo covers de afuera, por decreto.'],
    ['ricardo', 'Toqué covers años. Ya no.'],
  ],

  // ── SLANDOR ──
  'slandor-tayloy': [
    ['slandor', 'Te compro el clan entero. Papá paga.'],
    ['tayloy', 'El hijo que hereda el jardín sin sembrar, no sabe por qué florece.'],
    ['slandor', 'Florece porque papá paga al jardinero.'],
  ],
  'slandor-tevi': [
    ['slandor', 'Papá compró el horario estelar.'],
    ['tevi', 'Lo sé. Pero el guion lo escribo yo.'],
  ],
  'slandor-toxicity': [
    ['slandor', 'Papá compró tu banda. Para que te vayas.'],
    ['toxicity', 'Ya me fui. De todas.'],
  ],
  'slandor-turboshred': [
    ['slandor', 'Mis guitarras son de oro.'],
    ['turboshred', 'Y lentas.'],
  ],
  'slandor-virrey': [
    ['virrey', 'El heredero paga tributo doble.'],
    ['slandor', 'Papá ya compró tu escenario, Virrey.'],
  ],

  // ── TAYLOY ──
  'tayloy-tevi': [
    ['tevi', 'Un maestro milenario. ¿Listo para el siguiente episodio?'],
    ['tayloy', 'El sabio no corre hacia la cámara. La cámara lo encuentra.'],
    ['tevi', '¡Corte! Esa frase va al tráiler.'],
  ],
  'tayloy-toxicity': [
    ['toxicity', 'Que Dios te perdone. Yo no.'],
    ['tayloy', 'Quien reza con rabia, toca con prisa. Y quien toca con prisa, desafina.'],
    ['toxicity', 'Te vas del grupo.'],
  ],
  'tayloy-turboshred': [
    ['turboshred', 'Soy más rápido que tu clan.'],
    ['tayloy', 'El colibrí bate mil veces sus alas, y el águila llega más alto con una.'],
    ['turboshred', '¿Ya terminaste el proverbio? Yo ya terminé la pelea.'],
  ],
  'tayloy-virrey': [
    ['virrey', 'Por orden de la Corona, este solo es mío.'],
    ['tayloy', 'La corona pesa en la cabeza. La púa, solo en la mano del que la merece.'],
  ],

  // ── TEVI ──
  'tevi-toxicity': [
    ['tevi', '¿Lista para el siguiente episodio?'],
    ['toxicity', 'Solo si tú te vas del set.'],
  ],
  'tevi-turboshred': [
    ['tevi', '¡Corte! Otra toma. Más lento.'],
    ['turboshred', 'No sé tocar lento.'],
  ],
  'tevi-virrey': [
    ['virrey', 'Tu show se graba en mi escenario. Paga.'],
    ['tevi', 'Tranquilo, esto ya estaba escrito en el guion.'],
  ],

  // ── TOXICITY ──
  'toxicity-turboshred': [
    ['toxicity', 'Tocaste en mi banda. Muy rápido.'],
    ['turboshred', 'Y me botaste antes de que terminara el solo.'],
  ],
  'toxicity-virrey': [
    ['virrey', 'Hasta la iglesia paga tributo.'],
    ['toxicity', 'Que Dios te perdone. Yo no.'],
  ],

  // ── TURBOSHRED ──
  'turboshred-virrey': [
    ['virrey', 'Mi shred barroco es perfecto.'],
    ['turboshred', 'Y lento. Terminé antes de tu decreto.'],
  ],
};

/**
 * Diálogo de un enfrentamiento. Si no hay uno escrito para la pareja (por ejemplo, el espejo),
 * cada uno dice su frase de presentación: primero el rival (`b`, la CPU) y luego el jugador (`a`).
 */
export const dialogFor = (a: FighterId, b: FighterId): DialogLine[] => {
  const lines = DIALOGS[[a, b].sort().join('-')];
  if (lines) return lines.map(([speaker, text]) => ({ speaker, text }));
  return [
    { speaker: b, text: FIGHTERS[b].intro },
    { speaker: a, text: FIGHTERS[a].intro },
  ];
};
