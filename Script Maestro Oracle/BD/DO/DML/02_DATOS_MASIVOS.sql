/*
============================================================================
  Script: 02_DATOS_MASIVOS.sql
  Descripcion: Generacion masiva de datos con bloques anonimos PL/SQL
               Cada tabla transaccional tendra minimo 50 registros
  Proyecto: Plataforma eSports - Base de datos OLTP
  Fecha: 16/Marzo/2026
============================================================================
*/

-- =========================================================================
-- 1. PERSONA (60 registros)
-- =========================================================================
DECLARE
    TYPE t_nombres IS TABLE OF VARCHAR2(50);
    TYPE t_apellidos IS TABLE OF VARCHAR2(50);
    v_nombres t_nombres := t_nombres(
        'Carlos', 'Maria', 'Juan', 'Ana', 'Pedro', 'Laura', 'Diego',
        'Sofia', 'Andres', 'Valentina', 'Miguel', 'Isabella', 'Fernando',
        'Camila', 'Roberto', 'Daniela', 'Luis', 'Gabriela', 'Jose',
        'Paula', 'David', 'Alejandra', 'Ricardo', 'Mariana', 'Eduardo',
        'Natalia', 'Francisco', 'Andrea', 'Sergio', 'Carolina'
    );
    v_apellidos t_apellidos := t_apellidos(
        'Garcia', 'Rodriguez', 'Martinez', 'Lopez', 'Hernandez',
        'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres',
        'Flores', 'Rivera', 'Gomez', 'Diaz', 'Cruz',
        'Morales', 'Vargas', 'Reyes', 'Gutierrez', 'Ortiz'
    );
    v_genero_id NUMBER;
    v_idx_nombre NUMBER;
    v_idx_ap1 NUMBER;
    v_idx_ap2 NUMBER;
    v_idx_snombre NUMBER;
    v_segundo_nombre VARCHAR2(50);
BEGIN
    FOR i IN 1..60 LOOP
        v_idx_nombre := MOD(i - 1, v_nombres.COUNT) + 1;
        v_idx_ap1 := MOD(i - 1, v_apellidos.COUNT) + 1;
        v_idx_ap2 := MOD(i + 4, v_apellidos.COUNT) + 1;
        
        -- Calcular segundo nombre fuera del INSERT para evitar error PLS-00425
        IF MOD(i, 3) = 0 THEN
            v_idx_snombre := MOD(i + 5, v_nombres.COUNT) + 1;
            v_segundo_nombre := v_nombres(v_idx_snombre);
        ELSE
            v_segundo_nombre := NULL;
        END IF;
        
        -- Asignar genero ciclicamente (1=Masculino, 2=Femenino, 3=Otro, 4=Prefiero no decir)
        v_genero_id := MOD(i - 1, 4) + 1;
        
        INSERT INTO PERSONA (
            ID, P_NOMBRE, S_NOMBRE, P_APELLIDO, S_APELLIDO,
            CORREO, FECHA_NACIMIENTO, TIMEZONE, TELEFONO,
            DIRECCION, CIUDAD, PAIS, GENERO_ID
        ) VALUES (
            SEQ_PERSONA.NEXTVAL,
            v_nombres(v_idx_nombre),
            v_segundo_nombre,
            v_apellidos(v_idx_ap1),
            v_apellidos(v_idx_ap2),
            LOWER(v_nombres(v_idx_nombre)) || '.' || LOWER(v_apellidos(v_idx_ap1)) || i || '@esports.com',
            TO_DATE('1990-01-01', 'YYYY-MM-DD') + TRUNC(DBMS_RANDOM.VALUE(0, 3650)),
            'America/Mexico_City',
            '+52' || LPAD(TRUNC(DBMS_RANDOM.VALUE(1000000000, 9999999999)), 10, '0'),
            'Calle ' || i || ' Col. Centro',
            CASE MOD(i, 5) 
                WHEN 0 THEN 'Tegucigalpa'
                WHEN 1 THEN 'San Pedro Sula'
                WHEN 2 THEN 'La Ceiba'
                WHEN 3 THEN 'Comayagua'
                WHEN 4 THEN 'Choluteca'
            END,
            'Honduras',
            v_genero_id
        );
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Personas insertadas: 60');
END;
/

