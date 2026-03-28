/*
============================================================================
  Script: PKG_ESPORTS_BODY.sql
  Descripcion: Cuerpo del paquete PKG_ESPORTS
               Implementacion de 5 procedimientos y 2 funciones
  Proyecto: Plataforma eSports - Base de datos OLTP
  Fecha: 16/Marzo/2026
============================================================================
*/

CREATE OR REPLACE PACKAGE BODY PKG_ESPORTS AS

    /*
    =========================================================================
    SP1: REGISTRAR USUARIO
    - Crea un registro en PERSONA
    - Crea un registro en USUARIO con rol_id = 2 (usuario)
    - Usa transaccion (SAVEPOINT/ROLLBACK/COMMIT)
    - Manejo de excepciones
    =========================================================================
    */
    PROCEDURE SP_REGISTRAR_USUARIO(
        p_p_nombre      IN VARCHAR2,
        p_s_nombre      IN VARCHAR2,
        p_p_apellido    IN VARCHAR2,
        p_s_apellido    IN VARCHAR2,
        p_correo        IN VARCHAR2,
        p_fecha_nac     IN DATE,
        p_genero_id     IN NUMBER,
        p_nickname      IN VARCHAR2,
        p_password      IN VARCHAR2,
        p_usuario_id    OUT NUMBER
    ) IS
        v_persona_id    NUMBER;
        v_rol_usuario   NUMBER;
        v_avatar_id     NUMBER;
        e_correo_dup    EXCEPTION;
        PRAGMA EXCEPTION_INIT(e_correo_dup, -1); -- ORA-00001: unique constraint violated
    BEGIN
        SAVEPOINT sp_registro;
        
        -- Obtener el rol 'usuario'
        SELECT ID INTO v_rol_usuario FROM CATALOGO_ROL WHERE VALOR = 'usuario';
        
        -- Obtener un avatar aleatorio
        SELECT ID INTO v_avatar_id FROM (
            SELECT ID FROM CATALOGO_AVATAR WHERE DISPONIBLE = 1 ORDER BY DBMS_RANDOM.VALUE
        ) WHERE ROWNUM = 1;
        
        -- Crear persona
        v_persona_id := SEQ_PERSONA.NEXTVAL;
        INSERT INTO PERSONA (
            ID, P_NOMBRE, S_NOMBRE, P_APELLIDO, S_APELLIDO,
            CORREO, FECHA_NACIMIENTO, GENERO_ID
        ) VALUES (
            v_persona_id, p_p_nombre, p_s_nombre, p_p_apellido, p_s_apellido,
            p_correo, p_fecha_nac, p_genero_id
        );
        
        -- Crear usuario
        p_usuario_id := SEQ_USUARIO.NEXTVAL;
        INSERT INTO USUARIO (
            ID, NICKNAME, PASSWORD, ESTADO, XP, SALDO, CREDITOS,
            DESAFIOS_HABILITADOS, PERSONA_ID, ROL_ID, AVATAR_ID
        ) VALUES (
            p_usuario_id, p_nickname, p_password, 'activo', 0, 0, 0,
            1, v_persona_id, v_rol_usuario, v_avatar_id
        );
        
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Usuario registrado exitosamente. ID: ' || p_usuario_id);
        
    EXCEPTION
        WHEN e_correo_dup THEN
            ROLLBACK TO sp_registro;
            p_usuario_id := -1;
            DBMS_OUTPUT.PUT_LINE('ERROR: El correo o nickname ya existe.');
            RAISE_APPLICATION_ERROR(-20001, 'El correo o nickname ya existe.');
        WHEN NO_DATA_FOUND THEN
            ROLLBACK TO sp_registro;
            p_usuario_id := -1;
            DBMS_OUTPUT.PUT_LINE('ERROR: No se encontraron datos de catalogo necesarios.');
            RAISE_APPLICATION_ERROR(-20002, 'No se encontraron datos de catalogo necesarios.');
        WHEN OTHERS THEN
            ROLLBACK TO sp_registro;
            p_usuario_id := -1;
            DBMS_OUTPUT.PUT_LINE('ERROR: ' || SQLERRM);
            RAISE_APPLICATION_ERROR(-20099, 'Error inesperado: ' || SQLERRM);
    END SP_REGISTRAR_USUARIO;

    /*
    =========================================================================
    SP2: INSCRIBIR EN TORNEO
    - Valida existencia del torneo
    - Valida que no este cerrado
    - Valida que el usuario no este ya inscrito
    - Valida capacidad disponible
    =========================================================================
    */
    PROCEDURE SP_INSCRIBIR_EN_TORNEO(
        p_torneo_id     IN NUMBER,
        p_usuario_id    IN NUMBER,
        p_resultado     OUT VARCHAR2
    ) IS
        v_cerrado       NUMBER(1);
        v_capacidad     NUMBER;
        v_inscritos     NUMBER;
        v_ya_inscrito   NUMBER;
        v_estado_conf   NUMBER;
    BEGIN
        -- Validar que el torneo existe y no esta cerrado
        SELECT CERRADO, NVL(CAPACIDAD, 9999)
        INTO v_cerrado, v_capacidad
        FROM TORNEO WHERE ID = p_torneo_id;
        
        IF v_cerrado = 1 THEN
            p_resultado := 'ERROR: El torneo esta cerrado.';
            RETURN;
        END IF;
        
        -- Validar capacidad
        SELECT COUNT(*) INTO v_inscritos
        FROM TORNEO_INSCRIPCION WHERE TORNEO_ID = p_torneo_id;
        
        IF v_inscritos >= v_capacidad THEN
            p_resultado := 'ERROR: El torneo ha alcanzado su capacidad maxima.';
            RETURN;
        END IF;
        
        -- Validar que no este ya inscrito
        SELECT COUNT(*) INTO v_ya_inscrito
        FROM TORNEO_INSCRIPCION 
        WHERE TORNEO_ID = p_torneo_id AND USUARIO_ID = p_usuario_id;
        
        IF v_ya_inscrito > 0 THEN
            p_resultado := 'ERROR: El usuario ya esta inscrito en este torneo.';
            RETURN;
        END IF;
        
        -- Obtener estado 'confirmada'
        SELECT ID INTO v_estado_conf
        FROM CATALOGO_ESTADO_INSCRIPCION WHERE VALOR = 'confirmada';
        
        -- Insertar inscripcion
        INSERT INTO TORNEO_INSCRIPCION (ID, TORNEO_ID, USUARIO_ID, ESTADO_ID)
        VALUES (SEQ_TORNEO_INSCRIPCION.NEXTVAL, p_torneo_id, p_usuario_id, v_estado_conf);
        
        COMMIT;
        p_resultado := 'OK: Usuario inscrito exitosamente en el torneo.';
        
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            p_resultado := 'ERROR: Torneo no encontrado (ID: ' || p_torneo_id || ').';
        WHEN OTHERS THEN
            ROLLBACK;
            p_resultado := 'ERROR: ' || SQLERRM;
    END SP_INSCRIBIR_EN_TORNEO;

    /*
    =========================================================================
    SP3: PROCESAR COMPRA
    - Crea orden en TIENDA_ORDEN
    - Actualiza creditos/saldo del usuario si corresponde
    - Registra transaccion
    =========================================================================
    */
    PROCEDURE SP_PROCESAR_COMPRA(
        p_usuario_id    IN NUMBER,
        p_item_id       IN NUMBER,
        p_paypal_id     IN VARCHAR2,
        p_resultado     OUT VARCHAR2
    ) IS
        v_precio            NUMBER(12,2);
        v_creditos_otorgados NUMBER;
        v_tipo_item         VARCHAR2(100);
        v_tipo_trans_id     NUMBER;
        v_origen_id         NUMBER;
        v_orden_id          NUMBER;
    BEGIN
        SAVEPOINT sp_compra;
        
        -- Obtener informacion del item
        SELECT ti.PRECIO, ti.CREDITOS_OTORGADOS, cti.VALOR
        INTO v_precio, v_creditos_otorgados, v_tipo_item
        FROM TIENDA_ITEM ti
        JOIN CATALOGO_TIPO_ITEM cti ON ti.TIPO_ID = cti.ID
        WHERE ti.ID = p_item_id;
        
        -- Crear orden
        v_orden_id := SEQ_TIENDA_ORDEN.NEXTVAL;
        INSERT INTO TIENDA_ORDEN (
            ID, PAYPAL_ORDER_ID, MONTO, DIVISA, ESTADO,
            METADATA, USUARIO_ID, ITEM_ID, COMPLETADO_EN
        ) VALUES (
            v_orden_id, p_paypal_id, v_precio, 'USD', 'completado',
            '{"procesado": true}', p_usuario_id, p_item_id, SYSTIMESTAMP
        );
        
        -- Si es item de creditos, otorgar creditos al usuario
        IF v_tipo_item = 'creditos' AND v_creditos_otorgados IS NOT NULL THEN
            UPDATE USUARIO 
            SET CREDITOS = CREDITOS + v_creditos_otorgados,
                ACTUALIZADO_EN = SYSTIMESTAMP
            WHERE ID = p_usuario_id;
            
            -- Registrar transaccion de creditos
            SELECT ID INTO v_tipo_trans_id FROM CATALOGO_TRANSACCION_TIPO WHERE VALOR = 'creditos';
            SELECT ID INTO v_origen_id FROM CATALOGO_ORIGEN_TRANSACCION WHERE VALOR = 'compra';
            
            INSERT INTO TRANSACCION (ID, MONTO, DESCRIPCION, USUARIO_ID, TIPO_ID, ORIGEN_ID)
            VALUES (
                SEQ_TRANSACCION.NEXTVAL, v_precio, 
                'Compra de ' || v_creditos_otorgados || ' creditos',
                p_usuario_id, v_tipo_trans_id, v_origen_id
            );
        END IF;
        
        -- Si es item de saldo (membresia, servicio)
        IF v_tipo_item IN ('membresia', 'servicio') THEN
            SELECT ID INTO v_tipo_trans_id FROM CATALOGO_TRANSACCION_TIPO WHERE VALOR = 'saldo';
            SELECT ID INTO v_origen_id FROM CATALOGO_ORIGEN_TRANSACCION WHERE VALOR = 'compra';
            
            INSERT INTO TRANSACCION (ID, MONTO, DESCRIPCION, USUARIO_ID, TIPO_ID, ORIGEN_ID)
            VALUES (
                SEQ_TRANSACCION.NEXTVAL, v_precio,
                'Compra de ' || v_tipo_item || ' - Orden #' || v_orden_id,
                p_usuario_id, v_tipo_trans_id, v_origen_id
            );
        END IF;
        
        COMMIT;
        p_resultado := 'OK: Compra procesada exitosamente. Orden #' || v_orden_id;
        
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            ROLLBACK TO sp_compra;
            p_resultado := 'ERROR: Item no encontrado (ID: ' || p_item_id || ').';
        WHEN OTHERS THEN
            ROLLBACK TO sp_compra;
            p_resultado := 'ERROR: ' || SQLERRM;
    END SP_PROCESAR_COMPRA;

    /*
    =========================================================================
    SP4: ACTUALIZAR ESTADISTICAS
    - Si el registro existe, lo actualiza sumando las nuevas estadisticas
    - Si no existe, lo crea
    - Usa MERGE (UPSERT)
    =========================================================================
    */
    PROCEDURE SP_ACTUALIZAR_ESTADISTICAS(
        p_usuario_id    IN NUMBER,
        p_juego_id      IN NUMBER,
        p_victorias     IN NUMBER,
        p_derrotas      IN NUMBER,
        p_empates       IN NUMBER,
        p_horas         IN NUMBER,
        p_rango         IN VARCHAR2
    ) IS
    BEGIN
        MERGE INTO USUARIO_ESTADISTICAS_JUEGO dest
        USING (
            SELECT p_usuario_id AS USUARIO_ID, p_juego_id AS JUEGO_ID FROM DUAL
        ) src
        ON (dest.USUARIO_ID = src.USUARIO_ID AND dest.JUEGO_ID = src.JUEGO_ID)
        WHEN MATCHED THEN
            UPDATE SET
                dest.VICTORIAS = dest.VICTORIAS + p_victorias,
                dest.DERROTAS = dest.DERROTAS + p_derrotas,
                dest.EMPATES = dest.EMPATES + p_empates,
                dest.HORAS_JUGADAS = dest.HORAS_JUGADAS + p_horas,
                dest.NIVEL_RANGO = NVL(p_rango, dest.NIVEL_RANGO),
                dest.ACTUALIZADO_EN = SYSTIMESTAMP
        WHEN NOT MATCHED THEN
            INSERT (ID, VICTORIAS, DERROTAS, EMPATES, NIVEL_RANGO, HORAS_JUGADAS, USUARIO_ID, JUEGO_ID)
            VALUES (SEQ_USUARIO_ESTADISTICAS_JUEGO.NEXTVAL, p_victorias, p_derrotas, p_empates, p_rango, p_horas, p_usuario_id, p_juego_id);
        
        -- Actualizar XP del usuario (10 XP por victoria, 3 por derrota, 5 por empate)
        UPDATE USUARIO 
        SET XP = XP + (p_victorias * 10) + (p_derrotas * 3) + (p_empates * 5),
            ACTUALIZADO_EN = SYSTIMESTAMP
        WHERE ID = p_usuario_id;
        
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Estadisticas actualizadas para usuario ' || p_usuario_id || ' en juego ' || p_juego_id);
        
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            DBMS_OUTPUT.PUT_LINE('ERROR actualizando estadisticas: ' || SQLERRM);
            RAISE_APPLICATION_ERROR(-20003, 'Error al actualizar estadisticas: ' || SQLERRM);
    END SP_ACTUALIZAR_ESTADISTICAS;

    /*
    =========================================================================
    SP5: FINALIZAR TORNEO
    - Cambia el estado del torneo a 'terminado' y marca como cerrado
    - Registra posiciones (1er y 2do lugar)
    - Otorga trofeos a los ganadores
    - Distribuye premios si hay fondo
    =========================================================================
    */
    PROCEDURE SP_FINALIZAR_TORNEO(
        p_torneo_id     IN NUMBER,
        p_ganador_id    IN NUMBER,
        p_segundo_id    IN NUMBER,
        p_resultado     OUT VARCHAR2
    ) IS
        v_estado_terminado  NUMBER;
        v_tipo_trofeo       VARCHAR2(100);
        v_fondo_total       NUMBER(12,2);
        v_premio_1          NUMBER(12,2);
        v_premio_2          NUMBER(12,2);
        v_pct_1             NUMBER(5,2);
        v_pct_2             NUMBER(5,2);
        v_tipo_trans_premio NUMBER;
        v_origen_torneo     NUMBER;
    BEGIN
        SAVEPOINT sp_finalizar;
        
        -- Obtener estado 'terminado'
        SELECT ID INTO v_estado_terminado 
        FROM CATALOGO_ESTADO_TORNEO WHERE VALOR = 'terminado';
        
        -- Actualizar torneo
        UPDATE TORNEO 
        SET ESTADO_ID = v_estado_terminado, 
            CERRADO = 1,
            ACTUALIZADO_EN = SYSTIMESTAMP
        WHERE ID = p_torneo_id;
        
        IF SQL%ROWCOUNT = 0 THEN
            p_resultado := 'ERROR: Torneo no encontrado.';
            RETURN;
        END IF;
        
        -- Registrar resultados
        INSERT INTO TORNEO_RESULTADOS (ID, POSICION, TORNEO_ID, USUARIO_ID)
        VALUES (SEQ_TORNEO_RESULTADOS.NEXTVAL, 1, p_torneo_id, p_ganador_id);
        
        IF p_segundo_id IS NOT NULL THEN
            INSERT INTO TORNEO_RESULTADOS (ID, POSICION, TORNEO_ID, USUARIO_ID)
            VALUES (SEQ_TORNEO_RESULTADOS.NEXTVAL, 2, p_torneo_id, p_segundo_id);
        END IF;
        
        -- Obtener tipo de trofeo del torneo
        BEGIN
            SELECT ctt.TIPO_TROFEO INTO v_tipo_trofeo
            FROM TORNEO t
            JOIN CATALOGO_TIPO_TORNEO ctt ON t.TIPO_TORNEO_ID = ctt.ID
            WHERE t.ID = p_torneo_id;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                v_tipo_trofeo := 'trofeo_general';
        END;
        
        -- Otorgar trofeos
        INSERT INTO USUARIO_TROFEOS (ID, TIPO_TROFEO, USUARIO_ID, TORNEO_ID)
        VALUES (SEQ_USUARIO_TROFEOS.NEXTVAL, v_tipo_trofeo, p_ganador_id, p_torneo_id);
        
        -- Distribuir premios si hay fondo
        BEGIN
            SELECT NVL(FONDO_DESPUES_COMISION, 0), NVL(GANADOR1_PORCENTAJE, 70), NVL(GANADOR2_PORCENTAJE, 30)
            INTO v_fondo_total, v_pct_1, v_pct_2
            FROM TORNEO_PREMIOS WHERE TORNEO_ID = p_torneo_id;
            
            IF v_fondo_total > 0 THEN
                v_premio_1 := ROUND(v_fondo_total * v_pct_1 / 100, 2);
                v_premio_2 := ROUND(v_fondo_total * v_pct_2 / 100, 2);
                
                -- Acreditar al ganador
                UPDATE USUARIO SET SALDO = SALDO + v_premio_1, ACTUALIZADO_EN = SYSTIMESTAMP
                WHERE ID = p_ganador_id;
                
                SELECT ID INTO v_tipo_trans_premio FROM CATALOGO_TRANSACCION_TIPO WHERE VALOR = 'premio';
                SELECT ID INTO v_origen_torneo FROM CATALOGO_ORIGEN_TRANSACCION WHERE VALOR = 'torneo';
                
                INSERT INTO TRANSACCION (ID, MONTO, DESCRIPCION, USUARIO_ID, TIPO_ID, ORIGEN_ID)
                VALUES (SEQ_TRANSACCION.NEXTVAL, v_premio_1, 'Premio 1er lugar - Torneo #' || p_torneo_id,
                        p_ganador_id, v_tipo_trans_premio, v_origen_torneo);
                
                -- Acreditar al segundo lugar
                IF p_segundo_id IS NOT NULL THEN
                    UPDATE USUARIO SET SALDO = SALDO + v_premio_2, ACTUALIZADO_EN = SYSTIMESTAMP
                    WHERE ID = p_segundo_id;
                    
                    INSERT INTO TRANSACCION (ID, MONTO, DESCRIPCION, USUARIO_ID, TIPO_ID, ORIGEN_ID)
                    VALUES (SEQ_TRANSACCION.NEXTVAL, v_premio_2, 'Premio 2do lugar - Torneo #' || p_torneo_id,
                            p_segundo_id, v_tipo_trans_premio, v_origen_torneo);
                END IF;
            END IF;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                NULL; -- No hay premios configurados
        END;
        
        -- Otorgar XP a los participantes
        UPDATE USUARIO SET XP = XP + 50, ACTUALIZADO_EN = SYSTIMESTAMP
        WHERE ID = p_ganador_id;
        
        IF p_segundo_id IS NOT NULL THEN
            UPDATE USUARIO SET XP = XP + 25, ACTUALIZADO_EN = SYSTIMESTAMP
            WHERE ID = p_segundo_id;
        END IF;
        
        COMMIT;
        p_resultado := 'OK: Torneo #' || p_torneo_id || ' finalizado exitosamente.';
        
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK TO sp_finalizar;
            p_resultado := 'ERROR: ' || SQLERRM;
    END SP_FINALIZAR_TORNEO;

    /*
    =========================================================================
    FN1: CALCULAR NIVEL
    - Basado en el XP del usuario retorna el nivel
    - 0-99: Bronce
    - 100-499: Plata
    - 500-999: Oro
    - 1000-2499: Platino
    - 2500-4999: Diamante
    - 5000+: Maestro
    =========================================================================
    */
    FUNCTION FN_CALCULAR_NIVEL(
        p_usuario_id    IN NUMBER
    ) RETURN VARCHAR2 IS
        v_xp    NUMBER;
        v_nivel VARCHAR2(50);
    BEGIN
        SELECT XP INTO v_xp FROM USUARIO WHERE ID = p_usuario_id;
        
        v_nivel := CASE
            WHEN v_xp >= 5000 THEN 'Maestro'
            WHEN v_xp >= 2500 THEN 'Diamante'
            WHEN v_xp >= 1000 THEN 'Platino'
            WHEN v_xp >= 500  THEN 'Oro'
            WHEN v_xp >= 100  THEN 'Plata'
            ELSE 'Bronce'
        END;
        
        RETURN v_nivel;
        
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN 'USUARIO_NO_ENCONTRADO';
        WHEN OTHERS THEN
            RETURN 'ERROR: ' || SQLERRM;
    END FN_CALCULAR_NIVEL;

    /*
    =========================================================================
    FN2: INGRESOS TIENDA
    - Calcula el total de ingresos de ordenes completadas
      en un rango de fechas dado
    =========================================================================
    */
    FUNCTION FN_INGRESOS_TIENDA(
        p_fecha_inicio  IN DATE,
        p_fecha_fin     IN DATE
    ) RETURN NUMBER IS
        v_total NUMBER(12,2);
    BEGIN
        SELECT NVL(SUM(MONTO), 0) INTO v_total
        FROM TIENDA_ORDEN
        WHERE ESTADO = 'completado'
          AND CREADO_EN >= CAST(p_fecha_inicio AS TIMESTAMP)
          AND CREADO_EN <= CAST(p_fecha_fin AS TIMESTAMP) + INTERVAL '1' DAY;
        
        RETURN v_total;
        
    EXCEPTION
        WHEN OTHERS THEN
            RETURN -1;
    END FN_INGRESOS_TIENDA;

END PKG_ESPORTS;
/

PROMPT >>> Cuerpo del paquete PKG_ESPORTS creado exitosamente <<<
