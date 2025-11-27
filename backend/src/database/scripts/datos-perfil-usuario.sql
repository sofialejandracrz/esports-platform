-- ============================================================================
-- PROCEDIMIENTO ALMACENADO: obtener_perfil_usuario_completo
-- DESCRIPCIÓN: Retorna toda la información del perfil de un usuario para la
--              página usuario/perfil/{nickname}
-- AUTOR: Sistema eSports Platform
-- FECHA: 2025-11-26
-- ============================================================================

-- Primero creamos un tipo compuesto para retornar datos estructurados
DROP TYPE IF EXISTS perfil_usuario_resultado CASCADE;

CREATE TYPE perfil_usuario_resultado AS (
    -- Información básica del usuario
    usuario_id UUID,
    nickname VARCHAR,
    xp INTEGER,
    saldo NUMERIC(12,2),
    creditos INTEGER,
    foto_perfil VARCHAR,
    biografia VARCHAR(300),
    estado VARCHAR(50),
    ultima_conexion TIMESTAMP,
    desafios_habilitados BOOLEAN,
    creado_en TIMESTAMP,
    
    -- Información del avatar
    avatar_url VARCHAR,
    avatar_nombre VARCHAR,
    
    -- Información personal (solo visible para el propio usuario)
    p_nombre VARCHAR,
    s_nombre VARCHAR,
    p_apellido VARCHAR,
    s_apellido VARCHAR,
    correo VARCHAR,
    fecha_nacimiento DATE,
    pais VARCHAR,
    ciudad VARCHAR,
    
    -- Rol del usuario
    rol VARCHAR,
    
    -- Contadores de estadísticas globales
    total_amigos INTEGER,
    total_seguidores INTEGER,
    total_siguiendo INTEGER,
    total_trofeos INTEGER,
    total_logros INTEGER,
    total_torneos_participados INTEGER,
    total_victorias_torneos INTEGER,
    total_derrotas_global INTEGER,
    dinero_total_ganado NUMERIC(12,2),
    
    -- Indica si el usuario visualizador ya es amigo o tiene solicitud pendiente
    estado_amistad VARCHAR,
    solicitud_amistad_id UUID
);

-- ============================================================================
-- FUNCIÓN PRINCIPAL: obtener_perfil_usuario
-- Parámetros:
--   p_nickname: Nickname del usuario cuyo perfil se desea ver
--   p_viewer_id: UUID del usuario que está visualizando (NULL si no está logueado)
-- ============================================================================
CREATE OR REPLACE FUNCTION obtener_perfil_usuario(
    p_nickname VARCHAR,
    p_viewer_id UUID DEFAULT NULL
)
RETURNS perfil_usuario_resultado
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result perfil_usuario_resultado;
    v_usuario_id UUID;
    v_es_propio_perfil BOOLEAN;