COMMIT;

-- =========================================================================
-- 2. USUARIO (60 registros)
-- =========================================================================
DECLARE
    TYPE t_nicknames IS TABLE OF VARCHAR2(50);
    v_nicks t_nicknames := t_nicknames(
        'ProGamer', 'ShadowKnight', 'NeonStrike', 'CyberWolf', 'PhantomX',
        'BlazeFury', 'IronClad', 'StormRider', 'VortexKing', 'ThunderBolt',
        'NightHawk', 'DragonSlayer', 'CosmicRay', 'SteelFang', 'DarkMatter',
        'QuantumLeap', 'SilverBlade', 'GoldRush', 'CrimsonTide', 'EmeraldEye',
        'RubyStorm', 'DiamondCut', 'PlatinumX', 'BronzeStar', 'TitanForce',
        'NovaBurst', 'PulseFire', 'ZeroGravity', 'OmegaPrime', 'AlphaStrike',
        'BetaWave', 'GammaRay', 'DeltaForce', 'EpsilonX', 'ZetaHunter',
        'ArcticFox', 'DesertEagle', 'JungleCat', 'OceanWave', 'MountainPeak',
        'RiverFlow', 'SkyDiver', 'FireBreath', 'IceStorm', 'WindWalker',
        'EarthShaker', 'LavaKing', 'FrostBite', 'SunFlare', 'MoonBeam',
        'StarDust', 'CloudNine', 'RockSolid', 'WaveRider', 'FlameKnight',
        'ShadowHunter', 'StormBreaker', 'ThunderStrike', 'LightningBolt', 'DarkKnight'
    );
    v_rol_id NUMBER;
    v_avatar_id NUMBER;
BEGIN
    FOR i IN 1..60 LOOP
        -- Primer usuario = admin, resto = usuario
        IF i = 1 THEN
            v_rol_id := 1; -- admin
        ELSIF MOD(i, 20) = 0 THEN
            v_rol_id := 3; -- moderador
        ELSE
            v_rol_id := 2; -- usuario
        END IF;
        
        -- Asignar avatar ciclicamente
        v_avatar_id := MOD(i - 1, 70) + 1;
        
        INSERT INTO USUARIO (
            ID, NICKNAME, PASSWORD, ESTADO, XP, SALDO, CREDITOS,
            DESAFIOS_HABILITADOS, PERSONA_ID, ROL_ID, AVATAR_ID
        ) VALUES (
            SEQ_USUARIO.NEXTVAL,
            v_nicks(i),
            -- Hash simulado (en produccion seria bcrypt)
            '$2b$10$' || DBMS_RANDOM.STRING('X', 53),
            CASE WHEN MOD(i, 15) = 0 THEN 'suspendido' ELSE 'activo' END,
            TRUNC(DBMS_RANDOM.VALUE(0, 5000)),
            ROUND(DBMS_RANDOM.VALUE(0, 500), 2),
            TRUNC(DBMS_RANDOM.VALUE(0, 100)),
            1,
            i, -- persona_id = i (relacion 1:1)
            v_rol_id,
            v_avatar_id
        );
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Usuarios insertados: 60');
END;
/

COMMIT;

-- =========================================================================
-- 3. EQUIPO (55 registros)
-- =========================================================================
DECLARE
    TYPE t_equipos IS TABLE OF VARCHAR2(100);
    v_equipos t_equipos := t_equipos(
        'Los Invencibles', 'Shadow Squad', 'Cyber Warriors', 'Neon Knights',
        'Dark Phoenix', 'Storm Troopers', 'Iron Wolves', 'Blaze Force',
        'Thunder Hawks', 'Phantom Legends', 'Dragon Riders', 'Cosmic Elite',
        'Steel Vanguard', 'Nova Esports', 'Quantum Gaming', 'Emerald Tigers',
        'Ruby Legends', 'Diamond Dynasty', 'Gold Guardians', 'Platinum Pros',
        'Arctic Predators', 'Desert Storm', 'Jungle Kings', 'Ocean Monsters',
        'Mountain Lions', 'River Sharks', 'Sky Raiders', 'Fire Dragons',
        'Ice Titans', 'Wind Chasers', 'Earth Defenders', 'Lava Lords',
        'Frost Giants', 'Sun Warriors', 'Moon Shadows', 'Star Seekers',
        'Cloud Walkers', 'Rock Breakers', 'Wave Masters', 'Flame Guardians',
        'Los Halcones', 'Aguila Dorada', 'Puma Elite', 'Jaguar Force',
        'Condor Gaming', 'Quetzal Esports', 'Anaconda Squad', 'Piranha Team',
        'Tiburon Blanco', 'Lobo Alfa', 'Oso Grizzly', 'Leon Imperial',
        'Pantera Negra', 'Serpiente Real', 'Colibri Veloz'
    );
