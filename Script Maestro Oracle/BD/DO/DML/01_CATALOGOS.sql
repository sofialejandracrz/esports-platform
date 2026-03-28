/*
============================================================================
  Script: 01_CATALOGOS.sql
  Descripcion: Inserts para todas las tablas de catalogos
  Proyecto: Plataforma eSports - Base de datos OLTP
  Fecha: 16/Marzo/2026
============================================================================
*/

-- =========================================================================
-- CATALOGO_ROL (3 registros)
-- =========================================================================
INSERT INTO CATALOGO_ROL (ID, VALOR) VALUES (SEQ_CATALOGO_ROL.NEXTVAL, 'admin');
INSERT INTO CATALOGO_ROL (ID, VALOR) VALUES (SEQ_CATALOGO_ROL.NEXTVAL, 'usuario');
INSERT INTO CATALOGO_ROL (ID, VALOR) VALUES (SEQ_CATALOGO_ROL.NEXTVAL, 'moderador');

-- =========================================================================
-- CATALOGO_GENERO (4 registros)
-- =========================================================================
INSERT INTO CATALOGO_GENERO (ID, VALOR) VALUES (SEQ_CATALOGO_GENERO.NEXTVAL, 'Masculino');
INSERT INTO CATALOGO_GENERO (ID, VALOR) VALUES (SEQ_CATALOGO_GENERO.NEXTVAL, 'Femenino');
INSERT INTO CATALOGO_GENERO (ID, VALOR) VALUES (SEQ_CATALOGO_GENERO.NEXTVAL, 'Otro');
INSERT INTO CATALOGO_GENERO (ID, VALOR) VALUES (SEQ_CATALOGO_GENERO.NEXTVAL, 'Prefiero no decir');

-- =========================================================================
-- CATALOGO_ESTADO_AMISTAD (4 registros)
-- =========================================================================
INSERT INTO CATALOGO_ESTADO_AMISTAD (ID, VALOR) VALUES (SEQ_CATALOGO_ESTADO_AMISTAD.NEXTVAL, 'pendiente');
INSERT INTO CATALOGO_ESTADO_AMISTAD (ID, VALOR) VALUES (SEQ_CATALOGO_ESTADO_AMISTAD.NEXTVAL, 'aceptado');
INSERT INTO CATALOGO_ESTADO_AMISTAD (ID, VALOR) VALUES (SEQ_CATALOGO_ESTADO_AMISTAD.NEXTVAL, 'rechazado');
INSERT INTO CATALOGO_ESTADO_AMISTAD (ID, VALOR) VALUES (SEQ_CATALOGO_ESTADO_AMISTAD.NEXTVAL, 'bloqueado');

-- =========================================================================
-- CATALOGO_ESTADO_INSCRIPCION (4 registros)
-- =========================================================================
INSERT INTO CATALOGO_ESTADO_INSCRIPCION (ID, VALOR) VALUES (SEQ_CATALOGO_ESTADO_INSCRIPCION.NEXTVAL, 'pendiente');
INSERT INTO CATALOGO_ESTADO_INSCRIPCION (ID, VALOR) VALUES (SEQ_CATALOGO_ESTADO_INSCRIPCION.NEXTVAL, 'confirmada');
INSERT INTO CATALOGO_ESTADO_INSCRIPCION (ID, VALOR) VALUES (SEQ_CATALOGO_ESTADO_INSCRIPCION.NEXTVAL, 'cancelada');
INSERT INTO CATALOGO_ESTADO_INSCRIPCION (ID, VALOR) VALUES (SEQ_CATALOGO_ESTADO_INSCRIPCION.NEXTVAL, 'rechazada');

-- =========================================================================
-- CATALOGO_ESTADO_TORNEO (4 registros)
-- =========================================================================
INSERT INTO CATALOGO_ESTADO_TORNEO (ID, VALOR) VALUES (SEQ_CATALOGO_ESTADO_TORNEO.NEXTVAL, 'proximamente');
INSERT INTO CATALOGO_ESTADO_TORNEO (ID, VALOR) VALUES (SEQ_CATALOGO_ESTADO_TORNEO.NEXTVAL, 'en_curso');
INSERT INTO CATALOGO_ESTADO_TORNEO (ID, VALOR) VALUES (SEQ_CATALOGO_ESTADO_TORNEO.NEXTVAL, 'terminado');
INSERT INTO CATALOGO_ESTADO_TORNEO (ID, VALOR) VALUES (SEQ_CATALOGO_ESTADO_TORNEO.NEXTVAL, 'cancelado');