BEGIN
    -- Obtener el ID del usuario por nickname
    SELECT id INTO v_usuario_id
    FROM usuario
    WHERE nickname = p_nickname AND deleted_at IS NULL;
    
    -- Verificar si el usuario existe
    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con nickname % no encontrado', p_nickname;
    END IF;
    
    -- Verificar si es el propio perfil
    v_es_propio_perfil := (p_viewer_id IS NOT NULL AND p_viewer_id = v_usuario_id);
    
    -- Obtener información básica del usuario
    SELECT 
        u.id,
        u.nickname,
        u.xp,
        u.saldo,
        u.creditos,
        u.foto_perfil,
        u.biografia,
        u.estado,
        u.ultima_conexion,
        u.desafios_habilitados,
        u.creado_en,
        ca.url,
        ca.nombre,
        -- Datos personales (solo si es propio perfil)
        CASE WHEN v_es_propio_perfil THEN p.p_nombre ELSE NULL END,
        CASE WHEN v_es_propio_perfil THEN p.s_nombre ELSE NULL END,
        CASE WHEN v_es_propio_perfil THEN p.p_apellido ELSE NULL END,
        CASE WHEN v_es_propio_perfil THEN p.s_apellido ELSE NULL END,
        CASE WHEN v_es_propio_perfil THEN p.correo ELSE NULL END,
        CASE WHEN v_es_propio_perfil THEN p.fecha_nacimiento ELSE NULL END,
        p.pais,
        p.ciudad,
        cr.valor
    INTO 
        v_result.usuario_id,
        v_result.nickname,
        v_result.xp,
        v_result.saldo,
        v_result.creditos,
        v_result.foto_perfil,
        v_result.biografia,
        v_result.estado,
        v_result.ultima_conexion,
        v_result.desafios_habilitados,
        v_result.creado_en,
        v_result.avatar_url,
        v_result.avatar_nombre,
        v_result.p_nombre,
        v_result.s_nombre,
        v_result.p_apellido,
        v_result.s_apellido,
        v_result.correo,
        v_result.fecha_nacimiento,
        v_result.pais,
        v_result.ciudad,
        v_result.rol
    FROM usuario u
    LEFT JOIN persona p ON u.persona_id = p.id
    LEFT JOIN catalogo_avatar ca ON u.avatar_id = ca.id
    LEFT JOIN catalogo_rol cr ON u.rol_id = cr.id
    WHERE u.id = v_usuario_id;
    
    -- Contar amigos (relaciones aceptadas)
    SELECT COUNT(*) INTO v_result.total_amigos
    FROM usuario_amigos ua
    JOIN catalogo_estado_amistad cea ON ua.estado_id = cea.id
    WHERE (ua.usuario1_id = v_usuario_id OR ua.usuario2_id = v_usuario_id)
      AND cea.valor = 'aceptado';
    
    -- Contar seguidores
    SELECT COUNT(*) INTO v_result.total_seguidores
    FROM usuario_seguidores
    WHERE seguido_id = v_usuario_id;
    
    -- Contar siguiendo
    SELECT COUNT(*) INTO v_result.total_siguiendo
    FROM usuario_seguidores
    WHERE seguidor_id = v_usuario_id;
    
    -- Contar trofeos
    SELECT COUNT(*) INTO v_result.total_trofeos
    FROM usuario_trofeos
    WHERE usuario_id = v_usuario_id;
    
    -- Contar logros
    SELECT COUNT(*) INTO v_result.total_logros
    FROM usuario_logros
    WHERE usuario_id = v_usuario_id;
    
    -- Contar torneos participados (con inscripción aceptada)
    SELECT COUNT(*) INTO v_result.total_torneos_participados
    FROM torneo_inscripcion ti
    JOIN catalogo_estado_inscripcion cei ON ti.estado_id = cei.id
    WHERE ti.usuario_id = v_usuario_id
      AND cei.valor IN ('confirmado', 'completado');
    
    -- Contar victorias en torneos (posición 1)
    SELECT COUNT(*) INTO v_result.total_victorias_torneos
    FROM torneo_resultados
    WHERE usuario_id = v_usuario_id AND posicion = 1;
    
    -- Calcular derrotas globales de estadísticas de juegos
    SELECT COALESCE(SUM(derrotas), 0) INTO v_result.total_derrotas_global
    FROM usuario_estadisticas_juego
    WHERE usuario_id = v_usuario_id;
    
    -- Calcular dinero total ganado (transacciones de tipo 'ingreso' por premios de torneos)
    SELECT COALESCE(SUM(t.monto), 0) INTO v_result.dinero_total_ganado
    FROM transaccion t
    JOIN catalogo_transaccion_tipo ctt ON t.tipo_id = ctt.id
    JOIN catalogo_origen_transaccion cot ON t.origen_id = cot.id
    WHERE t.usuario_id = v_usuario_id
      AND ctt.valor = 'ingreso'
      AND cot.valor IN ('premio_torneo', 'torneo');
    
    -- Verificar estado de amistad con el viewer (si no es el propio perfil)
    IF p_viewer_id IS NOT NULL AND NOT v_es_propio_perfil THEN
        SELECT 
            -- Si el viewer envió la solicitud (usuario1), estado es 'pendiente_enviada'
            -- Si el viewer recibió la solicitud (usuario2), estado es 'pendiente_recibida'
            -- Si ya son amigos, estado es 'aceptado'
            CASE 
                WHEN cea.valor = 'pendiente' AND ua.usuario1_id = p_viewer_id THEN 'pendiente_enviada'
                WHEN cea.valor = 'pendiente' AND ua.usuario2_id = p_viewer_id THEN 'pendiente_recibida'
                ELSE cea.valor
            END,
            ua.id
        INTO 
            v_result.estado_amistad,
            v_result.solicitud_amistad_id
        FROM usuario_amigos ua
        JOIN catalogo_estado_amistad cea ON ua.estado_id = cea.id
        WHERE (ua.usuario1_id = p_viewer_id AND ua.usuario2_id = v_usuario_id)
           OR (ua.usuario1_id = v_usuario_id AND ua.usuario2_id = p_viewer_id);
    ELSE
        v_result.estado_amistad := NULL;
        v_result.solicitud_amistad_id := NULL;
    END IF;
    
    RETURN v_result;
