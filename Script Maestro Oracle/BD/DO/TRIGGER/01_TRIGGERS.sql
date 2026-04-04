/*
============================================================================
  Script: 01_TRIGGERS.sql
  Descripcion: Creacion de triggers para auditorias y logica automatica
  Proyecto: Plataforma eSports - Base de datos OLTP
  Fecha: 16/Marzo/2026
============================================================================
*/

-- =========================================================================
-- TABLA DE AUDITORIA (usada por los triggers)
-- =========================================================================
CREATE TABLE AUDITORIA_LOG (
    ID              NUMBER          NOT NULL,
    TABLA           VARCHAR2(100)   NOT NULL,
    OPERACION       VARCHAR2(20)    NOT NULL,
    REGISTRO_ID     NUMBER,
    USUARIO_BD      VARCHAR2(100)   DEFAULT USER,
    DETALLE         VARCHAR2(4000),
    FECHA           TIMESTAMP       DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT PK_AUDITORIA_LOG PRIMARY KEY (ID)
);
CREATE SEQUENCE SEQ_AUDITORIA_LOG START WITH 1 INCREMENT BY 1 NOCACHE;

-- =========================================================================
-- TRIGGER 1: Auditoria de cambios en USUARIO
-- Se dispara en INSERT, UPDATE y DELETE
-- =========================================================================
CREATE OR REPLACE TRIGGER TRG_AUDITORIA_USUARIO
AFTER INSERT OR UPDATE OR DELETE ON USUARIO
FOR EACH ROW
DECLARE
    v_operacion VARCHAR2(20);
    v_detalle   VARCHAR2(4000);
    v_registro_id NUMBER;
BEGIN
    IF INSERTING THEN
        v_operacion := 'INSERT';
        v_detalle := 'Nuevo usuario: ' || :NEW.NICKNAME || ' (ID: ' || :NEW.ID || ')';
        v_registro_id := :NEW.ID;
    ELSIF UPDATING THEN
        v_operacion := 'UPDATE';
        v_detalle := 'Usuario actualizado: ' || :NEW.NICKNAME || 
                     ' | Estado: ' || NVL(:OLD.ESTADO, 'N/A') || ' -> ' || NVL(:NEW.ESTADO, 'N/A') ||
                     ' | XP: ' || :OLD.XP || ' -> ' || :NEW.XP ||
                     ' | Saldo: ' || :OLD.SALDO || ' -> ' || :NEW.SALDO;
        v_registro_id := :NEW.ID;
    ELSIF DELETING THEN
        v_operacion := 'DELETE';
        v_detalle := 'Usuario eliminado: ' || :OLD.NICKNAME || ' (ID: ' || :OLD.ID || ')';
        v_registro_id := :OLD.ID;
    END IF;
    
    INSERT INTO AUDITORIA_LOG (ID, TABLA, OPERACION, REGISTRO_ID, DETALLE)
    VALUES (
        SEQ_AUDITORIA_LOG.NEXTVAL, 'USUARIO', v_operacion,
        v_registro_id,
        v_detalle
    );
END;
/

-- =========================================================================
-- TRIGGER 2: Actualizar campo ACTUALIZADO_EN automaticamente en USUARIO
-- =========================================================================
CREATE OR REPLACE TRIGGER TRG_USUARIO_ACTUALIZADO
BEFORE UPDATE ON USUARIO
FOR EACH ROW
BEGIN
    :NEW.ACTUALIZADO_EN := SYSTIMESTAMP;
END;
/

-- =========================================================================
-- TRIGGER 3: Actualizar campo ACTUALIZADO_EN automaticamente en TORNEO
-- =========================================================================
CREATE OR REPLACE TRIGGER TRG_TORNEO_ACTUALIZADO
BEFORE UPDATE ON TORNEO
FOR EACH ROW
BEGIN
    :NEW.ACTUALIZADO_EN := SYSTIMESTAMP;
END;
/

-- =========================================================================
-- TRIGGER 4: Auditoria de ordenes de tienda
-- =========================================================================
CREATE OR REPLACE TRIGGER TRG_AUDITORIA_ORDEN
AFTER INSERT OR UPDATE ON TIENDA_ORDEN
FOR EACH ROW
DECLARE
    v_operacion VARCHAR2(20);
    v_detalle   VARCHAR2(4000);