-- =========================================================================
-- CATALOGO_ORIGEN_TRANSACCION (7 registros)
-- =========================================================================
INSERT INTO CATALOGO_ORIGEN_TRANSACCION (ID, VALOR) VALUES (SEQ_CATALOGO_ORIGEN_TRANSACCION.NEXTVAL, 'compra');
INSERT INTO CATALOGO_ORIGEN_TRANSACCION (ID, VALOR) VALUES (SEQ_CATALOGO_ORIGEN_TRANSACCION.NEXTVAL, 'premio');
INSERT INTO CATALOGO_ORIGEN_TRANSACCION (ID, VALOR) VALUES (SEQ_CATALOGO_ORIGEN_TRANSACCION.NEXTVAL, 'reembolso');
INSERT INTO CATALOGO_ORIGEN_TRANSACCION (ID, VALOR) VALUES (SEQ_CATALOGO_ORIGEN_TRANSACCION.NEXTVAL, 'regalo');
INSERT INTO CATALOGO_ORIGEN_TRANSACCION (ID, VALOR) VALUES (SEQ_CATALOGO_ORIGEN_TRANSACCION.NEXTVAL, 'logro');
INSERT INTO CATALOGO_ORIGEN_TRANSACCION (ID, VALOR) VALUES (SEQ_CATALOGO_ORIGEN_TRANSACCION.NEXTVAL, 'torneo');
INSERT INTO CATALOGO_ORIGEN_TRANSACCION (ID, VALOR) VALUES (SEQ_CATALOGO_ORIGEN_TRANSACCION.NEXTVAL, 'inscripcion');

-- =========================================================================
-- CATALOGO_PLATAFORMA (14 registros)
-- =========================================================================
INSERT INTO CATALOGO_PLATAFORMA (ID, VALOR) VALUES (SEQ_CATALOGO_PLATAFORMA.NEXTVAL, 'PC');
INSERT INTO CATALOGO_PLATAFORMA (ID, VALOR) VALUES (SEQ_CATALOGO_PLATAFORMA.NEXTVAL, 'PlayStation 5');
INSERT INTO CATALOGO_PLATAFORMA (ID, VALOR) VALUES (SEQ_CATALOGO_PLATAFORMA.NEXTVAL, 'PlayStation 4');
INSERT INTO CATALOGO_PLATAFORMA (ID, VALOR) VALUES (SEQ_CATALOGO_PLATAFORMA.NEXTVAL, 'Xbox Series X/S');
INSERT INTO CATALOGO_PLATAFORMA (ID, VALOR) VALUES (SEQ_CATALOGO_PLATAFORMA.NEXTVAL, 'Xbox One');
INSERT INTO CATALOGO_PLATAFORMA (ID, VALOR) VALUES (SEQ_CATALOGO_PLATAFORMA.NEXTVAL, 'Nintendo Switch');
INSERT INTO CATALOGO_PLATAFORMA (ID, VALOR) VALUES (SEQ_CATALOGO_PLATAFORMA.NEXTVAL, 'Mobile');
INSERT INTO CATALOGO_PLATAFORMA (ID, VALOR) VALUES (SEQ_CATALOGO_PLATAFORMA.NEXTVAL, 'Steam');
INSERT INTO CATALOGO_PLATAFORMA (ID, VALOR) VALUES (SEQ_CATALOGO_PLATAFORMA.NEXTVAL, 'Epic Games');
INSERT INTO CATALOGO_PLATAFORMA (ID, VALOR) VALUES (SEQ_CATALOGO_PLATAFORMA.NEXTVAL, 'Battle.net');
INSERT INTO CATALOGO_PLATAFORMA (ID, VALOR) VALUES (SEQ_CATALOGO_PLATAFORMA.NEXTVAL, 'Origin');
INSERT INTO CATALOGO_PLATAFORMA (ID, VALOR) VALUES (SEQ_CATALOGO_PLATAFORMA.NEXTVAL, 'Ubisoft Connect');
INSERT INTO CATALOGO_PLATAFORMA (ID, VALOR) VALUES (SEQ_CATALOGO_PLATAFORMA.NEXTVAL, 'GOG');
INSERT INTO CATALOGO_PLATAFORMA (ID, VALOR) VALUES (SEQ_CATALOGO_PLATAFORMA.NEXTVAL, 'Crossplay');

