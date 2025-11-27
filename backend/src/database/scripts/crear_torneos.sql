-- =====================================================
-- SCRIPT: Creación y Administración de Torneos
-- Plataforma eSports
-- =====================================================
-- NOTA: Las tablas y columnas son gestionadas por TypeORM en las entidades:
-- - CatalogoTipoTorneo (catalogo-tipo-torneo/entities)
-- - Torneo (torneo/entities) - incluye: estado_id, tipo_torneo_id, banner_url, miniatura_url, contacto_anfitrion, discord_servidor, creado_en, actualizado_en
-- - TorneoPremio (torneo-premio/entities) - incluye: comision_total
-- =====================================================

-- =====================================================
-- 1. DATOS INICIALES: Insertar tipos de torneo
-- =====================================================
INSERT INTO catalogo_tipo_torneo (valor, descripcion, tipo_trofeo) VALUES
    ('eliminacion_simple', 'Eliminación simple - Un jugador pierde y queda eliminado', 'trofeo_eliminacion'),
    ('eliminacion_doble', 'Eliminación doble - Un jugador debe perder dos veces para ser eliminado', 'trofeo_eliminacion_doble'),
    ('todos_contra_todos', 'Round Robin - Todos juegan contra todos', 'trofeo_round_robin'),
    ('grupos', 'Fase de grupos con eliminatorias', 'trofeo_grupos'),
    ('suizo', 'Sistema suizo - Emparejamientos según rendimiento', 'trofeo_suizo')
ON CONFLICT (valor) DO NOTHING;

-- =====================================================
-- 2. DATOS INICIALES: Insertar estados de torneo
-- =====================================================
INSERT INTO catalogo_estado_torneo (valor) VALUES
    ('proximamente'),
    ('en_curso'),
    ('terminado'),
    ('cancelado')
ON CONFLICT (valor) DO NOTHING;

