-- =====================================================
-- SCRIPT: Funciones de PostgreSQL para Azure
-- Plataforma eSports
-- Ejecutar DESPUÉS de azure-init.sql
-- =====================================================

-- =====================================================
-- FUNCIONES DE TIENDA
-- =====================================================

-- 1. OBTENER CATÁLOGO DE TIENDA
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
                    'membresia_tipo_id', ti.metadata->>'membresiaTipoId'
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
                    'requiere_soporte', COALESCE((ti.metadata->>'requiereSoporte')::BOOLEAN, FALSE)
                ) ORDER BY ti.precio), '[]'::JSONB)
                FROM tienda_item ti
                JOIN catalogo_tipo_item cti ON ti.tipo_id = cti.id
                WHERE cti.valor = 'servicio'
            )
        )
    );
END;
$$;

-- 2. CREAR ORDEN DE COMPRA
CREATE OR REPLACE FUNCTION tienda_crear_orden(
    p_usuario_id UUID,
    p_item_id UUID,
    p_metadata JSONB DEFAULT '{}'::JSONB
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
    IF NOT EXISTS (SELECT 1 FROM usuario WHERE id = p_usuario_id AND deleted_at IS NULL) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Usuario no encontrado');
    END IF;
    
    SELECT ti.*, cti.valor as tipo_valor
    INTO v_item
    FROM tienda_item ti
    JOIN catalogo_tipo_item cti ON ti.tipo_id = cti.id
    WHERE ti.id = p_item_id;
    
    IF v_item IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Item no encontrado');
    END IF;
    
    v_tipo_item := v_item.tipo_valor;
    v_servicio_tipo := v_item.metadata->>'servicioTipo';
    
    IF v_servicio_tipo = 'cambio_nickname' THEN
        IF p_metadata->>'nuevo_nickname' IS NULL OR TRIM(p_metadata->>'nuevo_nickname') = '' THEN
            RETURN jsonb_build_object('success', false, 'error', 'Debe proporcionar el nuevo nickname');
        END IF;
        IF EXISTS (SELECT 1 FROM usuario WHERE nickname = p_metadata->>'nuevo_nickname' AND deleted_at IS NULL) THEN
            RETURN jsonb_build_object('success', false, 'error', 'El nickname ya está en uso');
        END IF;
    END IF;
    
    INSERT INTO tienda_orden (usuario_id, item_id, monto, estado, metadata)
    VALUES (p_usuario_id, p_item_id, v_item.precio, 'pendiente',
        p_metadata || jsonb_build_object('item_nombre', v_item.nombre, 'item_tipo', v_tipo_item, 'servicio_tipo', v_servicio_tipo))
    RETURNING id INTO v_orden_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'orden_id', v_orden_id,
        'item', jsonb_build_object('id', v_item.id, 'nombre', v_item.nombre, 'precio', v_item.precio, 'tipo', v_tipo_item),
        'message', 'Orden creada, proceder con pago PayPal'
    );
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM, 'code', SQLSTATE);
END;
$$;

-- 3. REGISTRAR PAGO PAYPAL
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
    SELECT * INTO v_orden FROM tienda_orden WHERE id = p_orden_id;
    
    IF v_orden IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Orden no encontrada');
    END IF;
    
    IF v_orden.estado != 'pendiente' THEN
        RETURN jsonb_build_object('success', false, 'error', 'La orden ya fue procesada');
    END IF;
    
    UPDATE tienda_orden
    SET paypal_order_id = p_paypal_order_id, paypal_capture_id = p_paypal_capture_id,
        paypal_payer_id = p_paypal_payer_id, paypal_payer_email = p_paypal_payer_email, actualizado_en = NOW()
    WHERE id = p_orden_id;
    
    RETURN jsonb_build_object('success', true, 'orden_id', p_orden_id, 'message', 'Datos de PayPal registrados');
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM, 'code', SQLSTATE);
END;
$$;

