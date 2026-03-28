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
-- 1. ELIMINAR TRIGGERS
-- =========================================================================
BEGIN
    FOR t IN (SELECT TRIGGER_NAME FROM USER_TRIGGERS) LOOP
        EXECUTE IMMEDIATE 'DROP TRIGGER ' || t.TRIGGER_NAME;
    END LOOP;
END;
/
PROMPT >>> Triggers eliminados <<<

-- =========================================================================
-- 2. ELIMINAR PAQUETES
-- =========================================================================
BEGIN
    FOR p IN (SELECT OBJECT_NAME FROM USER_OBJECTS WHERE OBJECT_TYPE = 'PACKAGE') LOOP
        EXECUTE IMMEDIATE 'DROP PACKAGE ' || p.OBJECT_NAME;
    END LOOP;
END;
/
PROMPT >>> Paquetes eliminados <<<

-- =========================================================================
-- 3. ELIMINAR VISTAS
-- =========================================================================
BEGIN
    FOR v IN (SELECT VIEW_NAME FROM USER_VIEWS) LOOP
        EXECUTE IMMEDIATE 'DROP VIEW ' || v.VIEW_NAME;
    END LOOP;
END;
/
PROMPT >>> Vistas eliminadas <<<

-- =========================================================================
-- 4. ELIMINAR TABLAS (con CASCADE CONSTRAINTS)
-- =========================================================================
BEGIN
    FOR t IN (SELECT TABLE_NAME FROM USER_TABLES) LOOP
        EXECUTE IMMEDIATE 'DROP TABLE ' || t.TABLE_NAME || ' CASCADE CONSTRAINTS PURGE';
    END LOOP;
END;
/
PROMPT >>> Tablas eliminadas <<<

-- =========================================================================
-- 5. ELIMINAR SECUENCIAS
-- =========================================================================
BEGIN
    FOR s IN (SELECT SEQUENCE_NAME FROM USER_SEQUENCES) LOOP
        EXECUTE IMMEDIATE 'DROP SEQUENCE ' || s.SEQUENCE_NAME;
    END LOOP;
END;
/
PROMPT >>> Secuencias eliminadas <<<

PROMPT >>> Todos los objetos han sido eliminados exitosamente <<<
