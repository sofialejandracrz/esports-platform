/*
============================================================================
  Script: PKG_PERFIL_BODY.sql
  Descripcion: Cuerpo del paquete PKG_PERFIL
               Implementación de funciones de perfil migradas de PostgreSQL
  Proyecto: Plataforma eSports - Migración a Oracle
  Fecha: Marzo/2026
============================================================================
*/

CREATE OR REPLACE PACKAGE BODY PKG_PERFIL AS

    /*
    =========================================================================
    FN1: OBTENER PERFIL DE USUARIO
    =========================================================================
    */
    FUNCTION FN_OBTENER_PERFIL(
        p_nickname      IN VARCHAR2,
        p_viewer_id     IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB
    IS
        v_usuario_id        NUMBER;
        v_es_propio_perfil  NUMBER(1) := 0;
        v_nickname          VARCHAR2(100);
        v_xp                NUMBER;
        v_saldo             NUMBER(12,2);
        v_creditos          NUMBER;
        v_foto_perfil       VARCHAR2(500);
        v_biografia         VARCHAR2(300);
        v_estado            VARCHAR2(50);
        v_ultima_conexion   TIMESTAMP;
        v_desafios_hab      NUMBER(1);
        v_creado_en         TIMESTAMP;
        v_avatar_url        VARCHAR2(500);
        v_avatar_nombre     VARCHAR2(100);
        v_p_nombre          VARCHAR2(100);
        v_p_apellido        VARCHAR2(100);
        v_correo            VARCHAR2(200);
        v_pais              VARCHAR2(100);
        v_ciudad            VARCHAR2(100);
        v_rol               VARCHAR2(50);
        v_total_amigos      NUMBER := 0;
        v_total_seguidores  NUMBER := 0;
        v_total_siguiendo   NUMBER := 0;
        v_total_trofeos     NUMBER := 0;
        v_result            CLOB;
    BEGIN
        -- Obtener el ID del usuario por nickname
        BEGIN
            SELECT id INTO v_usuario_id
            FROM USUARIO
            WHERE nickname = p_nickname AND deleted_at IS NULL;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "Usuario no encontrado"}';
        END;
        
        -- Verificar si es el propio perfil
        IF p_viewer_id IS NOT NULL AND TO_NUMBER(p_viewer_id) = v_usuario_id THEN
            v_es_propio_perfil := 1;
        END IF;
        
        -- Obtener información básica
        SELECT 
            u.nickname, u.xp, u.saldo, u.creditos, u.foto_perfil, u.biografia,
            u.estado, u.ultima_conexion, u.desafios_habilitados, u.creado_en,
            ca.url, ca.nombre,
            CASE WHEN v_es_propio_perfil = 1 THEN p.p_nombre ELSE NULL END,
            CASE WHEN v_es_propio_perfil = 1 THEN p.p_apellido ELSE NULL END,
            CASE WHEN v_es_propio_perfil = 1 THEN p.correo ELSE NULL END,
            p.pais, p.ciudad, cr.valor
        INTO 
            v_nickname, v_xp, v_saldo, v_creditos, v_foto_perfil, v_biografia,
            v_estado, v_ultima_conexion, v_desafios_hab, v_creado_en,
            v_avatar_url, v_avatar_nombre,
            v_p_nombre, v_p_apellido, v_correo, v_pais, v_ciudad, v_rol
        FROM USUARIO u
        LEFT JOIN PERSONA p ON u.persona_id = p.id
        LEFT JOIN CATALOGO_AVATAR ca ON u.avatar_id = ca.id
        LEFT JOIN CATALOGO_ROL cr ON u.rol_id = cr.id
        WHERE u.id = v_usuario_id;
        
        -- Contar amigos
        SELECT COUNT(*) INTO v_total_amigos
        FROM USUARIO_AMIGOS ua
        JOIN CATALOGO_ESTADO_AMISTAD cea ON ua.estado_id = cea.id
        WHERE (ua.usuario1_id = v_usuario_id OR ua.usuario2_id = v_usuario_id)
          AND cea.valor = 'aceptado';
        
        -- Contar seguidores
        SELECT COUNT(*) INTO v_total_seguidores
        FROM USUARIO_SEGUIDORES WHERE seguido_id = v_usuario_id;
        
        -- Contar siguiendo
        SELECT COUNT(*) INTO v_total_siguiendo
        FROM USUARIO_SEGUIDORES WHERE seguidor_id = v_usuario_id;
        
        -- Contar trofeos
        SELECT COUNT(*) INTO v_total_trofeos
        FROM USUARIO_TROFEOS WHERE usuario_id = v_usuario_id;
        
        -- Construir resultado
        v_result := JSON_OBJECT(
            'success' VALUE 'true',
            'usuario' VALUE JSON_OBJECT(
                'id' VALUE v_usuario_id,
                'nickname' VALUE v_nickname,
                'xp' VALUE v_xp,
                'saldo' VALUE v_saldo,
                'creditos' VALUE v_creditos,
                'foto_perfil' VALUE v_foto_perfil,
                'biografia' VALUE v_biografia,
                'estado' VALUE v_estado,
                'ultima_conexion' VALUE TO_CHAR(v_ultima_conexion, 'YYYY-MM-DD"T"HH24:MI:SS'),
                'desafios_habilitados' VALUE CASE WHEN v_desafios_hab = 1 THEN 'true' ELSE 'false' END,
                'creado_en' VALUE TO_CHAR(v_creado_en, 'YYYY-MM-DD"T"HH24:MI:SS'),
                'avatar_url' VALUE v_avatar_url,
                'avatar_nombre' VALUE v_avatar_nombre,
                'p_nombre' VALUE v_p_nombre,
                'p_apellido' VALUE v_p_apellido,
                'correo' VALUE v_correo,
                'pais' VALUE v_pais,
                'ciudad' VALUE v_ciudad,
                'rol' VALUE v_rol
            ),
            'estadisticas' VALUE JSON_OBJECT(
                'total_amigos' VALUE v_total_amigos,
                'total_seguidores' VALUE v_total_seguidores,
                'total_siguiendo' VALUE v_total_siguiendo,
                'total_trofeos' VALUE v_total_trofeos
            ),
            'es_propio_perfil' VALUE CASE WHEN v_es_propio_perfil = 1 THEN 'true' ELSE 'false' END
        );
        
        RETURN v_result;
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_OBTENER_PERFIL;

    /*
    =========================================================================
    FN2: LISTA DE AMIGOS
    =========================================================================
    */
    FUNCTION FN_LISTA_AMIGOS(
        p_usuario_id    IN VARCHAR2,
        p_limit         IN NUMBER DEFAULT 50,
        p_offset        IN NUMBER DEFAULT 0
    ) RETURN CLOB
    IS
        v_amigos CLOB;
        v_total  NUMBER;
    BEGIN
        SELECT COUNT(*) INTO v_total
        FROM USUARIO_AMIGOS ua
        JOIN CATALOGO_ESTADO_AMISTAD cea ON ua.estado_id = cea.id
        WHERE (ua.usuario1_id = p_usuario_id OR ua.usuario2_id = p_usuario_id)
          AND cea.valor = 'aceptado';
        
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'id' VALUE u.id,
                'nickname' VALUE u.nickname,
                'estado' VALUE u.estado,
                'ultima_conexion' VALUE TO_CHAR(u.ultima_conexion, 'YYYY-MM-DD"T"HH24:MI:SS'),
                'avatar_url' VALUE ca.url
            )
        ), '[]')
        INTO v_amigos
        FROM USUARIO_AMIGOS ua
        JOIN CATALOGO_ESTADO_AMISTAD cea ON ua.estado_id = cea.id
        JOIN USUARIO u ON u.id = CASE 
            WHEN ua.usuario1_id = p_usuario_id THEN ua.usuario2_id 
            ELSE ua.usuario1_id 
        END
        LEFT JOIN CATALOGO_AVATAR ca ON u.avatar_id = ca.id
        WHERE (ua.usuario1_id = p_usuario_id OR ua.usuario2_id = p_usuario_id)
          AND cea.valor = 'aceptado'
          AND ROWNUM <= p_limit;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'total' VALUE v_total,
            'amigos' VALUE v_amigos FORMAT JSON
        );
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_LISTA_AMIGOS;

    /*
    =========================================================================
    FN3: VITRINA DE TROFEOS
    =========================================================================
    */
    FUNCTION FN_VITRINA_TROFEOS(
        p_usuario_id    IN VARCHAR2,
        p_limit         IN NUMBER DEFAULT 20
    ) RETURN CLOB
    IS
        v_trofeos CLOB;
    BEGIN
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'id' VALUE ut.id,
                'torneo_titulo' VALUE t.titulo,
                'posicion' VALUE ut.posicion,
                'tipo_trofeo' VALUE ctt.tipo_trofeo,
                'fecha' VALUE TO_CHAR(ut.fecha, 'YYYY-MM-DD')
            ) ORDER BY ut.fecha DESC
        ), '[]')
        INTO v_trofeos
        FROM USUARIO_TROFEOS ut
        JOIN TORNEO t ON ut.torneo_id = t.id
        JOIN CATALOGO_TIPO_TORNEO ctt ON t.tipo_torneo_id = ctt.id
        WHERE ut.usuario_id = p_usuario_id
          AND ROWNUM <= p_limit;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'trofeos' VALUE v_trofeos FORMAT JSON
        );
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_VITRINA_TROFEOS;

    /*
    =========================================================================
    FN4: LOGROS DEL USUARIO
    =========================================================================
    */
    FUNCTION FN_LOGROS_USUARIO(
        p_usuario_id    IN VARCHAR2
    ) RETURN CLOB
    IS
        v_logros CLOB;
    BEGIN
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'id' VALUE l.id,
                'nombre' VALUE l.nombre,
                'descripcion' VALUE l.descripcion,
                'fecha_obtenido' VALUE TO_CHAR(ul.fecha_obtenido, 'YYYY-MM-DD')
            )
        ), '[]')
        INTO v_logros
        FROM USUARIO_LOGROS ul
        JOIN LOGRO l ON ul.logro_id = l.id
        WHERE ul.usuario_id = p_usuario_id;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'logros' VALUE v_logros FORMAT JSON
        );
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_LOGROS_USUARIO;

    /*
    =========================================================================
    FN5: ESTADÍSTICAS DE JUEGOS
    =========================================================================
    */
    FUNCTION FN_ESTADISTICAS_JUEGOS(
        p_usuario_id    IN VARCHAR2
    ) RETURN CLOB
    IS
        v_stats CLOB;
    BEGIN
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'juego_id' VALUE j.id,
                'juego_nombre' VALUE j.nombre,
                'victorias' VALUE uej.victorias,
                'derrotas' VALUE uej.derrotas,
                'empates' VALUE uej.empates,
                'horas_jugadas' VALUE uej.horas_jugadas,
                'rango' VALUE uej.rango,
                'porcentaje_victorias' VALUE ROUND(
                    CASE WHEN (uej.victorias + uej.derrotas + uej.empates) > 0 
                    THEN (uej.victorias * 100.0) / (uej.victorias + uej.derrotas + uej.empates)
                    ELSE 0 END, 2
                )
            )
        ), '[]')
        INTO v_stats
        FROM USUARIO_ESTADISTICAS_JUEGO uej
        JOIN JUEGO j ON uej.juego_id = j.id
        WHERE uej.usuario_id = p_usuario_id;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'estadisticas' VALUE v_stats FORMAT JSON
        );
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_ESTADISTICAS_JUEGOS;

    /*
    =========================================================================
    FN6: HISTORIAL DE TORNEOS
    =========================================================================
    */
    FUNCTION FN_HISTORIAL_TORNEOS(
        p_usuario_id    IN VARCHAR2,
        p_limit         IN NUMBER DEFAULT 20,
        p_offset        IN NUMBER DEFAULT 0
    ) RETURN CLOB
    IS
        v_torneos CLOB;
        v_total   NUMBER;
    BEGIN
        SELECT COUNT(*) INTO v_total
        FROM TORNEO_INSCRIPCION
        WHERE usuario_id = p_usuario_id;
        
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'torneo_id' VALUE t.id,
                'titulo' VALUE t.titulo,
                'juego' VALUE j.nombre,
                'estado' VALUE cet.valor,
                'fecha_inicio' VALUE TO_CHAR(t.fecha_inicio_torneo, 'YYYY-MM-DD'),
                'inscrito_en' VALUE TO_CHAR(ti.inscrito_en, 'YYYY-MM-DD')
            ) ORDER BY ti.inscrito_en DESC
        ), '[]')
        INTO v_torneos
        FROM TORNEO_INSCRIPCION ti
        JOIN TORNEO t ON ti.torneo_id = t.id
        LEFT JOIN JUEGO j ON t.juego_id = j.id
        JOIN CATALOGO_ESTADO_TORNEO cet ON t.estado_id = cet.id
        WHERE ti.usuario_id = p_usuario_id
          AND ROWNUM <= p_limit;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'total' VALUE v_total,
            'torneos' VALUE v_torneos FORMAT JSON
        );
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_HISTORIAL_TORNEOS;

    /*
    =========================================================================
    FN7: REDES SOCIALES
    =========================================================================
    */
    FUNCTION FN_REDES_SOCIALES(
        p_usuario_id    IN VARCHAR2
    ) RETURN CLOB
    IS
        v_redes CLOB;
    BEGIN
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'id' VALUE urs.id,
                'plataforma' VALUE urs.plataforma,
                'nombre_usuario' VALUE urs.nombre_usuario,
                'url' VALUE urs.url
            )
        ), '[]')
        INTO v_redes
        FROM USUARIO_REDES_SOCIALES urs
        WHERE urs.usuario_id = p_usuario_id;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'redes_sociales' VALUE v_redes FORMAT JSON
        );
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_REDES_SOCIALES;

    /*
    =========================================================================
    FN8: CUENTAS DE JUEGO
    =========================================================================
    */
    FUNCTION FN_CUENTAS_JUEGO(
        p_usuario_id    IN VARCHAR2
    ) RETURN CLOB
    IS
        v_cuentas CLOB;
    BEGIN
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'id' VALUE ucj.id,
                'juego_id' VALUE j.id,
                'juego_nombre' VALUE j.nombre,
                'nombre_cuenta' VALUE ucj.nombre_cuenta,
                'plataforma' VALUE cp.valor
            )
        ), '[]')
        INTO v_cuentas
        FROM USUARIO_CUENTAS_JUEGO ucj
        JOIN JUEGO j ON ucj.juego_id = j.id
        LEFT JOIN CATALOGO_PLATAFORMA cp ON ucj.plataforma_id = cp.id
        WHERE ucj.usuario_id = p_usuario_id;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'cuentas_juego' VALUE v_cuentas FORMAT JSON
        );
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_CUENTAS_JUEGO;

    /*
    =========================================================================
    FN9: EQUIPOS DEL USUARIO
    =========================================================================
    */
    FUNCTION FN_EQUIPOS_USUARIO(
        p_usuario_id    IN VARCHAR2
    ) RETURN CLOB
    IS
        v_equipos CLOB;
    BEGIN
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'id' VALUE e.id,
                'nombre' VALUE e.nombre,
                'descripcion' VALUE e.descripcion,
                'avatar_url' VALUE e.avatar_url,
                'rol' VALUE em.rol,
                'unido_en' VALUE TO_CHAR(em.unido_en, 'YYYY-MM-DD'),
                'total_miembros' VALUE (
                    SELECT COUNT(*) FROM EQUIPO_MIEMBROS WHERE equipo_id = e.id
                )
            )
        ), '[]')
        INTO v_equipos
        FROM EQUIPO_MIEMBROS em
        JOIN EQUIPO e ON em.equipo_id = e.id
        WHERE em.usuario_id = p_usuario_id;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'equipos' VALUE v_equipos FORMAT JSON
        );
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_EQUIPOS_USUARIO;

    /*
    =========================================================================
    FN10: PERFIL COMPLETO EN JSON
    =========================================================================
    */
    FUNCTION FN_PERFIL_COMPLETO_JSON(
        p_nickname      IN VARCHAR2,
        p_viewer_id     IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB
    IS
        v_perfil        CLOB;
        v_amigos        CLOB;
        v_trofeos       CLOB;
        v_logros        CLOB;
        v_stats         CLOB;
        v_torneos       CLOB;
        v_redes         CLOB;
        v_cuentas       CLOB;
        v_equipos       CLOB;
        v_usuario_id    VARCHAR2(100);
    BEGIN
        -- Obtener perfil básico
        v_perfil := FN_OBTENER_PERFIL(p_nickname, p_viewer_id);
        
        -- Si el perfil falló, retornar el error
        IF INSTR(v_perfil, '"success": false') > 0 OR INSTR(v_perfil, '"success":"false"') > 0 THEN
            RETURN v_perfil;
        END IF;
        
        -- Extraer usuario_id del perfil
        BEGIN
            SELECT id INTO v_usuario_id
            FROM USUARIO WHERE nickname = p_nickname AND deleted_at IS NULL;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "Usuario no encontrado"}';
        END;
        
        -- Obtener datos adicionales
        v_amigos := FN_LISTA_AMIGOS(v_usuario_id, 10, 0);
        v_trofeos := FN_VITRINA_TROFEOS(v_usuario_id, 10);
        v_logros := FN_LOGROS_USUARIO(v_usuario_id);
        v_stats := FN_ESTADISTICAS_JUEGOS(v_usuario_id);
        v_torneos := FN_HISTORIAL_TORNEOS(v_usuario_id, 10, 0);
        v_redes := FN_REDES_SOCIALES(v_usuario_id);
        v_cuentas := FN_CUENTAS_JUEGO(v_usuario_id);
        v_equipos := FN_EQUIPOS_USUARIO(v_usuario_id);
        
        -- Combinar todo en un solo JSON
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'perfil' VALUE v_perfil FORMAT JSON,
            'amigos' VALUE v_amigos FORMAT JSON,
            'trofeos' VALUE v_trofeos FORMAT JSON,
            'logros' VALUE v_logros FORMAT JSON,
            'estadisticas_juegos' VALUE v_stats FORMAT JSON,
            'historial_torneos' VALUE v_torneos FORMAT JSON,
            'redes_sociales' VALUE v_redes FORMAT JSON,
            'cuentas_juego' VALUE v_cuentas FORMAT JSON,
            'equipos' VALUE v_equipos FORMAT JSON
        );
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_PERFIL_COMPLETO_JSON;

END PKG_PERFIL;
/

PROMPT >>> Cuerpo del paquete PKG_PERFIL creado exitosamente <<<