-- 4. CONFIRMAR COMPRA
CREATE OR REPLACE FUNCTION tienda_confirmar_compra(
    p_orden_id UUID,
    p_paypal_capture_id VARCHAR DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_orden RECORD;
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
    SELECT o.*, ti.nombre as item_nombre, ti.creditos_otorgados, ti.metadata as item_metadata, cti.valor as tipo_valor
    INTO v_orden
    FROM tienda_orden o
    JOIN tienda_item ti ON o.item_id = ti.id
    JOIN catalogo_tipo_item cti ON ti.tipo_id = cti.id
    WHERE o.id = p_orden_id;
    
    IF v_orden IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'Orden no encontrada'); END IF;
    IF v_orden.estado = 'completado' THEN RETURN jsonb_build_object('success', false, 'error', 'La orden ya fue completada'); END IF;
    IF v_orden.estado != 'pendiente' THEN RETURN jsonb_build_object('success', false, 'error', 'La orden no puede ser completada'); END IF;
    
    v_usuario_id := v_orden.usuario_id;
    v_tipo_item := v_orden.tipo_valor;
    v_servicio_tipo := v_orden.metadata->>'servicio_tipo';
    
    SELECT id INTO v_tipo_transaccion_id FROM catalogo_transaccion_tipo WHERE valor = 'saldo';
    SELECT id INTO v_origen_transaccion_id FROM catalogo_origen_transaccion WHERE valor = 'compra';
    
    IF p_paypal_capture_id IS NOT NULL THEN
        UPDATE tienda_orden SET paypal_capture_id = p_paypal_capture_id WHERE id = p_orden_id;
    END IF;
    
    -- CRÉDITOS
    IF v_tipo_item = 'creditos' THEN
        UPDATE usuario SET creditos = creditos + v_orden.creditos_otorgados, actualizado_en = NOW() WHERE id = v_usuario_id;
        INSERT INTO transaccion (usuario_id, monto, descripcion, tipo_id, origen_id)
        SELECT v_usuario_id, v_orden.monto, 'Compra de ' || v_orden.creditos_otorgados || ' créditos',
            (SELECT id FROM catalogo_transaccion_tipo WHERE valor = 'creditos'), v_origen_transaccion_id;
        v_resultado := jsonb_build_object('tipo', 'creditos', 'creditos_agregados', v_orden.creditos_otorgados);
    
    -- MEMBRESÍA
    ELSIF v_tipo_item = 'membresia' THEN
        v_membresia_tipo_id := (v_orden.item_metadata->>'membresiaTipoId')::UUID;
        SELECT fecha_fin INTO v_fecha_inicio FROM usuario_membresias WHERE usuario_id = v_usuario_id AND activa = TRUE AND fecha_fin >= CURRENT_DATE ORDER BY fecha_fin DESC LIMIT 1;
        IF v_fecha_inicio IS NULL THEN v_fecha_inicio := CURRENT_DATE;
        ELSE UPDATE usuario_membresias SET activa = FALSE WHERE usuario_id = v_usuario_id AND activa = TRUE; v_fecha_inicio := v_fecha_inicio + 1; END IF;
        v_fecha_fin := v_fecha_inicio + (v_orden.item_metadata->>'duracionDias')::INTEGER;
        INSERT INTO usuario_membresias (usuario_id, membresia_tipo_id, fecha_inicio, fecha_fin, activa) VALUES (v_usuario_id, v_membresia_tipo_id, v_fecha_inicio, v_fecha_fin, TRUE);
        INSERT INTO transaccion (usuario_id, monto, descripcion, tipo_id, origen_id) VALUES (v_usuario_id, v_orden.monto, 'Compra de membresía: ' || v_orden.item_nombre, v_tipo_transaccion_id, v_origen_transaccion_id);
        v_resultado := jsonb_build_object('tipo', 'membresia', 'membresia', v_orden.item_nombre, 'fecha_inicio', v_fecha_inicio, 'fecha_fin', v_fecha_fin);
    
    -- SERVICIOS
    ELSIF v_tipo_item = 'servicio' THEN
        IF v_servicio_tipo = 'cambio_nickname' THEN
            v_nuevo_nickname := v_orden.metadata->>'nuevo_nickname';
            IF EXISTS (SELECT 1 FROM usuario WHERE nickname = v_nuevo_nickname AND deleted_at IS NULL) THEN
                UPDATE tienda_orden SET estado = 'fallido', actualizado_en = NOW() WHERE id = p_orden_id;
                RETURN jsonb_build_object('success', false, 'error', 'El nickname ya no está disponible');
            END IF;
            SELECT nickname INTO v_nickname_anterior FROM usuario WHERE id = v_usuario_id;
            UPDATE usuario SET nickname = v_nuevo_nickname, actualizado_en = NOW() WHERE id = v_usuario_id;
            UPDATE tienda_orden SET metadata = metadata || jsonb_build_object('nickname_anterior', v_nickname_anterior) WHERE id = p_orden_id;
            v_resultado := jsonb_build_object('tipo', 'servicio', 'servicio', 'cambio_nickname', 'nickname_anterior', v_nickname_anterior, 'nickname_nuevo', v_nuevo_nickname);
        ELSIF v_servicio_tipo = 'reset_record' THEN
            UPDATE usuario_estadisticas_juego SET victorias = 0, derrotas = 0, empates = 0, horas_jugadas = 0, actualizado_en = NOW() WHERE usuario_id = v_usuario_id;
            v_resultado := jsonb_build_object('tipo', 'servicio', 'servicio', 'reset_record', 'mensaje', 'Récord de juego reiniciado');
        ELSIF v_servicio_tipo = 'reset_stats' THEN
            UPDATE usuario_estadisticas_juego SET victorias = 0, derrotas = 0, empates = 0, actualizado_en = NOW() WHERE usuario_id = v_usuario_id;
            v_resultado := jsonb_build_object('tipo', 'servicio', 'servicio', 'reset_stats', 'mensaje', 'Estadísticas reiniciadas');
        ELSIF v_servicio_tipo = 'reclamar_nickname' THEN
            INSERT INTO tienda_solicitud_soporte (orden_id, usuario_id, tipo, nickname_solicitado, estado)
            VALUES (p_orden_id, v_usuario_id, 'reclamar_nickname', v_orden.metadata->>'nickname_solicitado', 'pendiente');
            v_resultado := jsonb_build_object('tipo', 'servicio', 'servicio', 'reclamar_nickname', 'mensaje', 'Solicitud enviada a soporte.');
        ELSE
            v_resultado := jsonb_build_object('tipo', 'servicio', 'servicio', v_servicio_tipo);
        END IF;
        INSERT INTO transaccion (usuario_id, monto, descripcion, tipo_id, origen_id) VALUES (v_usuario_id, v_orden.monto, 'Compra de servicio: ' || v_orden.item_nombre, v_tipo_transaccion_id, v_origen_transaccion_id);
    END IF;
    
    UPDATE tienda_orden SET estado = 'completado', completado_en = NOW(), actualizado_en = NOW() WHERE id = p_orden_id;
    
    RETURN jsonb_build_object('success', true, 'orden_id', p_orden_id, 'resultado', v_resultado, 'message', 'Compra completada exitosamente');
