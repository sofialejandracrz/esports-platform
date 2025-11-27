-- =====================================================
-- SCRIPT: Seeds Incrementales para eSports Platform
-- Ejecutar directamente en PostgreSQL sin borrar datos
-- Los INSERT usan ON CONFLICT DO NOTHING para evitar duplicados
-- =====================================================

-- =====================================================
-- 1. NUEVAS PLATAFORMAS (si no existían en el seeder original)
-- =====================================================
INSERT INTO catalogo_plataforma (valor) VALUES
    ('Origin'),
    ('Ubisoft Connect'),
    ('GOG'),
    ('Crossplay')
ON CONFLICT (valor) DO NOTHING;

-- =====================================================
-- 2. NUEVAS REGIONES
-- =====================================================
INSERT INTO catalogo_region (valor) VALUES
    ('México'),
    ('España'),
    ('Argentina'),
    ('Chile'),
    ('Colombia'),
    ('Perú')
ON CONFLICT (valor) DO NOTHING;

-- =====================================================
-- 3. ESTADOS DE TORNEO (actualizados para el SQL de torneos)
-- =====================================================
INSERT INTO catalogo_estado_torneo (valor) VALUES
    ('proximamente'),
    ('en_curso'),
    ('terminado'),
    ('cancelado')
ON CONFLICT (valor) DO NOTHING;

-- =====================================================
-- 4. NUEVOS TIPOS DE ENTRADA
-- =====================================================
INSERT INTO catalogo_tipo_entrada (valor) VALUES
    ('touch')
ON CONFLICT (valor) DO NOTHING;

-- =====================================================
-- 5. NUEVOS TIPOS DE ITEM
-- =====================================================
INSERT INTO catalogo_tipo_item (valor) VALUES
    ('avatar'),
    ('banner')
ON CONFLICT (valor) DO NOTHING;

-- =====================================================
-- 6. NUEVOS TIPOS DE TRANSACCIÓN
-- =====================================================
INSERT INTO catalogo_transaccion_tipo (valor) VALUES
    ('premio'),
    ('inscripcion')
ON CONFLICT (valor) DO NOTHING;

-- =====================================================
-- 7. NUEVOS ORÍGENES DE TRANSACCIÓN
-- =====================================================
INSERT INTO catalogo_origen_transaccion (valor) VALUES
    ('inscripcion')
ON CONFLICT (valor) DO NOTHING;

-- =====================================================
-- 8. TIPOS DE TORNEO
-- =====================================================
INSERT INTO catalogo_tipo_torneo (valor, descripcion, tipo_trofeo) VALUES
    ('eliminacion_simple', 'Eliminación simple - Un jugador pierde y queda eliminado', 'trofeo_eliminacion'),
    ('eliminacion_doble', 'Eliminación doble - Un jugador debe perder dos veces para ser eliminado', 'trofeo_eliminacion_doble'),
    ('todos_contra_todos', 'Round Robin - Todos juegan contra todos', 'trofeo_round_robin'),
    ('grupos', 'Fase de grupos con eliminatorias', 'trofeo_grupos'),
    ('suizo', 'Sistema suizo - Emparejamientos según rendimiento', 'trofeo_suizo')
ON CONFLICT (valor) DO NOTHING;

-- =====================================================
-- 9. JUEGOS POPULARES DE ESPORTS
-- =====================================================
INSERT INTO juego (nombre, descripcion) VALUES
    ('Call of Duty: Warzone', 'Battle Royale gratuito de la franquicia Call of Duty'),
    ('Fortnite', 'Battle Royale con construcción de Epic Games'),
    ('League of Legends', 'MOBA competitivo de Riot Games'),
    ('Valorant', 'Shooter táctico 5v5 de Riot Games'),
    ('Apex Legends', 'Battle Royale de escuadrones de EA'),
    ('Counter-Strike 2', 'Shooter táctico competitivo de Valve'),
    ('Rocket League', 'Fútbol con autos de Psyonix'),
    ('FIFA 24', 'Simulador de fútbol de EA Sports'),
    ('Super Smash Bros. Ultimate', 'Juego de peleas crossover de Nintendo'),
    ('Street Fighter 6', 'Juego de peleas de Capcom'),
    ('Tekken 8', 'Juego de peleas 3D de Bandai Namco'),
    ('Dota 2', 'MOBA competitivo de Valve'),
    ('Overwatch 2', 'Hero shooter de Blizzard'),
    ('PUBG: Battlegrounds', 'Battle Royale original de KRAFTON'),
    ('Rainbow Six Siege', 'Shooter táctico de Ubisoft')
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================
-- 10. MODOS DE JUEGO POR CADA JUEGO
-- =====================================================
-- Call of Duty: Warzone
INSERT INTO modo_juego (juego_id, nombre, descripcion)
SELECT j.id, m.nombre, m.descripcion
FROM juego j
CROSS JOIN (VALUES
    ('Battle Royale Solo', 'Último jugador en pie'),
    ('Battle Royale Dúos', 'Equipos de 2 jugadores'),
    ('Battle Royale Tríos', 'Equipos de 3 jugadores'),
    ('Battle Royale Cuartetos', 'Equipos de 4 jugadores'),
    ('Resurgimiento', 'Battle Royale con respawn')
) AS m(nombre, descripcion)
WHERE j.nombre = 'Call of Duty: Warzone'
AND NOT EXISTS (
    SELECT 1 FROM modo_juego mj WHERE mj.juego_id = j.id AND mj.nombre = m.nombre
);

