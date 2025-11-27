-- =====================================================
-- SCRIPT: Sistema de Tienda con PayPal
-- Plataforma eSports
-- =====================================================
-- NOTA: Las tablas tienda_orden y tienda_solicitud_soporte
-- son generadas automáticamente por TypeORM.
-- Los items de la tienda se crean mediante el SeederService.
-- =====================================================

-- =====================================================
-- 1. PROCEDIMIENTO: OBTENER CATÁLOGO DE TIENDA
-- =====================================================
CREATE OR REPLACE FUNCTION tienda_obtener_catalogo(
    p_usuario_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_tiene_membresia BOOLEAN := FALSE;
    v_membresia_actual JSONB := NULL;
BEGIN
    -- Verificar si el usuario tiene membresía activa
    IF p_usuario_id IS NOT NULL THEN
        SELECT 
            TRUE,
            jsonb_build_object(
                'id', um.id,
                'tipo', mt.nombre,
                'fecha_inicio', um.fecha_inicio,
                'fecha_fin', um.fecha_fin,
                'dias_restantes', GREATEST(0, um.fecha_fin - CURRENT_DATE)
            )
        INTO v_tiene_membresia, v_membresia_actual
        FROM usuario_membresias um
        JOIN membresia_tipo mt ON um.membresia_tipo_id = mt.id
        WHERE um.usuario_id = p_usuario_id 
          AND um.activa = TRUE 
          AND um.fecha_fin >= CURRENT_DATE
        ORDER BY um.fecha_fin DESC
        LIMIT 1;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'usuario', CASE WHEN p_usuario_id IS NOT NULL THEN jsonb_build_object(
            'id', p_usuario_id,
            'tiene_membresia', COALESCE(v_tiene_membresia, FALSE),
            'membresia_actual', v_membresia_actual,
            'saldo', (SELECT saldo FROM usuario WHERE id = p_usuario_id),
            'creditos', (SELECT creditos FROM usuario WHERE id = p_usuario_id)
        ) ELSE NULL END,
        'categorias', jsonb_build_object(
            'creditos', (
                SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'id', ti.id,
                    'nombre', ti.nombre,
                    'descripcion', ti.descripcion,
                    'precio', ti.precio,
                    'creditos_otorgados', ti.creditos_otorgados,
                    'destacado', COALESCE((ti.metadata->>'destacado')::BOOLEAN, FALSE),
                    'mejor_valor', COALESCE((ti.metadata->>'mejorValor')::BOOLEAN, FALSE)
                ) ORDER BY ti.precio), '[]'::JSONB)
                FROM tienda_item ti
                JOIN catalogo_tipo_item cti ON ti.tipo_id = cti.id
                WHERE cti.valor = 'creditos'
            ),
            'membresias', (
                SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'id', ti.id,
                    'nombre', ti.nombre,
                    'descripcion', ti.descripcion,
                    'precio', ti.precio,
                    'duracion_dias', (ti.metadata->>'duracionDias')::INTEGER,
                    'membresia_tipo_id', ti.metadata->>'membresiaTipoId',
                    'ahorro', CASE 
                        WHEN ti.nombre LIKE '%3 Meses%' THEN '28%'
                        WHEN ti.nombre LIKE '%6 Meses%' THEN '30%'
                        WHEN ti.nombre LIKE '%12 Meses%' THEN '30%'
                        ELSE NULL
                    END
                ) ORDER BY ti.precio), '[]'::JSONB)
                FROM tienda_item ti
                JOIN catalogo_tipo_item cti ON ti.tipo_id = cti.id
                WHERE cti.valor = 'membresia'
            ),
            'servicios', (
                SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'id', ti.id,
                    'nombre', ti.nombre,
                    'descripcion', ti.descripcion,
                    'precio', ti.precio,
                    'servicio_tipo', ti.metadata->>'servicioTipo',
                    'advertencia', ti.metadata->>'advertencia',
                    'requiere_soporte', COALESCE((ti.metadata->>'requiereSoporte')::BOOLEAN, FALSE)
                ) ORDER BY ti.precio), '[]'::JSONB)
                FROM tienda_item ti
                JOIN catalogo_tipo_item cti ON ti.tipo_id = cti.id
                WHERE cti.valor = 'servicio'
            )
        ),
        'info_membresia_gratuita', jsonb_build_object(
            'nombre', 'Cuenta Gratuita',
            'precio', 0,
            'beneficios', (
                SELECT beneficios FROM membresia_tipo WHERE nombre = 'Gratuita'
            )
        )
    );