EXCEPTION WHEN OTHERS THEN
    UPDATE tienda_orden SET estado = 'fallido', actualizado_en = NOW() WHERE id = p_orden_id;
    RETURN jsonb_build_object('success', false, 'error', SQLERRM, 'code', SQLSTATE);
END;
$$;

-- 5. CANCELAR ORDEN
CREATE OR REPLACE FUNCTION tienda_cancelar_orden(p_orden_id UUID, p_usuario_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_orden RECORD;
BEGIN
    SELECT * INTO v_orden FROM tienda_orden WHERE id = p_orden_id;
    IF v_orden IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'Orden no encontrada'); END IF;
    IF v_orden.usuario_id != p_usuario_id THEN RETURN jsonb_build_object('success', false, 'error', 'No tienes permiso para cancelar esta orden'); END IF;
    IF v_orden.estado != 'pendiente' THEN RETURN jsonb_build_object('success', false, 'error', 'Solo se pueden cancelar órdenes pendientes'); END IF;
    UPDATE tienda_orden SET estado = 'cancelado', actualizado_en = NOW() WHERE id = p_orden_id;
    RETURN jsonb_build_object('success', true, 'message', 'Orden cancelada');
END;
$$;

-- 6. HISTORIAL DE COMPRAS
CREATE OR REPLACE FUNCTION tienda_historial_compras(p_usuario_id UUID, p_limit INTEGER DEFAULT 20, p_offset INTEGER DEFAULT 0)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_total INTEGER; v_compras JSONB;
BEGIN
    SELECT COUNT(*) INTO v_total FROM tienda_orden WHERE usuario_id = p_usuario_id;
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', o.id, 'item', jsonb_build_object('id', ti.id, 'nombre', ti.nombre, 'tipo', cti.valor),
        'monto', o.monto, 'estado', o.estado, 'paypal_order_id', o.paypal_order_id, 'metadata', o.metadata,
        'creado_en', o.creado_en, 'completado_en', o.completado_en
    ) ORDER BY o.creado_en DESC), '[]'::JSONB) INTO v_compras
    FROM tienda_orden o JOIN tienda_item ti ON o.item_id = ti.id JOIN catalogo_tipo_item cti ON ti.tipo_id = cti.id
    WHERE o.usuario_id = p_usuario_id LIMIT p_limit OFFSET p_offset;
    RETURN jsonb_build_object('success', true, 'total', v_total, 'compras', v_compras);
