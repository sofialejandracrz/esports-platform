/*
============================================================================
  Script: PKG_TIENDA_BODY.sql
  Descripcion: Cuerpo del paquete PKG_TIENDA
               Implementación de funciones migradas de PostgreSQL
  Proyecto: Plataforma eSports - Migración a Oracle
  Fecha: Marzo/2026
============================================================================
*/

CREATE OR REPLACE PACKAGE BODY PKG_TIENDA AS

    /*
    =========================================================================
    FN1: OBTENER CATÁLOGO DE TIENDA
    =========================================================================
    */
    FUNCTION FN_OBTENER_CATALOGO(
        p_usuario_id    IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB
    IS
        v_result        CLOB;
        v_tiene_membresia NUMBER(1) := 0;
        v_membresia_json CLOB := 'null';
        v_saldo         NUMBER(12,2) := 0;
        v_creditos      NUMBER := 0;
        v_creditos_json CLOB;
        v_membresias_json CLOB;
        v_servicios_json CLOB;
    BEGIN
        -- Si hay usuario, obtener su info
        IF p_usuario_id IS NOT NULL THEN
            BEGIN
                SELECT u.saldo, u.creditos
                INTO v_saldo, v_creditos
                FROM USUARIO u
                WHERE u.id = p_usuario_id AND u.deleted_at IS NULL;
                
                -- Verificar membresía activa
                SELECT 1, JSON_OBJECT(
                    'id' VALUE um.id,
                    'tipo' VALUE mt.nombre,
                    'fecha_inicio' VALUE TO_CHAR(um.fecha_inicio, 'YYYY-MM-DD'),
                    'fecha_fin' VALUE TO_CHAR(um.fecha_fin, 'YYYY-MM-DD'),
                    'dias_restantes' VALUE GREATEST(0, um.fecha_fin - TRUNC(SYSDATE))
                )
                INTO v_tiene_membresia, v_membresia_json
                FROM USUARIO_MEMBRESIAS um
                JOIN MEMBRESIA_TIPO mt ON um.membresia_tipo_id = mt.id
                WHERE um.usuario_id = p_usuario_id 
                  AND um.activa = 1 
                  AND um.fecha_fin >= TRUNC(SYSDATE)
                  AND ROWNUM = 1
                ORDER BY um.fecha_fin DESC;
            EXCEPTION
                WHEN NO_DATA_FOUND THEN
                    v_tiene_membresia := 0;
                    v_membresia_json := 'null';
            END;
        END IF;
        
        -- Obtener items de créditos
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'id' VALUE ti.id,
                'nombre' VALUE ti.nombre,
                'descripcion' VALUE ti.descripcion,
                'precio' VALUE ti.precio,
                'creditos_otorgados' VALUE ti.creditos_otorgados
            ) ORDER BY ti.precio
        ), '[]')
        INTO v_creditos_json
        FROM TIENDA_ITEM ti
        JOIN CATALOGO_TIPO_ITEM cti ON ti.tipo_id = cti.id
        WHERE cti.valor = 'creditos';
        
        -- Obtener items de membresías
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'id' VALUE ti.id,
                'nombre' VALUE ti.nombre,
                'descripcion' VALUE ti.descripcion,
                'precio' VALUE ti.precio
            ) ORDER BY ti.precio
        ), '[]')
        INTO v_membresias_json
        FROM TIENDA_ITEM ti
        JOIN CATALOGO_TIPO_ITEM cti ON ti.tipo_id = cti.id
        WHERE cti.valor = 'membresia';
        
        -- Obtener items de servicios
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'id' VALUE ti.id,
                'nombre' VALUE ti.nombre,
                'descripcion' VALUE ti.descripcion,
                'precio' VALUE ti.precio
            ) ORDER BY ti.precio
        ), '[]')
        INTO v_servicios_json
        FROM TIENDA_ITEM ti
        JOIN CATALOGO_TIPO_ITEM cti ON ti.tipo_id = cti.id
        WHERE cti.valor = 'servicio';
        
        -- Construir resultado final
        v_result := JSON_OBJECT(
            'success' VALUE 'true',
            'usuario' VALUE CASE WHEN p_usuario_id IS NOT NULL THEN 
                JSON_OBJECT(
                    'id' VALUE p_usuario_id,
                    'tiene_membresia' VALUE CASE WHEN v_tiene_membresia = 1 THEN 'true' ELSE 'false' END,
                    'membresia_actual' VALUE v_membresia_json FORMAT JSON,
                    'saldo' VALUE v_saldo,
                    'creditos' VALUE v_creditos
                )
            ELSE 'null' END FORMAT JSON,
            'categorias' VALUE JSON_OBJECT(
                'creditos' VALUE v_creditos_json FORMAT JSON,
                'membresias' VALUE v_membresias_json FORMAT JSON,
                'servicios' VALUE v_servicios_json FORMAT JSON
            )
        );
        
        RETURN v_result;
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_OBTENER_CATALOGO;

    /*
    =========================================================================
    FN2: CREAR ORDEN DE COMPRA
    =========================================================================
    */
    FUNCTION FN_CREAR_ORDEN(
        p_usuario_id    IN VARCHAR2,
        p_item_id       IN VARCHAR2,
        p_metadata      IN CLOB DEFAULT '{}'
    ) RETURN CLOB
    IS
        v_usuario_count NUMBER;
        v_item_precio   NUMBER(12,2);
        v_item_nombre   VARCHAR2(200);
        v_tipo_valor    VARCHAR2(100);
        v_orden_id      NUMBER;
    BEGIN
        -- Verificar usuario existe
        SELECT COUNT(*) INTO v_usuario_count
        FROM USUARIO WHERE id = p_usuario_id AND deleted_at IS NULL;
        
        IF v_usuario_count = 0 THEN
            RETURN '{"success": false, "error": "Usuario no encontrado"}';
        END IF;
        
        -- Obtener info del item
        BEGIN
            SELECT ti.precio, ti.nombre, cti.valor
            INTO v_item_precio, v_item_nombre, v_tipo_valor
            FROM TIENDA_ITEM ti
            JOIN CATALOGO_TIPO_ITEM cti ON ti.tipo_id = cti.id
            WHERE ti.id = p_item_id;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "Item no encontrado"}';
        END;
        
        -- Crear orden
        SELECT SEQ_TIENDA_ORDEN.NEXTVAL INTO v_orden_id FROM DUAL;
        
        INSERT INTO TIENDA_ORDEN (id, usuario_id, item_id, monto, estado, metadata, creado_en, actualizado_en)
        VALUES (v_orden_id, p_usuario_id, p_item_id, v_item_precio, 'pendiente', p_metadata, SYSTIMESTAMP, SYSTIMESTAMP);
        
        COMMIT;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'orden_id' VALUE v_orden_id,
            'item' VALUE JSON_OBJECT(
                'id' VALUE p_item_id,
                'nombre' VALUE v_item_nombre,
                'precio' VALUE v_item_precio,
                'tipo' VALUE v_tipo_valor
            ),
            'message' VALUE 'Orden creada, proceder con pago PayPal'
        );
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_CREAR_ORDEN;

    /*
    =========================================================================
    FN3: REGISTRAR PAGO PAYPAL
    =========================================================================
    */
    FUNCTION FN_REGISTRAR_PAGO_PAYPAL(
        p_orden_id          IN VARCHAR2,
        p_paypal_order_id   IN VARCHAR2,
        p_paypal_capture_id IN VARCHAR2 DEFAULT NULL,
        p_paypal_payer_id   IN VARCHAR2 DEFAULT NULL,
        p_paypal_payer_email IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB
    IS
        v_estado VARCHAR2(50);
    BEGIN
        -- Verificar orden existe y obtener estado
        BEGIN
            SELECT estado INTO v_estado FROM TIENDA_ORDEN WHERE id = p_orden_id;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "Orden no encontrada"}';
        END;
        
        IF v_estado != 'pendiente' THEN
            RETURN '{"success": false, "error": "La orden ya fue procesada"}';
        END IF;
        
        -- Actualizar con datos de PayPal
        UPDATE TIENDA_ORDEN
        SET paypal_order_id = p_paypal_order_id,
            paypal_capture_id = p_paypal_capture_id,
            paypal_payer_id = p_paypal_payer_id,
            paypal_payer_email = p_paypal_payer_email,
            actualizado_en = SYSTIMESTAMP
        WHERE id = p_orden_id;
        
        COMMIT;
        
        RETURN '{"success": true, "orden_id": "' || p_orden_id || '", "message": "Datos de PayPal registrados"}';
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_REGISTRAR_PAGO_PAYPAL;

    /*
    =========================================================================
    FN4: CONFIRMAR COMPRA
    =========================================================================
    */
    FUNCTION FN_CONFIRMAR_COMPRA(
        p_orden_id          IN VARCHAR2,
        p_paypal_capture_id IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB
    IS
        v_orden_estado      VARCHAR2(50);
        v_usuario_id        NUMBER;
        v_item_id           NUMBER;
        v_tipo_valor        VARCHAR2(100);
        v_creditos_otorgados NUMBER;
        v_monto             NUMBER(12,2);
        v_item_nombre       VARCHAR2(200);
        v_tipo_transaccion_id NUMBER;
        v_origen_transaccion_id NUMBER;
        v_resultado         VARCHAR2(500);
    BEGIN
        -- Obtener datos de la orden
        BEGIN
            SELECT o.estado, o.usuario_id, o.item_id, o.monto, ti.nombre, ti.creditos_otorgados, cti.valor
            INTO v_orden_estado, v_usuario_id, v_item_id, v_monto, v_item_nombre, v_creditos_otorgados, v_tipo_valor
            FROM TIENDA_ORDEN o
            JOIN TIENDA_ITEM ti ON o.item_id = ti.id
            JOIN CATALOGO_TIPO_ITEM cti ON ti.tipo_id = cti.id
            WHERE o.id = p_orden_id;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "Orden no encontrada"}';
        END;
        
        IF v_orden_estado = 'completado' THEN
            RETURN '{"success": false, "error": "La orden ya fue completada"}';
        END IF;
        
        IF v_orden_estado != 'pendiente' THEN
            RETURN '{"success": false, "error": "La orden no puede ser completada"}';
        END IF;
        
        -- Obtener IDs de catálogos
        SELECT id INTO v_tipo_transaccion_id FROM CATALOGO_TRANSACCION_TIPO WHERE valor = 'saldo';
        SELECT id INTO v_origen_transaccion_id FROM CATALOGO_ORIGEN_TRANSACCION WHERE valor = 'compra';
        
        -- Actualizar capture_id si se proporciona
        IF p_paypal_capture_id IS NOT NULL THEN
            UPDATE TIENDA_ORDEN SET paypal_capture_id = p_paypal_capture_id WHERE id = p_orden_id;
        END IF;
        
        -- Procesar según tipo de item
        IF v_tipo_valor = 'creditos' THEN
            -- Agregar créditos al usuario
            UPDATE USUARIO SET creditos = creditos + v_creditos_otorgados, actualizado_en = SYSTIMESTAMP
            WHERE id = v_usuario_id;
            
            -- Registrar transacción
            INSERT INTO TRANSACCION (id, usuario_id, monto, descripcion, tipo_id, origen_id, creado_en)
            VALUES (SEQ_TRANSACCION.NEXTVAL, v_usuario_id, v_monto, 
                    'Compra de ' || v_creditos_otorgados || ' créditos',
                    (SELECT id FROM CATALOGO_TRANSACCION_TIPO WHERE valor = 'creditos'),
                    v_origen_transaccion_id, SYSTIMESTAMP);
            
            v_resultado := '{"tipo": "creditos", "creditos_agregados": ' || v_creditos_otorgados || '}';
            
        ELSIF v_tipo_valor = 'membresia' THEN
            -- Lógica de membresía simplificada
            INSERT INTO TRANSACCION (id, usuario_id, monto, descripcion, tipo_id, origen_id, creado_en)
            VALUES (SEQ_TRANSACCION.NEXTVAL, v_usuario_id, v_monto, 
                    'Compra de membresía: ' || v_item_nombre,
                    v_tipo_transaccion_id, v_origen_transaccion_id, SYSTIMESTAMP);
            
            v_resultado := '{"tipo": "membresia", "membresia": "' || v_item_nombre || '"}';
            
        ELSIF v_tipo_valor = 'servicio' THEN
            INSERT INTO TRANSACCION (id, usuario_id, monto, descripcion, tipo_id, origen_id, creado_en)
            VALUES (SEQ_TRANSACCION.NEXTVAL, v_usuario_id, v_monto, 
                    'Compra de servicio: ' || v_item_nombre,
                    v_tipo_transaccion_id, v_origen_transaccion_id, SYSTIMESTAMP);
            
            v_resultado := '{"tipo": "servicio", "servicio": "' || v_item_nombre || '"}';
        END IF;
        
        -- Marcar orden como completada
        UPDATE TIENDA_ORDEN 
        SET estado = 'completado', completado_en = SYSTIMESTAMP, actualizado_en = SYSTIMESTAMP
        WHERE id = p_orden_id;
        
        COMMIT;
        
        RETURN '{"success": true, "orden_id": "' || p_orden_id || '", "resultado": ' || v_resultado || ', "message": "Compra completada exitosamente"}';
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            UPDATE TIENDA_ORDEN SET estado = 'fallido', actualizado_en = SYSTIMESTAMP WHERE id = p_orden_id;
            COMMIT;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_CONFIRMAR_COMPRA;

    /*
    =========================================================================
    FN5: CANCELAR ORDEN
    =========================================================================
    */
    FUNCTION FN_CANCELAR_ORDEN(
        p_orden_id      IN VARCHAR2,
        p_usuario_id    IN VARCHAR2
    ) RETURN CLOB
    IS
        v_estado        VARCHAR2(50);
        v_orden_usuario NUMBER;
    BEGIN
        BEGIN
            SELECT estado, usuario_id INTO v_estado, v_orden_usuario
            FROM TIENDA_ORDEN WHERE id = p_orden_id;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "Orden no encontrada"}';
        END;
        
        IF v_orden_usuario != p_usuario_id THEN
            RETURN '{"success": false, "error": "No tienes permiso para cancelar esta orden"}';
        END IF;
        
        IF v_estado != 'pendiente' THEN
            RETURN '{"success": false, "error": "Solo se pueden cancelar ordenes pendientes"}';
        END IF;
        
        UPDATE TIENDA_ORDEN SET estado = 'cancelado', actualizado_en = SYSTIMESTAMP WHERE id = p_orden_id;
        COMMIT;
        
        RETURN '{"success": true, "message": "Orden cancelada"}';
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_CANCELAR_ORDEN;

    /*
    =========================================================================
    FN6: HISTORIAL DE COMPRAS
    =========================================================================
    */
    FUNCTION FN_HISTORIAL_COMPRAS(
        p_usuario_id    IN VARCHAR2,
        p_limit         IN NUMBER DEFAULT 20,
        p_offset        IN NUMBER DEFAULT 0
    ) RETURN CLOB
    IS
        v_total     NUMBER;
        v_compras   CLOB;
    BEGIN
        SELECT COUNT(*) INTO v_total FROM TIENDA_ORDEN WHERE usuario_id = p_usuario_id;
        
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'id' VALUE o.id,
                'item' VALUE JSON_OBJECT(
                    'id' VALUE ti.id,
                    'nombre' VALUE ti.nombre,
                    'tipo' VALUE cti.valor
                ),
                'monto' VALUE o.monto,
                'estado' VALUE o.estado,
                'paypal_order_id' VALUE o.paypal_order_id,
                'creado_en' VALUE TO_CHAR(o.creado_en, 'YYYY-MM-DD"T"HH24:MI:SS'),
                'completado_en' VALUE TO_CHAR(o.completado_en, 'YYYY-MM-DD"T"HH24:MI:SS')
            ) ORDER BY o.creado_en DESC
        ), '[]')
        INTO v_compras
        FROM TIENDA_ORDEN o
        JOIN TIENDA_ITEM ti ON o.item_id = ti.id
        JOIN CATALOGO_TIPO_ITEM cti ON ti.tipo_id = cti.id
        WHERE o.usuario_id = p_usuario_id
          AND ROWNUM <= p_limit;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'total' VALUE v_total,
            'compras' VALUE v_compras FORMAT JSON
        );
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_HISTORIAL_COMPRAS;

    /*
    =========================================================================
    FN7: VERIFICAR NICKNAME
    =========================================================================
    */
    FUNCTION FN_VERIFICAR_NICKNAME(
        p_nickname      IN VARCHAR2
    ) RETURN CLOB
    IS
        v_usuario_id        NUMBER;
        v_deleted_at        TIMESTAMP;
        v_ultima_conexion   TIMESTAMP;
        v_dias_inactivo     NUMBER;
    BEGIN
        IF LENGTH(p_nickname) < 3 OR LENGTH(p_nickname) > 20 THEN
            RETURN '{"disponible": false, "mensaje": "El nickname debe tener entre 3 y 20 caracteres"}';
        END IF;
        
        BEGIN
            SELECT id, deleted_at, ultima_conexion
            INTO v_usuario_id, v_deleted_at, v_ultima_conexion
            FROM USUARIO WHERE nickname = p_nickname;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"disponible": true, "tipo": "disponible", "mensaje": "El nickname esta disponible"}';
        END;
        
        IF v_deleted_at IS NOT NULL THEN
            RETURN '{"disponible": true, "tipo": "reclamable", "mensaje": "El nickname puede ser reclamado", "requiere_soporte": true}';
        END IF;
        
        v_dias_inactivo := TRUNC(SYSDATE) - TRUNC(v_ultima_conexion);
        
        IF v_dias_inactivo >= 180 THEN
            RETURN '{"disponible": true, "tipo": "inactivo", "mensaje": "El usuario esta inactivo.", "dias_inactivo": ' || v_dias_inactivo || ', "requiere_soporte": true}';
        END IF;
        
        RETURN '{"disponible": false, "tipo": "en_uso", "mensaje": "El nickname esta en uso por un usuario activo"}';
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"disponible": false, "error": "' || SQLERRM || '"}';
    END FN_VERIFICAR_NICKNAME;

    /*
    =========================================================================
    FN8: COMPRAR CON SALDO
    =========================================================================
    */
    FUNCTION FN_COMPRAR_CON_SALDO(
        p_usuario_id    IN VARCHAR2,
        p_item_id       IN VARCHAR2,
        p_metadata      IN CLOB DEFAULT '{}'
    ) RETURN CLOB
    IS
        v_saldo_actual  NUMBER(12,2);
        v_item_precio   NUMBER(12,2);
        v_orden_result  CLOB;
        v_orden_id      VARCHAR2(100);
        v_success       VARCHAR2(10);
    BEGIN
        -- Obtener saldo del usuario
        BEGIN
            SELECT saldo INTO v_saldo_actual
            FROM USUARIO WHERE id = p_usuario_id AND deleted_at IS NULL;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "Usuario no encontrado"}';
        END;
        
        -- Obtener precio del item
        BEGIN
            SELECT precio INTO v_item_precio FROM TIENDA_ITEM WHERE id = p_item_id;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "Item no encontrado"}';
        END;
        
        IF v_saldo_actual < v_item_precio THEN
            RETURN '{"success": false, "error": "Saldo insuficiente", "saldo_actual": ' || v_saldo_actual || ', "precio": ' || v_item_precio || '}';
        END IF;
        
        -- Crear orden
        v_orden_result := FN_CREAR_ORDEN(p_usuario_id, p_item_id, p_metadata);
        
        -- Verificar si la orden fue exitosa (parseo simple)
        IF INSTR(v_orden_result, '"success": true') = 0 AND INSTR(v_orden_result, '"success":"true"') = 0 THEN
            RETURN v_orden_result;
        END IF;
        
        -- Extraer orden_id del resultado (simplificado)
        v_orden_id := REGEXP_SUBSTR(v_orden_result, '"orden_id"[[:space:]]*:[[:space:]]*"?([^",}]+)', 1, 1, NULL, 1);
        
        -- Descontar saldo
        UPDATE USUARIO SET saldo = saldo - v_item_precio, actualizado_en = SYSTIMESTAMP WHERE id = p_usuario_id;
        
        -- Marcar orden como pagada con saldo interno
        UPDATE TIENDA_ORDEN 
        SET paypal_order_id = 'SALDO_INTERNO',
            metadata = '{"metodo_pago": "saldo"}'
        WHERE id = v_orden_id;
        
        COMMIT;
        
        -- Confirmar la compra
        RETURN FN_CONFIRMAR_COMPRA(v_orden_id);
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_COMPRAR_CON_SALDO;

    /*
    =========================================================================
    FN9: OBTENER SOLICITUDES DE SOPORTE (ADMIN)
    Migrado de PostgreSQL: tienda_obtener_solicitudes_soporte()
    =========================================================================
    */
    FUNCTION FN_OBTENER_SOLICITUDES_SOPORTE(
        p_estado        IN VARCHAR2 DEFAULT NULL,
        p_limit         IN NUMBER DEFAULT 20,
        p_offset        IN NUMBER DEFAULT 0
    ) RETURN CLOB
    IS
        v_total         NUMBER;
        v_solicitudes   CLOB;
    BEGIN
        -- Contar total
        SELECT COUNT(*) INTO v_total
        FROM TIENDA_SOLICITUD_SOPORTE
        WHERE (p_estado IS NULL OR ESTADO = p_estado);
        
        -- Obtener solicitudes con paginación
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'id' VALUE s.id,
                'tipo' VALUE s.tipo,
                'nickname_solicitado' VALUE s.nickname_solicitado,
                'estado' VALUE s.estado,
                'usuario' VALUE JSON_OBJECT(
                    'id' VALUE u.id,
                    'nickname' VALUE u.nickname
                ),
                'orden' VALUE CASE 
                    WHEN s.orden_id IS NOT NULL THEN 
                        JSON_OBJECT('id' VALUE o.id, 'monto' VALUE o.monto)
                    ELSE NULL 
                END,
                'notas_admin' VALUE s.notas_admin,
                'creado_en' VALUE TO_CHAR(s.creado_en, 'YYYY-MM-DD"T"HH24:MI:SS'),
                'resuelto_en' VALUE TO_CHAR(s.resuelto_en, 'YYYY-MM-DD"T"HH24:MI:SS')
            ) ORDER BY s.creado_en DESC
        ), '[]')
        INTO v_solicitudes
        FROM (
            SELECT * FROM (
                SELECT s2.*, ROWNUM AS rn
                FROM (
                    SELECT * FROM TIENDA_SOLICITUD_SOPORTE 
                    WHERE (p_estado IS NULL OR ESTADO = p_estado)
                    ORDER BY creado_en DESC
                ) s2
                WHERE ROWNUM <= p_offset + p_limit
            )
            WHERE rn > p_offset
        ) s
        JOIN USUARIO u ON s.usuario_id = u.id
        LEFT JOIN TIENDA_ORDEN o ON s.orden_id = o.id;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'total' VALUE v_total,
            'solicitudes' VALUE v_solicitudes FORMAT JSON
        );
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_OBTENER_SOLICITUDES_SOPORTE;

    /*
    =========================================================================
    FN10: RESOLVER SOLICITUD DE SOPORTE (ADMIN)
    Migrado de PostgreSQL: tienda_resolver_solicitud_soporte()
    =========================================================================
    */
    FUNCTION FN_RESOLVER_SOLICITUD_SOPORTE(
        p_solicitud_id  IN VARCHAR2,
        p_admin_id      IN VARCHAR2,
        p_aprobar       IN NUMBER,
        p_notas         IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB
    IS
        v_es_admin          NUMBER;
        v_solicitud_tipo    VARCHAR2(100);
        v_solicitud_estado  VARCHAR2(50);
        v_usuario_id        NUMBER;
        v_nickname_solicit  VARCHAR2(100);
        v_nickname_anterior VARCHAR2(100);
    BEGIN
        -- Verificar que quien resuelve es admin
        SELECT COUNT(*) INTO v_es_admin
        FROM USUARIO u
        JOIN CATALOGO_ROL cr ON u.rol_id = cr.id
        WHERE u.id = p_admin_id AND cr.valor = 'admin';
        
        IF v_es_admin = 0 THEN
            RETURN '{"success": false, "error": "Solo administradores pueden resolver solicitudes"}';
        END IF;
        
        -- Obtener datos de la solicitud
        BEGIN
            SELECT tipo, estado, usuario_id, nickname_solicitado
            INTO v_solicitud_tipo, v_solicitud_estado, v_usuario_id, v_nickname_solicit
            FROM TIENDA_SOLICITUD_SOPORTE
            WHERE id = p_solicitud_id;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "Solicitud no encontrada"}';
        END;
        
        -- Verificar que no esté resuelta
        IF v_solicitud_estado NOT IN ('pendiente', 'en_revision') THEN
            RETURN '{"success": false, "error": "La solicitud ya fue resuelta"}';
        END IF;
        
        IF p_aprobar = 1 THEN
            -- Si es reclamar nickname, hacer el cambio
            IF v_solicitud_tipo = 'reclamar_nickname' THEN
                -- Liberar el nickname del usuario inactivo (agregar sufijo)
                UPDATE USUARIO 
                SET nickname = nickname || '_old_' || TO_CHAR(SYSTIMESTAMP, 'YYYYMMDDHH24MISS')
                WHERE nickname = v_nickname_solicit 
                  AND id != v_usuario_id;
                
                -- Guardar nickname anterior del solicitante
                SELECT nickname INTO v_nickname_anterior
                FROM USUARIO WHERE id = v_usuario_id;
                
                -- Asignar nuevo nickname al solicitante
                UPDATE USUARIO 
                SET nickname = v_nickname_solicit, 
                    actualizado_en = SYSTIMESTAMP
                WHERE id = v_usuario_id;
            END IF;
            
            -- Actualizar solicitud como aprobada
            UPDATE TIENDA_SOLICITUD_SOPORTE
            SET estado = 'aprobado',
                notas_admin = p_notas,
                resuelto_en = SYSTIMESTAMP,
                resuelto_por = p_admin_id,
                actualizado_en = SYSTIMESTAMP
            WHERE id = p_solicitud_id;
            
            COMMIT;
            
            RETURN '{"success": true, "message": "Solicitud aprobada", "nickname_asignado": "' || v_nickname_solicit || '"}';
        ELSE
            -- Rechazar solicitud
            UPDATE TIENDA_SOLICITUD_SOPORTE
            SET estado = 'rechazado',
                notas_admin = p_notas,
                resuelto_en = SYSTIMESTAMP,
                resuelto_por = p_admin_id,
                actualizado_en = SYSTIMESTAMP
            WHERE id = p_solicitud_id;
            
            COMMIT;
            
            RETURN '{"success": true, "message": "Solicitud rechazada"}';
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_RESOLVER_SOLICITUD_SOPORTE;

END PKG_TIENDA;
/

PROMPT >>> Cuerpo del paquete PKG_TIENDA creado exitosamente <<<