END;
$$;

COMMENT ON FUNCTION tienda_obtener_catalogo IS 'Obtiene el catálogo completo de la tienda organizado por categorías';

-- =====================================================
-- 2. PROCEDIMIENTO: CREAR ORDEN DE COMPRA (INICIAR PAGO)
-- =====================================================
CREATE OR REPLACE FUNCTION tienda_crear_orden(
    p_usuario_id UUID,
    p_item_id UUID,
    p_metadata JSONB DEFAULT '{}'::JSONB  -- Para datos adicionales como nuevo nickname
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_item RECORD;
    v_orden_id UUID;
    v_tipo_item VARCHAR;
    v_servicio_tipo VARCHAR;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM usuario WHERE id = p_usuario_id AND deleted_at IS NULL) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Usuario no encontrado');
    END IF;
    
    -- Obtener información del item
    SELECT 
        ti.*,
        cti.valor as tipo_valor
    INTO v_item
    FROM tienda_item ti
    JOIN catalogo_tipo_item cti ON ti.tipo_id = cti.id
    WHERE ti.id = p_item_id;
    
    IF v_item IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Item no encontrado');
    END IF;
    
    v_tipo_item := v_item.tipo_valor;
    v_servicio_tipo := v_item.metadata->>'servicioTipo';
    
    -- Validaciones específicas por tipo de servicio
    IF v_servicio_tipo = 'cambio_nickname' THEN
        -- Verificar que se proporcionó el nuevo nickname
        IF p_metadata->>'nuevo_nickname' IS NULL OR TRIM(p_metadata->>'nuevo_nickname') = '' THEN
            RETURN jsonb_build_object('success', false, 'error', 'Debe proporcionar el nuevo nickname');
        END IF;
        
        -- Verificar que el nickname no esté en uso
        IF EXISTS (
            SELECT 1 FROM usuario 
            WHERE nickname = p_metadata->>'nuevo_nickname' 
            AND deleted_at IS NULL
        ) THEN
            RETURN jsonb_build_object('success', false, 'error', 'El nickname ya está en uso');
        END IF;
    END IF;
    
    IF v_servicio_tipo = 'reclamar_nickname' THEN
        -- Verificar que se proporcionó el nickname a reclamar
        IF p_metadata->>'nickname_solicitado' IS NULL OR TRIM(p_metadata->>'nickname_solicitado') = '' THEN
            RETURN jsonb_build_object('success', false, 'error', 'Debe proporcionar el nickname a reclamar');
        END IF;
    END IF;
    
    -- Verificar si es membresía y el usuario ya tiene una activa
    IF v_tipo_item = 'membresia' THEN
        IF EXISTS (
            SELECT 1 FROM usuario_membresias 
            WHERE usuario_id = p_usuario_id 
            AND activa = TRUE 
            AND fecha_fin >= CURRENT_DATE
        ) THEN
            -- Actualizar metadata para indicar que es extensión
            p_metadata := p_metadata || '{"es_extension": true}'::JSONB;
        END IF;
    END IF;
    
    -- Crear la orden
    INSERT INTO tienda_orden (
        usuario_id,
        item_id,
        monto,
        estado,
        metadata
    ) VALUES (
        p_usuario_id,
        p_item_id,
        v_item.precio,
        'pendiente',
        p_metadata || jsonb_build_object(
            'item_nombre', v_item.nombre,
            'item_tipo', v_tipo_item,
            'servicio_tipo', v_servicio_tipo
        )
    )
    RETURNING id INTO v_orden_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'orden_id', v_orden_id,
        'item', jsonb_build_object(
            'id', v_item.id,
            'nombre', v_item.nombre,
            'precio', v_item.precio,
            'tipo', v_tipo_item
        ),
        'message', 'Orden creada, proceder con pago PayPal'
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