BEGIN
    IF INSERTING THEN
        v_operacion := 'INSERT';
        v_detalle := 'Nueva orden #' || :NEW.ID || 
                     ' | Item: ' || :NEW.ITEM_ID || 
                     ' | Monto: $' || :NEW.MONTO ||
                     ' | Usuario: ' || :NEW.USUARIO_ID;
    ELSIF UPDATING THEN
        v_operacion := 'UPDATE';
        v_detalle := 'Orden #' || :NEW.ID || 
                     ' | Estado: ' || NVL(:OLD.ESTADO, 'N/A') || ' -> ' || NVL(:NEW.ESTADO, 'N/A') ||
                     ' | Monto: $' || :NEW.MONTO;
    END IF;
    
    INSERT INTO AUDITORIA_LOG (ID, TABLA, OPERACION, REGISTRO_ID, DETALLE)
    VALUES (
        SEQ_AUDITORIA_LOG.NEXTVAL, 'TIENDA_ORDEN', v_operacion, :NEW.ID, v_detalle
    );
END;
/

-- =========================================================================
-- TRIGGER 5: Validar que la fecha de fin de registro sea posterior
--            a la fecha de inicio de registro en TORNEO
-- =========================================================================
CREATE OR REPLACE TRIGGER TRG_VALIDAR_FECHAS_TORNEO
BEFORE INSERT OR UPDATE ON TORNEO
FOR EACH ROW
BEGIN
    IF :NEW.FECHA_FIN_REGISTRO IS NOT NULL AND :NEW.FECHA_INICIO_REGISTRO IS NOT NULL THEN
        IF :NEW.FECHA_FIN_REGISTRO < :NEW.FECHA_INICIO_REGISTRO THEN
            RAISE_APPLICATION_ERROR(-20010, 
                'La fecha de fin de registro no puede ser anterior a la fecha de inicio.');
        END IF;
    END IF;
    
    IF :NEW.FECHA_INICIO_TORNEO IS NOT NULL AND :NEW.FECHA_FIN_REGISTRO IS NOT NULL THEN
        IF :NEW.FECHA_INICIO_TORNEO < :NEW.FECHA_FIN_REGISTRO THEN
            RAISE_APPLICATION_ERROR(-20011, 
                'La fecha de inicio del torneo no puede ser anterior a la fecha de fin de registro.');
        END IF;
    END IF;
END;
/

-- =========================================================================
-- TRIGGER 6: Actualizar fondo de premios al confirmar inscripción
-- Migrado de PostgreSQL: trigger_actualizar_fondo_premios()
-- Se dispara cuando una inscripción cambia a estado 'confirmada'
-- =========================================================================
CREATE OR REPLACE TRIGGER TRG_ACTUALIZAR_FONDO_PREMIOS
AFTER INSERT OR UPDATE ON TORNEO_INSCRIPCION
FOR EACH ROW
DECLARE
    v_cuota             NUMBER;
    v_comision_pct      NUMBER(5,2);
    v_inscritos         NUMBER;
    v_fondo_total       NUMBER(12,2);
    v_comision_total    NUMBER(12,2);
    v_fondo_despues     NUMBER(12,2);
    v_estado_conf_id    NUMBER;
BEGIN
    -- Obtener el ID del estado 'confirmada'
    BEGIN
        SELECT ID INTO v_estado_conf_id
        FROM CATALOGO_ESTADO_INSCRIPCION 
        WHERE VALOR = 'confirmada';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            -- Si no existe el estado, salir sin hacer nada
            RETURN;
    END;
    
    -- Solo procesar si la inscripción es confirmada
    IF :NEW.ESTADO_ID = v_estado_conf_id THEN
        -- Obtener cuota y comisión del torneo
        BEGIN
            SELECT CUOTA, COMISION_PORCENTAJE 
            INTO v_cuota, v_comision_pct
            FROM TORNEO_PREMIOS 
            WHERE TORNEO_ID = :NEW.TORNEO_ID;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                -- Si no hay registro de premios, no hacer nada
                RETURN;
        END;
        
        -- Contar inscritos confirmados
        SELECT COUNT(*) INTO v_inscritos
        FROM TORNEO_INSCRIPCION
        WHERE TORNEO_ID = :NEW.TORNEO_ID 
          AND ESTADO_ID = v_estado_conf_id;
        
        -- Calcular fondos
        v_fondo_total := NVL(v_cuota, 0) * v_inscritos;
        v_comision_total := v_fondo_total * NVL(v_comision_pct, 0) / 100;
        v_fondo_despues := v_fondo_total - v_comision_total;
        
        -- Actualizar torneo_premios
        UPDATE TORNEO_PREMIOS
        SET FONDO_TOTAL = v_fondo_total,
            COMISION_TOTAL = v_comision_total,
            FONDO_DESPUES_COMISION = v_fondo_despues
        WHERE TORNEO_ID = :NEW.TORNEO_ID;
    END IF;
END;
/

PROMPT >>> Triggers creados exitosamente <<<