-- =========================================================================
-- CATALOGO_REGION (15 registros)
-- =========================================================================
INSERT INTO CATALOGO_REGION (ID, VALOR) VALUES (SEQ_CATALOGO_REGION.NEXTVAL, 'Norte America');
INSERT INTO CATALOGO_REGION (ID, VALOR) VALUES (SEQ_CATALOGO_REGION.NEXTVAL, 'Sur America');
INSERT INTO CATALOGO_REGION (ID, VALOR) VALUES (SEQ_CATALOGO_REGION.NEXTVAL, 'Europa');
INSERT INTO CATALOGO_REGION (ID, VALOR) VALUES (SEQ_CATALOGO_REGION.NEXTVAL, 'Asia');
INSERT INTO CATALOGO_REGION (ID, VALOR) VALUES (SEQ_CATALOGO_REGION.NEXTVAL, 'Oceania');
INSERT INTO CATALOGO_REGION (ID, VALOR) VALUES (SEQ_CATALOGO_REGION.NEXTVAL, 'Africa');
INSERT INTO CATALOGO_REGION (ID, VALOR) VALUES (SEQ_CATALOGO_REGION.NEXTVAL, 'LATAM');
INSERT INTO CATALOGO_REGION (ID, VALOR) VALUES (SEQ_CATALOGO_REGION.NEXTVAL, 'Brasil');
INSERT INTO CATALOGO_REGION (ID, VALOR) VALUES (SEQ_CATALOGO_REGION.NEXTVAL, 'Global');
INSERT INTO CATALOGO_REGION (ID, VALOR) VALUES (SEQ_CATALOGO_REGION.NEXTVAL, 'Mexico');
INSERT INTO CATALOGO_REGION (ID, VALOR) VALUES (SEQ_CATALOGO_REGION.NEXTVAL, 'Espana');
INSERT INTO CATALOGO_REGION (ID, VALOR) VALUES (SEQ_CATALOGO_REGION.NEXTVAL, 'Argentina');
INSERT INTO CATALOGO_REGION (ID, VALOR) VALUES (SEQ_CATALOGO_REGION.NEXTVAL, 'Chile');
INSERT INTO CATALOGO_REGION (ID, VALOR) VALUES (SEQ_CATALOGO_REGION.NEXTVAL, 'Colombia');
INSERT INTO CATALOGO_REGION (ID, VALOR) VALUES (SEQ_CATALOGO_REGION.NEXTVAL, 'Peru');

-- =========================================================================
-- CATALOGO_TIPO_ENTRADA (4 registros)
-- =========================================================================
INSERT INTO CATALOGO_TIPO_ENTRADA (ID, VALOR) VALUES (SEQ_CATALOGO_TIPO_ENTRADA.NEXTVAL, 'mando');
INSERT INTO CATALOGO_TIPO_ENTRADA (ID, VALOR) VALUES (SEQ_CATALOGO_TIPO_ENTRADA.NEXTVAL, 'teclado');
INSERT INTO CATALOGO_TIPO_ENTRADA (ID, VALOR) VALUES (SEQ_CATALOGO_TIPO_ENTRADA.NEXTVAL, 'todos');
INSERT INTO CATALOGO_TIPO_ENTRADA (ID, VALOR) VALUES (SEQ_CATALOGO_TIPO_ENTRADA.NEXTVAL, 'touch');

-- =========================================================================
-- CATALOGO_TIPO_ITEM (5 registros)
-- =========================================================================
INSERT INTO CATALOGO_TIPO_ITEM (ID, VALOR) VALUES (SEQ_CATALOGO_TIPO_ITEM.NEXTVAL, 'creditos');
INSERT INTO CATALOGO_TIPO_ITEM (ID, VALOR) VALUES (SEQ_CATALOGO_TIPO_ITEM.NEXTVAL, 'membresia');
INSERT INTO CATALOGO_TIPO_ITEM (ID, VALOR) VALUES (SEQ_CATALOGO_TIPO_ITEM.NEXTVAL, 'servicio');
INSERT INTO CATALOGO_TIPO_ITEM (ID, VALOR) VALUES (SEQ_CATALOGO_TIPO_ITEM.NEXTVAL, 'avatar');
INSERT INTO CATALOGO_TIPO_ITEM (ID, VALOR) VALUES (SEQ_CATALOGO_TIPO_ITEM.NEXTVAL, 'banner');

-- =========================================================================
-- CATALOGO_TIPO_TORNEO (5 registros)
-- =========================================================================
INSERT INTO CATALOGO_TIPO_TORNEO (ID, VALOR, DESCRIPCION, TIPO_TROFEO) VALUES (SEQ_CATALOGO_TIPO_TORNEO.NEXTVAL, 'eliminacion_simple', 'Eliminacion simple - Un jugador pierde y queda eliminado', 'trofeo_eliminacion');
INSERT INTO CATALOGO_TIPO_TORNEO (ID, VALOR, DESCRIPCION, TIPO_TROFEO) VALUES (SEQ_CATALOGO_TIPO_TORNEO.NEXTVAL, 'eliminacion_doble', 'Eliminacion doble - Debe perder dos veces para ser eliminado', 'trofeo_eliminacion_doble');
INSERT INTO CATALOGO_TIPO_TORNEO (ID, VALOR, DESCRIPCION, TIPO_TROFEO) VALUES (SEQ_CATALOGO_TIPO_TORNEO.NEXTVAL, 'todos_contra_todos', 'Round Robin - Todos juegan contra todos', 'trofeo_round_robin');
INSERT INTO CATALOGO_TIPO_TORNEO (ID, VALOR, DESCRIPCION, TIPO_TROFEO) VALUES (SEQ_CATALOGO_TIPO_TORNEO.NEXTVAL, 'grupos', 'Fase de grupos con eliminatorias', 'trofeo_grupos');
INSERT INTO CATALOGO_TIPO_TORNEO (ID, VALOR, DESCRIPCION, TIPO_TROFEO) VALUES (SEQ_CATALOGO_TIPO_TORNEO.NEXTVAL, 'suizo', 'Sistema suizo - Emparejamientos segun rendimiento', 'trofeo_suizo');