COMMENT ON FUNCTION tienda_crear_orden IS 'Crea una orden de compra pendiente. El frontend debe llamar a PayPal después.';

-- =====================================================
-- 3. PROCEDIMIENTO: REGISTRAR PAGO PAYPAL
-- =====================================================
CREATE OR REPLACE FUNCTION tienda_registrar_pago_paypal(
    p_orden_id UUID,
    p_paypal_order_id VARCHAR,
    p_paypal_capture_id VARCHAR DEFAULT NULL,
    p_paypal_payer_id VARCHAR DEFAULT NULL,
    p_paypal_payer_email VARCHAR DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_orden RECORD;
BEGIN
    -- Obtener la orden
    SELECT * INTO v_orden
    FROM tienda_orden
    WHERE id = p_orden_id;
    
    IF v_orden IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Orden no encontrada');
    END IF;
    
    IF v_orden.estado != 'pendiente' THEN
        RETURN jsonb_build_object('success', false, 'error', 'La orden ya fue procesada');
    END IF;
    
    -- Actualizar con datos de PayPal
    UPDATE tienda_orden
    SET 
        paypal_order_id = p_paypal_order_id,
        paypal_capture_id = p_paypal_capture_id,
        paypal_payer_id = p_paypal_payer_id,
        paypal_payer_email = p_paypal_payer_email,
        actualizado_en = NOW()
    WHERE id = p_orden_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'orden_id', p_orden_id,
        'message', 'Datos de PayPal registrados'
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

COMMENT ON FUNCTION tienda_registrar_pago_paypal IS 'Registra los datos del pago de PayPal antes de confirmar';

-- =====================================================
-- 4. PROCEDIMIENTO: CONFIRMAR COMPRA (DESPUÉS DE PAGO EXITOSO)
-- =====================================================
CREATE OR REPLACE FUNCTION tienda_confirmar_compra(
    p_orden_id UUID,
    p_paypal_capture_id VARCHAR DEFAULT NULL  -- Para actualizar si no se había registrado
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_orden RECORD;
    v_item RECORD;
    v_tipo_item VARCHAR;
    v_servicio_tipo VARCHAR;
    v_usuario_id UUID;
    v_resultado JSONB;
    v_tipo_transaccion_id UUID;
    v_origen_transaccion_id UUID;
    v_membresia_tipo_id UUID;
    v_fecha_inicio DATE;
    v_fecha_fin DATE;
    v_nuevo_nickname VARCHAR;
    v_nickname_anterior VARCHAR;
BEGIN
    -- Obtener la orden con el item
    SELECT 
        o.*,
        ti.nombre as item_nombre,
        ti.creditos_otorgados,
        ti.metadata as item_metadata,
        cti.valor as tipo_valor
    INTO v_orden
    FROM tienda_orden o
    JOIN tienda_item ti ON o.item_id = ti.id
    JOIN catalogo_tipo_item cti ON ti.tipo_id = cti.id
    WHERE o.id = p_orden_id;
    
    IF v_orden IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Orden no encontrada');
    END IF;
    
    IF v_orden.estado = 'completado' THEN
        RETURN jsonb_build_object('success', false, 'error', 'La orden ya fue completada');
    END IF;
    
    IF v_orden.estado != 'pendiente' THEN
        RETURN jsonb_build_object('success', false, 'error', 'La orden no puede ser completada');
    END IF;
    
    v_usuario_id := v_orden.usuario_id;
    v_tipo_item := v_orden.tipo_valor;
    v_servicio_tipo := v_orden.metadata->>'servicio_tipo';
    
    -- Obtener IDs de catálogos para transacciones
    SELECT id INTO v_tipo_transaccion_id FROM catalogo_transaccion_tipo WHERE valor = 'saldo';
    SELECT id INTO v_origen_transaccion_id FROM catalogo_origen_transaccion WHERE valor = 'compra';
    
    -- Actualizar capture_id si se proporciona
    IF p_paypal_capture_id IS NOT NULL THEN
        UPDATE tienda_orden SET paypal_capture_id = p_paypal_capture_id WHERE id = p_orden_id;
    END IF;
    
    -- =========================================
    -- PROCESAR SEGÚN TIPO DE ITEM
    -- =========================================
    
    -- CRÉDITOS
    IF v_tipo_item = 'creditos' THEN
        -- Agregar créditos al usuario
        UPDATE usuario 
        SET creditos = creditos + v_orden.creditos_otorgados,
            actualizado_en = NOW()
        WHERE id = v_usuario_id;
        
        -- Registrar transacción
        INSERT INTO transaccion (usuario_id, monto, descripcion, tipo_id, origen_id)
        SELECT 
            v_usuario_id,
            v_orden.monto,
            'Compra de ' || v_orden.creditos_otorgados || ' créditos',
            (SELECT id FROM catalogo_transaccion_tipo WHERE valor = 'creditos'),
            v_origen_transaccion_id;
        
        v_resultado := jsonb_build_object(
            'tipo', 'creditos',
            'creditos_agregados', v_orden.creditos_otorgados
        );
    
    -- MEMBRESÍA
    ELSIF v_tipo_item = 'membresia' THEN
        v_membresia_tipo_id := (v_orden.item_metadata->>'membresiaTipoId')::UUID;
        
        -- Calcular fechas
        -- Si ya tiene membresía activa, extender desde la fecha de fin actual
        SELECT fecha_fin INTO v_fecha_inicio
        FROM usuario_membresias
        WHERE usuario_id = v_usuario_id AND activa = TRUE AND fecha_fin >= CURRENT_DATE
        ORDER BY fecha_fin DESC
        LIMIT 1;
        
        IF v_fecha_inicio IS NULL THEN
            v_fecha_inicio := CURRENT_DATE;
        ELSE
            -- Desactivar membresía anterior
            UPDATE usuario_membresias 
            SET activa = FALSE 
            WHERE usuario_id = v_usuario_id AND activa = TRUE;
            
            v_fecha_inicio := v_fecha_inicio + 1; -- Empezar al día siguiente
        END IF;
        
        v_fecha_fin := v_fecha_inicio + (v_orden.item_metadata->>'duracionDias')::INTEGER;
        
        -- Crear nueva membresía
        INSERT INTO usuario_membresias (usuario_id, membresia_tipo_id, fecha_inicio, fecha_fin, activa)
        VALUES (v_usuario_id, v_membresia_tipo_id, v_fecha_inicio, v_fecha_fin, TRUE);
        
        -- Registrar transacción
        INSERT INTO transaccion (usuario_id, monto, descripcion, tipo_id, origen_id)
        VALUES (
            v_usuario_id,
            v_orden.monto,
            'Compra de membresía: ' || v_orden.item_nombre,
            v_tipo_transaccion_id,
            v_origen_transaccion_id
        );
        
        v_resultado := jsonb_build_object(
            'tipo', 'membresia',
            'membresia', v_orden.item_nombre,
            'fecha_inicio', v_fecha_inicio,
            'fecha_fin', v_fecha_fin
        );
    
    -- SERVICIOS
    ELSIF v_tipo_item = 'servicio' THEN
        
        -- CAMBIO DE NICKNAME
        IF v_servicio_tipo = 'cambio_nickname' THEN
            v_nuevo_nickname := v_orden.metadata->>'nuevo_nickname';
            
            -- Verificar nuevamente disponibilidad
            IF EXISTS (SELECT 1 FROM usuario WHERE nickname = v_nuevo_nickname AND deleted_at IS NULL) THEN
                -- Marcar orden como fallida
                UPDATE tienda_orden SET estado = 'fallido', actualizado_en = NOW() WHERE id = p_orden_id;
                RETURN jsonb_build_object('success', false, 'error', 'El nickname ya no está disponible');
            END IF;
            
            -- Guardar nickname anterior
            SELECT nickname INTO v_nickname_anterior FROM usuario WHERE id = v_usuario_id;
            
            -- Cambiar nickname
            UPDATE usuario 
            SET nickname = v_nuevo_nickname, actualizado_en = NOW()
            WHERE id = v_usuario_id;
            
            -- Actualizar metadata de la orden
            UPDATE tienda_orden 
            SET metadata = metadata || jsonb_build_object('nickname_anterior', v_nickname_anterior)
            WHERE id = p_orden_id;
            
            v_resultado := jsonb_build_object(
                'tipo', 'servicio',
                'servicio', 'cambio_nickname',
                'nickname_anterior', v_nickname_anterior,
                'nickname_nuevo', v_nuevo_nickname
            );
        
        -- REINICIAR RÉCORD DE JUEGO
        ELSIF v_servicio_tipo = 'reset_record' THEN
            -- Reiniciar estadísticas de todos los juegos
            UPDATE usuario_estadisticas_juego
            SET 
                victorias = 0,
                derrotas = 0,
                empates = 0,
                horas_jugadas = 0,
                actualizado_en = NOW()
            WHERE usuario_id = v_usuario_id;
            
            v_resultado := jsonb_build_object(
                'tipo', 'servicio',
                'servicio', 'reset_record',
                'mensaje', 'Récord de juego reiniciado'
            );
        
        -- REINICIAR ESTADÍSTICAS
        ELSIF v_servicio_tipo = 'reset_stats' THEN
            -- Reiniciar solo victorias/derrotas/empates
            UPDATE usuario_estadisticas_juego
            SET 
                victorias = 0,
                derrotas = 0,
                empates = 0,
                actualizado_en = NOW()
            WHERE usuario_id = v_usuario_id;
            
            v_resultado := jsonb_build_object(
                'tipo', 'servicio',
                'servicio', 'reset_stats',
                'mensaje', 'Estadísticas reiniciadas'
            );
        
        -- RECLAMAR NICKNAME (requiere soporte)
        ELSIF v_servicio_tipo = 'reclamar_nickname' THEN
            -- Crear solicitud de soporte
            INSERT INTO tienda_solicitud_soporte (
                orden_id,
                usuario_id,
                tipo,
                nickname_solicitado,
                estado
            ) VALUES (
                p_orden_id,
                v_usuario_id,
                'reclamar_nickname',
                v_orden.metadata->>'nickname_solicitado',
                'pendiente'
            );
            
            v_resultado := jsonb_build_object(
                'tipo', 'servicio',
                'servicio', 'reclamar_nickname',
                'nickname_solicitado', v_orden.metadata->>'nickname_solicitado',
                'mensaje', 'Solicitud enviada a soporte. Te contactaremos pronto.'
            );
        
        ELSE
            v_resultado := jsonb_build_object('tipo', 'servicio', 'servicio', v_servicio_tipo);
        END IF;
        
        -- Registrar transacción para servicios
        INSERT INTO transaccion (usuario_id, monto, descripcion, tipo_id, origen_id)
        VALUES (
            v_usuario_id,
            v_orden.monto,
            'Compra de servicio: ' || v_orden.item_nombre,
            v_tipo_transaccion_id,
            v_origen_transaccion_id
        );
    END IF;
    
    -- =========================================
    -- MARCAR ORDEN COMO COMPLETADA
    -- =========================================
    UPDATE tienda_orden
    SET 
        estado = 'completado',
        completado_en = NOW(),
        actualizado_en = NOW()
    WHERE id = p_orden_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'orden_id', p_orden_id,
        'resultado', v_resultado,
        'message', 'Compra completada exitosamente'
    );

EXCEPTION
    WHEN OTHERS THEN
        -- Marcar orden como fallida
        UPDATE tienda_orden 
        SET estado = 'fallido', actualizado_en = NOW() 
        WHERE id = p_orden_id;
        
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;

COMMENT ON FUNCTION tienda_confirmar_compra IS 'Confirma una compra después de que PayPal confirma el pago. Aplica los beneficios según el tipo de item.';

-- =====================================================
-- 5. PROCEDIMIENTO: CANCELAR ORDEN
-- =====================================================
CREATE OR REPLACE FUNCTION tienda_cancelar_orden(
    p_orden_id UUID,
    p_usuario_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_orden RECORD;
BEGIN
    SELECT * INTO v_orden FROM tienda_orden WHERE id = p_orden_id;
    
    IF v_orden IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Orden no encontrada');
    END IF;
    
    IF v_orden.usuario_id != p_usuario_id THEN
        RETURN jsonb_build_object('success', false, 'error', 'No tienes permiso para cancelar esta orden');
    END IF;
    
    IF v_orden.estado != 'pendiente' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Solo se pueden cancelar órdenes pendientes');
    END IF;
    
    UPDATE tienda_orden
    SET estado = 'cancelado', actualizado_en = NOW()
    WHERE id = p_orden_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Orden cancelada'
    );
END;
$$;

COMMENT ON FUNCTION tienda_cancelar_orden IS 'Cancela una orden pendiente';

-- =====================================================
-- 6. PROCEDIMIENTO: OBTENER HISTORIAL DE COMPRAS
-- =====================================================
CREATE OR REPLACE FUNCTION tienda_historial_compras(
    p_usuario_id UUID,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total INTEGER;
    v_compras JSONB;
BEGIN
    -- Contar total
    SELECT COUNT(*) INTO v_total
    FROM tienda_orden
    WHERE usuario_id = p_usuario_id;
    
    -- Obtener compras
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', o.id,
        'item', jsonb_build_object(
            'id', ti.id,
            'nombre', ti.nombre,
            'tipo', cti.valor
        ),
        'monto', o.monto,
        'estado', o.estado,
        'paypal_order_id', o.paypal_order_id,
        'metadata', o.metadata,
        'creado_en', o.creado_en,
        'completado_en', o.completado_en
    ) ORDER BY o.creado_en DESC), '[]'::JSONB)
    INTO v_compras
    FROM tienda_orden o
    JOIN tienda_item ti ON o.item_id = ti.id
    JOIN catalogo_tipo_item cti ON ti.tipo_id = cti.id
    WHERE o.usuario_id = p_usuario_id
    LIMIT p_limit OFFSET p_offset;
    
    RETURN jsonb_build_object(
        'success', true,
        'total', v_total,
        'compras', v_compras
    );