BEGIN
    FOR i IN 1..v_equipos.COUNT LOOP
        INSERT INTO EQUIPO (ID, NOMBRE, DESCRIPCION, CREADO_POR)
        VALUES (
            SEQ_EQUIPO.NEXTVAL,
            v_equipos(i),
            'Equipo competitivo de eSports - ' || v_equipos(i),
            MOD(i - 1, 60) + 1  -- creado_por: usuarios 1-60
        );
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Equipos insertados: ' || v_equipos.COUNT);
END;
/

COMMIT;

-- =========================================================================
-- 4. EQUIPO_MIEMBROS (165 registros - ~3 miembros por equipo)
-- =========================================================================
DECLARE
    v_usuario_id NUMBER;
    v_count NUMBER := 0;
BEGIN
    FOR i IN 1..55 LOOP
        -- Cada equipo tiene 3 miembros
        FOR j IN 0..2 LOOP
            v_usuario_id := MOD((i - 1) * 3 + j, 60) + 1;
            
            INSERT INTO EQUIPO_MIEMBROS (ID, ROL, EQUIPO_ID, USUARIO_ID)
            VALUES (
                SEQ_EQUIPO_MIEMBROS.NEXTVAL,
                CASE j WHEN 0 THEN 'capitan' WHEN 1 THEN 'subcapitan' ELSE 'miembro' END,
                i,
                v_usuario_id
            );
            v_count := v_count + 1;
        END LOOP;
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Miembros de equipo insertados: ' || v_count);
END;
/

COMMIT;

-- =========================================================================
-- 5. TORNEO (60 registros)
-- =========================================================================
DECLARE
    TYPE t_titulos IS TABLE OF VARCHAR2(200);
    v_titulos t_titulos := t_titulos(
        'Copa eSports LATAM 2025', 'Torneo Invernal de Valorant', 'Liga Premier de LoL',
        'Gran Final de CS2', 'Battle Royale Championship', 'Copa de las Americas',
        'Torneo Nocturno Elite', 'Liga Diamante', 'Copa Platino', 'Desafio Semanal',
        'Copa Fuego', 'Torneo Relampago', 'Liga Estelar', 'Copa Dragon',
        'Desafio Maestro', 'Copa CyberPro', 'Liga Infinita', 'Copa Titan',
        'Torneo Genesis', 'Copa Suprema', 'Liga Fenix', 'Copa Olimpica Digital',
        'Torneo de Campeones', 'Liga Centroamericana', 'Copa Catracha',
        'Torneo Hondureno', 'Liga Nacional eSports', 'Copa Tegucigalpa',
        'Desafio San Pedro Sula', 'Copa Universitaria', 'Liga Estudiantil',
        'Torneo Amateur Open', 'Copa Pro Series', 'Liga Masters',
        'Copa Legends', 'Torneo All-Stars', 'Liga de Novatos',
        'Copa Primavera', 'Torneo de Verano', 'Liga de Otono',
        'Copa de Invierno', 'Desafio Mensual Enero', 'Desafio Mensual Febrero',
        'Desafio Mensual Marzo', 'Desafio Mensual Abril', 'Desafio Mensual Mayo',
        'Desafio Mensual Junio', 'Desafio Mensual Julio', 'Desafio Mensual Agosto',
        'Desafio Mensual Septiembre', 'Desafio Mensual Octubre', 'Desafio Mensual Noviembre',
        'Desafio Mensual Diciembre', 'Super Copa Final', 'Gran Copa Anual',
        'Torneo Benefico', 'Copa Amistad', 'Liga Rapida', 'Copa Dorada', 'Copa Especial'
    );
    v_juego_id NUMBER;
    v_modo_id NUMBER;
    v_estado_id NUMBER;
    v_region_id NUMBER;
    v_plataforma_id NUMBER;
    v_tipo_torneo_id NUMBER;
    v_tipo_entrada_id NUMBER;