-- =========================================================================
-- CATALOGO_TRANSACCION_TIPO (4 registros)
-- =========================================================================
INSERT INTO CATALOGO_TRANSACCION_TIPO (ID, VALOR) VALUES (SEQ_CATALOGO_TRANSACCION_TIPO.NEXTVAL, 'saldo');
INSERT INTO CATALOGO_TRANSACCION_TIPO (ID, VALOR) VALUES (SEQ_CATALOGO_TRANSACCION_TIPO.NEXTVAL, 'creditos');
INSERT INTO CATALOGO_TRANSACCION_TIPO (ID, VALOR) VALUES (SEQ_CATALOGO_TRANSACCION_TIPO.NEXTVAL, 'premio');
INSERT INTO CATALOGO_TRANSACCION_TIPO (ID, VALOR) VALUES (SEQ_CATALOGO_TRANSACCION_TIPO.NEXTVAL, 'inscripcion');

-- =========================================================================
-- MEMBRESIA_TIPO (5 registros)
-- =========================================================================
INSERT INTO MEMBRESIA_TIPO (ID, NOMBRE, PRECIO, DURACION_DIAS, BENEFICIOS) VALUES (SEQ_MEMBRESIA_TIPO.NEXTVAL, 'Gratuita', 0.00, 0, 'Acceso a competiciones gratuitas, Desafia a otros jugadores');
INSERT INTO MEMBRESIA_TIPO (ID, NOMBRE, PRECIO, DURACION_DIAS, BENEFICIOS) VALUES (SEQ_MEMBRESIA_TIPO.NEXTVAL, 'Premium 1 Mes', 5.99, 30, 'Todo lo gratuito + Sin comisiones, Torneos ELITE, Avatares premium');
INSERT INTO MEMBRESIA_TIPO (ID, NOMBRE, PRECIO, DURACION_DIAS, BENEFICIOS) VALUES (SEQ_MEMBRESIA_TIPO.NEXTVAL, 'Premium 3 Meses', 12.99, 90, 'Todo lo de Premium + Ahorra un 28%');
INSERT INTO MEMBRESIA_TIPO (ID, NOMBRE, PRECIO, DURACION_DIAS, BENEFICIOS) VALUES (SEQ_MEMBRESIA_TIPO.NEXTVAL, 'Premium 6 Meses', 24.99, 180, 'Todo lo de Premium + Ahorra un 30%');
INSERT INTO MEMBRESIA_TIPO (ID, NOMBRE, PRECIO, DURACION_DIAS, BENEFICIOS) VALUES (SEQ_MEMBRESIA_TIPO.NEXTVAL, 'Premium 12 Meses', 49.99, 365, 'Todo lo de Premium + Ahorra un 30%');

-- =========================================================================
-- LOGRO (20 registros)
-- =========================================================================
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Primer Victoria', 'Gana tu primera partida competitiva');
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Racha Imparable', 'Gana 5 partidas consecutivas');
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Leyenda del Torneo', 'Gana un torneo de mas de 32 jugadores');
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Veterano', 'Juega mas de 100 partidas');
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Coleccionista', 'Desbloquea 10 avatares');
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Social Butterfly', 'Agrega 20 amigos');
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Influencer', 'Consigue 50 seguidores');
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Multijugador', 'Juega 5 juegos diferentes');
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Capitan', 'Crea un equipo');
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Inversor', 'Compra tu primera membresia premium');
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Novato', 'Completa tu perfil por primera vez');
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Maestro del Arena', 'Gana 50 partidas en total');
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Rey del Podio', 'Termina en el top 3 de un torneo 10 veces');
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Gladiador', 'Participa en 25 torneos');
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Maratonista', 'Juega mas de 500 horas en total');
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Comprador Frecuente', 'Realiza 10 compras en la tienda');
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Lider de Equipo', 'Se lider de un equipo con 5 miembros');
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Anfitrion Elite', 'Organiza 10 torneos');
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Sin Derrota', 'Gana un torneo sin perder una sola partida');
INSERT INTO LOGRO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_LOGRO.NEXTVAL, 'Celebridad', 'Consigue 100 seguidores');

