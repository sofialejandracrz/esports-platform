/*
============================================================================
  Script: init_esports_analytics.js
  Base de datos: esports_analytics (MongoDB)
  Descripción: Crea las colecciones y datos de prueba para el Data Warehouse
  Colecciones:
    - logs_actividad    → Datamart 2 (Comportamiento del Usuario)
    - feedback_torneos  → Datamart 3 (Calidad de Torneos)
  
  Ejecutar con: mongosh < init_esports_analytics.js
  O se ejecuta automáticamente con docker-entrypoint-initdb.d
  
  NOTA: Los IDs de oracle_usuario_id (1-60) y oracle_torneo_id (1-60)
        mapean directamente a USUARIO.ID y TORNEO.ID en Oracle.
============================================================================
*/

// Seleccionar/crear la base de datos
db = db.getSiblingDB('esports_analytics');

// ===========================================================================
// Limpiar colecciones existentes (idempotente)
// ===========================================================================
db.logs_actividad.drop();
db.feedback_torneos.drop();

// ===========================================================================
// COLECCIÓN: logs_actividad
// Datamart 2 — Comportamiento del Usuario y Gaming
// ~200 documentos de logs de actividad de usuarios
// ===========================================================================

print(">>> Generando logs_actividad...");

const tiposEvento = [
  "login", "logout", "busqueda", "perfil_visitado",
  "clic_torneo", "clic_tienda", "cambio_config", "envio_solicitud_amistad"
];

const paises = [
  "Honduras", "Mexico", "Guatemala", "El Salvador", "Costa Rica",
  "Panama", "Colombia", "Argentina", "Chile", "Peru",
  "Espana", "Estados Unidos", "Brasil"
];

const secciones = [
  "ranking", "tienda", "torneos", "perfil", "inicio",
  "amigos", "configuracion", "equipos", "juegos"
];

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/605.1.15 Safari/17.3",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/121.0.0.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0"
];

const logsActividad = [];

for (let i = 0; i < 200; i++) {
  const usuarioId = (i % 60) + 1;
  const tipoEvento = tiposEvento[i % tiposEvento.length];
  const pais = paises[i % paises.length];

  // Generar fecha entre 2025-09-01 y 2026-03-31
  const startDate = new Date("2025-09-01T00:00:00Z");
  const endDate = new Date("2026-03-31T23:59:59Z");
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  const timestamp = new Date(randomTime);

  // IP simulada basada en país
  const octet3 = (i % 254) + 1;
  const octet4 = ((i * 7) % 254) + 1;
  const ip = `190.${100 + (i % 50)}.${octet3}.${octet4}`;

  // Detalle varía según tipo de evento
  let detalle = {};
  switch (tipoEvento) {
    case "login":
      detalle = {
        metodo: i % 3 === 0 ? "google" : "email",
        exitoso: i % 10 !== 0  // 10% de logins fallidos
      };
      break;
    case "logout":
      detalle = {
        duracion_sesion_min: Math.floor(Math.random() * 180) + 5
      };
      break;
    case "busqueda":
      const terminos = ["valorant torneo", "league of legends", "FIFA 24 equipos", 
                         "cs2 ranked", "fortnite premio", "apex legends tips",
                         "como subir xp", "mejores builds", "torneos gratis"];
      detalle = {
        termino: terminos[i % terminos.length],
        resultados_encontrados: Math.floor(Math.random() * 50) + 1
      };
      break;
    case "perfil_visitado":
      detalle = {
        perfil_visitado_id: ((i + 15) % 60) + 1,
        tiempo_visualizacion_seg: Math.floor(Math.random() * 120) + 5,
        desde_seccion: secciones[i % secciones.length]
      };
      break;
    case "clic_torneo":
      detalle = {
        torneo_id: (i % 60) + 1,
        accion: i % 3 === 0 ? "ver_detalle" : (i % 3 === 1 ? "inscribirse" : "compartir"),
        desde_seccion: secciones[i % secciones.length]
      };
      break;
    case "clic_tienda":
      detalle = {
        item_id: (i % 14) + 1,
        accion: i % 2 === 0 ? "ver_detalle" : "agregar_carrito",
        categoria: ["creditos", "membresia", "servicio", "avatar", "banner"][i % 5]
      };
      break;
    case "cambio_config":
      detalle = {
        seccion: ["privacidad", "notificaciones", "apariencia", "idioma", "seguridad"][i % 5],
        campo_modificado: ["tema_oscuro", "mostrar_perfil", "notif_email", "idioma_preferido", "2fa"][i % 5]
      };
      break;
    case "envio_solicitud_amistad":
      detalle = {
        destinatario_id: ((i + 20) % 60) + 1,
        desde_seccion: secciones[i % secciones.length]
      };
      break;
  }

  logsActividad.push({
    oracle_usuario_id: usuarioId,
    tipo_evento: tipoEvento,
    detalle: detalle,
    ip: ip,
    user_agent: userAgents[i % userAgents.length],
    pais_origen: pais,
    timestamp: timestamp
  });
}