BEGIN
    FOR i IN 1..v_titulos.COUNT LOOP
        v_juego_id := MOD(i - 1, 15) + 1;
        v_estado_id := MOD(i - 1, 4) + 1;
        v_region_id := MOD(i - 1, 15) + 1;
        v_plataforma_id := MOD(i - 1, 14) + 1;
        v_tipo_torneo_id := MOD(i - 1, 5) + 1;
        v_tipo_entrada_id := MOD(i - 1, 4) + 1;
        
        -- Obtener un modo de juego valido para el juego
        BEGIN
            SELECT MIN(ID) INTO v_modo_id FROM MODO_JUEGO WHERE JUEGO_ID = v_juego_id;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN v_modo_id := NULL;
        END;
        
        INSERT INTO TORNEO (
            ID, TITULO, DESCRIPCION, 
            FECHA_INICIO_REGISTRO, FECHA_FIN_REGISTRO, FECHA_INICIO_TORNEO,
            AL_MEJOR_DE, FORMATO, CERRADO, CAPACIDAD,
            ANFITRION_ID, JUEGO_ID, PLATAFORMA_ID, MODO_JUEGO_ID,
            REGION_ID, ESTADO_ID, TIPO_TORNEO_ID, TIPO_ENTRADA_ID
        ) VALUES (
            SEQ_TORNEO.NEXTVAL,
            v_titulos(i),
            'Torneo competitivo de eSports: ' || v_titulos(i),
            SYSTIMESTAMP - INTERVAL '30' DAY + (i * INTERVAL '1' DAY),
            SYSTIMESTAMP - INTERVAL '15' DAY + (i * INTERVAL '1' DAY),
            SYSTIMESTAMP - INTERVAL '10' DAY + (i * INTERVAL '1' DAY),
            CASE MOD(i, 3) WHEN 0 THEN 3 WHEN 1 THEN 1 ELSE 5 END,
            CASE MOD(i, 2) WHEN 0 THEN 'eliminacion' ELSE 'round_robin' END,
            CASE WHEN v_estado_id = 3 THEN 1 ELSE 0 END,
            POWER(2, TRUNC(DBMS_RANDOM.VALUE(3, 7))), -- 8, 16, 32, 64
            MOD(i - 1, 60) + 1, -- anfitrion
            v_juego_id,
            v_plataforma_id,
            v_modo_id,
            v_region_id,
            v_estado_id,
            v_tipo_torneo_id,
            v_tipo_entrada_id
        );
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Torneos insertados: ' || v_titulos.COUNT);
END;
/

COMMIT;

-- =========================================================================
-- 6. TORNEO_INSCRIPCION (180 registros - ~3 inscritos por torneo)
-- =========================================================================
DECLARE
    v_count NUMBER := 0;
    v_usuario_id NUMBER;
    v_estado_id NUMBER;
BEGIN
    FOR i IN 1..60 LOOP
        FOR j IN 1..3 LOOP
            v_usuario_id := MOD((i * 3 + j), 60) + 1;
            v_estado_id := MOD(j - 1, 4) + 1;
            
            INSERT INTO TORNEO_INSCRIPCION (ID, TORNEO_ID, USUARIO_ID, ESTADO_ID)
            VALUES (
                SEQ_TORNEO_INSCRIPCION.NEXTVAL,
                i,
                v_usuario_id,
                v_estado_id
            );
            v_count := v_count + 1;
        END LOOP;
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Inscripciones insertadas: ' || v_count);
END;
/

COMMIT;

