/*
============================================================================
  Script: PKG_CONFIG_BODY.sql
  Descripcion: Cuerpo del paquete PKG_CONFIG
               Implementación de funciones de configuración de usuario
  Proyecto: Plataforma eSports - Migración a Oracle
  Fecha: Marzo/2026
============================================================================
*/

CREATE OR REPLACE PACKAGE BODY PKG_CONFIG AS

    /*
    =========================================================================
    SECCIÓN 1: PERSONAL
    =========================================================================
    */
    FUNCTION FN_GET_PERSONAL(p_usuario_id IN VARCHAR2) RETURN CLOB
    IS
        v_result CLOB;
        v_generos CLOB;
    BEGIN
        -- Verificar usuario
        DECLARE
            v_count NUMBER;
        BEGIN
            SELECT COUNT(*) INTO v_count FROM USUARIO WHERE id = p_usuario_id AND deleted_at IS NULL;
            IF v_count = 0 THEN
                RETURN '{"success": false, "error": "Usuario no encontrado"}';
            END IF;
        END;
        
        -- Obtener géneros disponibles
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT('id' VALUE id, 'valor' VALUE valor) ORDER BY valor
        ), '[]')
        INTO v_generos FROM CATALOGO_GENERO;
        
        -- Obtener datos personales
        SELECT JSON_OBJECT(
            'success' VALUE 'true',
            'nickname' VALUE u.nickname,
            'biografia' VALUE u.biografia,
            'genero' VALUE JSON_OBJECT('id' VALUE cg.id, 'valor' VALUE cg.valor),
            'timezone' VALUE p.timezone,
            'foto_perfil' VALUE u.foto_perfil,
            'avatar' VALUE JSON_OBJECT('id' VALUE ca.id, 'nombre' VALUE ca.nombre, 'url' VALUE ca.url),
            'generos_disponibles' VALUE v_generos FORMAT JSON
        )
        INTO v_result
        FROM USUARIO u
        LEFT JOIN PERSONA p ON u.persona_id = p.id
        LEFT JOIN CATALOGO_GENERO cg ON p.genero_id = cg.id
        LEFT JOIN CATALOGO_AVATAR ca ON u.avatar_id = ca.id
        WHERE u.id = p_usuario_id;
        
        RETURN v_result;
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_GET_PERSONAL;
    
    FUNCTION FN_UPDATE_PERSONAL(
        p_usuario_id    IN VARCHAR2,
        p_biografia     IN VARCHAR2 DEFAULT NULL,
        p_genero_id     IN VARCHAR2 DEFAULT NULL,
        p_timezone      IN VARCHAR2 DEFAULT NULL,
        p_avatar_id     IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB
    IS
        v_persona_id NUMBER;
    BEGIN
        -- Obtener persona_id
        BEGIN
            SELECT persona_id INTO v_persona_id FROM USUARIO WHERE id = p_usuario_id AND deleted_at IS NULL;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "Usuario no encontrado"}';
        END;
        
        -- Validar género
        IF p_genero_id IS NOT NULL THEN
            DECLARE v_count NUMBER;
            BEGIN
                SELECT COUNT(*) INTO v_count FROM CATALOGO_GENERO WHERE id = p_genero_id;
                IF v_count = 0 THEN
                    RETURN '{"success": false, "error": "Genero no valido"}';
                END IF;
            END;
        END IF;
        
        -- Validar avatar
        IF p_avatar_id IS NOT NULL THEN
            DECLARE v_count NUMBER;
            BEGIN
                SELECT COUNT(*) INTO v_count FROM CATALOGO_AVATAR WHERE id = p_avatar_id AND disponible = 1;
                IF v_count = 0 THEN
                    RETURN '{"success": false, "error": "Avatar no disponible"}';
                END IF;
            END;
        END IF;
        
        -- Actualizar usuario
        UPDATE USUARIO SET
            biografia = NVL(p_biografia, biografia),
            avatar_id = NVL(p_avatar_id, avatar_id),
            actualizado_en = SYSTIMESTAMP
        WHERE id = p_usuario_id;
        
        -- Actualizar persona
        IF v_persona_id IS NOT NULL AND (p_genero_id IS NOT NULL OR p_timezone IS NOT NULL) THEN
            UPDATE PERSONA SET
                genero_id = NVL(p_genero_id, genero_id),
                timezone = NVL(p_timezone, timezone),
                actualizado_en = SYSTIMESTAMP
            WHERE id = v_persona_id;
        END IF;
        
        COMMIT;
        
        RETURN '{"success": true, "message": "Configuracion personal actualizada correctamente"}';
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_UPDATE_PERSONAL;

    /*
    =========================================================================
    SECCIÓN 2: SOCIAL (REDES SOCIALES)
    =========================================================================
    */
    FUNCTION FN_GET_SOCIAL(p_usuario_id IN VARCHAR2) RETURN CLOB
    IS
        v_redes CLOB;
    BEGIN
        -- Verificar usuario
        DECLARE v_count NUMBER;
        BEGIN
            SELECT COUNT(*) INTO v_count FROM USUARIO WHERE id = p_usuario_id AND deleted_at IS NULL;
            IF v_count = 0 THEN
                RETURN '{"success": false, "error": "Usuario no encontrado"}';
            END IF;
        END;
        
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'id' VALUE urs.id,
                'plataforma' VALUE urs.plataforma,
                'enlace' VALUE urs.enlace
            ) ORDER BY urs.plataforma
        ), '[]')
        INTO v_redes
        FROM USUARIO_RED_SOCIAL urs
        WHERE urs.usuario_id = p_usuario_id;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'redes_sociales' VALUE v_redes FORMAT JSON,
            'plataformas_sugeridas' VALUE JSON_ARRAY('Twitter', 'Twitch', 'YouTube', 'Discord', 'Instagram', 'TikTok', 'Facebook')
        );
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_GET_SOCIAL;
    
    FUNCTION FN_UPSERT_SOCIAL(
        p_usuario_id    IN VARCHAR2,
        p_plataforma    IN VARCHAR2,
        p_enlace        IN VARCHAR2,
        p_red_id        IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB
    IS
        v_red_id NUMBER;
    BEGIN
        -- Verificar usuario
        DECLARE v_count NUMBER;
        BEGIN
            SELECT COUNT(*) INTO v_count FROM USUARIO WHERE id = p_usuario_id AND deleted_at IS NULL;
            IF v_count = 0 THEN
                RETURN '{"success": false, "error": "Usuario no encontrado"}';
            END IF;
        END;
        
        -- Validar datos
        IF p_plataforma IS NULL OR TRIM(p_plataforma) = '' THEN
            RETURN '{"success": false, "error": "La plataforma es requerida"}';
        END IF;
        
        IF p_enlace IS NULL OR TRIM(p_enlace) = '' THEN
            RETURN '{"success": false, "error": "El enlace es requerido"}';
        END IF;
        
        IF p_red_id IS NOT NULL THEN
            -- Actualizar existente
            UPDATE USUARIO_RED_SOCIAL
            SET plataforma = p_plataforma, enlace = p_enlace
            WHERE id = p_red_id AND usuario_id = p_usuario_id;
            
            IF SQL%ROWCOUNT = 0 THEN
                RETURN '{"success": false, "error": "Red social no encontrada"}';
            END IF;
            v_red_id := TO_NUMBER(p_red_id);
        ELSE
            -- Verificar si existe
            BEGIN
                SELECT id INTO v_red_id FROM USUARIO_RED_SOCIAL
                WHERE usuario_id = p_usuario_id AND UPPER(plataforma) = UPPER(p_plataforma);
                
                UPDATE USUARIO_RED_SOCIAL SET enlace = p_enlace WHERE id = v_red_id;
            EXCEPTION
                WHEN NO_DATA_FOUND THEN
                    SELECT SEQ_USUARIO_RED_SOCIAL.NEXTVAL INTO v_red_id FROM DUAL;
                    INSERT INTO USUARIO_RED_SOCIAL (id, usuario_id, plataforma, enlace)
                    VALUES (v_red_id, p_usuario_id, p_plataforma, p_enlace);
            END;
        END IF;
        
        UPDATE USUARIO SET actualizado_en = SYSTIMESTAMP WHERE id = p_usuario_id;
        COMMIT;
        
        RETURN '{"success": true, "red_id": ' || v_red_id || ', "message": "Red social guardada correctamente"}';
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_UPSERT_SOCIAL;
    
    FUNCTION FN_DELETE_SOCIAL(
        p_usuario_id    IN VARCHAR2,
        p_red_id        IN VARCHAR2
    ) RETURN CLOB
    IS
    BEGIN
        DELETE FROM USUARIO_RED_SOCIAL WHERE id = p_red_id AND usuario_id = p_usuario_id;
        
        IF SQL%ROWCOUNT = 0 THEN
            RETURN '{"success": false, "error": "Red social no encontrada"}';
        END IF;
        
        UPDATE USUARIO SET actualizado_en = SYSTIMESTAMP WHERE id = p_usuario_id;
        COMMIT;
        
        RETURN '{"success": true, "message": "Red social eliminada correctamente"}';
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_DELETE_SOCIAL;

    /*
    =========================================================================
    SECCIÓN 3: JUEGOS (CUENTAS DE PLATAFORMAS)
    =========================================================================
    */
    FUNCTION FN_GET_JUEGOS(p_usuario_id IN VARCHAR2) RETURN CLOB
    IS
        v_cuentas CLOB;
        v_plataformas CLOB;
    BEGIN
        -- Verificar usuario
        DECLARE v_count NUMBER;
        BEGIN
            SELECT COUNT(*) INTO v_count FROM USUARIO WHERE id = p_usuario_id AND deleted_at IS NULL;
            IF v_count = 0 THEN
                RETURN '{"success": false, "error": "Usuario no encontrado"}';
            END IF;
        END;
        
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'id' VALUE ucj.id,
                'plataforma_id' VALUE cp.id,
                'plataforma' VALUE cp.valor,
                'identificador' VALUE ucj.identificador
            ) ORDER BY cp.valor
        ), '[]')
        INTO v_cuentas
        FROM USUARIO_CUENTA_JUEGO ucj
        JOIN CATALOGO_PLATAFORMA cp ON ucj.plataforma_juego_id = cp.id
        WHERE ucj.usuario_id = p_usuario_id;
        
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT('id' VALUE id, 'valor' VALUE valor) ORDER BY valor
        ), '[]')
        INTO v_plataformas FROM CATALOGO_PLATAFORMA;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'cuentas_juego' VALUE v_cuentas FORMAT JSON,
            'plataformas_disponibles' VALUE v_plataformas FORMAT JSON
        );
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_GET_JUEGOS;
    
    FUNCTION FN_UPSERT_CUENTA_JUEGO(
        p_usuario_id    IN VARCHAR2,
        p_plataforma_id IN VARCHAR2,
        p_identificador IN VARCHAR2,
        p_cuenta_id     IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB
    IS
        v_cuenta_id NUMBER;
    BEGIN
        -- Verificar usuario
        DECLARE v_count NUMBER;
        BEGIN
            SELECT COUNT(*) INTO v_count FROM USUARIO WHERE id = p_usuario_id AND deleted_at IS NULL;
            IF v_count = 0 THEN
                RETURN '{"success": false, "error": "Usuario no encontrado"}';
            END IF;
        END;
        
        -- Validar plataforma
        DECLARE v_count NUMBER;
        BEGIN
            SELECT COUNT(*) INTO v_count FROM CATALOGO_PLATAFORMA WHERE id = p_plataforma_id;
            IF v_count = 0 THEN
                RETURN '{"success": false, "error": "Plataforma no valida"}';
            END IF;
        END;
        
        IF p_identificador IS NULL OR TRIM(p_identificador) = '' THEN
            RETURN '{"success": false, "error": "El identificador es requerido"}';
        END IF;
        
        IF p_cuenta_id IS NOT NULL THEN
            UPDATE USUARIO_CUENTA_JUEGO
            SET plataforma_juego_id = p_plataforma_id, identificador = p_identificador
            WHERE id = p_cuenta_id AND usuario_id = p_usuario_id;
            
            IF SQL%ROWCOUNT = 0 THEN
                RETURN '{"success": false, "error": "Cuenta de juego no encontrada"}';
            END IF;
            v_cuenta_id := TO_NUMBER(p_cuenta_id);
        ELSE
            BEGIN
                SELECT id INTO v_cuenta_id FROM USUARIO_CUENTA_JUEGO
                WHERE usuario_id = p_usuario_id AND plataforma_juego_id = p_plataforma_id;
                
                UPDATE USUARIO_CUENTA_JUEGO SET identificador = p_identificador WHERE id = v_cuenta_id;
            EXCEPTION
                WHEN NO_DATA_FOUND THEN
                    SELECT SEQ_USUARIO_CUENTA_JUEGO.NEXTVAL INTO v_cuenta_id FROM DUAL;
                    INSERT INTO USUARIO_CUENTA_JUEGO (id, usuario_id, plataforma_juego_id, identificador)
                    VALUES (v_cuenta_id, p_usuario_id, p_plataforma_id, p_identificador);
            END;
        END IF;
        
        UPDATE USUARIO SET actualizado_en = SYSTIMESTAMP WHERE id = p_usuario_id;
        COMMIT;
        
        RETURN '{"success": true, "cuenta_id": ' || v_cuenta_id || ', "message": "Cuenta de juego guardada correctamente"}';
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_UPSERT_CUENTA_JUEGO;
    
    FUNCTION FN_DELETE_CUENTA_JUEGO(
        p_usuario_id    IN VARCHAR2,
        p_cuenta_id     IN VARCHAR2
    ) RETURN CLOB
    IS
    BEGIN
        DELETE FROM USUARIO_CUENTA_JUEGO WHERE id = p_cuenta_id AND usuario_id = p_usuario_id;
        
        IF SQL%ROWCOUNT = 0 THEN
            RETURN '{"success": false, "error": "Cuenta de juego no encontrada"}';
        END IF;
        
        UPDATE USUARIO SET actualizado_en = SYSTIMESTAMP WHERE id = p_usuario_id;
        COMMIT;
        
        RETURN '{"success": true, "message": "Cuenta de juego eliminada correctamente"}';
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_DELETE_CUENTA_JUEGO;

    /*
    =========================================================================
    SECCIÓN 4: PREFERENCIAS
    =========================================================================
    */
    FUNCTION FN_GET_PREFERENCIAS(p_usuario_id IN VARCHAR2) RETURN CLOB
    IS
        v_desafios NUMBER(1);
    BEGIN
        BEGIN
            SELECT desafios_habilitados INTO v_desafios
            FROM USUARIO WHERE id = p_usuario_id AND deleted_at IS NULL;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "Usuario no encontrado"}';
        END;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'desafios_habilitados' VALUE CASE WHEN v_desafios = 1 THEN 'true' ELSE 'false' END
        );
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_GET_PREFERENCIAS;
    
    FUNCTION FN_UPDATE_PREFERENCIAS(
        p_usuario_id            IN VARCHAR2,
        p_desafios_habilitados  IN NUMBER DEFAULT NULL
    ) RETURN CLOB
    IS
    BEGIN
        UPDATE USUARIO SET
            desafios_habilitados = NVL(p_desafios_habilitados, desafios_habilitados),
            actualizado_en = SYSTIMESTAMP
        WHERE id = p_usuario_id AND deleted_at IS NULL;
        
        IF SQL%ROWCOUNT = 0 THEN
            RETURN '{"success": false, "error": "Usuario no encontrado"}';
        END IF;
        
        COMMIT;
        
        RETURN '{"success": true, "message": "Preferencias actualizadas correctamente"}';
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_UPDATE_PREFERENCIAS;

    /*
    =========================================================================
    SECCIÓN 5: CUENTA
    =========================================================================
    */
    FUNCTION FN_GET_CUENTA(p_usuario_id IN VARCHAR2) RETURN CLOB
    IS
        v_result CLOB;
    BEGIN
        SELECT JSON_OBJECT(
            'success' VALUE 'true',
            'nickname' VALUE u.nickname,
            'correo' VALUE p.correo,
            'creado_en' VALUE TO_CHAR(u.creado_en, 'YYYY-MM-DD"T"HH24:MI:SS'),
            'ultima_conexion' VALUE TO_CHAR(u.ultima_conexion, 'YYYY-MM-DD"T"HH24:MI:SS')
        )
        INTO v_result
        FROM USUARIO u
        LEFT JOIN PERSONA p ON u.persona_id = p.id
        WHERE u.id = p_usuario_id AND u.deleted_at IS NULL;
        
        RETURN v_result;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN '{"success": false, "error": "Usuario no encontrado"}';
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_GET_CUENTA;
    
    FUNCTION FN_UPDATE_PASSWORD(
        p_usuario_id        IN VARCHAR2,
        p_password_actual   IN VARCHAR2,
        p_password_nuevo    IN VARCHAR2
    ) RETURN CLOB
    IS
        v_password_actual VARCHAR2(255);
    BEGIN
        BEGIN
            SELECT password INTO v_password_actual
            FROM USUARIO WHERE id = p_usuario_id AND deleted_at IS NULL;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "Usuario no encontrado"}';
        END;
        
        -- Nota: En producción, usar bcrypt para comparar
        IF v_password_actual != p_password_actual THEN
            RETURN '{"success": false, "error": "La contraseña actual es incorrecta"}';
        END IF;
        
        IF LENGTH(p_password_nuevo) < 8 THEN
            RETURN '{"success": false, "error": "La nueva contraseña debe tener al menos 8 caracteres"}';
        END IF;
        
        UPDATE USUARIO SET
            password = p_password_nuevo,
            actualizado_en = SYSTIMESTAMP
        WHERE id = p_usuario_id;
        
        COMMIT;
        
        RETURN '{"success": true, "message": "Contraseña actualizada correctamente"}';
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_UPDATE_PASSWORD;

    /*
    =========================================================================
    SECCIÓN 6: SEGURIDAD
    =========================================================================
    */
    FUNCTION FN_GET_SEGURIDAD(p_usuario_id IN VARCHAR2) RETURN CLOB
    IS
        v_result CLOB;
    BEGIN
        SELECT JSON_OBJECT(
            'success' VALUE 'true',
            'correo' VALUE p.correo,
            'correo_paypal' VALUE p.correo_paypal,
            'telefono' VALUE p.telefono,
            'tiene_2fa' VALUE 'false'
        )
        INTO v_result
        FROM USUARIO u
        LEFT JOIN PERSONA p ON u.persona_id = p.id
        WHERE u.id = p_usuario_id AND u.deleted_at IS NULL;
        
        RETURN v_result;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN '{"success": false, "error": "Usuario no encontrado"}';
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_GET_SEGURIDAD;
    
    FUNCTION FN_UPDATE_SEGURIDAD(
        p_usuario_id    IN VARCHAR2,
        p_correo        IN VARCHAR2 DEFAULT NULL,
        p_correo_paypal IN VARCHAR2 DEFAULT NULL,
        p_telefono      IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB
    IS
        v_persona_id NUMBER;
    BEGIN
        BEGIN
            SELECT persona_id INTO v_persona_id
            FROM USUARIO WHERE id = p_usuario_id AND deleted_at IS NULL;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "Usuario no encontrado"}';
        END;
        
        -- Validar correo único si se cambia
        IF p_correo IS NOT NULL THEN
            DECLARE v_count NUMBER;
            BEGIN
                SELECT COUNT(*) INTO v_count FROM PERSONA
                WHERE correo = p_correo AND id != v_persona_id;
                IF v_count > 0 THEN
                    RETURN '{"success": false, "error": "El correo ya esta en uso"}';
                END IF;
            END;
        END IF;
        
        UPDATE PERSONA SET
            correo = NVL(p_correo, correo),
            correo_paypal = NVL(p_correo_paypal, correo_paypal),
            telefono = NVL(p_telefono, telefono),
            actualizado_en = SYSTIMESTAMP
        WHERE id = v_persona_id;
        
        UPDATE USUARIO SET actualizado_en = SYSTIMESTAMP WHERE id = p_usuario_id;
        COMMIT;
        
        RETURN '{"success": true, "message": "Configuracion de seguridad actualizada correctamente"}';
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_UPDATE_SEGURIDAD;

    /*
    =========================================================================
    SECCIÓN 7: RETIRO (PLACEHOLDER)
    =========================================================================
    */
    FUNCTION FN_GET_RETIRO(p_usuario_id IN VARCHAR2) RETURN CLOB
    IS
        v_saldo NUMBER(12,2);
        v_correo_paypal VARCHAR2(200);
    BEGIN
        BEGIN
            SELECT u.saldo, p.correo_paypal
            INTO v_saldo, v_correo_paypal
            FROM USUARIO u
            LEFT JOIN PERSONA p ON u.persona_id = p.id
            WHERE u.id = p_usuario_id AND u.deleted_at IS NULL;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "Usuario no encontrado"}';
        END;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'saldo_disponible' VALUE v_saldo,
            'correo_paypal' VALUE v_correo_paypal,
            'minimo_retiro' VALUE 10,
            'comision_retiro' VALUE 2.5
        );
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_GET_RETIRO;

    /*
    =========================================================================
    CONFIGURACIÓN COMPLETA
    =========================================================================
    */
    FUNCTION FN_GET_COMPLETA(p_usuario_id IN VARCHAR2) RETURN CLOB
    IS
        v_personal      CLOB;
        v_social        CLOB;
        v_juegos        CLOB;
        v_preferencias  CLOB;
        v_cuenta        CLOB;
        v_seguridad     CLOB;
        v_retiro        CLOB;
    BEGIN
        v_personal := FN_GET_PERSONAL(p_usuario_id);
        v_social := FN_GET_SOCIAL(p_usuario_id);
        v_juegos := FN_GET_JUEGOS(p_usuario_id);
        v_preferencias := FN_GET_PREFERENCIAS(p_usuario_id);
        v_cuenta := FN_GET_CUENTA(p_usuario_id);
        v_seguridad := FN_GET_SEGURIDAD(p_usuario_id);
        v_retiro := FN_GET_RETIRO(p_usuario_id);
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'personal' VALUE v_personal FORMAT JSON,
            'social' VALUE v_social FORMAT JSON,
            'juegos' VALUE v_juegos FORMAT JSON,
            'preferencias' VALUE v_preferencias FORMAT JSON,
            'cuenta' VALUE v_cuenta FORMAT JSON,
            'seguridad' VALUE v_seguridad FORMAT JSON,
            'retiro' VALUE v_retiro FORMAT JSON
        );
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_GET_COMPLETA;

END PKG_CONFIG;
/

PROMPT >>> Cuerpo del paquete PKG_CONFIG creado exitosamente <<<
