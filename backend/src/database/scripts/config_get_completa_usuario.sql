-- ============================================================================
-- PROCEDIMIENTOS ALMACENADOS: Dashboard de Configuración de Usuario
-- DESCRIPCIÓN: Funciones para GET y UPDATE de todas las secciones de configuración
-- Rutas cubiertas:
--   /usuario/configuracion/personal
--   /usuario/configuracion/social
--   /usuario/configuracion/juegos
--   /usuario/configuracion/preferencias
--   /usuario/configuracion/cuenta
--   /usuario/configuracion/seguridad
--   /usuario/configuracion/retiro (placeholder)
-- AUTOR: Sistema eSports Platform
-- FECHA: 2025-11-26
-- ============================================================================

-- ============================================================================
-- SECCIÓN 1: /usuario/configuracion/personal
-- Campos: nickname (solo lectura), biografia, genero, timezone
-- ============================================================================

-- GET: Obtener configuración personal
CREATE OR REPLACE FUNCTION config_get_personal(
    p_usuario_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_resultado JSONB;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM usuario WHERE id = p_usuario_id AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    SELECT jsonb_build_object(
        'nickname', u.nickname,
        'biografia', u.biografia,
        'genero', jsonb_build_object(
            'id', cg.id,
            'valor', cg.valor
        ),
        'timezone', p.timezone,
        'foto_perfil', u.foto_perfil,
        'avatar', jsonb_build_object(
            'id', ca.id,
            'nombre', ca.nombre,
            'url', ca.url
        ),
        'generos_disponibles', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', g.id,
                'valor', g.valor
            ) ORDER BY g.valor), '[]'::jsonb)
            FROM catalogo_genero g
        )
    )
    INTO v_resultado
    FROM usuario u
    LEFT JOIN persona p ON u.persona_id = p.id
    LEFT JOIN catalogo_genero cg ON p.genero_id = cg.id
    LEFT JOIN catalogo_avatar ca ON u.avatar_id = ca.id
    WHERE u.id = p_usuario_id;
    
    RETURN v_resultado;
END;
$$;

-- UPDATE: Actualizar configuración personal
CREATE OR REPLACE FUNCTION config_update_personal(
    p_usuario_id UUID,
    p_biografia VARCHAR(300) DEFAULT NULL,
    p_genero_id UUID DEFAULT NULL,
    p_timezone VARCHAR DEFAULT NULL,
    p_avatar_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_persona_id UUID;
    v_cambios INTEGER := 0;
BEGIN
    -- Verificar que el usuario existe
    SELECT persona_id INTO v_persona_id
    FROM usuario
    WHERE id = p_usuario_id AND deleted_at IS NULL;
    
    IF v_persona_id IS NULL THEN
        -- Puede que el usuario exista pero no tenga persona asociada
        IF NOT EXISTS (SELECT 1 FROM usuario WHERE id = p_usuario_id AND deleted_at IS NULL) THEN
            RAISE EXCEPTION 'Usuario no encontrado';
        END IF;
    END IF;
    
    -- Validar género si se proporciona
    IF p_genero_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM catalogo_genero WHERE id = p_genero_id) THEN
            RAISE EXCEPTION 'Género no válido';
        END IF;
    END IF;
    
    -- Validar avatar si se proporciona
    IF p_avatar_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM catalogo_avatar WHERE id = p_avatar_id AND disponible = true) THEN
            RAISE EXCEPTION 'Avatar no disponible';
        END IF;
    END IF;
    
    -- Actualizar usuario (biografia y avatar)
    UPDATE usuario
    SET 
        biografia = COALESCE(p_biografia, biografia),
        avatar_id = COALESCE(p_avatar_id, avatar_id),
        actualizado_en = NOW()
    WHERE id = p_usuario_id;
    
    GET DIAGNOSTICS v_cambios = ROW_COUNT;
    
    -- Actualizar persona (genero y timezone)
    IF v_persona_id IS NOT NULL AND (p_genero_id IS NOT NULL OR p_timezone IS NOT NULL) THEN
        UPDATE persona
        SET 
            genero_id = COALESCE(p_genero_id, genero_id),
            timezone = COALESCE(p_timezone, timezone),
            actualizado_en = NOW()
        WHERE id = v_persona_id;
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Configuración personal actualizada correctamente'
    );