-- =========================================================================
-- 7. TORNEO_PREMIOS (60 registros)
-- =========================================================================
DECLARE
    v_fondo NUMBER(12,2);
    v_comision_pct NUMBER(5,2);
    v_comision_total NUMBER(12,2);
    v_fondo_neto NUMBER(12,2);
BEGIN
    FOR i IN 1..60 LOOP
        v_fondo := ROUND(DBMS_RANDOM.VALUE(50, 5000), 2);
        v_comision_pct := ROUND(DBMS_RANDOM.VALUE(5, 15), 2);
        v_comision_total := ROUND(v_fondo * v_comision_pct / 100, 2);
        v_fondo_neto := v_fondo - v_comision_total;
        
        INSERT INTO TORNEO_PREMIOS (
            ID, CUOTA, FONDO_TOTAL, FONDO_DESPUES_COMISION,
            COMISION_PORCENTAJE, COMISION_TOTAL,
            GANADOR1_PORCENTAJE, GANADOR2_PORCENTAJE, TORNEO_ID
        ) VALUES (
            SEQ_TORNEO_PREMIOS.NEXTVAL,
            TRUNC(DBMS_RANDOM.VALUE(1, 20)),
            v_fondo,
            v_fondo_neto,
            v_comision_pct,
            v_comision_total,
            ROUND(DBMS_RANDOM.VALUE(50, 70), 2),
            ROUND(DBMS_RANDOM.VALUE(20, 40), 2),
            i
        );
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Premios de torneo insertados: 60');
END;
/

COMMIT;

-- =========================================================================
-- 8. TORNEO_REDES (120 registros - 2 redes por torneo)
-- =========================================================================
DECLARE
    v_count NUMBER := 0;
BEGIN
    FOR i IN 1..60 LOOP
        INSERT INTO TORNEO_REDES (ID, PLATAFORMA, URL, TORNEO_ID)
        VALUES (
            SEQ_TORNEO_REDES.NEXTVAL,
            'Discord',
            'https://discord.gg/torneo' || i,
            i
        );
        v_count := v_count + 1;
        
        INSERT INTO TORNEO_REDES (ID, PLATAFORMA, URL, TORNEO_ID)
        VALUES (
            SEQ_TORNEO_REDES.NEXTVAL,
            CASE MOD(i, 3) 
                WHEN 0 THEN 'Twitter'
                WHEN 1 THEN 'Twitch'
                ELSE 'YouTube'
            END,
            'https://social.com/torneo' || i,
            i
        );
        v_count := v_count + 1;
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Redes de torneo insertadas: ' || v_count);
END;
/

COMMIT;

-- =========================================================================
-- 9. TORNEO_RESULTADOS (60 registros)
-- =========================================================================
DECLARE
    v_count NUMBER := 0;
    v_usuario_id NUMBER;
BEGIN
    -- Solo torneos terminados o algunos otros tienen resultados
    FOR i IN 1..60 LOOP
        -- Solo posicion 1 por torneo para simplificar
        v_usuario_id := MOD(i * 7, 60) + 1;
        
        INSERT INTO TORNEO_RESULTADOS (ID, POSICION, TORNEO_ID, USUARIO_ID)
        VALUES (SEQ_TORNEO_RESULTADOS.NEXTVAL, 1, i, v_usuario_id);
        v_count := v_count + 1;
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Resultados de torneo insertados: ' || v_count);
END;
/

COMMIT;

-- =========================================================================
-- 10. TRANSACCION (75 registros)
-- =========================================================================
DECLARE
    v_tipo_id NUMBER;
    v_origen_id NUMBER;
BEGIN
    FOR i IN 1..75 LOOP
        v_tipo_id := MOD(i - 1, 4) + 1;
        v_origen_id := MOD(i - 1, 7) + 1;
        
        INSERT INTO TRANSACCION (ID, MONTO, DESCRIPCION, USUARIO_ID, TIPO_ID, ORIGEN_ID)
        VALUES (
            SEQ_TRANSACCION.NEXTVAL,
            ROUND(DBMS_RANDOM.VALUE(1, 200), 2),
            'Transaccion #' || i || ' - ' || 
                CASE v_tipo_id WHEN 1 THEN 'Saldo' WHEN 2 THEN 'Creditos' WHEN 3 THEN 'Premio' ELSE 'Inscripcion' END,
            MOD(i - 1, 60) + 1,
            v_tipo_id,
            v_origen_id
        );
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Transacciones insertadas: 75');
END;
/

