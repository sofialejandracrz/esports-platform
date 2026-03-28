/*
============================================================================
  Script: 01_USUARIOS_ROLES.sql
  Descripcion: Creacion de tablespace, usuario y asignacion de roles/privilegios
  Proyecto: Plataforma eSports - Base de datos OLTP
  Fecha: 16/Marzo/2026
  Nota: Oracle 21c XE usa arquitectura CDB (Container Database).
        El ALTER SESSION permite crear usuarios locales sin prefijo C##.
============================================================================
*/

-- =========================================================================
-- 0. HABILITAR CREACION DE USUARIOS LOCALES EN CDB (Oracle 21c XE)
-- =========================================================================
ALTER SESSION SET "_ORACLE_SCRIPT" = TRUE;

-- =========================================================================
-- 1. CREAR TABLESPACE
-- =========================================================================
CREATE TABLESPACE TBS_ESPORTS
    DATAFILE 'tbs_esports01.dbf'
    SIZE 100M
    AUTOEXTEND ON
    NEXT 50M
    MAXSIZE 500M;

-- =========================================================================
-- 2. CREAR USUARIO
-- =========================================================================
CREATE USER ESPORTS_APP
    IDENTIFIED BY Esports2026
    DEFAULT TABLESPACE TBS_ESPORTS
    TEMPORARY TABLESPACE TEMP
    QUOTA UNLIMITED ON TBS_ESPORTS;

-- =========================================================================
-- 3. CREAR ROL PERSONALIZADO
-- =========================================================================
CREATE ROLE ROL_ESPORTS_ADMIN;

-- Asignar privilegios al rol
GRANT CREATE SESSION TO ROL_ESPORTS_ADMIN;
GRANT CREATE TABLE TO ROL_ESPORTS_ADMIN;
GRANT CREATE VIEW TO ROL_ESPORTS_ADMIN;
GRANT CREATE SEQUENCE TO ROL_ESPORTS_ADMIN;
GRANT CREATE PROCEDURE TO ROL_ESPORTS_ADMIN;
GRANT CREATE TRIGGER TO ROL_ESPORTS_ADMIN;
GRANT CREATE SYNONYM TO ROL_ESPORTS_ADMIN;
GRANT CREATE TYPE TO ROL_ESPORTS_ADMIN;

-- =========================================================================
-- 4. ASIGNAR ROL AL USUARIO
-- =========================================================================
GRANT ROL_ESPORTS_ADMIN TO ESPORTS_APP;
GRANT CONNECT, RESOURCE TO ESPORTS_APP;

-- Privilegio para crear secuencias
GRANT CREATE ANY SEQUENCE TO ESPORTS_APP;

PROMPT >>> Tablespace, usuario y roles creados exitosamente <<<