-- =========================================================================
-- CATALOGO_AVATAR (70 registros con bloque anonimo)
-- =========================================================================
DECLARE
    TYPE t_seeds IS TABLE OF VARCHAR2(50);
    v_seeds t_seeds := t_seeds(
        'Felix', 'Aneka', 'Buster', 'Midnight', 'Precious', 'Shadow',
        'Lucky', 'Misty', 'Buddy', 'Charlie', 'Max', 'Luna', 'Rocky',
        'Daisy', 'Bailey', 'Coco', 'Milo', 'Bella', 'Oliver', 'Zoe',
        'Leo', 'Lily', 'Cooper', 'Lucy', 'Bear', 'Molly', 'Duke', 'Sophie',
        'Zeus', 'Sadie', 'Jack', 'Maggie', 'Toby', 'Stella', 'Teddy',
        'Penny', 'Winston', 'Chloe', 'Tucker', 'Lola', 'Jake', 'Nala',
        'Bentley', 'Gracie', 'Oscar', 'Ruby', 'Gizmo', 'Rosie', 'Thor',
        'Ellie', 'Bandit', 'Zoey', 'Finn', 'Ginger', 'Harley', 'Princess',
        'Murphy', 'Piper', 'Riley', 'Willow', 'Hank', 'Emma', 'Louie',
        'Abby', 'Bruno', 'Angel', 'Diesel', 'Annie', 'Ace', 'Roxy'
    );
    v_premium NUMBER(1);
BEGIN
    FOR i IN 1..v_seeds.COUNT LOOP
        IF i > 50 THEN
            v_premium := 1;
        ELSE
            v_premium := 0;
        END IF;
        
        INSERT INTO CATALOGO_AVATAR (ID, NOMBRE, URL, SEED, CATEGORIA, DISPONIBLE, PREMIUM)
        VALUES (
            SEQ_CATALOGO_AVATAR.NEXTVAL,
            'bottts-' || LOWER(v_seeds(i)),
            'https://api.dicebear.com/9.x/bottts/svg?seed=' || v_seeds(i),
            v_seeds(i),
            'bottts',
            1,
            v_premium
        );
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Avatares insertados: ' || v_seeds.COUNT);
END;
/

-- =========================================================================
-- TIENDA_ITEM (14 registros)
-- =========================================================================
-- Items de creditos (tipo_id = 1 = creditos)
INSERT INTO TIENDA_ITEM (ID, NOMBRE, DESCRIPCION, PRECIO, CREDITOS_OTORGADOS, METADATA, TIPO_ID) VALUES (SEQ_TIENDA_ITEM.NEXTVAL, '1 Credito', 'Paquete basico de creditos', 1.00, 1, '{"destacado": false}', 1);
INSERT INTO TIENDA_ITEM (ID, NOMBRE, DESCRIPCION, PRECIO, CREDITOS_OTORGADOS, METADATA, TIPO_ID) VALUES (SEQ_TIENDA_ITEM.NEXTVAL, '3 Creditos', 'Paquete de 3 creditos', 2.25, 3, '{"destacado": false}', 1);
INSERT INTO TIENDA_ITEM (ID, NOMBRE, DESCRIPCION, PRECIO, CREDITOS_OTORGADOS, METADATA, TIPO_ID) VALUES (SEQ_TIENDA_ITEM.NEXTVAL, '5 Creditos', 'Paquete de 5 creditos', 3.75, 5, '{"destacado": false}', 1);
INSERT INTO TIENDA_ITEM (ID, NOMBRE, DESCRIPCION, PRECIO, CREDITOS_OTORGADOS, METADATA, TIPO_ID) VALUES (SEQ_TIENDA_ITEM.NEXTVAL, '7 Creditos', 'Paquete de 7 creditos', 5.00, 7, '{"destacado": true}', 1);
INSERT INTO TIENDA_ITEM (ID, NOMBRE, DESCRIPCION, PRECIO, CREDITOS_OTORGADOS, METADATA, TIPO_ID) VALUES (SEQ_TIENDA_ITEM.NEXTVAL, '10 Creditos', 'Paquete de 10 creditos', 7.50, 10, '{"destacado": false}', 1);
INSERT INTO TIENDA_ITEM (ID, NOMBRE, DESCRIPCION, PRECIO, CREDITOS_OTORGADOS, METADATA, TIPO_ID) VALUES (SEQ_TIENDA_ITEM.NEXTVAL, '15 Creditos', 'Paquete de 15 creditos - Mejor valor', 10.00, 15, '{"destacado": true}', 1);