COMMIT;

-- =========================================================================
-- 11. TIENDA_ORDEN (65 registros)
-- =========================================================================
DECLARE
    v_item_id NUMBER;
    v_monto NUMBER(12,2);
BEGIN
    FOR i IN 1..65 LOOP
        v_item_id := MOD(i - 1, 14) + 1;
        
        SELECT PRECIO INTO v_monto FROM TIENDA_ITEM WHERE ID = v_item_id;
        
        INSERT INTO TIENDA_ORDEN (
            ID, PAYPAL_ORDER_ID, PAYPAL_CAPTURE_ID, MONTO, DIVISA,
            ESTADO, METADATA, USUARIO_ID, ITEM_ID
        ) VALUES (
            SEQ_TIENDA_ORDEN.NEXTVAL,
            'PAYPAL-' || LPAD(i, 6, '0'),
            'CAP-' || LPAD(i, 6, '0'),
            v_monto,
            'USD',
            CASE MOD(i, 4) 
                WHEN 0 THEN 'completado'
                WHEN 1 THEN 'completado'
                WHEN 2 THEN 'completado'
                ELSE 'pendiente'
            END,
            '{"itemNombre": "Item ' || v_item_id || '"}',
            MOD(i - 1, 60) + 1,
            v_item_id
        );
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Ordenes de tienda insertadas: 65');
END;
/

COMMIT;

-- =========================================================================
-- 12. TIENDA_SOLICITUD_SOPORTE (55 registros)
-- =========================================================================
DECLARE
    v_orden_id NUMBER;
BEGIN
    FOR i IN 1..55 LOOP
        -- Algunas solicitudes tienen orden, otras no
        IF MOD(i, 3) = 0 THEN
            v_orden_id := MOD(i - 1, 65) + 1;
        ELSE
            v_orden_id := NULL;
        END IF;
        
        INSERT INTO TIENDA_SOLICITUD_SOPORTE (
            ID, TIPO, NICKNAME_SOLICITADO, ESTADO, NOTAS_ADMIN,
            ORDEN_ID, USUARIO_ID, RESUELTO_POR
        ) VALUES (
            SEQ_TIENDA_SOLICITUD_SOPORTE.NEXTVAL,
            CASE MOD(i, 4)
                WHEN 0 THEN 'reembolso'
                WHEN 1 THEN 'cambio_nickname'
                WHEN 2 THEN 'reclamo'
                ELSE 'consulta'
            END,
            CASE WHEN MOD(i, 4) = 1 THEN 'NuevoNick' || i ELSE NULL END,
            CASE MOD(i, 3)
                WHEN 0 THEN 'resuelto'
                WHEN 1 THEN 'pendiente'
                ELSE 'en_proceso'
            END,
            CASE WHEN MOD(i, 3) = 0 THEN 'Solicitud resuelta satisfactoriamente' ELSE NULL END,
            v_orden_id,
            MOD(i - 1, 60) + 1,
            CASE WHEN MOD(i, 3) = 0 THEN 1 ELSE NULL END -- admin resuelve
        );
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Solicitudes de soporte insertadas: 55');
END;
/

COMMIT;

-- =========================================================================
-- 13. USUARIO_AMIGOS (80 registros)
-- =========================================================================
DECLARE
    v_u1 NUMBER;
    v_u2 NUMBER;
    v_estado_id NUMBER;
BEGIN
    FOR i IN 1..80 LOOP
        v_u1 := MOD(i - 1, 60) + 1;
        v_u2 := MOD(i + 29, 60) + 1;
        
        -- Evitar que sean el mismo
        IF v_u1 = v_u2 THEN
            v_u2 := MOD(v_u2, 60) + 1;
        END IF;
        
        v_estado_id := MOD(i - 1, 4) + 1;
        
        INSERT INTO USUARIO_AMIGOS (ID, USUARIO1_ID, USUARIO2_ID, ESTADO_ID)
        VALUES (SEQ_USUARIO_AMIGOS.NEXTVAL, v_u1, v_u2, v_estado_id);
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Relaciones de amistad insertadas: 80');
END;
/