END;
$$;

COMMENT ON FUNCTION tienda_historial_compras IS 'Obtiene el historial de compras del usuario';

-- =====================================================
-- 7. PROCEDIMIENTO: VERIFICAR DISPONIBILIDAD NICKNAME
-- =====================================================
CREATE OR REPLACE FUNCTION tienda_verificar_nickname(
    p_nickname VARCHAR
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_usuario_existente RECORD;
    v_dias_inactivo INTEGER;
BEGIN
    -- Validar formato del nickname
    IF LENGTH(p_nickname) < 3 OR LENGTH(p_nickname) > 20 THEN
        RETURN jsonb_build_object(
            'disponible', false,
            'mensaje', 'El nickname debe tener entre 3 y 20 caracteres'
        );
    END IF;
    
    -- Buscar si existe
    SELECT 
        id,
        nickname,
        ultima_conexion,
        deleted_at,
        EXTRACT(DAY FROM NOW() - ultima_conexion)::INTEGER as dias_sin_conexion
    INTO v_usuario_existente
    FROM usuario
    WHERE nickname = p_nickname;
    
    -- Si no existe, está disponible para cambio de nickname normal
    IF v_usuario_existente IS NULL THEN
        RETURN jsonb_build_object(
            'disponible', true,
            'tipo', 'disponible',
            'mensaje', 'El nickname está disponible'
        );
    END IF;
    
    -- Si fue eliminado (soft delete), disponible para reclamar
    IF v_usuario_existente.deleted_at IS NOT NULL THEN
        RETURN jsonb_build_object(
            'disponible', true,
            'tipo', 'reclamable',
            'mensaje', 'El nickname puede ser reclamado',
            'requiere_soporte', true
        );
    END IF;
    
    -- Verificar inactividad (más de 180 días = 6 meses)
    v_dias_inactivo := v_usuario_existente.dias_sin_conexion;
    
    IF v_dias_inactivo >= 180 THEN
        RETURN jsonb_build_object(
            'disponible', true,
            'tipo', 'inactivo',
            'mensaje', 'El usuario está inactivo. Puedes solicitar reclamar este nickname.',
            'dias_inactivo', v_dias_inactivo,
            'requiere_soporte', true
        );
    END IF;
    
    -- El nickname está en uso activo
    RETURN jsonb_build_object(
        'disponible', false,
        'tipo', 'en_uso',
        'mensaje', 'El nickname está en uso por un usuario activo'
    );
END;
$$;

COMMENT ON FUNCTION tienda_verificar_nickname IS 'Verifica la disponibilidad de un nickname para cambio o reclamo';

-- =====================================================
-- 8. PROCEDIMIENTO: OBTENER SOLICITUDES DE SOPORTE (ADMIN)
-- =====================================================
CREATE OR REPLACE FUNCTION tienda_obtener_solicitudes_soporte(
    p_estado VARCHAR DEFAULT NULL,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total INTEGER;
    v_solicitudes JSONB;
BEGIN
    SELECT COUNT(*) INTO v_total
    FROM tienda_solicitud_soporte
    WHERE (p_estado IS NULL OR estado = p_estado);
    
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', s.id,
        'tipo', s.tipo,
        'nickname_solicitado', s.nickname_solicitado,
        'estado', s.estado,
        'usuario', jsonb_build_object(
            'id', u.id,
            'nickname', u.nickname
        ),
        'orden', CASE WHEN s.orden_id IS NOT NULL THEN jsonb_build_object(
            'id', o.id,
            'monto', o.monto
        ) ELSE NULL END,
        'notas_admin', s.notas_admin,
        'creado_en', s.creado_en,
        'resuelto_en', s.resuelto_en
    ) ORDER BY s.creado_en DESC), '[]'::JSONB)
    INTO v_solicitudes
    FROM tienda_solicitud_soporte s
    JOIN usuario u ON s.usuario_id = u.id
    LEFT JOIN tienda_orden o ON s.orden_id = o.id
    WHERE (p_estado IS NULL OR s.estado = p_estado)
    LIMIT p_limit OFFSET p_offset;
    
    RETURN jsonb_build_object(
        'success', true,
        'total', v_total,
        'solicitudes', v_solicitudes
    );
