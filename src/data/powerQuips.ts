import type { FighterId } from './fighters';

/** Comentarios del poder básico: diez frases originales de hasta cuatro palabras por luchador. */
export const POWER_QUIPS = {
  erp: [
    'Seguro fue un zurdo.', 'Bug de zurdos.', 'Con la derecha, papá.', 'Compila a la derecha.', 'Cuerdas al derecho.',
    'Eso es lenguaje.', 'Mano derecha, código limpio.', 'Ese commit era zurdo.', 'Desde mi cuarto.', 'Revertido por zurdo.',
  ],
  mayin: [
    'Con cinco alcanza.', 'Esto es barrio.', 'Blues con panza.', 'Siente esas cinco.', 'Sin sexta, papá.',
    'Dolor del bueno.', 'La pollada espera.', 'Te faltó calle.', 'Guitarra prestada, sentimiento propio.', 'Puro sufrimiento, causa.',
  ],
  george: [
    'El bend se respeta.', 'Cuidado ese bend.', 'Eso estaba desafinado.', 'Te faltó oído.', 'La afinación manda.',
    'Otra vez abajo.', 'Oído absoluto, paciencia limitada.', 'Ese vibrato sobra.', 'Respeta la nota.', 'Afinador, por favor.',
  ],
  pepper: [
    'Más producción, querido.', 'Eso estaba saturando.', 'Te falta compresión.', 'Recorta esos graves.', 'Tu mezcla embarraba.',
    'Esto sí está masterizado.', 'Bájale al ego.', 'Suena a demo.', 'Estándar internacional, cariño.', 'Los ochenta llamaron.',
  ],
  slandor: [
    'Mi talento heredado.', 'Págalo en cuotas.', 'Eso cuesta extra.', 'Papá lo financia.', 'Puro mérito propio.',
    'Desde cero, claro.', 'Oro de colección.', 'El castillo respalda.', 'Demasiado exclusivo para ti.', 'Te falta patrimonio.',
  ],
  pentalick: [
    'Este nunca falla.', 'Otra vez el primero.', 'Cinco son suficientes.', 'Ya conoces este.', 'Funciona en cualquier tono.',
    'El sexto no existe.', 'Mismo lick, otro golpe.', 'Clásico de cumpleaños.', 'Mi repertorio completo.', 'Para qué cambiar.',
  ],
  mimetico: [
    'Es influencia, hermano.', 'Ese también lo sé.', 'Me suena familiar.', 'Ahora es mío.', 'Mismo lick, distinta camiseta.',
    'Te quedó mejor conmigo.', 'Lo escuché primero.', 'Puro homenaje, claro.', 'Hasta tu pose.', 'Versión ligeramente prestada.',
  ],
  clavito: [
    'Acabo de inventarlo.', 'El futuro llegó.', 'Metal con calle.', 'Eso todavía no existe.', 'Arpegio completamente nuevo.',
    'Nadie entiende mi género.', 'Innovación nota por nota.', 'Ponle más beat.', 'Soy la nueva escuela.', 'Mi género, mis reglas.',
  ],
  chantal: [
    'Su pedido, señor.', 'Licks recién servidos.', 'Con extra de distorsión.', 'Plato de la casa.', '¿Le traigo otra?',
    'Propina no incluida.', 'Directo de las montañas.', 'La bandeja vuelve.', 'Buen provecho, maestro.', 'Aquí nunca desafinamos.',
  ],
  jeanpierre: [
    'Bonjour, amateur.', 'Con clase europea.', 'Desde el callejón.', 'Esto cruza fronteras.', 'Equipaje bien aprovechado.',
    'Mon Dieu, qué golpe.', 'Una postal de Europa.', 'Eso costó esfuerzo.', 'Pasaporte de seis cuerdas.', 'Merci por venir.',
  ],
  ferdex: [
    'Por Curcuman, compañero.', 'Tu fraseo es burgués.', 'Escala del pueblo.', 'Los sabios aprobaron.', 'Disciplina, camarada.',
    'Plan cumplido, compañero.', 'La revolución afina.', 'Curcuman guía mi puño.', 'Invierno para tu solo.', 'Estudia el manifiesto.',
  ],
  turboshred: [
    'Ya terminé.', '¿Eso era rápido?', 'El metrónomo renunció.', 'Te faltan semicorcheas.', 'Ni me viste.',
    'Otro tempo, por favor.', 'Voy calentando todavía.', 'Tu oído llegó tarde.', 'Más notas, menos tiempo.', 'Parpadeaste demasiado.',
  ],
  toxicity: [
    'Yo no perdono.', 'Reza lo que sepas.', 'Bendición con carácter.', 'Fuera de mi banda.', 'Agua bendita hirviendo.',
    'Amén y al piso.', 'Octava banda, tampoco.', 'Dios tiene paciencia.', 'Baterista, corre.', 'Te falta penitencia.',
  ],
  rematada: [
    'Precio de remate.', 'Poco uso, dicen.', 'Sin devolución, querido.', 'Cuerdas oxidadas, memoria intacta.', 'Te cobro el maltrato.',
    'La sexta era mía.', 'Oferta con rencor.', 'Marketplace no te salva.', 'Tu deuda sigue pendiente.', 'Ahora mando yo.',
  ],
  escalas: [
    'Lee el capítulo tres.', 'Eso está documentado.', 'Toma nota.', 'Consulta la bibliografía.', 'Silencio en clase.',
    'Lección bien aprendida.', 'Con fundamento teórico.', 'Mi libro me respalda.', 'Te falta lectura.', 'La púa definitiva.',
  ],
  tayloy: [
    'Quien corre, desafina.', 'La púa recuerda.', 'Mil escalas, un camino.', 'El metrónomo no miente.', 'Afina antes de hablar.',
    'El silencio también suena.', 'Dedo paciente, nota exacta.', 'Cuerda tensa, mente serena.', 'Bambú dobla, cuerda canta.', 'Sin raíz no hay bend.',
  ],
  jesex: [
    'Yo invito, amigo.', 'Cárgalo a mi cuenta.', 'Puro vacilón.', 'La revancha también pago.', 'Abro otra sede.',
    'Mi jet espera.', 'Esto lo compro.', 'Entrada para todos.', 'Rock sin presupuesto límite.', 'Vacaciones bien invertidas.',
  ],
  markus: [
    '¡KABOOOM!', 'Escucha ese maqam.', 'Un cuarto de tono.', 'Segunda aumentada, hermano.', 'Tu pentatónica quedó corta.',
    'Escalas con historia.', 'El desierto responde.', 'Sonido antiguo, golpe nuevo.', 'Siete notas no alcanzan.', 'Mensaje fuerte y claro.',
  ],
  platanero: [
    'Rebobina, rebobina.', 'Ahora sí salió.', 'Mi abuela paga.', 'Eso viene en VHS.', 'Primero la mensualidad.',
    '¿Y mi pollito?', 'Lección uno, cobrar.', 'Ni arriba me aguantan.', 'Fue culpa del tracking.', 'Pausa para descansar.',
  ],
  ricardo: [
    'Este riff es mío.', 'Volví a mis raíces.', 'Ahora toco para mí.', 'Se acabaron los jingles.', 'Rock con voz propia.',
    'Por fin me encontré.', 'Sin pedidos, gracias.', 'Esa etapa ya pasó.', 'Hoy sueno a mí.', 'Nada de canciones ajenas.',
    'Hoy sueno feliz.', 'Así soy yo.', 'Me reconocí.', 'Sin pedir permiso.',
  ],
  kimberly: [
    'Dale like primero.', 'Esto va al feed.', 'Gracias, auspiciadores.', '¿Quedó bien grabado?', 'Sin filtro, casi.',
    'El algoritmo me ama.', '¿Salí bonita?', 'Etiqueta mi cuenta.', 'Dos millones mirando.', 'Luz de aro, lista.',
  ],
  nosu: [
    'Error corregido.', 'Procesando tu derrota.', 'Cuadrado al milímetro.', 'Hit generado.', 'Afinación actualizada.',
    'Ruido humano detectado.', 'Treinta segundos bastan.', 'Tu ensayo está pendiente.', 'Patrón repetido, éxito garantizado.', 'Larga vida al código.',
  ],
  virrey: [
    'Paga tu tributo.', 'Por decreto real.', 'El escenario es mío.', 'La Corona confisca.', 'Paga derecho de piso.',
    'Solo covers autorizados.', 'La mitad de puerta.', 'Y las chelas también.', 'Licencia denegada.', 'Mi reino, mis reglas.',
  ],
  tevi: [
    '¡Corte!', 'Toma dos.', 'No estás en escaleta.', 'Eso no sale.', 'Vamos a comerciales.',
    'Sube el rating.', 'Fuera de cuadro.', 'Tú sales de extra.', 'Lo arreglamos en edición.', 'Estás al aire.',
  ],
  acople: [
    'Sube ese odio.', 'Tu crítica me alimenta.', 'Yo amplifico todo.', 'Más volumen, más rencor.', 'Escucha tu propia envidia.',
    'Ese chillido es mío.', 'Gracias por el odio.', 'Todos alimentan mi ampli.', 'Devuelvo cada crítica.', 'Sigue hablando, sigo creciendo.',
  ],
} satisfies Record<FighterId, readonly string[]>;