COMMIT;

-- =========================================================================
-- 14. USUARIO_CUENTA_JUEGO (70 registros)
-- =========================================================================
DECLARE
    v_usuario_id NUMBER;
    v_plataforma_id NUMBER;
BEGIN
    FOR i IN 1..70 LOOP
        v_usuario_id := MOD(i - 1, 60) + 1;
        v_plataforma_id := MOD(i - 1, 14) + 1;
        
        INSERT INTO USUARIO_CUENTA_JUEGO (ID, IDENTIFICADOR, USUARIO_ID, PLATAFORMA_JUEGO_ID)
        VALUES (
            SEQ_USUARIO_CUENTA_JUEGO.NEXTVAL,
            'Player_' || v_usuario_id || '_' || DBMS_RANDOM.STRING('X', 8),
            v_usuario_id,
            v_plataforma_id
        );
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Cuentas de juego insertadas: 70');
END;
/

COMMIT;

-- =========================================================================
-- 15. USUARIO_ESTADISTICAS_JUEGO (75 registros)
-- =========================================================================
DECLARE
    v_usuario_id NUMBER;
    v_juego_id NUMBER;
    v_rangos VARCHAR2(500) := 'Bronce,Plata,Oro,Platino,Diamante,Maestro,Gran Maestro,Challenger';
BEGIN
    FOR i IN 1..75 LOOP
        v_usuario_id := MOD(i - 1, 60) + 1;
        v_juego_id := MOD(i - 1, 15) + 1;
        
        INSERT INTO USUARIO_ESTADISTICAS_JUEGO (
            ID, VICTORIAS, DERROTAS, EMPATES, NIVEL_RANGO,
            HORAS_JUGADAS, USUARIO_ID, JUEGO_ID
        ) VALUES (
            SEQ_USUARIO_ESTADISTICAS_JUEGO.NEXTVAL,
            TRUNC(DBMS_RANDOM.VALUE(0, 200)),
            TRUNC(DBMS_RANDOM.VALUE(0, 150)),
            TRUNC(DBMS_RANDOM.VALUE(0, 30)),
            CASE MOD(i, 8)
                WHEN 0 THEN 'Bronce'
                WHEN 1 THEN 'Plata'
                WHEN 2 THEN 'Oro'
                WHEN 3 THEN 'Platino'
                WHEN 4 THEN 'Diamante'
                WHEN 5 THEN 'Maestro'
                WHEN 6 THEN 'Gran Maestro'
                ELSE 'Challenger'
            END,
            TRUNC(DBMS_RANDOM.VALUE(10, 2000)),
            v_usuario_id,
            v_juego_id
        );
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Estadisticas de juego insertadas: 75');
END;
/

COMMIT;

-- =========================================================================
-- 16. USUARIO_LOGROS (80 registros)
-- =========================================================================
BEGIN
    FOR i IN 1..80 LOOP
        INSERT INTO USUARIO_LOGROS (ID, USUARIO_ID, LOGRO_ID)
        VALUES (
            SEQ_USUARIO_LOGROS.NEXTVAL,
            MOD(i - 1, 60) + 1,
            MOD(i - 1, 20) + 1
        );
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Logros de usuario insertados: 80');
END;
/

COMMIT;

-- =========================================================================
-- 17. USUARIO_MEMBRESIAS (55 registros)
-- =========================================================================
BEGIN
    FOR i IN 1..55 LOOP
        INSERT INTO USUARIO_MEMBRESIAS (
            ID, FECHA_INICIO, FECHA_FIN, ACTIVA,
            USUARIO_ID, MEMBRESIA_TIPO_ID
        ) VALUES (
            SEQ_USUARIO_MEMBRESIAS.NEXTVAL,
            TRUNC(SYSDATE) - TRUNC(DBMS_RANDOM.VALUE(0, 180)),
            TRUNC(SYSDATE) + TRUNC(DBMS_RANDOM.VALUE(1, 365)),
            CASE WHEN MOD(i, 5) = 0 THEN 0 ELSE 1 END,
            MOD(i - 1, 60) + 1,
            MOD(i - 1, 5) + 1
        );
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Membresias de usuario insertadas: 55');
END;
/