-- Fortnite
INSERT INTO modo_juego (juego_id, nombre, descripcion)
SELECT j.id, m.nombre, m.descripcion
FROM juego j
CROSS JOIN (VALUES
    ('Solo', 'Battle Royale individual'),
    ('Dúos', 'Equipos de 2'),
    ('Tríos', 'Equipos de 3'),
    ('Escuadrones', 'Equipos de 4'),
    ('Zero Build Solo', 'Sin construcción individual'),
    ('Zero Build Escuadrones', 'Sin construcción equipos')
) AS m(nombre, descripcion)
WHERE j.nombre = 'Fortnite'
AND NOT EXISTS (
    SELECT 1 FROM modo_juego mj WHERE mj.juego_id = j.id AND mj.nombre = m.nombre
);

-- League of Legends
INSERT INTO modo_juego (juego_id, nombre, descripcion)
SELECT j.id, m.nombre, m.descripcion
FROM juego j
CROSS JOIN (VALUES
    ('Grieta del Invocador 5v5', 'Modo competitivo estándar'),
    ('ARAM', 'All Random All Mid'),
    ('Clash', 'Torneos organizados')
) AS m(nombre, descripcion)
WHERE j.nombre = 'League of Legends'
AND NOT EXISTS (
    SELECT 1 FROM modo_juego mj WHERE mj.juego_id = j.id AND mj.nombre = m.nombre
);

-- Valorant
INSERT INTO modo_juego (juego_id, nombre, descripcion)
SELECT j.id, m.nombre, m.descripcion
FROM juego j
CROSS JOIN (VALUES
    ('Competitivo', 'Modo rankeado 5v5'),
    ('Sin clasificar', 'Partidas casuales 5v5'),
    ('Spike Rush', 'Partidas rápidas'),
    ('Deathmatch', 'Todos contra todos')
) AS m(nombre, descripcion)
WHERE j.nombre = 'Valorant'
AND NOT EXISTS (
    SELECT 1 FROM modo_juego mj WHERE mj.juego_id = j.id AND mj.nombre = m.nombre
);

-- Apex Legends
INSERT INTO modo_juego (juego_id, nombre, descripcion)
SELECT j.id, m.nombre, m.descripcion
FROM juego j
CROSS JOIN (VALUES
    ('Battle Royale Tríos', 'Escuadrones de 3'),
    ('Battle Royale Dúos', 'Escuadrones de 2'),
    ('Arenas', 'Combate 3v3'),
    ('Control', 'Modo de control de puntos')
) AS m(nombre, descripcion)
WHERE j.nombre = 'Apex Legends'
AND NOT EXISTS (
    SELECT 1 FROM modo_juego mj WHERE mj.juego_id = j.id AND mj.nombre = m.nombre
);

-- Counter-Strike 2
INSERT INTO modo_juego (juego_id, nombre, descripcion)
SELECT j.id, m.nombre, m.descripcion
FROM juego j
CROSS JOIN (VALUES
    ('Competitivo', 'Partidas rankeadas 5v5'),
    ('Premier', 'Modo competitivo premium'),
    ('Wingman', 'Partidas 2v2'),
    ('Casual', 'Partidas sin rango')
) AS m(nombre, descripcion)
WHERE j.nombre = 'Counter-Strike 2'
AND NOT EXISTS (
    SELECT 1 FROM modo_juego mj WHERE mj.juego_id = j.id AND mj.nombre = m.nombre
);