-- Items de servicio (tipo_id = 3 = servicio)
INSERT INTO TIENDA_ITEM (ID, NOMBRE, DESCRIPCION, PRECIO, CREDITOS_OTORGADOS, METADATA, TIPO_ID) VALUES (SEQ_TIENDA_ITEM.NEXTVAL, 'Cambio de Nickname', 'Cambia tu nombre de usuario', 3.99, NULL, '{"servicioTipo": "cambio_nickname"}', 3);
INSERT INTO TIENDA_ITEM (ID, NOMBRE, DESCRIPCION, PRECIO, CREDITOS_OTORGADOS, METADATA, TIPO_ID) VALUES (SEQ_TIENDA_ITEM.NEXTVAL, 'Reiniciar Record', 'Reinicia tu historial de partidas', 5.99, NULL, '{"servicioTipo": "reset_record"}', 3);
INSERT INTO TIENDA_ITEM (ID, NOMBRE, DESCRIPCION, PRECIO, CREDITOS_OTORGADOS, METADATA, TIPO_ID) VALUES (SEQ_TIENDA_ITEM.NEXTVAL, 'Reiniciar Estadisticas', 'Reinicia tus estadisticas', 3.99, NULL, '{"servicioTipo": "reset_stats"}', 3);
INSERT INTO TIENDA_ITEM (ID, NOMBRE, DESCRIPCION, PRECIO, CREDITOS_OTORGADOS, METADATA, TIPO_ID) VALUES (SEQ_TIENDA_ITEM.NEXTVAL, 'Reclamar Nombre', 'Reclama un nombre inactivo', 9.99, NULL, '{"servicioTipo": "reclamar_nickname"}', 3);

-- Items de membresia (tipo_id = 2 = membresia)
INSERT INTO TIENDA_ITEM (ID, NOMBRE, DESCRIPCION, PRECIO, CREDITOS_OTORGADOS, METADATA, TIPO_ID) VALUES (SEQ_TIENDA_ITEM.NEXTVAL, 'Premium 1 Mes', 'Membresia Premium 1 Mes', 5.99, NULL, '{"membresiaTipoId": 2, "duracionDias": 30}', 2);
INSERT INTO TIENDA_ITEM (ID, NOMBRE, DESCRIPCION, PRECIO, CREDITOS_OTORGADOS, METADATA, TIPO_ID) VALUES (SEQ_TIENDA_ITEM.NEXTVAL, 'Premium 3 Meses', 'Membresia Premium 3 Meses', 12.99, NULL, '{"membresiaTipoId": 3, "duracionDias": 90}', 2);
INSERT INTO TIENDA_ITEM (ID, NOMBRE, DESCRIPCION, PRECIO, CREDITOS_OTORGADOS, METADATA, TIPO_ID) VALUES (SEQ_TIENDA_ITEM.NEXTVAL, 'Premium 6 Meses', 'Membresia Premium 6 Meses', 24.99, NULL, '{"membresiaTipoId": 4, "duracionDias": 180}', 2);
INSERT INTO TIENDA_ITEM (ID, NOMBRE, DESCRIPCION, PRECIO, CREDITOS_OTORGADOS, METADATA, TIPO_ID) VALUES (SEQ_TIENDA_ITEM.NEXTVAL, 'Premium 12 Meses', 'Membresia Premium 12 Meses', 49.99, NULL, '{"membresiaTipoId": 5, "duracionDias": 365}', 2);

-- =========================================================================
-- JUEGO (15 registros)
-- =========================================================================
INSERT INTO JUEGO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_JUEGO.NEXTVAL, 'Call of Duty: Warzone', 'Battle Royale gratuito de Call of Duty');
INSERT INTO JUEGO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_JUEGO.NEXTVAL, 'Fortnite', 'Battle Royale con construccion de Epic Games');
INSERT INTO JUEGO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_JUEGO.NEXTVAL, 'League of Legends', 'MOBA competitivo de Riot Games');
INSERT INTO JUEGO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_JUEGO.NEXTVAL, 'Valorant', 'Shooter tactico 5v5 de Riot Games');
INSERT INTO JUEGO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_JUEGO.NEXTVAL, 'Apex Legends', 'Battle Royale de escuadrones de EA');
INSERT INTO JUEGO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_JUEGO.NEXTVAL, 'Counter-Strike 2', 'Shooter tactico competitivo de Valve');
INSERT INTO JUEGO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_JUEGO.NEXTVAL, 'Rocket League', 'Futbol con autos de Psyonix');
INSERT INTO JUEGO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_JUEGO.NEXTVAL, 'FIFA 24', 'Simulador de futbol de EA Sports');
INSERT INTO JUEGO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_JUEGO.NEXTVAL, 'Super Smash Bros. Ultimate', 'Juego de peleas crossover de Nintendo');
INSERT INTO JUEGO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_JUEGO.NEXTVAL, 'Street Fighter 6', 'Juego de peleas de Capcom');
INSERT INTO JUEGO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_JUEGO.NEXTVAL, 'Tekken 8', 'Juego de peleas 3D de Bandai Namco');
INSERT INTO JUEGO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_JUEGO.NEXTVAL, 'Dota 2', 'MOBA competitivo de Valve');
INSERT INTO JUEGO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_JUEGO.NEXTVAL, 'Overwatch 2', 'Hero shooter de Blizzard');
INSERT INTO JUEGO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_JUEGO.NEXTVAL, 'PUBG: Battlegrounds', 'Battle Royale original de KRAFTON');
INSERT INTO JUEGO (ID, NOMBRE, DESCRIPCION) VALUES (SEQ_JUEGO.NEXTVAL, 'Rainbow Six Siege', 'Shooter tactico de Ubisoft');