END;
$$;

-- ============================================================================
-- SECCIÓN 2: /usuario/configuracion/social
-- Campos: Redes sociales del usuario (Twitter, Twitch, YouTube, Discord, etc.)
-- ============================================================================

-- GET: Obtener redes sociales
CREATE OR REPLACE FUNCTION config_get_social(
    p_usuario_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_resultado JSONB;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM usuario WHERE id = p_usuario_id AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    SELECT jsonb_build_object(
        'redes_sociales', COALESCE((
            SELECT jsonb_agg(jsonb_build_object(
                'id', urs.id,
                'plataforma', urs.plataforma,
                'enlace', urs.enlace
            ) ORDER BY urs.plataforma)
            FROM usuario_red_social urs
            WHERE urs.usuario_id = p_usuario_id
        ), '[]'::jsonb),
        'plataformas_sugeridas', jsonb_build_array(
            'Twitter', 'Twitch', 'YouTube', 'Discord', 'Instagram', 'TikTok', 'Facebook'
        )
    )
    INTO v_resultado;
    
    RETURN v_resultado;
END;
$$;

-- UPDATE: Agregar/Actualizar red social
CREATE OR REPLACE FUNCTION config_upsert_social(
    p_usuario_id UUID,
    p_plataforma VARCHAR,
    p_enlace VARCHAR,
    p_red_id UUID DEFAULT NULL  -- NULL para crear, UUID para actualizar
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_red_id UUID;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM usuario WHERE id = p_usuario_id AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    -- Validar datos
    IF p_plataforma IS NULL OR TRIM(p_plataforma) = '' THEN
        RAISE EXCEPTION 'La plataforma es requerida';
    END IF;
    
    IF p_enlace IS NULL OR TRIM(p_enlace) = '' THEN
        RAISE EXCEPTION 'El enlace es requerido';
    END IF;
    
    IF p_red_id IS NOT NULL THEN
        -- Actualizar existente
        UPDATE usuario_red_social
        SET plataforma = p_plataforma,
            enlace = p_enlace
        WHERE id = p_red_id AND usuario_id = p_usuario_id;
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Red social no encontrada';
        END IF;
        
        v_red_id := p_red_id;
    ELSE
        -- Verificar si ya existe esta plataforma para el usuario
        IF EXISTS (
            SELECT 1 FROM usuario_red_social 
            WHERE usuario_id = p_usuario_id 
            AND LOWER(plataforma) = LOWER(p_plataforma)
        ) THEN
            -- Actualizar existente por plataforma
            UPDATE usuario_red_social
            SET enlace = p_enlace
            WHERE usuario_id = p_usuario_id AND LOWER(plataforma) = LOWER(p_plataforma)
            RETURNING id INTO v_red_id;
        ELSE
            -- Crear nueva
            INSERT INTO usuario_red_social (usuario_id, plataforma, enlace)
            VALUES (p_usuario_id, p_plataforma, p_enlace)
            RETURNING id INTO v_red_id;
        END IF;
    END IF;
    
    -- Actualizar timestamp del usuario
    UPDATE usuario SET actualizado_en = NOW() WHERE id = p_usuario_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'red_id', v_red_id,
        'message', 'Red social guardada correctamente'
    );
END;
$$;

-- DELETE: Eliminar red social
CREATE OR REPLACE FUNCTION config_delete_social(
    p_usuario_id UUID,
    p_red_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM usuario_red_social
    WHERE id = p_red_id AND usuario_id = p_usuario_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Red social no encontrada';
    END IF;
    
    UPDATE usuario SET actualizado_en = NOW() WHERE id = p_usuario_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Red social eliminada correctamente'
    );
END;
$$;

-- ============================================================================
-- SECCIÓN 3: /usuario/configuracion/juegos
-- Campos: Cuentas de plataformas de juegos
-- ============================================================================

-- GET: Obtener cuentas de juegos
CREATE OR REPLACE FUNCTION config_get_juegos(
    p_usuario_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_resultado JSONB;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM usuario WHERE id = p_usuario_id AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    SELECT jsonb_build_object(
        'cuentas_juego', COALESCE((
            SELECT jsonb_agg(jsonb_build_object(
                'id', ucj.id,
                'plataforma_id', cp.id,
                'plataforma', cp.valor,
                'identificador', ucj.identificador
            ) ORDER BY cp.valor)
            FROM usuario_cuenta_juego ucj
            JOIN catalogo_plataforma cp ON ucj.plataforma_juego_id = cp.id
            WHERE ucj.usuario_id = p_usuario_id
        ), '[]'::jsonb),
        'plataformas_disponibles', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', cp.id,
                'valor', cp.valor
            ) ORDER BY cp.valor), '[]'::jsonb)
            FROM catalogo_plataforma cp
        )
    )
    INTO v_resultado;
    
    RETURN v_resultado;