-- Rocket League
INSERT INTO modo_juego (juego_id, nombre, descripcion)
SELECT j.id, m.nombre, m.descripcion
FROM juego j
CROSS JOIN (VALUES
    ('1v1', 'Duelo individual'),
    ('2v2', 'Dúos'),
    ('3v3', 'Estándar'),
    ('Hoops', 'Basquetbol'),
    ('Rumble', 'Con power-ups')
) AS m(nombre, descripcion)
WHERE j.nombre = 'Rocket League'
AND NOT EXISTS (
    SELECT 1 FROM modo_juego mj WHERE mj.juego_id = j.id AND mj.nombre = m.nombre
);

-- FIFA 24
INSERT INTO modo_juego (juego_id, nombre, descripcion)
SELECT j.id, m.nombre, m.descripcion
FROM juego j
CROSS JOIN (VALUES
    ('Ultimate Team', 'Construye tu equipo'),
    ('1v1 Online', 'Partida individual'),
    ('Pro Clubs', 'Equipos de jugadores'),
    ('Co-op Seasons', 'Cooperativo en línea')
) AS m(nombre, descripcion)
WHERE j.nombre = 'FIFA 24'
AND NOT EXISTS (
    SELECT 1 FROM modo_juego mj WHERE mj.juego_id = j.id AND mj.nombre = m.nombre
);

-- Super Smash Bros. Ultimate
INSERT INTO modo_juego (juego_id, nombre, descripcion)
SELECT j.id, m.nombre, m.descripcion
FROM juego j
CROSS JOIN (VALUES
    ('1v1', 'Duelo individual'),
    ('2v2', 'Equipos'),
    ('Free For All', 'Todos contra todos')
) AS m(nombre, descripcion)
WHERE j.nombre = 'Super Smash Bros. Ultimate'
AND NOT EXISTS (
    SELECT 1 FROM modo_juego mj WHERE mj.juego_id = j.id AND mj.nombre = m.nombre
);

-- Street Fighter 6
INSERT INTO modo_juego (juego_id, nombre, descripcion)
SELECT j.id, m.nombre, m.descripcion
FROM juego j
CROSS JOIN (VALUES
    ('Ranked Match', 'Partidas rankeadas 1v1'),
    ('Casual Match', 'Partidas casuales'),
    ('Battle Hub', 'Lobby social')
) AS m(nombre, descripcion)
WHERE j.nombre = 'Street Fighter 6'
AND NOT EXISTS (
    SELECT 1 FROM modo_juego mj WHERE mj.juego_id = j.id AND mj.nombre = m.nombre
);

-- Tekken 8
INSERT INTO modo_juego (juego_id, nombre, descripcion)
SELECT j.id, m.nombre, m.descripcion
FROM juego j
CROSS JOIN (VALUES
    ('Ranked Match', 'Partidas rankeadas 1v1'),
    ('Quick Match', 'Partidas rápidas'),
    ('Lobby Match', 'Salas personalizadas')
) AS m(nombre, descripcion)
WHERE j.nombre = 'Tekken 8'
AND NOT EXISTS (
    SELECT 1 FROM modo_juego mj WHERE mj.juego_id = j.id AND mj.nombre = m.nombre
);

-- Dota 2
INSERT INTO modo_juego (juego_id, nombre, descripcion)
SELECT j.id, m.nombre, m.descripcion
FROM juego j
CROSS JOIN (VALUES
    ('All Pick', 'Modo estándar 5v5'),
    ('Captain Mode', 'Modo competitivo con draft'),
    ('Turbo', 'Partidas rápidas')
) AS m(nombre, descripcion)
WHERE j.nombre = 'Dota 2'
AND NOT EXISTS (
    SELECT 1 FROM modo_juego mj WHERE mj.juego_id = j.id AND mj.nombre = m.nombre
);

-- Overwatch 2
INSERT INTO modo_juego (juego_id, nombre, descripcion)
SELECT j.id, m.nombre, m.descripcion
FROM juego j
CROSS JOIN (VALUES
    ('Competitivo', 'Partidas rankeadas 5v5'),
    ('Quick Play', 'Partidas rápidas'),
    ('Arcade', 'Modos especiales')
) AS m(nombre, descripcion)
WHERE j.nombre = 'Overwatch 2'
AND NOT EXISTS (
    SELECT 1 FROM modo_juego mj WHERE mj.juego_id = j.id AND mj.nombre = m.nombre
);

-- PUBG: Battlegrounds
INSERT INTO modo_juego (juego_id, nombre, descripcion)
SELECT j.id, m.nombre, m.descripcion
FROM juego j
CROSS JOIN (VALUES
    ('Solo', 'Battle Royale individual'),
    ('Dúo', 'Equipos de 2'),
    ('Escuadrón', 'Equipos de 4')
) AS m(nombre, descripcion)
WHERE j.nombre = 'PUBG: Battlegrounds'
AND NOT EXISTS (
    SELECT 1 FROM modo_juego mj WHERE mj.juego_id = j.id AND mj.nombre = m.nombre
);