END;
$$;

COMMENT ON FUNCTION tienda_obtener_solicitudes_soporte IS 'Obtiene solicitudes de soporte (para panel de admin)';

-- =====================================================
-- 9. PROCEDIMIENTO: RESOLVER SOLICITUD DE SOPORTE (ADMIN)
-- =====================================================
CREATE OR REPLACE FUNCTION tienda_resolver_solicitud_soporte(
    p_solicitud_id UUID,
    p_admin_id UUID,
    p_aprobar BOOLEAN,
    p_notas VARCHAR DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_solicitud RECORD;
    v_nickname_anterior VARCHAR;
BEGIN
    -- Verificar que quien resuelve es admin
    IF NOT EXISTS (
        SELECT 1 FROM usuario u
        JOIN catalogo_rol cr ON u.rol_id = cr.id
        WHERE u.id = p_admin_id AND cr.valor = 'admin'
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Solo administradores pueden resolver solicitudes');
    END IF;
    
    -- Obtener solicitud
    SELECT * INTO v_solicitud
    FROM tienda_solicitud_soporte
    WHERE id = p_solicitud_id;
    
    IF v_solicitud IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Solicitud no encontrada');
    END IF;
    
    IF v_solicitud.estado != 'pendiente' AND v_solicitud.estado != 'en_revision' THEN
        RETURN jsonb_build_object('success', false, 'error', 'La solicitud ya fue resuelta');
    END IF;
    
    IF p_aprobar THEN
        -- Si es reclamar nickname, hacer el cambio
        IF v_solicitud.tipo = 'reclamar_nickname' THEN
            -- Liberar el nickname del usuario inactivo
            UPDATE usuario 
            SET nickname = nickname || '_old_' || EXTRACT(EPOCH FROM NOW())::TEXT
            WHERE nickname = v_solicitud.nickname_solicitado 
            AND id != v_solicitud.usuario_id;
            
            -- Guardar nickname anterior del solicitante
            SELECT nickname INTO v_nickname_anterior 
            FROM usuario WHERE id = v_solicitud.usuario_id;
            
            -- Asignar nuevo nickname al solicitante
            UPDATE usuario 
            SET nickname = v_solicitud.nickname_solicitado, actualizado_en = NOW()
            WHERE id = v_solicitud.usuario_id;
        END IF;
        
        UPDATE tienda_solicitud_soporte
        SET 
            estado = 'aprobado',
            notas_admin = p_notas,
            resuelto_en = NOW(),
            resuelto_por = p_admin_id,
            actualizado_en = NOW()
        WHERE id = p_solicitud_id;
        
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Solicitud aprobada',
            'nickname_asignado', v_solicitud.nickname_solicitado
        );
    ELSE
        UPDATE tienda_solicitud_soporte
        SET 
            estado = 'rechazado',
            notas_admin = p_notas,
            resuelto_en = NOW(),
            resuelto_por = p_admin_id,
            actualizado_en = NOW()
        WHERE id = p_solicitud_id;
        
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Solicitud rechazada'
        );
    END IF;