END;
$$;

-- ============================================================================
-- FUNCIÓN: obtener_lista_amigos
-- Retorna la lista de amigos de un usuario
-- ============================================================================
CREATE OR REPLACE FUNCTION obtener_lista_amigos(
    p_nickname VARCHAR,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    amigo_id UUID,
    amigo_nickname VARCHAR,
    amigo_foto_perfil VARCHAR,
    amigo_avatar_url VARCHAR,
    amigo_estado VARCHAR(50),
    amigo_ultima_conexion TIMESTAMP,
    amigo_xp INTEGER,
    fecha_amistad TIMESTAMP
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_usuario_id UUID;
BEGIN
    -- Obtener el ID del usuario por nickname
    SELECT id INTO v_usuario_id
    FROM usuario
    WHERE nickname = p_nickname AND deleted_at IS NULL;
    
    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con nickname % no encontrado', p_nickname;
    END IF;
    
    RETURN QUERY
    SELECT 
        u.id,
        u.nickname,
        u.foto_perfil,
        ca.url,
        u.estado,
        u.ultima_conexion,
        u.xp,
        ua.creado_en
    FROM usuario_amigos ua
    JOIN catalogo_estado_amistad cea ON ua.estado_id = cea.id
    JOIN usuario u ON (
        CASE 
            WHEN ua.usuario1_id = v_usuario_id THEN ua.usuario2_id
            ELSE ua.usuario1_id
        END = u.id
    )
    LEFT JOIN catalogo_avatar ca ON u.avatar_id = ca.id
    WHERE (ua.usuario1_id = v_usuario_id OR ua.usuario2_id = v_usuario_id)
      AND cea.valor = 'aceptado'
      AND u.deleted_at IS NULL
    ORDER BY ua.creado_en DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;

-- ============================================================================
-- FUNCIÓN: obtener_vitrina_trofeos
-- Retorna los trofeos ganados por el usuario
-- ============================================================================
CREATE OR REPLACE FUNCTION obtener_vitrina_trofeos(
    p_nickname VARCHAR,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    trofeo_id UUID,
    tipo_trofeo VARCHAR,
    ganado_en TIMESTAMP,
    torneo_id UUID,
    torneo_titulo VARCHAR,
    torneo_juego VARCHAR,
    posicion_final INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_usuario_id UUID;
BEGIN
    -- Obtener el ID del usuario por nickname
    SELECT id INTO v_usuario_id
    FROM usuario
    WHERE nickname = p_nickname AND deleted_at IS NULL;
    
    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con nickname % no encontrado', p_nickname;
    END IF;
    
    RETURN QUERY
    SELECT 
        ut.id,
        ut.tipo_trofeo,
        ut.ganado_en,
        t.id,
        t.titulo,
        j.nombre,
        tr.posicion
    FROM usuario_trofeos ut
    LEFT JOIN torneo t ON ut.torneo_id = t.id
    LEFT JOIN juego j ON t.juego_id = j.id
    LEFT JOIN torneo_resultados tr ON tr.torneo_id = t.id AND tr.usuario_id = v_usuario_id
    WHERE ut.usuario_id = v_usuario_id
    ORDER BY ut.ganado_en DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;

-- ============================================================================
-- FUNCIÓN: obtener_logros_usuario
-- Retorna los logros desbloqueados por el usuario
-- ============================================================================
CREATE OR REPLACE FUNCTION obtener_logros_usuario(
    p_nickname VARCHAR,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    logro_id UUID,
    logro_nombre VARCHAR,
    logro_descripcion TEXT,
    fecha_obtenido TIMESTAMP
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_usuario_id UUID;
BEGIN
    -- Obtener el ID del usuario por nickname
    SELECT id INTO v_usuario_id
    FROM usuario
    WHERE nickname = p_nickname AND deleted_at IS NULL;
    
    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con nickname % no encontrado', p_nickname;
    END IF;
    
    RETURN QUERY
    SELECT 
        l.id,
        l.nombre,
        l.descripcion,
        ul.fecha
    FROM usuario_logros ul
    JOIN logro l ON ul.logro_id = l.id
    WHERE ul.usuario_id = v_usuario_id
    ORDER BY ul.fecha DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;

-- ============================================================================
-- FUNCIÓN: obtener_estadisticas_juegos
-- Retorna las estadísticas por juego del usuario
-- ============================================================================
CREATE OR REPLACE FUNCTION obtener_estadisticas_juegos(
    p_nickname VARCHAR
)
RETURNS TABLE (
    juego_id UUID,
    juego_nombre VARCHAR,
    victorias INTEGER,
    derrotas INTEGER,
    empates INTEGER,
    porcentaje_victorias NUMERIC(5,2),
    nivel_rango VARCHAR,
    horas_jugadas INTEGER,
    actualizado_en TIMESTAMP
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_usuario_id UUID;
BEGIN
    -- Obtener el ID del usuario por nickname
    SELECT id INTO v_usuario_id
    FROM usuario
    WHERE nickname = p_nickname AND deleted_at IS NULL;
    
    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con nickname % no encontrado', p_nickname;
    END IF;
    
    RETURN QUERY
    SELECT 
        j.id,
        j.nombre::VARCHAR,
        uej.victorias,
        uej.derrotas,
        uej.empates,
        CASE 
            WHEN (uej.victorias + uej.derrotas + uej.empates) > 0 
            THEN ROUND((uej.victorias::NUMERIC / (uej.victorias + uej.derrotas + uej.empates)) * 100, 2)
            ELSE 0.00
        END,
        uej.nivel_rango,
        uej.horas_jugadas,
        uej.actualizado_en
    FROM usuario_estadisticas_juego uej
    JOIN juego j ON uej.juego_id = j.id
    WHERE uej.usuario_id = v_usuario_id
    ORDER BY uej.victorias DESC;
END;
$$;

-- ============================================================================
-- FUNCIÓN: obtener_historial_torneos
-- Retorna el historial de participación en torneos
-- ============================================================================
CREATE OR REPLACE FUNCTION obtener_historial_torneos(
    p_nickname VARCHAR,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    torneo_id UUID,
    torneo_titulo VARCHAR,
    juego_nombre VARCHAR,
    fecha_inicio TIMESTAMP,
    fecha_inscripcion TIMESTAMP,
    estado_inscripcion VARCHAR,
    posicion_final INTEGER,
    premio_ganado NUMERIC(12,2),
    tipo_trofeo VARCHAR
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_usuario_id UUID;
BEGIN
    -- Obtener el ID del usuario por nickname
    SELECT id INTO v_usuario_id
    FROM usuario
    WHERE nickname = p_nickname AND deleted_at IS NULL;
    
    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con nickname % no encontrado', p_nickname;
    END IF;
    
    RETURN QUERY
    SELECT 
        t.id,
        t.titulo::VARCHAR,
        j.nombre::VARCHAR,
        t.fecha_inicio_torneo,
        ti.fecha,
        cei.valor::VARCHAR,
        tr.posicion,
        -- Calcular premio ganado basado en posición
        CASE 
            WHEN tr.posicion = 1 THEN 
                COALESCE(tp.fondo_despues_comision * tp.ganador1_porcentaje / 100, 0)
            WHEN tr.posicion = 2 THEN 
                COALESCE(tp.fondo_despues_comision * tp.ganador2_porcentaje / 100, 0)
            ELSE 0.00
        END,
        ut.tipo_trofeo
    FROM torneo_inscripcion ti
    JOIN torneo t ON ti.torneo_id = t.id
    JOIN catalogo_estado_inscripcion cei ON ti.estado_id = cei.id
    LEFT JOIN juego j ON t.juego_id = j.id
    LEFT JOIN torneo_resultados tr ON tr.torneo_id = t.id AND tr.usuario_id = v_usuario_id
    LEFT JOIN torneo_premios tp ON tp.torneo_id = t.id
    LEFT JOIN usuario_trofeos ut ON ut.torneo_id = t.id AND ut.usuario_id = v_usuario_id
    WHERE ti.usuario_id = v_usuario_id
    ORDER BY ti.fecha DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;

-- ============================================================================
-- FUNCIÓN: obtener_redes_sociales
-- Retorna las redes sociales del usuario
-- ============================================================================
CREATE OR REPLACE FUNCTION obtener_redes_sociales(
    p_nickname VARCHAR
)
RETURNS TABLE (
    red_id UUID,
    plataforma VARCHAR,
    enlace VARCHAR
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_usuario_id UUID;
BEGIN
    -- Obtener el ID del usuario por nickname
    SELECT id INTO v_usuario_id
    FROM usuario
    WHERE nickname = p_nickname AND deleted_at IS NULL;
    
    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con nickname % no encontrado', p_nickname;
    END IF;
    
    RETURN QUERY
    SELECT 
        urs.id,
        urs.plataforma,
        urs.enlace
    FROM usuario_red_social urs
    WHERE urs.usuario_id = v_usuario_id
    ORDER BY urs.plataforma;
END;
$$;

-- ============================================================================
-- FUNCIÓN: obtener_cuentas_juego
-- Retorna las cuentas de plataformas de juego del usuario
-- ============================================================================
CREATE OR REPLACE FUNCTION obtener_cuentas_juego(
    p_nickname VARCHAR
)
RETURNS TABLE (
    cuenta_id UUID,
    plataforma VARCHAR,
    identificador VARCHAR
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_usuario_id UUID;
BEGIN
    -- Obtener el ID del usuario por nickname
    SELECT id INTO v_usuario_id
    FROM usuario
    WHERE nickname = p_nickname AND deleted_at IS NULL;
    
    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con nickname % no encontrado', p_nickname;
    END IF;
    
    RETURN QUERY
    SELECT 
        ucj.id,
        cp.valor,
        ucj.identificador
    FROM usuario_cuenta_juego ucj
    JOIN catalogo_plataforma cp ON ucj.plataforma_juego_id = cp.id
    WHERE ucj.usuario_id = v_usuario_id
    ORDER BY cp.valor;
END;
$$;

-- ============================================================================
-- FUNCIÓN: obtener_equipos_usuario
-- Retorna los equipos en los que participa el usuario
-- ============================================================================
CREATE OR REPLACE FUNCTION obtener_equipos_usuario(
    p_nickname VARCHAR
)
RETURNS TABLE (
    equipo_id UUID,
    equipo_nombre VARCHAR,
    equipo_descripcion TEXT,
    equipo_avatar_url VARCHAR,
    rol_en_equipo VARCHAR,
    fecha_ingreso TIMESTAMP,
    total_miembros BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_usuario_id UUID;
BEGIN
    -- Obtener el ID del usuario por nickname
    SELECT id INTO v_usuario_id
    FROM usuario
    WHERE nickname = p_nickname AND deleted_at IS NULL;
    
    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con nickname % no encontrado', p_nickname;
    END IF;
    
    RETURN QUERY
    SELECT 
        e.id,
        e.nombre,
        e.descripcion,
        e.avatar_url,
        em.rol,
        em.joined_at,
        (SELECT COUNT(*) FROM equipo_miembros em2 WHERE em2.equipo_id = e.id)
    FROM equipo_miembros em
    JOIN equipo e ON em.equipo_id = e.id
    WHERE em.usuario_id = v_usuario_id
    ORDER BY em.joined_at DESC;
END;
$$;

-- ============================================================================
-- FUNCIÓN COMPLETA: obtener_perfil_completo_json
-- Retorna TODA la información del perfil en formato JSON para uso en API
-- ============================================================================
CREATE OR REPLACE FUNCTION obtener_perfil_completo_json(
    p_nickname VARCHAR,
    p_viewer_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_perfil perfil_usuario_resultado;
    v_resultado JSONB;
BEGIN
    -- Obtener datos básicos del perfil
    v_perfil := obtener_perfil_usuario(p_nickname, p_viewer_id);
    
    -- Construir el JSON completo
    v_resultado := jsonb_build_object(
        'usuario', jsonb_build_object(
            'id', v_perfil.usuario_id,
            'nickname', v_perfil.nickname,
            'xp', v_perfil.xp,
            'saldo', v_perfil.saldo,
            'creditos', v_perfil.creditos,
            'foto_perfil', v_perfil.foto_perfil,
            'biografia', v_perfil.biografia,
            'estado', v_perfil.estado,
            'ultima_conexion', v_perfil.ultima_conexion,
            'desafios_habilitados', v_perfil.desafios_habilitados,
            'creado_en', v_perfil.creado_en,
            'avatar_url', v_perfil.avatar_url,
            'avatar_nombre', v_perfil.avatar_nombre,
            'rol', v_perfil.rol
        ),
        'datos_personales', CASE 
            WHEN v_perfil.p_nombre IS NOT NULL THEN jsonb_build_object(
                'nombre_completo', TRIM(CONCAT(
                    v_perfil.p_nombre, ' ',
                    COALESCE(v_perfil.s_nombre || ' ', ''),
                    v_perfil.p_apellido, ' ',
                    COALESCE(v_perfil.s_apellido, '')
                )),
                'correo', v_perfil.correo,
                'fecha_nacimiento', v_perfil.fecha_nacimiento,
                'pais', v_perfil.pais,
                'ciudad', v_perfil.ciudad
            )
            ELSE jsonb_build_object(
                'pais', v_perfil.pais,
                'ciudad', v_perfil.ciudad
            )
        END,
        'estadisticas_globales', jsonb_build_object(
            'total_amigos', v_perfil.total_amigos,
            'total_seguidores', v_perfil.total_seguidores,
            'total_siguiendo', v_perfil.total_siguiendo,
            'total_trofeos', v_perfil.total_trofeos,
            'total_logros', v_perfil.total_logros,
            'total_torneos_participados', v_perfil.total_torneos_participados,
            'total_victorias_torneos', v_perfil.total_victorias_torneos,
            'total_derrotas_global', v_perfil.total_derrotas_global,
            'dinero_total_ganado', v_perfil.dinero_total_ganado
        ),
        'estado_amistad', jsonb_build_object(
            'estado', v_perfil.estado_amistad,
            'solicitud_id', v_perfil.solicitud_amistad_id,
            'puede_agregar', (v_perfil.estado_amistad IS NULL AND p_viewer_id IS NOT NULL AND p_viewer_id != v_perfil.usuario_id)
        ),
        'amigos', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', amigo_id,
                'nickname', amigo_nickname,
                'foto_perfil', amigo_foto_perfil,
                'avatar_url', amigo_avatar_url,
                'estado', amigo_estado,
                'ultima_conexion', amigo_ultima_conexion,
                'xp', amigo_xp,
                'fecha_amistad', fecha_amistad
            )), '[]'::jsonb)
            FROM obtener_lista_amigos(p_nickname, 10, 0)
        ),
        'trofeos', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', trofeo_id,
                'tipo', tipo_trofeo,
                'ganado_en', ganado_en,
                'torneo_id', torneo_id,
                'torneo_titulo', torneo_titulo,
                'torneo_juego', torneo_juego,
                'posicion', posicion_final
            )), '[]'::jsonb)
            FROM obtener_vitrina_trofeos(p_nickname, 20, 0)
        ),
        'logros', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', logro_id,
                'nombre', logro_nombre,
                'descripcion', logro_descripcion,
                'fecha_obtenido', fecha_obtenido
            )), '[]'::jsonb)
            FROM obtener_logros_usuario(p_nickname, 20, 0)
        ),
        'estadisticas_juegos', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'juego_id', juego_id,
                'juego_nombre', juego_nombre,
                'victorias', victorias,
                'derrotas', derrotas,
                'empates', empates,
                'porcentaje_victorias', porcentaje_victorias,
                'nivel_rango', nivel_rango,
                'horas_jugadas', horas_jugadas
            )), '[]'::jsonb)
            FROM obtener_estadisticas_juegos(p_nickname)
        ),
        'historial_torneos', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'torneo_id', torneo_id,
                'titulo', torneo_titulo,
                'juego', juego_nombre,
                'fecha_inicio', fecha_inicio,
                'fecha_inscripcion', fecha_inscripcion,
                'estado_inscripcion', estado_inscripcion,
                'posicion_final', posicion_final,
                'premio_ganado', premio_ganado,
                'trofeo', tipo_trofeo
            )), '[]'::jsonb)
            FROM obtener_historial_torneos(p_nickname, 10, 0)
        ),
        'redes_sociales', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', red_id,
                'plataforma', plataforma,
                'enlace', enlace
            )), '[]'::jsonb)
            FROM obtener_redes_sociales(p_nickname)
        ),
        'cuentas_juego', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', cuenta_id,
                'plataforma', plataforma,
                'identificador', identificador
            )), '[]'::jsonb)
            FROM obtener_cuentas_juego(p_nickname)
        ),
        'equipos', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', equipo_id,
                'nombre', equipo_nombre,
                'descripcion', equipo_descripcion,
                'avatar_url', equipo_avatar_url,
                'rol', rol_en_equipo,
                'fecha_ingreso', fecha_ingreso,
                'total_miembros', total_miembros
            )), '[]'::jsonb)
            FROM obtener_equipos_usuario(p_nickname)
        )
    );
    
    RETURN v_resultado;
