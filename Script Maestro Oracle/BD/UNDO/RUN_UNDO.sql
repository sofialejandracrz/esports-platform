
-- -----------------------------------------------------------------------------------
-- Autor           : Eduardo Valenzuela
-- Descripcion     : Script maestro para revertir (UNDO) todos los objetos
-- Base de datos   : Plataforma eSports - OLTP
-- Fecha           : 16/Marzo/2026
-- ADVERTENCIA     : Este script ELIMINA todos los objetos y datos
-- -----------------------------------------------------------------------------------
SET DEFINE OFF
SET VERIFY ON
SET HEADING OFF
SET FEEDBACK OFF

spool  !RUN_UNDO_ESPORTS_2026.log

PROMPT *** Iniciando UNDO del Script Maestro - Plataforma eSports ***

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

Prompt ***Inicio UNDO***

Prompt ============================================================
Prompt   Eliminando todos los objetos de la base de datos
Prompt ============================================================
Prompt ./DDL/DROP_ALL.sql
@ ./DDL/DROP_ALL.sql

COMMIT;

PROMPT ----------------------------------------------------------------------------------
PROMPT    FIN DE EJECUCION DE UNDO - PLATAFORMA ESPORTS
PROMPT ----------------------------------------------------------------------------------

spool off