END;
$$;

COMMENT ON FUNCTION tienda_resolver_solicitud_soporte IS 'Permite a un admin aprobar o rechazar solicitudes de soporte';

-- =====================================================
-- 10. PROCEDIMIENTO: COMPRA CON SALDO (SIN PAYPAL)
-- Para items que se pueden comprar con saldo existente
-- =====================================================
CREATE OR REPLACE FUNCTION tienda_comprar_con_saldo(
    p_usuario_id UUID,
    p_item_id UUID,
    p_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_saldo_actual NUMERIC(12,2);
    v_item RECORD;
    v_orden_result JSONB;
    v_orden_id UUID;
BEGIN
    -- Verificar saldo del usuario
    SELECT saldo INTO v_saldo_actual
    FROM usuario
    WHERE id = p_usuario_id AND deleted_at IS NULL;
    
    IF v_saldo_actual IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Usuario no encontrado');
    END IF;
    
    -- Obtener precio del item
    SELECT precio INTO v_item FROM tienda_item WHERE id = p_item_id;
    
    IF v_item IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Item no encontrado');
    END IF;
    
    -- Verificar saldo suficiente
    IF v_saldo_actual < v_item.precio THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Saldo insuficiente',
            'saldo_actual', v_saldo_actual,
            'precio', v_item.precio
        );
    END IF;
    
    -- Crear orden
    v_orden_result := tienda_crear_orden(p_usuario_id, p_item_id, p_metadata);
    
    IF NOT (v_orden_result->>'success')::BOOLEAN THEN
        RETURN v_orden_result;
    END IF;
    
    v_orden_id := (v_orden_result->>'orden_id')::UUID;
    
    -- Descontar saldo
    UPDATE usuario 
    SET saldo = saldo - v_item.precio, actualizado_en = NOW()
    WHERE id = p_usuario_id;
    
    -- Registrar pago interno (sin PayPal)
    UPDATE tienda_orden
    SET 
        paypal_order_id = 'SALDO_INTERNO',
        metadata = metadata || '{"metodo_pago": "saldo"}'::JSONB
    WHERE id = v_orden_id;
    
    -- Confirmar compra
    RETURN tienda_confirmar_compra(v_orden_id);
END;
$$;

COMMENT ON FUNCTION tienda_comprar_con_saldo IS 'Permite comprar un item usando el saldo del usuario en lugar de PayPal';

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