END;
$$;

-- ============================================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ============================================================================
COMMENT ON FUNCTION obtener_perfil_usuario IS 
'Obtiene la información básica del perfil de un usuario dado su nickname. 
Si se proporciona p_viewer_id, verifica el estado de amistad y muestra datos personales si es el propio perfil.';

COMMENT ON FUNCTION obtener_lista_amigos IS 
'Obtiene la lista paginada de amigos de un usuario (estado aceptado).';

COMMENT ON FUNCTION obtener_vitrina_trofeos IS 
'Obtiene los trofeos ganados por el usuario con información del torneo asociado.';

COMMENT ON FUNCTION obtener_logros_usuario IS 
'Obtiene los logros desbloqueados por el usuario con fecha de obtención.';

COMMENT ON FUNCTION obtener_estadisticas_juegos IS 
'Obtiene las estadísticas de rendimiento del usuario por cada juego.';

COMMENT ON FUNCTION obtener_historial_torneos IS 
'Obtiene el historial de participación en torneos con resultados y premios.';

COMMENT ON FUNCTION obtener_redes_sociales IS 
'Obtiene los enlaces a redes sociales del usuario.';

COMMENT ON FUNCTION obtener_cuentas_juego IS 
'Obtiene las cuentas de plataformas de juego vinculadas al usuario.';