-- =====================================================
-- 3. PROCEDIMIENTO PRINCIPAL: CREAR TORNEO
-- =====================================================
CREATE OR REPLACE FUNCTION torneo_crear(
    -- Información básica (Paso 1)
    p_anfitrion_id UUID,
    p_titulo VARCHAR,
    p_descripcion TEXT DEFAULT NULL,
    p_fecha_inicio_registro TIMESTAMP DEFAULT NULL,
    p_fecha_fin_registro TIMESTAMP DEFAULT NULL,
    p_fecha_inicio_torneo TIMESTAMP DEFAULT NULL,
    
    -- Detalles del torneo (Paso 2)
    p_juego_id UUID DEFAULT NULL,
    p_plataforma_id UUID DEFAULT NULL,
    p_modo_juego_id UUID DEFAULT NULL,
    p_region_id UUID DEFAULT NULL,
    p_tipo_torneo_id UUID DEFAULT NULL,
    p_al_mejor_de INTEGER DEFAULT 1,
    p_formato VARCHAR DEFAULT '1v1',
    p_cerrado BOOLEAN DEFAULT FALSE,
    p_reglas TEXT DEFAULT NULL,
    p_jugadores_pc_permitidos BOOLEAN DEFAULT TRUE,
    p_requiere_transmision BOOLEAN DEFAULT FALSE,
    p_requiere_camara BOOLEAN DEFAULT FALSE,
    p_tipo_entrada_id UUID DEFAULT NULL,
    p_capacidad INTEGER DEFAULT NULL,
    
    -- Premios (Paso 3)
    p_cuota INTEGER DEFAULT 0,
    p_comision_porcentaje NUMERIC(5,2) DEFAULT 0,
    p_ganador1_porcentaje NUMERIC(5,2) DEFAULT 70,
    p_ganador2_porcentaje NUMERIC(5,2) DEFAULT 30,
    
    -- Detalles del anfitrión (Paso 4)
    p_contacto_anfitrion VARCHAR DEFAULT NULL,
    p_discord_servidor VARCHAR DEFAULT NULL,
    p_redes_sociales JSONB DEFAULT '[]'::JSONB,
    
    -- Gráficos (Paso 5)
    p_banner_url VARCHAR DEFAULT NULL,
    p_miniatura_url VARCHAR DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_torneo_id UUID;
    v_estado_proximamente_id UUID;
    v_red JSONB;
    v_fondo_total NUMERIC(12,2) := 0;
    v_fondo_despues_comision NUMERIC(12,2) := 0;
    v_comision_total NUMERIC(12,2) := 0;
    v_tipo_torneo_default_id UUID;
BEGIN
    -- =====================================================
    -- VALIDACIONES
    -- =====================================================
    
    -- Validar que el anfitrión existe y está activo
    IF NOT EXISTS (
        SELECT 1 FROM usuario 
        WHERE id = p_anfitrion_id AND deleted_at IS NULL
    ) THEN
        RAISE EXCEPTION 'El usuario anfitrión no existe o no está activo';
    END IF;
    
    -- Validar título obligatorio
    IF p_titulo IS NULL OR TRIM(p_titulo) = '' THEN
        RAISE EXCEPTION 'El título del torneo es obligatorio';
    END IF;
    
    -- Validar juego si se proporciona
    IF p_juego_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM juego WHERE id = p_juego_id) THEN
            RAISE EXCEPTION 'El juego especificado no existe';
        END IF;
    END IF;
    
    -- Validar plataforma si se proporciona
    IF p_plataforma_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM catalogo_plataforma WHERE id = p_plataforma_id) THEN
            RAISE EXCEPTION 'La plataforma especificada no existe';
        END IF;
    END IF;
    
    -- Validar modo de juego si se proporciona (debe pertenecer al juego)
    IF p_modo_juego_id IS NOT NULL THEN
        IF p_juego_id IS NULL THEN
            RAISE EXCEPTION 'Debe especificar un juego para seleccionar un modo de juego';
        END IF;
        IF NOT EXISTS (
            SELECT 1 FROM modo_juego 
            WHERE id = p_modo_juego_id AND juego_id = p_juego_id
        ) THEN
            RAISE EXCEPTION 'El modo de juego no pertenece al juego especificado';
        END IF;
    END IF;
    
    -- Validar región si se proporciona
    IF p_region_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM catalogo_region WHERE id = p_region_id) THEN
            RAISE EXCEPTION 'La región especificada no existe';
        END IF;
    END IF;
    
    -- Validar tipo de entrada si se proporciona
    IF p_tipo_entrada_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM catalogo_tipo_entrada WHERE id = p_tipo_entrada_id) THEN
            RAISE EXCEPTION 'El tipo de entrada especificado no existe';
        END IF;
    END IF;
    
    -- Validar tipo de torneo o asignar default
    IF p_tipo_torneo_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM catalogo_tipo_torneo WHERE id = p_tipo_torneo_id) THEN
            RAISE EXCEPTION 'El tipo de torneo especificado no existe';
        END IF;
    ELSE
        -- Asignar eliminación simple por defecto
        SELECT id INTO v_tipo_torneo_default_id 
        FROM catalogo_tipo_torneo 
        WHERE valor = 'eliminacion_simple';
        p_tipo_torneo_id := v_tipo_torneo_default_id;
    END IF;
    
    -- Validar al_mejor_de (debe ser 1, 3, 5, o 7)
    IF p_al_mejor_de NOT IN (1, 3, 5, 7) THEN
        RAISE EXCEPTION 'El valor "al mejor de" debe ser 1, 3, 5 o 7';
    END IF;
    
    -- Validar porcentajes de premios
    IF p_ganador1_porcentaje + p_ganador2_porcentaje > 100 THEN
        RAISE EXCEPTION 'La suma de los porcentajes de premios no puede exceder 100%%';
    END IF;
    
    -- Validar fechas lógicas
    IF p_fecha_inicio_registro IS NOT NULL AND p_fecha_fin_registro IS NOT NULL THEN
        IF p_fecha_fin_registro <= p_fecha_inicio_registro THEN
            RAISE EXCEPTION 'La fecha de fin de registro debe ser posterior a la fecha de inicio de registro';
        END IF;
    END IF;
    
    IF p_fecha_fin_registro IS NOT NULL AND p_fecha_inicio_torneo IS NOT NULL THEN
        IF p_fecha_inicio_torneo < p_fecha_fin_registro THEN
            RAISE EXCEPTION 'La fecha de inicio del torneo debe ser igual o posterior a la fecha de fin de registro';
        END IF;
    END IF;
    
    -- =====================================================
    -- OBTENER ID DE ESTADO "PRÓXIMAMENTE"
    -- =====================================================
    SELECT id INTO v_estado_proximamente_id 
    FROM catalogo_estado_torneo 
    WHERE valor = 'proximamente';
    
    IF v_estado_proximamente_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró el estado "proximamente" en el catálogo';
    END IF;
    
    -- =====================================================
    -- INSERTAR TORNEO
    -- =====================================================
    INSERT INTO torneo (
        titulo,
        descripcion,
        fecha_inicio_registro,
        fecha_fin_registro,
        fecha_inicio_torneo,
        juego_id,
        plataforma_id,
        modo_juego_id,
        region_id,
        tipo_torneo_id,
        tipo_torneo, -- Campo legacy, mantener por compatibilidad
        al_mejor_de,
        formato,
        cerrado,
        reglas,
        jugadores_pc_permitidos,
        requiere_transmision,
        requiere_camara,
        tipo_entrada_id,
        capacidad,
        anfitrion_id,
        contacto_anfitrion,
        discord_servidor,
        banner_url,
        miniatura_url,
        estado_id,
        creado_en,
        actualizado_en
    ) VALUES (
        p_titulo,
        p_descripcion,
        p_fecha_inicio_registro,
        p_fecha_fin_registro,
        p_fecha_inicio_torneo,
        p_juego_id,
        p_plataforma_id,
        p_modo_juego_id,
        p_region_id,
        p_tipo_torneo_id,
        (SELECT valor FROM catalogo_tipo_torneo WHERE id = p_tipo_torneo_id),
        p_al_mejor_de,
        p_formato,
        p_cerrado,
        p_reglas,
        p_jugadores_pc_permitidos,
        p_requiere_transmision,
        p_requiere_camara,
        p_tipo_entrada_id,
        p_capacidad,
        p_anfitrion_id,
        p_contacto_anfitrion,
        p_discord_servidor,
        p_banner_url,
        p_miniatura_url,
        v_estado_proximamente_id,
        NOW(),
        NOW()
    )
    RETURNING id INTO v_torneo_id;
    
    -- =====================================================
    -- INSERTAR PREMIOS
    -- (El fondo se calcula cuando se registran jugadores)
    -- =====================================================
    INSERT INTO torneo_premios (
        torneo_id,
        cuota,
        fondo_total,
        fondo_despues_comision,
        comision_porcentaje,
        comision_total,
        ganador1_porcentaje,
        ganador2_porcentaje
    ) VALUES (
        v_torneo_id,
        p_cuota,
        0, -- Se actualizará conforme se inscriban jugadores
        0,
        p_comision_porcentaje,
        0,
        p_ganador1_porcentaje,
        p_ganador2_porcentaje
    );
    
    -- =====================================================
    -- INSERTAR REDES SOCIALES DEL TORNEO
    -- =====================================================
    IF p_redes_sociales IS NOT NULL AND jsonb_array_length(p_redes_sociales) > 0 THEN
        FOR v_red IN SELECT * FROM jsonb_array_elements(p_redes_sociales)
        LOOP
            INSERT INTO torneo_redes (torneo_id, plataforma, url)
            VALUES (
                v_torneo_id,
                v_red->>'plataforma',
                v_red->>'url'
            );
        END LOOP;
    END IF;
    
    -- =====================================================
    -- RETORNAR RESULTADO
    -- =====================================================
    RETURN jsonb_build_object(
        'success', true,
        'torneo_id', v_torneo_id,
        'message', 'Torneo creado exitosamente',
        'estado', 'proximamente',
        'datos', jsonb_build_object(
            'titulo', p_titulo,
            'anfitrion_id', p_anfitrion_id,
            'capacidad', p_capacidad,
            'cuota', p_cuota,
            'fecha_inicio_torneo', p_fecha_inicio_torneo
        )
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;

COMMENT ON FUNCTION torneo_crear IS 'Crea un nuevo torneo con toda la información de los 6 pasos del formulario.
El estado inicial siempre es "proximamente".

Parámetros agrupados por paso:
1. Información básica: título, descripción, fechas
2. Detalles: juego, plataforma, modo, región, tipo, formato, reglas, opciones
3. Premios: cuota, comisiones, distribución
4. Anfitrión: contacto, discord, redes sociales
5. Gráficos: banner, miniatura

Retorna JSON con success, torneo_id y mensaje.';

-- =====================================================
-- 4. PROCEDIMIENTO: ACTUALIZAR TORNEO
-- =====================================================
CREATE OR REPLACE FUNCTION torneo_actualizar(
    p_torneo_id UUID,
    p_anfitrion_id UUID, -- Para validar que quien actualiza es el anfitrión
    
    -- Información básica
    p_titulo VARCHAR DEFAULT NULL,
    p_descripcion TEXT DEFAULT NULL,
    p_fecha_inicio_registro TIMESTAMP DEFAULT NULL,
    p_fecha_fin_registro TIMESTAMP DEFAULT NULL,
    p_fecha_inicio_torneo TIMESTAMP DEFAULT NULL,
    
    -- Detalles del torneo
    p_juego_id UUID DEFAULT NULL,
    p_plataforma_id UUID DEFAULT NULL,
    p_modo_juego_id UUID DEFAULT NULL,
    p_region_id UUID DEFAULT NULL,
    p_tipo_torneo_id UUID DEFAULT NULL,
    p_al_mejor_de INTEGER DEFAULT NULL,
    p_formato VARCHAR DEFAULT NULL,
    p_cerrado BOOLEAN DEFAULT NULL,
    p_reglas TEXT DEFAULT NULL,
    p_jugadores_pc_permitidos BOOLEAN DEFAULT NULL,
    p_requiere_transmision BOOLEAN DEFAULT NULL,
    p_requiere_camara BOOLEAN DEFAULT NULL,
    p_tipo_entrada_id UUID DEFAULT NULL,
    p_capacidad INTEGER DEFAULT NULL,
    
    -- Premios
    p_cuota INTEGER DEFAULT NULL,
    p_comision_porcentaje NUMERIC(5,2) DEFAULT NULL,
    p_ganador1_porcentaje NUMERIC(5,2) DEFAULT NULL,
    p_ganador2_porcentaje NUMERIC(5,2) DEFAULT NULL,
    
    -- Detalles del anfitrión
    p_contacto_anfitrion VARCHAR DEFAULT NULL,
    p_discord_servidor VARCHAR DEFAULT NULL,
    
    -- Gráficos
    p_banner_url VARCHAR DEFAULT NULL,
    p_miniatura_url VARCHAR DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_estado_actual VARCHAR;
    v_anfitrion_actual UUID;
BEGIN
    -- Verificar que el torneo existe y obtener datos actuales
    SELECT 
        cet.valor,
        t.anfitrion_id
    INTO v_estado_actual, v_anfitrion_actual
    FROM torneo t
    LEFT JOIN catalogo_estado_torneo cet ON t.estado_id = cet.id
    WHERE t.id = p_torneo_id;
    
    IF v_anfitrion_actual IS NULL THEN
        RAISE EXCEPTION 'El torneo no existe';
    END IF;
    
    -- Verificar que quien actualiza es el anfitrión
    IF v_anfitrion_actual != p_anfitrion_id THEN
        RAISE EXCEPTION 'Solo el anfitrión puede modificar el torneo';
    END IF;
    
    -- No permitir modificar torneos terminados o cancelados
    IF v_estado_actual IN ('terminado', 'cancelado') THEN
        RAISE EXCEPTION 'No se puede modificar un torneo que ya terminó o fue cancelado';
    END IF;
    
    -- Actualizar torneo
    UPDATE torneo
    SET
        titulo = COALESCE(p_titulo, titulo),
        descripcion = COALESCE(p_descripcion, descripcion),
        fecha_inicio_registro = COALESCE(p_fecha_inicio_registro, fecha_inicio_registro),
        fecha_fin_registro = COALESCE(p_fecha_fin_registro, fecha_fin_registro),
        fecha_inicio_torneo = COALESCE(p_fecha_inicio_torneo, fecha_inicio_torneo),
        juego_id = COALESCE(p_juego_id, juego_id),
        plataforma_id = COALESCE(p_plataforma_id, plataforma_id),
        modo_juego_id = COALESCE(p_modo_juego_id, modo_juego_id),
        region_id = COALESCE(p_region_id, region_id),
        tipo_torneo_id = COALESCE(p_tipo_torneo_id, tipo_torneo_id),
        al_mejor_de = COALESCE(p_al_mejor_de, al_mejor_de),
        formato = COALESCE(p_formato, formato),
        cerrado = COALESCE(p_cerrado, cerrado),
        reglas = COALESCE(p_reglas, reglas),
        jugadores_pc_permitidos = COALESCE(p_jugadores_pc_permitidos, jugadores_pc_permitidos),
        requiere_transmision = COALESCE(p_requiere_transmision, requiere_transmision),
        requiere_camara = COALESCE(p_requiere_camara, requiere_camara),
        tipo_entrada_id = COALESCE(p_tipo_entrada_id, tipo_entrada_id),
        capacidad = COALESCE(p_capacidad, capacidad),
        contacto_anfitrion = COALESCE(p_contacto_anfitrion, contacto_anfitrion),
        discord_servidor = COALESCE(p_discord_servidor, discord_servidor),
        banner_url = COALESCE(p_banner_url, banner_url),
        miniatura_url = COALESCE(p_miniatura_url, miniatura_url),
        actualizado_en = NOW()
    WHERE id = p_torneo_id;
    
    -- Actualizar premios si se proporcionan
    IF p_cuota IS NOT NULL OR p_comision_porcentaje IS NOT NULL 
       OR p_ganador1_porcentaje IS NOT NULL OR p_ganador2_porcentaje IS NOT NULL THEN
        UPDATE torneo_premios
        SET
            cuota = COALESCE(p_cuota, cuota),
            comision_porcentaje = COALESCE(p_comision_porcentaje, comision_porcentaje),
            ganador1_porcentaje = COALESCE(p_ganador1_porcentaje, ganador1_porcentaje),
            ganador2_porcentaje = COALESCE(p_ganador2_porcentaje, ganador2_porcentaje)
        WHERE torneo_id = p_torneo_id;
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'torneo_id', p_torneo_id,
        'message', 'Torneo actualizado exitosamente'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;

COMMENT ON FUNCTION torneo_actualizar IS 'Actualiza un torneo existente. Solo el anfitrión puede modificar. No se permiten cambios en torneos terminados o cancelados.';

-- =====================================================
-- 5. PROCEDIMIENTO: CAMBIAR ESTADO DEL TORNEO
-- =====================================================
CREATE OR REPLACE FUNCTION torneo_cambiar_estado(
    p_torneo_id UUID,
    p_anfitrion_id UUID,
    p_nuevo_estado VARCHAR -- 'proximamente', 'en_curso', 'terminado', 'cancelado'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_estado_id UUID;
    v_anfitrion_actual UUID;
    v_estado_actual VARCHAR;
BEGIN
    -- Verificar que el torneo existe
    SELECT 
        t.anfitrion_id,
        cet.valor
    INTO v_anfitrion_actual, v_estado_actual
    FROM torneo t
    LEFT JOIN catalogo_estado_torneo cet ON t.estado_id = cet.id
    WHERE t.id = p_torneo_id;
    
    IF v_anfitrion_actual IS NULL THEN
        RAISE EXCEPTION 'El torneo no existe';
    END IF;
    
    -- Verificar que quien cambia el estado es el anfitrión
    IF v_anfitrion_actual != p_anfitrion_id THEN
        RAISE EXCEPTION 'Solo el anfitrión puede cambiar el estado del torneo';
    END IF;
    
    -- Obtener el ID del nuevo estado
    SELECT id INTO v_estado_id
    FROM catalogo_estado_torneo
    WHERE valor = p_nuevo_estado;
    
    IF v_estado_id IS NULL THEN
        RAISE EXCEPTION 'Estado no válido. Use: proximamente, en_curso, terminado, cancelado';
    END IF;
    
    -- Validar transiciones de estado permitidas
    IF v_estado_actual = 'terminado' THEN
        RAISE EXCEPTION 'No se puede cambiar el estado de un torneo terminado';
    END IF;
    
    IF v_estado_actual = 'cancelado' AND p_nuevo_estado != 'cancelado' THEN
        RAISE EXCEPTION 'No se puede reactivar un torneo cancelado';
    END IF;
    
    -- Actualizar estado
    UPDATE torneo
    SET 
        estado_id = v_estado_id,
        actualizado_en = NOW()
    WHERE id = p_torneo_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'torneo_id', p_torneo_id,
        'estado_anterior', v_estado_actual,
        'estado_nuevo', p_nuevo_estado,
        'message', 'Estado del torneo actualizado'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;

COMMENT ON FUNCTION torneo_cambiar_estado IS 'Cambia el estado de un torneo. Estados válidos: proximamente, en_curso, terminado, cancelado';

-- =====================================================
-- 6. PROCEDIMIENTO: GESTIONAR REDES SOCIALES DEL TORNEO
-- =====================================================
CREATE OR REPLACE FUNCTION torneo_upsert_red_social(
    p_torneo_id UUID,
    p_anfitrion_id UUID,
    p_plataforma VARCHAR, -- 'twitch', 'discord', 'youtube', 'facebook', 'x'
    p_url VARCHAR,
    p_red_id UUID DEFAULT NULL -- Para actualizar existente
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_anfitrion_actual UUID;
    v_red_id UUID;
BEGIN
    -- Verificar que el torneo existe y pertenece al anfitrión
    SELECT anfitrion_id INTO v_anfitrion_actual
    FROM torneo WHERE id = p_torneo_id;
    
    IF v_anfitrion_actual IS NULL THEN
        RAISE EXCEPTION 'El torneo no existe';
    END IF;
    
    IF v_anfitrion_actual != p_anfitrion_id THEN
        RAISE EXCEPTION 'Solo el anfitrión puede modificar las redes del torneo';
    END IF;
    
    -- Validar datos
    IF p_plataforma IS NULL OR TRIM(p_plataforma) = '' THEN
        RAISE EXCEPTION 'La plataforma es requerida';
    END IF;
    
    IF p_url IS NULL OR TRIM(p_url) = '' THEN
        RAISE EXCEPTION 'La URL es requerida';
    END IF;
    
    IF p_red_id IS NOT NULL THEN
        -- Actualizar existente
        UPDATE torneo_redes
        SET plataforma = p_plataforma, url = p_url
        WHERE id = p_red_id AND torneo_id = p_torneo_id;
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Red social no encontrada';
        END IF;
        
        v_red_id := p_red_id;
    ELSE
        -- Verificar si ya existe esta plataforma para el torneo
        SELECT id INTO v_red_id
        FROM torneo_redes
        WHERE torneo_id = p_torneo_id AND LOWER(plataforma) = LOWER(p_plataforma);
        
        IF v_red_id IS NOT NULL THEN
            -- Actualizar existente
            UPDATE torneo_redes
            SET url = p_url
            WHERE id = v_red_id;
        ELSE
            -- Crear nueva
            INSERT INTO torneo_redes (torneo_id, plataforma, url)
            VALUES (p_torneo_id, p_plataforma, p_url)
            RETURNING id INTO v_red_id;
        END IF;
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'red_id', v_red_id,
        'message', 'Red social guardada correctamente'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;

COMMENT ON FUNCTION torneo_upsert_red_social IS 'Crea o actualiza una red social del torneo (twitch, discord, youtube, facebook, x)';

-- =====================================================
-- 7. PROCEDIMIENTO: ELIMINAR RED SOCIAL DEL TORNEO
-- =====================================================
CREATE OR REPLACE FUNCTION torneo_eliminar_red_social(
    p_torneo_id UUID,
    p_anfitrion_id UUID,
    p_red_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_anfitrion_actual UUID;
BEGIN
    -- Verificar que el torneo pertenece al anfitrión
    SELECT anfitrion_id INTO v_anfitrion_actual
    FROM torneo WHERE id = p_torneo_id;
    
    IF v_anfitrion_actual != p_anfitrion_id THEN
        RAISE EXCEPTION 'Solo el anfitrión puede eliminar redes del torneo';
    END IF;
    
    DELETE FROM torneo_redes
    WHERE id = p_red_id AND torneo_id = p_torneo_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Red social no encontrada';
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Red social eliminada correctamente'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;

COMMENT ON FUNCTION torneo_eliminar_red_social IS 'Elimina una red social del torneo';

-- =====================================================
-- 8. PROCEDIMIENTO: OBTENER DETALLE COMPLETO DEL TORNEO
-- =====================================================
CREATE OR REPLACE FUNCTION torneo_obtener_detalle(
    p_torneo_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_resultado JSONB;
BEGIN
    SELECT jsonb_build_object(
        'id', t.id,
        'titulo', t.titulo,
        'descripcion', t.descripcion,
        
        -- Fechas
        'fechas', jsonb_build_object(
            'inicio_registro', t.fecha_inicio_registro,
            'fin_registro', t.fecha_fin_registro,
            'inicio_torneo', t.fecha_inicio_torneo
        ),
        
        -- Detalles
        'juego', CASE WHEN j.id IS NOT NULL THEN jsonb_build_object(
            'id', j.id,
            'nombre', j.nombre
        ) ELSE NULL END,
        'plataforma', CASE WHEN cp.id IS NOT NULL THEN jsonb_build_object(
            'id', cp.id,
            'valor', cp.valor
        ) ELSE NULL END,
        'modo_juego', CASE WHEN mj.id IS NOT NULL THEN jsonb_build_object(
            'id', mj.id,
            'nombre', mj.nombre
        ) ELSE NULL END,
        'region', CASE WHEN cr.id IS NOT NULL THEN jsonb_build_object(
            'id', cr.id,
            'valor', cr.valor
        ) ELSE NULL END,
        'tipo_torneo', CASE WHEN ctt.id IS NOT NULL THEN jsonb_build_object(
            'id', ctt.id,
            'valor', ctt.valor,
            'tipo_trofeo', ctt.tipo_trofeo
        ) ELSE NULL END,
        'tipo_entrada', CASE WHEN cte.id IS NOT NULL THEN jsonb_build_object(
            'id', cte.id,
            'valor', cte.valor
        ) ELSE NULL END,
        
        -- Configuración
        'configuracion', jsonb_build_object(
            'al_mejor_de', t.al_mejor_de,
            'formato', t.formato,
            'cerrado', t.cerrado,
            'reglas', t.reglas,
            'capacidad', t.capacidad,
            'jugadores_pc_permitidos', t.jugadores_pc_permitidos,
            'requiere_transmision', t.requiere_transmision,
            'requiere_camara', t.requiere_camara
        ),
        
        -- Estado
        'estado', CASE WHEN cet.id IS NOT NULL THEN jsonb_build_object(
            'id', cet.id,
            'valor', cet.valor
        ) ELSE NULL END,
        
        -- Premios
        'premios', (
            SELECT jsonb_build_object(
                'cuota', tp.cuota,
                'fondo_total', tp.fondo_total,
                'fondo_despues_comision', tp.fondo_despues_comision,
                'comision_porcentaje', tp.comision_porcentaje,
                'comision_total', tp.comision_total,
                'ganador1_porcentaje', tp.ganador1_porcentaje,
                'ganador2_porcentaje', tp.ganador2_porcentaje,
                'premio_1er_lugar', ROUND(tp.fondo_despues_comision * tp.ganador1_porcentaje / 100, 2),
                'premio_2do_lugar', ROUND(tp.fondo_despues_comision * tp.ganador2_porcentaje / 100, 2)
            )
            FROM torneo_premios tp
            WHERE tp.torneo_id = t.id
        ),
        
        -- Anfitrión
        'anfitrion', jsonb_build_object(
            'id', u.id,
            'nickname', u.nickname,
            'foto_perfil', u.foto_perfil,
            'avatar_url', ca.url,
            'contacto', t.contacto_anfitrion,
            'discord_servidor', t.discord_servidor
        ),
        
        -- Redes sociales del torneo
        'redes_sociales', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', tr.id,
                'plataforma', tr.plataforma,
                'url', tr.url
            )), '[]'::jsonb)
            FROM torneo_redes tr
            WHERE tr.torneo_id = t.id
        ),
        
        -- Gráficos
        'graficos', jsonb_build_object(
            'banner_url', t.banner_url,
            'miniatura_url', t.miniatura_url
        ),
        
        -- Estadísticas
        'estadisticas', jsonb_build_object(
            'inscritos', (
                SELECT COUNT(*) 
                FROM torneo_inscripcion ti
                JOIN catalogo_estado_inscripcion cei ON ti.estado_id = cei.id
                WHERE ti.torneo_id = t.id AND cei.valor = 'confirmado'
            ),
            'capacidad_restante', CASE 
                WHEN t.capacidad IS NOT NULL THEN 
                    t.capacidad - (
                        SELECT COUNT(*) 
                        FROM torneo_inscripcion ti
                        JOIN catalogo_estado_inscripcion cei ON ti.estado_id = cei.id
                        WHERE ti.torneo_id = t.id AND cei.valor = 'confirmado'
                    )
                ELSE NULL
            END
        ),
        
        -- Timestamps
        'creado_en', t.creado_en,
        'actualizado_en', t.actualizado_en
    )
    INTO v_resultado
    FROM torneo t
    LEFT JOIN juego j ON t.juego_id = j.id
    LEFT JOIN catalogo_plataforma cp ON t.plataforma_id = cp.id
    LEFT JOIN modo_juego mj ON t.modo_juego_id = mj.id
    LEFT JOIN catalogo_region cr ON t.region_id = cr.id
    LEFT JOIN catalogo_tipo_torneo ctt ON t.tipo_torneo_id = ctt.id
    LEFT JOIN catalogo_tipo_entrada cte ON t.tipo_entrada_id = cte.id
    LEFT JOIN catalogo_estado_torneo cet ON t.estado_id = cet.id
    LEFT JOIN usuario u ON t.anfitrion_id = u.id
    LEFT JOIN catalogo_avatar ca ON u.avatar_id = ca.id
    WHERE t.id = p_torneo_id;
    
    IF v_resultado IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Torneo no encontrado'
        );
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'torneo', v_resultado
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;

COMMENT ON FUNCTION torneo_obtener_detalle IS 'Obtiene toda la información detallada de un torneo para visualización';

-- =====================================================
-- 9. PROCEDIMIENTO: LISTAR TORNEOS (CON FILTROS)
-- =====================================================
CREATE OR REPLACE FUNCTION torneo_listar(
    p_estado VARCHAR DEFAULT NULL, -- Filtrar por estado
    p_juego_id UUID DEFAULT NULL,
    p_region_id UUID DEFAULT NULL,
    p_anfitrion_id UUID DEFAULT NULL, -- Torneos de un anfitrión específico
    p_busqueda VARCHAR DEFAULT NULL, -- Búsqueda por título
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total INTEGER;
    v_torneos JSONB;
BEGIN
    -- Contar total
    SELECT COUNT(*)
    INTO v_total
    FROM torneo t
    LEFT JOIN catalogo_estado_torneo cet ON t.estado_id = cet.id
    WHERE (p_estado IS NULL OR cet.valor = p_estado)
      AND (p_juego_id IS NULL OR t.juego_id = p_juego_id)
      AND (p_region_id IS NULL OR t.region_id = p_region_id)
      AND (p_anfitrion_id IS NULL OR t.anfitrion_id = p_anfitrion_id)
      AND (p_busqueda IS NULL OR t.titulo ILIKE '%' || p_busqueda || '%');
    
    -- Obtener torneos
    SELECT COALESCE(jsonb_agg(torneo_data ORDER BY t.fecha_inicio_torneo DESC NULLS LAST), '[]'::jsonb)
    INTO v_torneos
    FROM (
        SELECT jsonb_build_object(
            'id', t.id,
            'titulo', t.titulo,
            'descripcion', LEFT(t.descripcion, 200),
            'miniatura_url', t.miniatura_url,
            'juego', j.nombre,
            'plataforma', cp.valor,
            'region', cr.valor,
            'estado', cet.valor,
            'formato', t.formato,
            'capacidad', t.capacidad,
            'inscritos', (
                SELECT COUNT(*) 
                FROM torneo_inscripcion ti
                JOIN catalogo_estado_inscripcion cei ON ti.estado_id = cei.id
                WHERE ti.torneo_id = t.id AND cei.valor = 'confirmado'
            ),
            'cuota', tp.cuota,
            'fondo_total', tp.fondo_total,
            'fecha_inicio_torneo', t.fecha_inicio_torneo,
            'fecha_fin_registro', t.fecha_fin_registro,
            'anfitrion', jsonb_build_object(
                'id', u.id,
                'nickname', u.nickname,
                'avatar_url', ca.url
            )
        ) as torneo_data,
        t.fecha_inicio_torneo
        FROM torneo t
        LEFT JOIN juego j ON t.juego_id = j.id
        LEFT JOIN catalogo_plataforma cp ON t.plataforma_id = cp.id
        LEFT JOIN catalogo_region cr ON t.region_id = cr.id
        LEFT JOIN catalogo_estado_torneo cet ON t.estado_id = cet.id
        LEFT JOIN torneo_premios tp ON tp.torneo_id = t.id
        LEFT JOIN usuario u ON t.anfitrion_id = u.id
        LEFT JOIN catalogo_avatar ca ON u.avatar_id = ca.id
        WHERE (p_estado IS NULL OR cet.valor = p_estado)
          AND (p_juego_id IS NULL OR t.juego_id = p_juego_id)
          AND (p_region_id IS NULL OR t.region_id = p_region_id)
          AND (p_anfitrion_id IS NULL OR t.anfitrion_id = p_anfitrion_id)
          AND (p_busqueda IS NULL OR t.titulo ILIKE '%' || p_busqueda || '%')
        ORDER BY t.fecha_inicio_torneo DESC NULLS LAST
        LIMIT p_limit
        OFFSET p_offset
    ) t;
    
    RETURN jsonb_build_object(
        'success', true,
        'total', v_total,
        'limit', p_limit,
        'offset', p_offset,
        'torneos', v_torneos
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;

COMMENT ON FUNCTION torneo_listar IS 'Lista torneos con filtros opcionales por estado, juego, región, anfitrión y búsqueda por título';

-- =====================================================
-- 10. PROCEDIMIENTO: OBTENER CATÁLOGOS PARA FORMULARIO
-- =====================================================
CREATE OR REPLACE FUNCTION torneo_obtener_catalogos()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN jsonb_build_object(
        'success', true,
        'catalogos', jsonb_build_object(
            'juegos', (
                SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'id', j.id,
                    'nombre', j.nombre,
                    'plataformas', (
                        SELECT COALESCE(jsonb_agg(jsonb_build_object(
                            'id', cp.id,
                            'valor', cp.valor
                        )), '[]'::jsonb)
                        FROM juego_plataformas jp
                        JOIN catalogo_plataforma cp ON jp."catalogoPlataformaId" = cp.id
                        WHERE jp."juegoId" = j.id
                    ),
                    'modos_juego', (
                        SELECT COALESCE(jsonb_agg(jsonb_build_object(
                            'id', mj.id,
                            'nombre', mj.nombre
                        )), '[]'::jsonb)
                        FROM modo_juego mj
                        WHERE mj.juego_id = j.id
                    )
                ) ORDER BY j.nombre), '[]'::jsonb)
                FROM juego j
            ),
            'regiones', (
                SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'id', id,
                    'valor', valor
                ) ORDER BY valor), '[]'::jsonb)
                FROM catalogo_region
            ),
            'tipos_torneo', (
                SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'id', id,
                    'valor', valor,
                    'descripcion', descripcion,
                    'tipo_trofeo', tipo_trofeo
                ) ORDER BY valor), '[]'::jsonb)
                FROM catalogo_tipo_torneo
            ),
            'tipos_entrada', (
                SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'id', id,
                    'valor', valor
                ) ORDER BY valor), '[]'::jsonb)
                FROM catalogo_tipo_entrada
            ),
            'al_mejor_de', jsonb_build_array(1, 3, 5, 7),
            'formatos', jsonb_build_array('1v1', '2v2', '3v3', '4v4', '5v5'),
            'redes_sociales', jsonb_build_array('twitch', 'discord', 'youtube', 'facebook', 'x')
        )
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;