-- Rainbow Six Siege
INSERT INTO modo_juego (juego_id, nombre, descripcion)
SELECT j.id, m.nombre, m.descripcion
FROM juego j
CROSS JOIN (VALUES
    ('Ranked', 'Partidas rankeadas 5v5'),
    ('Unranked', 'Sin rango 5v5'),
    ('Quick Match', 'Partidas rápidas')
) AS m(nombre, descripcion)
WHERE j.nombre = 'Rainbow Six Siege'
AND NOT EXISTS (
    SELECT 1 FROM modo_juego mj WHERE mj.juego_id = j.id AND mj.nombre = m.nombre
);

-- =====================================================
-- 11. RELACIONES JUEGO-PLATAFORMA
-- =====================================================
-- Call of Duty: Warzone
INSERT INTO juego_plataformas ("juegoId", "catalogoPlataformaId")
SELECT j.id, p.id
FROM juego j, catalogo_plataforma p
WHERE j.nombre = 'Call of Duty: Warzone'
AND p.valor IN ('PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One')
AND NOT EXISTS (
    SELECT 1 FROM juego_plataformas jp 
    WHERE jp."juegoId" = j.id AND jp."catalogoPlataformaId" = p.id
);

-- Fortnite
INSERT INTO juego_plataformas ("juegoId", "catalogoPlataformaId")
SELECT j.id, p.id
FROM juego j, catalogo_plataforma p
WHERE j.nombre = 'Fortnite'
AND p.valor IN ('PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'Nintendo Switch', 'Mobile')
AND NOT EXISTS (
    SELECT 1 FROM juego_plataformas jp 
    WHERE jp."juegoId" = j.id AND jp."catalogoPlataformaId" = p.id
);

-- League of Legends
INSERT INTO juego_plataformas ("juegoId", "catalogoPlataformaId")
SELECT j.id, p.id
FROM juego j, catalogo_plataforma p
WHERE j.nombre = 'League of Legends'
AND p.valor IN ('PC')
AND NOT EXISTS (
    SELECT 1 FROM juego_plataformas jp 
    WHERE jp."juegoId" = j.id AND jp."catalogoPlataformaId" = p.id
);

-- Valorant
INSERT INTO juego_plataformas ("juegoId", "catalogoPlataformaId")
SELECT j.id, p.id
FROM juego j, catalogo_plataforma p
WHERE j.nombre = 'Valorant'
AND p.valor IN ('PC')
AND NOT EXISTS (
    SELECT 1 FROM juego_plataformas jp 
    WHERE jp."juegoId" = j.id AND jp."catalogoPlataformaId" = p.id
);

-- Apex Legends
INSERT INTO juego_plataformas ("juegoId", "catalogoPlataformaId")
SELECT j.id, p.id
FROM juego j, catalogo_plataforma p
WHERE j.nombre = 'Apex Legends'
AND p.valor IN ('PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'Nintendo Switch')
AND NOT EXISTS (
    SELECT 1 FROM juego_plataformas jp 
    WHERE jp."juegoId" = j.id AND jp."catalogoPlataformaId" = p.id
);

-- Counter-Strike 2
INSERT INTO juego_plataformas ("juegoId", "catalogoPlataformaId")
SELECT j.id, p.id
FROM juego j, catalogo_plataforma p
WHERE j.nombre = 'Counter-Strike 2'
AND p.valor IN ('PC', 'Steam')
AND NOT EXISTS (
    SELECT 1 FROM juego_plataformas jp 
    WHERE jp."juegoId" = j.id AND jp."catalogoPlataformaId" = p.id
);

-- Rocket League
INSERT INTO juego_plataformas ("juegoId", "catalogoPlataformaId")
SELECT j.id, p.id
FROM juego j, catalogo_plataforma p
WHERE j.nombre = 'Rocket League'
AND p.valor IN ('PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'Nintendo Switch', 'Epic Games')
AND NOT EXISTS (
    SELECT 1 FROM juego_plataformas jp 
    WHERE jp."juegoId" = j.id AND jp."catalogoPlataformaId" = p.id
);

-- FIFA 24
INSERT INTO juego_plataformas ("juegoId", "catalogoPlataformaId")
SELECT j.id, p.id
FROM juego j, catalogo_plataforma p
WHERE j.nombre = 'FIFA 24'
AND p.valor IN ('PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One')
AND NOT EXISTS (
    SELECT 1 FROM juego_plataformas jp 
    WHERE jp."juegoId" = j.id AND jp."catalogoPlataformaId" = p.id
);

-- Super Smash Bros. Ultimate
INSERT INTO juego_plataformas ("juegoId", "catalogoPlataformaId")
SELECT j.id, p.id
FROM juego j, catalogo_plataforma p
WHERE j.nombre = 'Super Smash Bros. Ultimate'
AND p.valor IN ('Nintendo Switch')
AND NOT EXISTS (
    SELECT 1 FROM juego_plataformas jp 
    WHERE jp."juegoId" = j.id AND jp."catalogoPlataformaId" = p.id
);

-- Street Fighter 6
INSERT INTO juego_plataformas ("juegoId", "catalogoPlataformaId")
SELECT j.id, p.id
FROM juego j, catalogo_plataforma p
WHERE j.nombre = 'Street Fighter 6'
AND p.valor IN ('PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Steam')
AND NOT EXISTS (
    SELECT 1 FROM juego_plataformas jp 
    WHERE jp."juegoId" = j.id AND jp."catalogoPlataformaId" = p.id
);

-- Tekken 8
INSERT INTO juego_plataformas ("juegoId", "catalogoPlataformaId")
SELECT j.id, p.id
FROM juego j, catalogo_plataforma p
WHERE j.nombre = 'Tekken 8'
AND p.valor IN ('PC', 'PlayStation 5', 'Xbox Series X/S', 'Steam')
AND NOT EXISTS (
    SELECT 1 FROM juego_plataformas jp 
    WHERE jp."juegoId" = j.id AND jp."catalogoPlataformaId" = p.id
);

-- Dota 2
INSERT INTO juego_plataformas ("juegoId", "catalogoPlataformaId")
SELECT j.id, p.id
FROM juego j, catalogo_plataforma p
WHERE j.nombre = 'Dota 2'
AND p.valor IN ('PC', 'Steam')
AND NOT EXISTS (
    SELECT 1 FROM juego_plataformas jp 
    WHERE jp."juegoId" = j.id AND jp."catalogoPlataformaId" = p.id
);

-- Overwatch 2
INSERT INTO juego_plataformas ("juegoId", "catalogoPlataformaId")
SELECT j.id, p.id
FROM juego j, catalogo_plataforma p
WHERE j.nombre = 'Overwatch 2'
AND p.valor IN ('PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'Nintendo Switch', 'Battle.net')
AND NOT EXISTS (
    SELECT 1 FROM juego_plataformas jp 
    WHERE jp."juegoId" = j.id AND jp."catalogoPlataformaId" = p.id
);

-- PUBG: Battlegrounds
INSERT INTO juego_plataformas ("juegoId", "catalogoPlataformaId")
SELECT j.id, p.id
FROM juego j, catalogo_plataforma p
WHERE j.nombre = 'PUBG: Battlegrounds'
AND p.valor IN ('PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'Mobile', 'Steam')
AND NOT EXISTS (
    SELECT 1 FROM juego_plataformas jp 
    WHERE jp."juegoId" = j.id AND jp."catalogoPlataformaId" = p.id
);

-- Rainbow Six Siege
INSERT INTO juego_plataformas ("juegoId", "catalogoPlataformaId")
SELECT j.id, p.id
FROM juego j, catalogo_plataforma p
WHERE j.nombre = 'Rainbow Six Siege'
AND p.valor IN ('PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'Ubisoft Connect')
AND NOT EXISTS (
    SELECT 1 FROM juego_plataformas jp 
    WHERE jp."juegoId" = j.id AND jp."catalogoPlataformaId" = p.id
);

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================
SELECT '=== RESUMEN DE DATOS ===' AS info;
SELECT 'Plataformas' AS tabla, COUNT(*) AS total FROM catalogo_plataforma;
SELECT 'Regiones' AS tabla, COUNT(*) AS total FROM catalogo_region;
SELECT 'Estados Torneo' AS tabla, COUNT(*) AS total FROM catalogo_estado_torneo;
SELECT 'Tipos Entrada' AS tabla, COUNT(*) AS total FROM catalogo_tipo_entrada;
SELECT 'Tipos Torneo' AS tabla, COUNT(*) AS total FROM catalogo_tipo_torneo;
SELECT 'Juegos' AS tabla, COUNT(*) AS total FROM juego;
SELECT 'Modos de Juego' AS tabla, COUNT(*) AS total FROM modo_juego;
SELECT 'Relaciones Juego-Plataforma' AS tabla, COUNT(*) AS total FROM juego_plataformas;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
