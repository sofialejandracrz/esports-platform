/*
============================================================================
  Script: DROP_ALL.sql
  Descripcion: Elimina todos los objetos de la base de datos eSports
  Proyecto: Plataforma eSports - Base de datos OLTP
  Fecha: 16/Marzo/2026
  ADVERTENCIA: Este script elimina TODOS los datos y objetos
============================================================================
*/

-- =========================================================================
-- 0. CAMBIAR AL ESQUEMA ESPORTS_APP
-- =========================================================================
ALTER SESSION SET CURRENT_SCHEMA = ESPORTS_APP;

-- =========================================================================
-- 1. ELIMINAR TRIGGERS
-- =========================================================================
BEGIN
    FOR t IN (SELECT TRIGGER_NAME FROM ALL_TRIGGERS WHERE OWNER = 'ESPORTS_APP') LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP TRIGGER ESPORTS_APP.' || t.TRIGGER_NAME;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
    END LOOP;
END;
/
PROMPT >>> Triggers eliminados <<<

-- =========================================================================
-- 2. ELIMINAR PAQUETES
-- =========================================================================
BEGIN
    FOR p IN (SELECT OBJECT_NAME FROM ALL_OBJECTS WHERE OWNER = 'ESPORTS_APP' AND OBJECT_TYPE = 'PACKAGE') LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP PACKAGE ESPORTS_APP.' || p.OBJECT_NAME;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
    END LOOP;
END;
/
PROMPT >>> Paquetes eliminados <<<

-- =========================================================================
-- 3. ELIMINAR VISTAS
-- =========================================================================
BEGIN
    FOR v IN (SELECT VIEW_NAME FROM ALL_VIEWS WHERE OWNER = 'ESPORTS_APP') LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP VIEW ESPORTS_APP.' || v.VIEW_NAME;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
    END LOOP;
END;
/
PROMPT >>> Vistas eliminadas <<<

-- =========================================================================
-- 4. ELIMINAR TABLAS (con CASCADE CONSTRAINTS)
-- =========================================================================
BEGIN
    FOR t IN (SELECT TABLE_NAME FROM ALL_TABLES WHERE OWNER = 'ESPORTS_APP') LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP TABLE ESPORTS_APP.' || t.TABLE_NAME || ' CASCADE CONSTRAINTS PURGE';
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
    END LOOP;
END;
/
PROMPT >>> Tablas eliminadas <<<

-- =========================================================================
-- 5. ELIMINAR SECUENCIAS
-- =========================================================================
BEGIN
    FOR s IN (SELECT SEQUENCE_NAME FROM ALL_SEQUENCES WHERE SEQUENCE_OWNER = 'ESPORTS_APP') LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP SEQUENCE ESPORTS_APP.' || s.SEQUENCE_NAME;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
    END LOOP;
END;
/
PROMPT >>> Secuencias eliminadas <<<

PROMPT >>> Todos los objetos han sido eliminados exitosamente <<<