END;
$$;

-- 7. VERIFICAR NICKNAME
CREATE OR REPLACE FUNCTION tienda_verificar_nickname(p_nickname VARCHAR)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_usuario_existente RECORD; v_dias_inactivo INTEGER;
BEGIN
    IF LENGTH(p_nickname) < 3 OR LENGTH(p_nickname) > 20 THEN
        RETURN jsonb_build_object('disponible', false, 'mensaje', 'El nickname debe tener entre 3 y 20 caracteres');
    END IF;
    SELECT id, nickname, ultima_conexion, deleted_at, EXTRACT(DAY FROM NOW() - ultima_conexion)::INTEGER as dias_sin_conexion
    INTO v_usuario_existente FROM usuario WHERE nickname = p_nickname;
    IF v_usuario_existente IS NULL THEN
        RETURN jsonb_build_object('disponible', true, 'tipo', 'disponible', 'mensaje', 'El nickname está disponible');
    END IF;
    IF v_usuario_existente.deleted_at IS NOT NULL THEN
        RETURN jsonb_build_object('disponible', true, 'tipo', 'reclamable', 'mensaje', 'El nickname puede ser reclamado', 'requiere_soporte', true);
    END IF;
    v_dias_inactivo := v_usuario_existente.dias_sin_conexion;
    IF v_dias_inactivo >= 180 THEN
        RETURN jsonb_build_object('disponible', true, 'tipo', 'inactivo', 'mensaje', 'El usuario está inactivo.', 'dias_inactivo', v_dias_inactivo, 'requiere_soporte', true);
    END IF;
    RETURN jsonb_build_object('disponible', false, 'tipo', 'en_uso', 'mensaje', 'El nickname está en uso por un usuario activo');
END;
$$;

-- 8. COMPRA CON SALDO
CREATE OR REPLACE FUNCTION tienda_comprar_con_saldo(p_usuario_id UUID, p_item_id UUID, p_metadata JSONB DEFAULT '{}'::JSONB)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_saldo_actual NUMERIC(12,2); v_item RECORD; v_orden_result JSONB; v_orden_id UUID;
BEGIN
    SELECT saldo INTO v_saldo_actual FROM usuario WHERE id = p_usuario_id AND deleted_at IS NULL;
    IF v_saldo_actual IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'Usuario no encontrado'); END IF;
    SELECT precio INTO v_item FROM tienda_item WHERE id = p_item_id;
    IF v_item IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'Item no encontrado'); END IF;
    IF v_saldo_actual < v_item.precio THEN
        RETURN jsonb_build_object('success', false, 'error', 'Saldo insuficiente', 'saldo_actual', v_saldo_actual, 'precio', v_item.precio);
    END IF;
    v_orden_result := tienda_crear_orden(p_usuario_id, p_item_id, p_metadata);
    IF NOT (v_orden_result->>'success')::BOOLEAN THEN RETURN v_orden_result; END IF;
    v_orden_id := (v_orden_result->>'orden_id')::UUID;
    UPDATE usuario SET saldo = saldo - v_item.precio, actualizado_en = NOW() WHERE id = p_usuario_id;
    UPDATE tienda_orden SET paypal_order_id = 'SALDO_INTERNO', metadata = metadata || '{"metodo_pago": "saldo"}'::JSONB WHERE id = v_orden_id;
    RETURN tienda_confirmar_compra(v_orden_id);
END;
$$;

-- =====================================================
-- FUNCIONES DE TORNEO
-- =====================================================

