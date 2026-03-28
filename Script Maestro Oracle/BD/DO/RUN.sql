
-- -----------------------------------------------------------------------------------
-- Autor           : Eduardo Valenzuela
-- Descripcion     : Archivo maestro que ejecuta los scripts en la secuencia requerida
-- Base de datos   : Plataforma eSports - OLTP
-- Fecha           : 16/Marzo/2026
-- Ejecutar en     : SQL*Plus o SQL Developer conectado como SYSDBA
-- -----------------------------------------------------------------------------------
SET DEFINE OFF
SET VERIFY ON
SET HEADING OFF
SET FEEDBACK OFF

spool  !RUN_ESPORTS_2026.log

PROMPT *** Iniciando la Ejecucion del Script Maestro - Plataforma eSports ***

Select banner from v$version;

select 'Instancia=' || sys_context('USERENV','DB_NAME') as INSTANCIA FROM DUAL
UNION ALL
select 'Database =' || global_name from global_name
UNION ALL
Select 'Usuario  =' || USER AS USUARIO FROM DUAL
UNION ALL
Select 'Fecha    =' || to_char(SYSDATE,'DD/MON/YYYY HH:MM:SS AM') AS FECHA FROM DUAL;


SET HEADING ON
SET FEEDBACK ON
SET ECHO ON

Prompt ***Inicio***

Prompt ============================================================
Prompt   FASE 1: DDL - Usuarios, Roles y Tablespace
Prompt ============================================================
Prompt ./DDL/01_USUARIOS_ROLES.sql
@ ./DDL/01_USUARIOS_ROLES.sql

Prompt ============================================================
Prompt   Cambiando al esquema ESPORTS_APP
Prompt ============================================================
ALTER SESSION SET CURRENT_SCHEMA = ESPORTS_APP;

Prompt ============================================================
Prompt   FASE 2: DDL - Secuencias
Prompt ============================================================
Prompt ./DDL/02_SECUENCIAS.sql
@ ./DDL/02_SECUENCIAS.sql

Prompt ============================================================
Prompt   FASE 3: DDL - Creacion de Tablas
Prompt ============================================================
Prompt ./DDL/03_TABLAS.sql
@ ./DDL/03_TABLAS.sql

Prompt ============================================================
Prompt   FASE 4: DML - Datos de Catalogos
Prompt ============================================================
Prompt ./DML/01_CATALOGOS.sql
@ ./DML/01_CATALOGOS.sql

Prompt ============================================================
Prompt   FASE 5: DML - Datos Masivos (bloques anonimos)
Prompt ============================================================
Prompt ./DML/02_DATOS_MASIVOS.sql
@ ./DML/02_DATOS_MASIVOS.sql

Prompt ============================================================
Prompt   FASE 6: Vistas
Prompt ============================================================
Prompt ./VIEW/01_VISTAS.sql
@ ./VIEW/01_VISTAS.sql

Prompt ============================================================
Prompt   FASE 7: Paquete PKG_ESPORTS - Especificacion
Prompt ============================================================
Prompt ./PACKAGE/PKG_ESPORTS_SPEC.sql
@ ./PACKAGE/PKG_ESPORTS_SPEC.sql

Prompt ============================================================
Prompt   FASE 8: Paquete PKG_ESPORTS - Cuerpo
Prompt ============================================================
Prompt ./PACKAGE/PKG_ESPORTS_BODY.sql
@ ./PACKAGE/PKG_ESPORTS_BODY.sql

Prompt ============================================================
Prompt   FASE 9: Paquete PKG_TIENDA - Especificacion (Migracion)
Prompt ============================================================
Prompt ./PACKAGE/PKG_TIENDA_SPEC.sql
@ ./PACKAGE/PKG_TIENDA_SPEC.sql

Prompt ============================================================
Prompt   FASE 10: Paquete PKG_TIENDA - Cuerpo (Migracion)
Prompt ============================================================
Prompt ./PACKAGE/PKG_TIENDA_BODY.sql
@ ./PACKAGE/PKG_TIENDA_BODY.sql

Prompt ============================================================
Prompt   FASE 11: Paquete PKG_PERFIL - Especificacion (Migracion)
Prompt ============================================================
Prompt ./PACKAGE/PKG_PERFIL_SPEC.sql
@ ./PACKAGE/PKG_PERFIL_SPEC.sql

Prompt ============================================================
Prompt   FASE 12: Paquete PKG_PERFIL - Cuerpo (Migracion)
Prompt ============================================================
Prompt ./PACKAGE/PKG_PERFIL_BODY.sql
@ ./PACKAGE/PKG_PERFIL_BODY.sql

Prompt ============================================================
Prompt   FASE 13: Triggers
Prompt ============================================================
Prompt ./TRIGGER/01_TRIGGERS.sql
@ ./TRIGGER/01_TRIGGERS.sql

COMMIT;

PROMPT ----------------------------------------------------------------------------------
PROMPT    FIN DE EJECUCION DE SCRIPTS - PLATAFORMA ESPORTS
PROMPT ----------------------------------------------------------------------------------
PROMPT    Resumen de objetos creados:
PROMPT      - 1 Tablespace (TBS_ESPORTS)
PROMPT      - 1 Usuario (ESPORTS_APP)
PROMPT      - 1 Rol (ROL_ESPORTS_ADMIN)
PROMPT      - 40 Secuencias
PROMPT      - 39 Tablas (15 catalogos + 24 transaccionales)
PROMPT      - 1 Tabla de auditoria
PROMPT      - 6 Vistas
PROMPT      - 3 Paquetes:
PROMPT        * PKG_ESPORTS (5 SP + 2 FN) - Original
PROMPT        * PKG_TIENDA (8 FN) - Migrado de PostgreSQL
PROMPT        * PKG_PERFIL (10 FN) - Migrado de PostgreSQL
PROMPT      - 5 Triggers
PROMPT      - ~1,800 registros de datos
PROMPT ----------------------------------------------------------------------------------

spool off