-- =========================================================================
-- JUEGO_PLATAFORMAS (relaciones M:N)
-- =========================================================================
-- COD Warzone (juego 1): PC(1), PS5(2), PS4(3), Xbox Series(4), Xbox One(5)
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (1, 1);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (1, 2);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (1, 3);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (1, 4);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (1, 5);
-- Fortnite (juego 2): PC, PS5, PS4, Xbox Series, Xbox One, Switch, Mobile
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (2, 1);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (2, 2);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (2, 3);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (2, 4);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (2, 5);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (2, 6);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (2, 7);
-- LoL (juego 3): PC
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (3, 1);
-- Valorant (juego 4): PC
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (4, 1);
-- Apex (juego 5): PC, PS5, PS4, Xbox Series, Xbox One, Switch
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (5, 1);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (5, 2);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (5, 3);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (5, 4);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (5, 5);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (5, 6);
-- CS2 (juego 6): PC, Steam
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (6, 1);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (6, 8);
-- Rocket League (juego 7): PC, PS5, PS4, Xbox, Switch, Epic
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (7, 1);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (7, 2);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (7, 4);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (7, 6);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (7, 9);
-- FIFA 24 (juego 8): PC, PS5, PS4, Xbox
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (8, 1);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (8, 2);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (8, 3);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (8, 4);
-- Smash Bros (juego 9): Switch
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (9, 6);
-- Street Fighter 6 (juego 10): PC, PS5, Xbox, Steam
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (10, 1);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (10, 2);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (10, 4);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (10, 8);
-- Tekken 8 (juego 11): PC, PS5, Xbox, Steam
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (11, 1);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (11, 2);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (11, 4);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (11, 8);
-- Dota 2 (juego 12): PC, Steam
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (12, 1);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (12, 8);
-- Overwatch 2 (juego 13): PC, PS5, PS4, Xbox, Switch, Battle.net
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (13, 1);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (13, 2);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (13, 3);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (13, 4);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (13, 6);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (13, 10);
-- PUBG (juego 14): PC, PS5, PS4, Xbox, Mobile, Steam
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (14, 1);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (14, 2);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (14, 3);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (14, 4);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (14, 7);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (14, 8);
-- Rainbow Six (juego 15): PC, PS5, PS4, Xbox, Ubisoft
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (15, 1);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (15, 2);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (15, 3);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (15, 4);
INSERT INTO JUEGO_PLATAFORMAS (JUEGO_ID, CATALOGO_PLATAFORMA_ID) VALUES (15, 12);

-- =========================================================================
-- MODO_JUEGO (55 registros con bloque anonimo)
-- =========================================================================
DECLARE
    TYPE t_modo IS RECORD (nombre VARCHAR2(200), descripcion VARCHAR2(500), juego_id NUMBER);
    TYPE t_modos IS TABLE OF t_modo;
    v_modos t_modos := t_modos();
    
    PROCEDURE add_modo(p_nombre VARCHAR2, p_desc VARCHAR2, p_juego NUMBER) IS
    BEGIN
        v_modos.EXTEND;
        v_modos(v_modos.COUNT).nombre := p_nombre;
        v_modos(v_modos.COUNT).descripcion := p_desc;
        v_modos(v_modos.COUNT).juego_id := p_juego;
    END;