-- CREAR TORNEO
CREATE OR REPLACE FUNCTION torneo_crear(
    p_anfitrion_id UUID,
    p_titulo VARCHAR,
    p_descripcion TEXT DEFAULT NULL,
    p_fecha_inicio_registro TIMESTAMP DEFAULT NULL,
    p_fecha_fin_registro TIMESTAMP DEFAULT NULL,
    p_fecha_inicio_torneo TIMESTAMP DEFAULT NULL,
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
    p_cuota INTEGER DEFAULT 0,
    p_comision_porcentaje NUMERIC(5,2) DEFAULT 0,
    p_ganador1_porcentaje NUMERIC(5,2) DEFAULT 70,
    p_ganador2_porcentaje NUMERIC(5,2) DEFAULT 30,
    p_contacto_anfitrion VARCHAR DEFAULT NULL,
    p_discord_servidor VARCHAR DEFAULT NULL,
    p_redes_sociales JSONB DEFAULT '[]'::JSONB,
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
    v_tipo_torneo_default_id UUID;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM usuario WHERE id = p_anfitrion_id AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'El usuario anfitrión no existe o no está activo';
    END IF;
    
    IF p_titulo IS NULL OR TRIM(p_titulo) = '' THEN
        RAISE EXCEPTION 'El título del torneo es obligatorio';
    END IF;
    
    IF p_tipo_torneo_id IS NULL THEN
        SELECT id INTO v_tipo_torneo_default_id FROM catalogo_tipo_torneo WHERE valor = 'eliminacion_simple';
        p_tipo_torneo_id := v_tipo_torneo_default_id;
    END IF;
    
    SELECT id INTO v_estado_proximamente_id FROM catalogo_estado_torneo WHERE valor = 'proximamente';
    IF v_estado_proximamente_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró el estado "proximamente"';
    END IF;
    
    INSERT INTO torneo (
        titulo, descripcion, fecha_inicio_registro, fecha_fin_registro, fecha_inicio_torneo,
        juego_id, plataforma_id, modo_juego_id, region_id, tipo_torneo_id,
        tipo_torneo, al_mejor_de, formato, cerrado, reglas,
        jugadores_pc_permitidos, requiere_transmision, requiere_camara,
        tipo_entrada_id, capacidad, anfitrion_id, contacto_anfitrion, discord_servidor,
        banner_url, miniatura_url, estado_id, creado_en, actualizado_en
    ) VALUES (
        p_titulo, p_descripcion, p_fecha_inicio_registro, p_fecha_fin_registro, p_fecha_inicio_torneo,
        p_juego_id, p_plataforma_id, p_modo_juego_id, p_region_id, p_tipo_torneo_id,
        (SELECT valor FROM catalogo_tipo_torneo WHERE id = p_tipo_torneo_id),
        p_al_mejor_de, p_formato, p_cerrado, p_reglas,
        p_jugadores_pc_permitidos, p_requiere_transmision, p_requiere_camara,
        p_tipo_entrada_id, p_capacidad, p_anfitrion_id, p_contacto_anfitrion, p_discord_servidor,
        p_banner_url, p_miniatura_url, v_estado_proximamente_id, NOW(), NOW()
    )
    RETURNING id INTO v_torneo_id;
    
    INSERT INTO torneo_premios (torneo_id, cuota, fondo_total, fondo_despues_comision, comision_porcentaje, comision_total, ganador1_porcentaje, ganador2_porcentaje)
    VALUES (v_torneo_id, p_cuota, 0, 0, p_comision_porcentaje, 0, p_ganador1_porcentaje, p_ganador2_porcentaje);
    
    IF p_redes_sociales IS NOT NULL AND jsonb_array_length(p_redes_sociales) > 0 THEN
        FOR v_red IN SELECT * FROM jsonb_array_elements(p_redes_sociales)
        LOOP
            INSERT INTO torneo_redes (torneo_id, plataforma, url)
            VALUES (v_torneo_id, v_red->>'plataforma', v_red->>'url');
        END LOOP;
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'torneo_id', v_torneo_id,
        'message', 'Torneo creado exitosamente',
        'estado', 'proximamente'
    );
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM, 'code', SQLSTATE);
END;
$$;

-- OBTENER CATÁLOGOS PARA FORMULARIO
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
                    'plataformas', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', cp.id, 'valor', cp.valor)), '[]'::jsonb) FROM juego_plataformas jp JOIN catalogo_plataforma cp ON jp."catalogoPlataformaId" = cp.id WHERE jp."juegoId" = j.id),
                    'modos_juego', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', mj.id, 'nombre', mj.nombre)), '[]'::jsonb) FROM modo_juego mj WHERE mj.juego_id = j.id)
                ) ORDER BY j.nombre), '[]'::jsonb)
                FROM juego j
            ),
            'regiones', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', id, 'valor', valor) ORDER BY valor), '[]'::jsonb) FROM catalogo_region),
            'tipos_torneo', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', id, 'valor', valor, 'descripcion', descripcion, 'tipo_trofeo', tipo_trofeo) ORDER BY valor), '[]'::jsonb) FROM catalogo_tipo_torneo),
            'tipos_entrada', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', id, 'valor', valor) ORDER BY valor), '[]'::jsonb) FROM catalogo_tipo_entrada),
            'al_mejor_de', jsonb_build_array(1, 3, 5, 7),
            'formatos', jsonb_build_array('1v1', '2v2', '3v3', '4v4', '5v5'),
            'redes_sociales', jsonb_build_array('twitch', 'discord', 'youtube', 'facebook', 'x')
        )
    );
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM, 'code', SQLSTATE);
END;
$$;