COMMENT ON FUNCTION torneo_obtener_catalogos IS 'Obtiene todos los catálogos necesarios para el formulario de creación de torneos';

-- =====================================================
-- 11. TRIGGER: ACTUALIZAR FONDO DE PREMIOS AL INSCRIBIRSE
-- =====================================================
CREATE OR REPLACE FUNCTION trigger_actualizar_fondo_premios()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_cuota INTEGER;
    v_comision_porcentaje NUMERIC(5,2);
    v_inscritos INTEGER;
    v_fondo_total NUMERIC(12,2);
    v_comision_total NUMERIC(12,2);
    v_fondo_despues_comision NUMERIC(12,2);
    v_estado_confirmado_id UUID;
BEGIN
    -- Obtener estado confirmado
    SELECT id INTO v_estado_confirmado_id
    FROM catalogo_estado_inscripcion
    WHERE valor = 'confirmado';
    
    -- Solo procesar si la inscripción es confirmada
    IF NEW.estado_id = v_estado_confirmado_id THEN
        -- Obtener cuota y comisión del torneo
        SELECT cuota, comision_porcentaje
        INTO v_cuota, v_comision_porcentaje
        FROM torneo_premios
        WHERE torneo_id = NEW.torneo_id;
        
        -- Contar inscritos confirmados
        SELECT COUNT(*)
        INTO v_inscritos
        FROM torneo_inscripcion ti
        WHERE ti.torneo_id = NEW.torneo_id 
          AND ti.estado_id = v_estado_confirmado_id;
        
        -- Calcular fondos
        v_fondo_total := v_cuota * v_inscritos;
        v_comision_total := v_fondo_total * v_comision_porcentaje / 100;
        v_fondo_despues_comision := v_fondo_total - v_comision_total;
        
        -- Actualizar torneo_premios
        UPDATE torneo_premios
        SET 
            fondo_total = v_fondo_total,
            comision_total = v_comision_total,
            fondo_despues_comision = v_fondo_despues_comision
        WHERE torneo_id = NEW.torneo_id;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Crear trigger si no existe