BEGIN
    -- COD Warzone (1)
    add_modo('Battle Royale Solo', 'Ultimo jugador en pie', 1);
    add_modo('Battle Royale Duos', 'Equipos de 2 jugadores', 1);
    add_modo('Battle Royale Trios', 'Equipos de 3 jugadores', 1);
    add_modo('Battle Royale Cuartetos', 'Equipos de 4 jugadores', 1);
    add_modo('Resurgimiento', 'Battle Royale con respawn', 1);
    -- Fortnite (2)
    add_modo('Solo', 'Battle Royale individual', 2);
    add_modo('Duos', 'Equipos de 2', 2);
    add_modo('Trios', 'Equipos de 3', 2);
    add_modo('Escuadrones', 'Equipos de 4', 2);
    add_modo('Zero Build Solo', 'Sin construccion individual', 2);
    add_modo('Zero Build Escuadrones', 'Sin construccion equipos', 2);
    -- LoL (3)
    add_modo('Grieta del Invocador 5v5', 'Modo competitivo estandar', 3);
    add_modo('ARAM', 'All Random All Mid', 3);
    add_modo('Clash', 'Torneos organizados', 3);
    -- Valorant (4)
    add_modo('Competitivo', 'Modo rankeado 5v5', 4);
    add_modo('Sin clasificar', 'Partidas casuales 5v5', 4);
    add_modo('Spike Rush', 'Partidas rapidas', 4);
    add_modo('Deathmatch', 'Todos contra todos', 4);
    -- Apex (5)
    add_modo('BR Trios', 'Escuadrones de 3', 5);
    add_modo('BR Duos', 'Escuadrones de 2', 5);
    add_modo('Arenas', 'Combate 3v3', 5);
    add_modo('Control', 'Modo de control de puntos', 5);
    -- CS2 (6)
    add_modo('Competitivo CS2', 'Partidas rankeadas 5v5', 6);
    add_modo('Premier', 'Modo competitivo premium', 6);
    add_modo('Wingman', 'Partidas 2v2', 6);
    add_modo('Casual', 'Partidas sin rango', 6);
    -- Rocket League (7)
    add_modo('1v1', 'Duelo individual', 7);
    add_modo('2v2', 'Duos', 7);
    add_modo('3v3', 'Estandar', 7);
    add_modo('Hoops', 'Basquetbol', 7);
    add_modo('Rumble', 'Con power-ups', 7);
    -- FIFA 24 (8)
    add_modo('Ultimate Team', 'Construye tu equipo', 8);
    add_modo('1v1 Online', 'Partida individual', 8);
    add_modo('Pro Clubs', 'Equipos de jugadores', 8);
    add_modo('Co-op Seasons', 'Cooperativo en linea', 8);
    -- Smash (9)
    add_modo('1v1 Smash', 'Duelo individual', 9);
    add_modo('2v2 Smash', 'Equipos', 9);
    add_modo('Free For All', 'Todos contra todos', 9);
    -- SF6 (10)
    add_modo('Ranked Match SF6', 'Partidas rankeadas 1v1', 10);
    add_modo('Casual Match SF6', 'Partidas casuales', 10);
    add_modo('Battle Hub', 'Lobby social', 10);
    -- Tekken (11)
    add_modo('Ranked Match Tekken', 'Partidas rankeadas 1v1', 11);
    add_modo('Quick Match', 'Partidas rapidas', 11);
    add_modo('Lobby Match', 'Salas personalizadas', 11);
    -- Dota 2 (12)
    add_modo('All Pick', 'Modo estandar 5v5', 12);
    add_modo('Captain Mode', 'Modo competitivo con draft', 12);
    add_modo('Turbo', 'Partidas rapidas', 12);
    -- OW2 (13)
    add_modo('Competitivo OW2', 'Partidas rankeadas 5v5', 13);
    add_modo('Quick Play', 'Partidas rapidas', 13);
    add_modo('Arcade', 'Modos especiales', 13);
    -- PUBG (14)
    add_modo('Solo PUBG', 'Battle Royale individual', 14);
    add_modo('Duo PUBG', 'Equipos de 2', 14);
    add_modo('Escuadron PUBG', 'Equipos de 4', 14);
    -- R6 (15)
    add_modo('Ranked R6', 'Partidas rankeadas 5v5', 15);
    add_modo('Unranked R6', 'Sin rango 5v5', 15);
    add_modo('Quick Match R6', 'Partidas rapidas', 15);
    
    FOR i IN 1..v_modos.COUNT LOOP
        INSERT INTO MODO_JUEGO (ID, NOMBRE, DESCRIPCION, JUEGO_ID)
        VALUES (SEQ_MODO_JUEGO.NEXTVAL, v_modos(i).nombre, v_modos(i).descripcion, v_modos(i).juego_id);
    END LOOP;
    
    DBMS_OUTPUT.PUT_LINE('Modos de juego insertados: ' || v_modos.COUNT);
END;
/

COMMIT;
PROMPT >>> Catalogos insertados exitosamente <<<