-- LISTAR TORNEOS
CREATE OR REPLACE FUNCTION torneo_listar(
    p_estado VARCHAR DEFAULT NULL,
    p_juego_id UUID DEFAULT NULL,
    p_region_id UUID DEFAULT NULL,
    p_anfitrion_id UUID DEFAULT NULL,
    p_busqueda VARCHAR DEFAULT NULL,
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
    SELECT COUNT(*) INTO v_total
    FROM torneo t
    LEFT JOIN catalogo_estado_torneo cet ON t.estado_id = cet.id
    WHERE (p_estado IS NULL OR cet.valor = p_estado)
      AND (p_juego_id IS NULL OR t.juego_id = p_juego_id)
      AND (p_region_id IS NULL OR t.region_id = p_region_id)
      AND (p_anfitrion_id IS NULL OR t.anfitrion_id = p_anfitrion_id)
      AND (p_busqueda IS NULL OR t.titulo ILIKE '%' || p_busqueda || '%');
    
    SELECT COALESCE(jsonb_agg(torneo_data ORDER BY fecha_inicio_torneo DESC NULLS LAST), '[]'::jsonb)
    INTO v_torneos
    FROM (
        SELECT jsonb_build_object(
            'id', t.id, 'titulo', t.titulo, 'descripcion', LEFT(t.descripcion, 200),
            'miniatura_url', t.miniatura_url, 'juego', j.nombre, 'plataforma', cp.valor,
            'region', cr.valor, 'estado', cet.valor, 'formato', t.formato, 'capacidad', t.capacidad,
            'inscritos', (SELECT COUNT(*) FROM torneo_inscripcion ti JOIN catalogo_estado_inscripcion cei ON ti.estado_id = cei.id WHERE ti.torneo_id = t.id AND cei.valor = 'confirmado'),
            'cuota', tp.cuota, 'fondo_total', tp.fondo_total,
            'fecha_inicio_torneo', t.fecha_inicio_torneo, 'fecha_fin_registro', t.fecha_fin_registro,
            'anfitrion', jsonb_build_object('id', u.id, 'nickname', u.nickname, 'avatar_url', ca.url)
        ) as torneo_data, t.fecha_inicio_torneo
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
        LIMIT p_limit OFFSET p_offset
    ) t;
    
    RETURN jsonb_build_object('success', true, 'total', v_total, 'limit', p_limit, 'offset', p_offset, 'torneos', v_torneos);
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM, 'code', SQLSTATE);
END;
$$;

-- TRIGGER: ACTUALIZAR FONDO DE PREMIOS
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
    SELECT id INTO v_estado_confirmado_id FROM catalogo_estado_inscripcion WHERE valor = 'confirmado';
    
    IF NEW.estado_id = v_estado_confirmado_id THEN
        SELECT cuota, comision_porcentaje INTO v_cuota, v_comision_porcentaje FROM torneo_premios WHERE torneo_id = NEW.torneo_id;
        SELECT COUNT(*) INTO v_inscritos FROM torneo_inscripcion ti WHERE ti.torneo_id = NEW.torneo_id AND ti.estado_id = v_estado_confirmado_id;
        v_fondo_total := v_cuota * v_inscritos;
        v_comision_total := v_fondo_total * v_comision_porcentaje / 100;
        v_fondo_despues_comision := v_fondo_total - v_comision_total;
        UPDATE torneo_premios SET fondo_total = v_fondo_total, comision_total = v_comision_total, fondo_despues_comision = v_fondo_despues_comision WHERE torneo_id = NEW.torneo_id;
    END IF;
    
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_actualizar_fondo_premios ON torneo_inscripcion;
CREATE TRIGGER trg_actualizar_fondo_premios
    AFTER INSERT OR UPDATE ON torneo_inscripcion
    FOR EACH ROW
    EXECUTE FUNCTION trigger_actualizar_fondo_premios();

-- =====================================================
-- FIN DEL SCRIPT DE FUNCIONES
-- =====================================================

SELECT 'Funciones de PostgreSQL creadas correctamente' as resultado;