END;
$$;

-- UPDATE: Agregar/Actualizar cuenta de juego
CREATE OR REPLACE FUNCTION config_upsert_cuenta_juego(
    p_usuario_id UUID,
    p_plataforma_id UUID,
    p_identificador VARCHAR,
    p_cuenta_id UUID DEFAULT NULL  -- NULL para crear, UUID para actualizar
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_cuenta_id UUID;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM usuario WHERE id = p_usuario_id AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    -- Validar plataforma
    IF NOT EXISTS (SELECT 1 FROM catalogo_plataforma WHERE id = p_plataforma_id) THEN
        RAISE EXCEPTION 'Plataforma no válida';
    END IF;
    
    -- Validar identificador
    IF p_identificador IS NULL OR TRIM(p_identificador) = '' THEN
        RAISE EXCEPTION 'El identificador es requerido';
    END IF;
    
    IF p_cuenta_id IS NOT NULL THEN
        -- Actualizar existente
        UPDATE usuario_cuenta_juego
        SET plataforma_juego_id = p_plataforma_id,
            identificador = p_identificador
        WHERE id = p_cuenta_id AND usuario_id = p_usuario_id;
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Cuenta de juego no encontrada';
        END IF;
        
        v_cuenta_id := p_cuenta_id;
    ELSE
        -- Verificar si ya existe esta plataforma para el usuario
        SELECT id INTO v_cuenta_id
        FROM usuario_cuenta_juego
        WHERE usuario_id = p_usuario_id AND plataforma_juego_id = p_plataforma_id;
        
        IF v_cuenta_id IS NOT NULL THEN
            -- Actualizar existente
            UPDATE usuario_cuenta_juego
            SET identificador = p_identificador
            WHERE id = v_cuenta_id;
        ELSE
            -- Crear nueva
            INSERT INTO usuario_cuenta_juego (usuario_id, plataforma_juego_id, identificador)
            VALUES (p_usuario_id, p_plataforma_id, p_identificador)
            RETURNING id INTO v_cuenta_id;
        END IF;
    END IF;
    
    UPDATE usuario SET actualizado_en = NOW() WHERE id = p_usuario_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'cuenta_id', v_cuenta_id,
        'message', 'Cuenta de juego guardada correctamente'
    );
END;
$$;

-- DELETE: Eliminar cuenta de juego
CREATE OR REPLACE FUNCTION config_delete_cuenta_juego(
    p_usuario_id UUID,
    p_cuenta_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM usuario_cuenta_juego
    WHERE id = p_cuenta_id AND usuario_id = p_usuario_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cuenta de juego no encontrada';
    END IF;
    
    UPDATE usuario SET actualizado_en = NOW() WHERE id = p_usuario_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Cuenta de juego eliminada correctamente'
    );
END;
$$;

-- ============================================================================
-- SECCIÓN 4: /usuario/configuracion/preferencias
-- Campos: desafios_habilitados (true/false)
-- ============================================================================