COMMENT ON FUNCTION obtener_equipos_usuario IS 
'Obtiene los equipos a los que pertenece el usuario con su rol.';

COMMENT ON FUNCTION obtener_perfil_completo_json IS 
'Función principal que retorna TODO el perfil del usuario en formato JSON.
Ideal para consumir desde la API del backend.
Parámetros:
  - p_nickname: nickname del usuario a consultar
  - p_viewer_id: UUID del usuario que visualiza (NULL si no está logueado)
  
Retorna toda la información necesaria para la página usuario/perfil/{nickname}';

-- ============================================================================
-- EJEMPLOS DE USO
-- ============================================================================
-- 1. Obtener perfil completo en JSON (para API):
--    SELECT obtener_perfil_completo_json('nickname_usuario', 'viewer_uuid');
--
-- 2. Obtener solo datos básicos:
--    SELECT * FROM obtener_perfil_usuario('nickname_usuario');
--
-- 3. Obtener lista de amigos paginada:
--    SELECT * FROM obtener_lista_amigos('nickname_usuario', 20, 0);
--
-- 4. Obtener trofeos:
--    SELECT * FROM obtener_vitrina_trofeos('nickname_usuario');
--
-- 5. Obtener estadísticas por juego:
--    SELECT * FROM obtener_estadisticas_juegos('nickname_usuario');
-- ============================================================================