COMMIT;

-- =========================================================================
-- 18. USUARIO_RED_SOCIAL (65 registros)
-- =========================================================================
DECLARE
    v_usuario_id NUMBER;
BEGIN
    FOR i IN 1..65 LOOP
        v_usuario_id := MOD(i - 1, 60) + 1;
        
        INSERT INTO USUARIO_RED_SOCIAL (ID, PLATAFORMA, ENLACE, USUARIO_ID)
        VALUES (
            SEQ_USUARIO_RED_SOCIAL.NEXTVAL,
            CASE MOD(i, 5)
                WHEN 0 THEN 'Twitter'
                WHEN 1 THEN 'Instagram'
                WHEN 2 THEN 'Twitch'
                WHEN 3 THEN 'YouTube'
                ELSE 'Discord'
            END,
            'https://social.com/user' || v_usuario_id || '_' || i,
            v_usuario_id
        );
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Redes sociales de usuario insertadas: 65');
END;
/

COMMIT;

-- =========================================================================
-- 19. USUARIO_SEGUIDORES (100 registros)
-- =========================================================================
DECLARE
    v_seguidor NUMBER;
    v_seguido NUMBER;
BEGIN
    FOR i IN 1..100 LOOP
        v_seguidor := MOD(i - 1, 60) + 1;
        v_seguido := MOD(i + 19, 60) + 1;
        
        IF v_seguidor = v_seguido THEN
            v_seguido := MOD(v_seguido, 60) + 1;
        END IF;
        
        INSERT INTO USUARIO_SEGUIDORES (ID, SEGUIDOR_ID, SEGUIDO_ID)
        VALUES (SEQ_USUARIO_SEGUIDORES.NEXTVAL, v_seguidor, v_seguido);
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Relaciones de seguidor insertadas: 100');
END;
/

COMMIT;

-- =========================================================================
-- 20. USUARIO_TROFEOS (60 registros)
-- =========================================================================
BEGIN
    FOR i IN 1..60 LOOP
        INSERT INTO USUARIO_TROFEOS (
            ID, TIPO_TROFEO, USUARIO_ID, TORNEO_ID
        ) VALUES (
            SEQ_USUARIO_TROFEOS.NEXTVAL,
            CASE MOD(i, 5)
                WHEN 0 THEN 'trofeo_eliminacion'
                WHEN 1 THEN 'trofeo_eliminacion_doble'
                WHEN 2 THEN 'trofeo_round_robin'
                WHEN 3 THEN 'trofeo_grupos'
                ELSE 'trofeo_suizo'
            END,
            MOD(i - 1, 60) + 1,
            MOD(i - 1, 60) + 1
        );
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Trofeos de usuario insertados: 60');
END;
/

COMMIT;

PROMPT >>> Datos masivos insertados exitosamente <<<
PROMPT >>> Resumen de registros por tabla: <<<
PROMPT     PERSONA: 60
PROMPT     USUARIO: 60
PROMPT     EQUIPO: 55
PROMPT     EQUIPO_MIEMBROS: 165
PROMPT     TORNEO: 60
PROMPT     TORNEO_INSCRIPCION: 180
PROMPT     TORNEO_PREMIOS: 60
PROMPT     TORNEO_REDES: 120
PROMPT     TORNEO_RESULTADOS: 60
PROMPT     TRANSACCION: 75
PROMPT     TIENDA_ORDEN: 65
PROMPT     TIENDA_SOLICITUD_SOPORTE: 55
PROMPT     USUARIO_AMIGOS: 80
PROMPT     USUARIO_CUENTA_JUEGO: 70
PROMPT     USUARIO_ESTADISTICAS_JUEGO: 75
PROMPT     USUARIO_LOGROS: 80
PROMPT     USUARIO_MEMBRESIAS: 55
PROMPT     USUARIO_RED_SOCIAL: 65
PROMPT     USUARIO_SEGUIDORES: 100
PROMPT     USUARIO_TROFEOS: 60