db.logs_actividad.insertMany(logsActividad);
print(`>>> logs_actividad insertados: ${logsActividad.length}`);

// Crear índices para consultas del ETL
db.logs_actividad.createIndex({ oracle_usuario_id: 1 });
db.logs_actividad.createIndex({ tipo_evento: 1 });
db.logs_actividad.createIndex({ timestamp: 1 });
db.logs_actividad.createIndex({ pais_origen: 1 });

// ===========================================================================
// COLECCIÓN: feedback_torneos
// Datamart 3 — Calidad de Torneos y Juegos
// ~80 documentos de reseñas/feedback de torneos
// ===========================================================================

print(">>> Generando feedback_torneos...");

const comentariosPositivos = [
  "Excelente torneo, muy bien organizado!",
  "Buena experiencia, volvería a participar",
  "Los premios fueron justos y la competencia fue genial",
  "Me gustó mucho el formato, fue muy emocionante",
  "Increíble nivel de juego, lo recomiendo al 100%",
  "El mejor torneo en el que he participado",
  "Organización impecable, sin problemas técnicos",
  "Muy buena transmisión y comunicación del staff"
];

const comentariosNeutrales = [
  "Estuvo bien, pero podría mejorar el matchmaking",
  "Torneo aceptable, los horarios fueron un poco incómodos",
  "Buen torneo en general, pero hubo algo de lag",
  "La experiencia fue normal, nada extraordinario",
  "Podría mejorar la comunicación previa al torneo"
];

const comentariosNegativos = [
  "Mucho lag durante las partidas, experiencia frustrante",
  "El matchmaking fue terrible, equipos muy desbalanceados",
  "Problemas con los servidores, varias partidas se cayeron",
  "No recomiendo, la organización fue muy mala",
  "Los premios no se entregaron a tiempo"
];

const tagsPosibles = [
  "buen_premio", "buena_organizacion", "buen_matchmaking", "sin_lag",
  "excelente_transmision", "buen_formato", "premios_justos",
  "lag", "mal_matchmaking", "desorganizado", "servidores_caidos",
  "mala_comunicacion", "premios_tardios",
  "divertido", "competitivo", "casual", "emocionante", "estresante"
];

const feedbackTorneos = [];

for (let i = 0; i < 80; i++) {
  const torneoId = (i % 60) + 1;
  const usuarioId = ((i * 3 + 7) % 60) + 1;  // Diferente distribución que logs
  
  // Calificación con distribución realista (más positivas que negativas)
  let calificacion;
  const rand = Math.random();
  if (rand < 0.15) calificacion = 1 + Math.floor(Math.random() * 2);  // 15% → 1-2 estrellas
  else if (rand < 0.35) calificacion = 3;                              // 20% → 3 estrellas
  else calificacion = 4 + Math.floor(Math.random() * 2);               // 65% → 4-5 estrellas

  // Comentario basado en calificación
  let comentario;
  if (calificacion >= 4) {
    comentario = comentariosPositivos[i % comentariosPositivos.length];
  } else if (calificacion === 3) {
    comentario = comentariosNeutrales[i % comentariosNeutrales.length];
  } else {
    comentario = comentariosNegativos[i % comentariosNegativos.length];
  }

  // Tags aleatorios (2-4 tags por reseña)
  const numTags = 2 + Math.floor(Math.random() * 3);
  const tags = [];
  const usedIndexes = new Set();
  for (let t = 0; t < numTags; t++) {
    let idx;
    do { idx = Math.floor(Math.random() * tagsPosibles.length); } while (usedIndexes.has(idx));
    usedIndexes.add(idx);
    tags.push(tagsPosibles[idx]);
  }

  // Fecha entre 2025-10-01 y 2026-03-31
  const startDate = new Date("2025-10-01T00:00:00Z");
  const endDate = new Date("2026-03-31T23:59:59Z");
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  const timestamp = new Date(randomTime);

  feedbackTorneos.push({
    oracle_torneo_id: torneoId,
    oracle_usuario_id: usuarioId,
    calificacion: calificacion,
    comentario: comentario,
    tags: tags,
    recomendaria: calificacion >= 3,
    timestamp: timestamp
  });
}

db.feedback_torneos.insertMany(feedbackTorneos);
print(`>>> feedback_torneos insertados: ${feedbackTorneos.length}`);

// Crear índices
db.feedback_torneos.createIndex({ oracle_torneo_id: 1 });
db.feedback_torneos.createIndex({ oracle_usuario_id: 1 });
db.feedback_torneos.createIndex({ calificacion: 1 });
db.feedback_torneos.createIndex({ timestamp: 1 });

// ===========================================================================
// Verificación final
// ===========================================================================
print("=============================================");
print(">>> Base de datos: esports_analytics");
print(">>> Colecciones creadas:");
print(`    - logs_actividad:   ${db.logs_actividad.countDocuments()} documentos`);
print(`    - feedback_torneos: ${db.feedback_torneos.countDocuments()} documentos`);
print(">>> Índices creados en ambas colecciones");
print("=============================================");