-- GET: Obtener preferencias
CREATE OR REPLACE FUNCTION config_get_preferencias(
    p_usuario_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_resultado JSONB;
BEGIN
    SELECT jsonb_build_object(
        'desafios_habilitados', u.desafios_habilitados
    )
    INTO v_resultado
    FROM usuario u
    WHERE u.id = p_usuario_id AND u.deleted_at IS NULL;
    
    IF v_resultado IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    RETURN v_resultado;
END;
$$;

-- UPDATE: Actualizar preferencias
CREATE OR REPLACE FUNCTION config_update_preferencias(
    p_usuario_id UUID,
    p_desafios_habilitados BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE usuario
    SET desafios_habilitados = p_desafios_habilitados,
        actualizado_en = NOW()
    WHERE id = p_usuario_id AND deleted_at IS NULL;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'desafios_habilitados', p_desafios_habilitados,
        'message', 'Preferencias actualizadas correctamente'
    );
END;
$$;

-- ============================================================================
-- SECCIÓN 5: /usuario/configuracion/cuenta
-- Campos: correo (solo lectura), cambio de contraseña
-- ============================================================================

-- GET: Obtener información de cuenta
CREATE OR REPLACE FUNCTION config_get_cuenta(
    p_usuario_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_resultado JSONB;
BEGIN
    SELECT jsonb_build_object(
        'correo', p.correo,
        'nickname', u.nickname,
        'creado_en', u.creado_en,
        'ultima_conexion', u.ultima_conexion,
        'estado', u.estado
    )
    INTO v_resultado
    FROM usuario u
    LEFT JOIN persona p ON u.persona_id = p.id
    WHERE u.id = p_usuario_id AND u.deleted_at IS NULL;
    
    IF v_resultado IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    RETURN v_resultado;
END;
$$;

-- UPDATE: Cambiar contraseña (la validación del password actual se hace en el backend)
CREATE OR REPLACE FUNCTION config_update_password(
    p_usuario_id UUID,
    p_nuevo_password_hash VARCHAR  -- El hash se genera en el backend
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Validar que se proporciona un password
    IF p_nuevo_password_hash IS NULL OR TRIM(p_nuevo_password_hash) = '' THEN
        RAISE EXCEPTION 'La contraseña es requerida';
    END IF;
    
    UPDATE usuario
    SET password = p_nuevo_password_hash,
        actualizado_en = NOW()
    WHERE id = p_usuario_id AND deleted_at IS NULL;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Contraseña actualizada correctamente'
    );
END;
$$;

-- ============================================================================
-- SECCIÓN 6: /usuario/configuracion/seguridad
-- Campos: PayPal, nombre, apellido, teléfono, dirección, ciudad, estado, CP, país, divisa
-- ============================================================================

-- GET: Obtener información de seguridad/pago
CREATE OR REPLACE FUNCTION config_get_seguridad(
    p_usuario_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_resultado JSONB;
BEGIN
    SELECT jsonb_build_object(
        'correo_paypal', p.correo_paypal,
        'p_nombre', p.p_nombre,
        's_nombre', p.s_nombre,
        'p_apellido', p.p_apellido,
        's_apellido', p.s_apellido,
        'telefono', p.telefono,
        'direccion', p.direccion,
        'ciudad', p.ciudad,
        'estado', p.estado,
        'codigo_postal', p.codigo_postal,
        'pais', p.pais,
        'divisa', p.divisa,
        'divisas_disponibles', jsonb_build_array(
            'USD', 'EUR', 'MXN', 'COP', 'ARS', 'CLP', 'PEN', 'BRL'
        )
    )
    INTO v_resultado
    FROM usuario u
    LEFT JOIN persona p ON u.persona_id = p.id
    WHERE u.id = p_usuario_id AND u.deleted_at IS NULL;
    
    IF v_resultado IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    RETURN v_resultado;
END;
$$;

-- UPDATE: Actualizar información de seguridad/pago
CREATE OR REPLACE FUNCTION config_update_seguridad(
    p_usuario_id UUID,
    p_correo_paypal VARCHAR DEFAULT NULL,
    p_p_nombre VARCHAR DEFAULT NULL,
    p_s_nombre VARCHAR DEFAULT NULL,
    p_p_apellido VARCHAR DEFAULT NULL,
    p_s_apellido VARCHAR DEFAULT NULL,
    p_telefono VARCHAR DEFAULT NULL,
    p_direccion VARCHAR DEFAULT NULL,
    p_ciudad VARCHAR DEFAULT NULL,
    p_estado VARCHAR DEFAULT NULL,
    p_codigo_postal VARCHAR DEFAULT NULL,
    p_pais VARCHAR DEFAULT NULL,
    p_divisa VARCHAR DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_persona_id UUID;
BEGIN
    -- Obtener persona_id
    SELECT persona_id INTO v_persona_id
    FROM usuario
    WHERE id = p_usuario_id AND deleted_at IS NULL;
    
    IF v_persona_id IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado o sin datos personales asociados';
    END IF;
    
    -- Validar divisa si se proporciona
    IF p_divisa IS NOT NULL AND p_divisa NOT IN ('USD', 'EUR', 'MXN', 'COP', 'ARS', 'CLP', 'PEN', 'BRL') THEN
        RAISE EXCEPTION 'Divisa no válida';
    END IF;
    
    -- Actualizar persona
    UPDATE persona
    SET 
        correo_paypal = COALESCE(p_correo_paypal, correo_paypal),
        p_nombre = COALESCE(p_p_nombre, p_nombre),
        s_nombre = COALESCE(p_s_nombre, s_nombre),
        p_apellido = COALESCE(p_p_apellido, p_apellido),
        s_apellido = COALESCE(p_s_apellido, s_apellido),
        telefono = COALESCE(p_telefono, telefono),
        direccion = COALESCE(p_direccion, direccion),
        ciudad = COALESCE(p_ciudad, ciudad),
        estado = COALESCE(p_estado, estado),
        codigo_postal = COALESCE(p_codigo_postal, codigo_postal),
        pais = COALESCE(p_pais, pais),
        divisa = COALESCE(p_divisa, divisa),
        actualizado_en = NOW()
    WHERE id = v_persona_id;
    
    UPDATE usuario SET actualizado_en = NOW() WHERE id = p_usuario_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Información de seguridad actualizada correctamente'
    );
END;
$$;

-- ============================================================================
-- SECCIÓN 7: /usuario/configuracion/retiro (Placeholder para integración futura)
-- ============================================================================

-- GET: Obtener información de retiro
CREATE OR REPLACE FUNCTION config_get_retiro(
    p_usuario_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_resultado JSONB;
BEGIN
    SELECT jsonb_build_object(
        'saldo_disponible', u.saldo,
        'creditos', u.creditos,
        'correo_paypal', p.correo_paypal,
        'paypal_configurado', (p.correo_paypal IS NOT NULL AND p.correo_paypal != ''),
        'historial_retiros', '[]'::jsonb,  -- Placeholder
        'mensaje', 'Funcionalidad de retiros en desarrollo. Próximamente disponible.'
    )
    INTO v_resultado
    FROM usuario u
    LEFT JOIN persona p ON u.persona_id = p.id
    WHERE u.id = p_usuario_id AND u.deleted_at IS NULL;
    
    IF v_resultado IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    RETURN v_resultado;
END;
$$;

-- ============================================================================
-- FUNCIÓN PRINCIPAL: Obtener TODA la configuración en una sola llamada
-- Útil para cargar el dashboard completo
-- ============================================================================

CREATE OR REPLACE FUNCTION config_get_completa(
    p_usuario_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_resultado JSONB;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM usuario WHERE id = p_usuario_id AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    SELECT jsonb_build_object(
        'personal', config_get_personal(p_usuario_id),
        'social', config_get_social(p_usuario_id),
        'juegos', config_get_juegos(p_usuario_id),
        'preferencias', config_get_preferencias(p_usuario_id),
        'cuenta', config_get_cuenta(p_usuario_id),
        'seguridad', config_get_seguridad(p_usuario_id),
        'retiro', config_get_retiro(p_usuario_id)
    )
    INTO v_resultado;
    
    RETURN v_resultado;
END;
$$;

-- ============================================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ============================================================================

COMMENT ON FUNCTION config_get_personal IS 
'GET /usuario/configuracion/personal - Retorna nickname (readonly), biografia, genero, timezone';

COMMENT ON FUNCTION config_update_personal IS 
'PUT /usuario/configuracion/personal - Actualiza biografia, genero_id, timezone, avatar_id';

COMMENT ON FUNCTION config_get_social IS 
'GET /usuario/configuracion/social - Retorna lista de redes sociales del usuario';

COMMENT ON FUNCTION config_upsert_social IS 
'POST/PUT /usuario/configuracion/social - Crea o actualiza una red social';

COMMENT ON FUNCTION config_delete_social IS 
'DELETE /usuario/configuracion/social/:id - Elimina una red social';

COMMENT ON FUNCTION config_get_juegos IS 
'GET /usuario/configuracion/juegos - Retorna cuentas de plataformas de juegos';

COMMENT ON FUNCTION config_upsert_cuenta_juego IS 
'POST/PUT /usuario/configuracion/juegos - Crea o actualiza cuenta de juego';

COMMENT ON FUNCTION config_delete_cuenta_juego IS 
'DELETE /usuario/configuracion/juegos/:id - Elimina cuenta de juego';

COMMENT ON FUNCTION config_get_preferencias IS 
'GET /usuario/configuracion/preferencias - Retorna preferencias (desafios_habilitados)';

COMMENT ON FUNCTION config_update_preferencias IS 
'PUT /usuario/configuracion/preferencias - Actualiza desafios_habilitados';

COMMENT ON FUNCTION config_get_cuenta IS 
'GET /usuario/configuracion/cuenta - Retorna correo (readonly), info de cuenta';

COMMENT ON FUNCTION config_update_password IS 
'PUT /usuario/configuracion/cuenta/password - Cambia contraseña (hash generado en backend)';

COMMENT ON FUNCTION config_get_seguridad IS 
'GET /usuario/configuracion/seguridad - Retorna datos de pago: PayPal, dirección, etc.';

COMMENT ON FUNCTION config_update_seguridad IS 
'PUT /usuario/configuracion/seguridad - Actualiza datos de pago y dirección';

COMMENT ON FUNCTION config_get_retiro IS 
'GET /usuario/configuracion/retiro - Placeholder para futura integración de retiros';

COMMENT ON FUNCTION config_get_completa IS 
'GET /usuario/configuracion - Retorna TODA la configuración del usuario en una llamada';

-- ============================================================================
-- EJEMPLOS DE USO
-- ============================================================================
-- 
-- 1. Obtener toda la configuración:
--    SELECT config_get_completa('uuid-del-usuario');
--
-- 2. Obtener solo configuración personal:
--    SELECT config_get_personal('uuid-del-usuario');
--
-- 3. Actualizar biografía y timezone:
--    SELECT config_update_personal(
--        'uuid-del-usuario',
--        p_biografia := 'Gamer profesional',
--        p_timezone := 'America/Mexico_City'
--    );
--
-- 4. Agregar red social:
--    SELECT config_upsert_social(
--        'uuid-del-usuario',
--        'Twitter',
--        'https://twitter.com/miusuario'
--    );
--
-- 5. Agregar cuenta de juego (necesitas el ID de la plataforma del catálogo):
--    SELECT config_upsert_cuenta_juego(
--        'uuid-del-usuario',
--        'uuid-plataforma-steam',
--        'mi_steam_id_12345'
--    );
--
-- 6. Actualizar preferencias:
--    SELECT config_update_preferencias('uuid-del-usuario', false);
--
-- 7. Actualizar datos de seguridad/pago:
--    SELECT config_update_seguridad(
--        'uuid-del-usuario',
--        p_correo_paypal := 'mi@paypal.com',
--        p_telefono := '+52 555 123 4567',
--        p_pais := 'México',
--        p_divisa := 'MXN'
--    );
-- ============================================================================