DROP TRIGGER IF EXISTS trg_actualizar_fondo_premios ON torneo_inscripcion;
CREATE TRIGGER trg_actualizar_fondo_premios
    AFTER INSERT OR UPDATE ON torneo_inscripcion
    FOR EACH ROW
    EXECUTE FUNCTION trigger_actualizar_fondo_premios();

-- =====================================================
-- 12. PROCEDIMIENTO: FINALIZAR TORNEO Y ASIGNAR TROFEOS
-- =====================================================
CREATE OR REPLACE FUNCTION torneo_finalizar(
    p_torneo_id UUID,
    p_anfitrion_id UUID,
    p_resultados JSONB -- [{"usuario_id": "uuid", "posicion": 1}, {"usuario_id": "uuid", "posicion": 2}, ...]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_anfitrion_actual UUID;
    v_estado_terminado_id UUID;
    v_tipo_trofeo VARCHAR;
    v_resultado JSONB;
    v_premio_1 NUMERIC(12,2);
    v_premio_2 NUMERIC(12,2);
    v_ganador1_id UUID;
    v_ganador2_id UUID;
BEGIN
    -- Verificar que el torneo existe y pertenece al anfitrión
    SELECT anfitrion_id INTO v_anfitrion_actual
    FROM torneo WHERE id = p_torneo_id;
    
    IF v_anfitrion_actual IS NULL THEN
        RAISE EXCEPTION 'El torneo no existe';
    END IF;
    
    IF v_anfitrion_actual != p_anfitrion_id THEN
        RAISE EXCEPTION 'Solo el anfitrión puede finalizar el torneo';
    END IF;
    
    -- Obtener estado terminado
    SELECT id INTO v_estado_terminado_id
    FROM catalogo_estado_torneo WHERE valor = 'terminado';
    
    -- Obtener tipo de trofeo del tipo de torneo
    SELECT ctt.tipo_trofeo INTO v_tipo_trofeo
    FROM torneo t
    JOIN catalogo_tipo_torneo ctt ON t.tipo_torneo_id = ctt.id
    WHERE t.id = p_torneo_id;
    
    IF v_tipo_trofeo IS NULL THEN
        v_tipo_trofeo := 'trofeo_general';
    END IF;
    
    -- Obtener premios calculados
    SELECT 
        ROUND(fondo_despues_comision * ganador1_porcentaje / 100, 2),
        ROUND(fondo_despues_comision * ganador2_porcentaje / 100, 2)
    INTO v_premio_1, v_premio_2
    FROM torneo_premios
    WHERE torneo_id = p_torneo_id;
    
    -- Insertar resultados
    FOR v_resultado IN SELECT * FROM jsonb_array_elements(p_resultados)
    LOOP
        -- Insertar resultado
        INSERT INTO torneo_resultados (torneo_id, usuario_id, posicion)
        VALUES (
            p_torneo_id,
            (v_resultado->>'usuario_id')::UUID,
            (v_resultado->>'posicion')::INTEGER
        )
        ON CONFLICT DO NOTHING;
        
        -- Asignar trofeo al ganador (posición 1 y 2)
        IF (v_resultado->>'posicion')::INTEGER <= 2 THEN
            INSERT INTO usuario_trofeos (usuario_id, torneo_id, tipo_trofeo)
            VALUES (
                (v_resultado->>'usuario_id')::UUID,
                p_torneo_id,
                v_tipo_trofeo || '_' || (v_resultado->>'posicion')
            );
            
            -- Guardar IDs de ganadores para transferir premios
            IF (v_resultado->>'posicion')::INTEGER = 1 THEN
                v_ganador1_id := (v_resultado->>'usuario_id')::UUID;
            ELSIF (v_resultado->>'posicion')::INTEGER = 2 THEN
                v_ganador2_id := (v_resultado->>'usuario_id')::UUID;
            END IF;
        END IF;
    END LOOP;
    
    -- Actualizar saldo de ganadores (si hay premios)
    IF v_premio_1 > 0 AND v_ganador1_id IS NOT NULL THEN
        UPDATE usuario SET saldo = saldo + v_premio_1 WHERE id = v_ganador1_id;
        
        -- Registrar transacción
        INSERT INTO transaccion (usuario_id, monto, descripcion, tipo_id, origen_id)
        SELECT 
            v_ganador1_id,
            v_premio_1,
            'Premio 1er lugar - Torneo',
            (SELECT id FROM catalogo_transaccion_tipo WHERE valor = 'ingreso'),
            (SELECT id FROM catalogo_origen_transaccion WHERE valor IN ('premio_torneo', 'torneo') LIMIT 1);
    END IF;
    
    IF v_premio_2 > 0 AND v_ganador2_id IS NOT NULL THEN
        UPDATE usuario SET saldo = saldo + v_premio_2 WHERE id = v_ganador2_id;
        
        -- Registrar transacción
        INSERT INTO transaccion (usuario_id, monto, descripcion, tipo_id, origen_id)
        SELECT 
            v_ganador2_id,
            v_premio_2,
            'Premio 2do lugar - Torneo',
            (SELECT id FROM catalogo_transaccion_tipo WHERE valor = 'ingreso'),
            (SELECT id FROM catalogo_origen_transaccion WHERE valor IN ('premio_torneo', 'torneo') LIMIT 1);
    END IF;
    
    -- Actualizar estado del torneo
    UPDATE torneo
    SET estado_id = v_estado_terminado_id, actualizado_en = NOW()
    WHERE id = p_torneo_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'torneo_id', p_torneo_id,
        'message', 'Torneo finalizado exitosamente',
        'premios_distribuidos', jsonb_build_object(
            'primer_lugar', jsonb_build_object('usuario_id', v_ganador1_id, 'monto', v_premio_1),
            'segundo_lugar', jsonb_build_object('usuario_id', v_ganador2_id, 'monto', v_premio_2)
        )
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;

COMMENT ON FUNCTION torneo_finalizar IS 'Finaliza un torneo, registra resultados, asigna trofeos y distribuye premios a los ganadores';

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
