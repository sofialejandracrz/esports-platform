/*
============================================================================
  Script: PKG_PERFIL_SPEC.sql
  Descripcion: Especificacion del paquete PKG_PERFIL
               Funciones de perfil de usuario migradas de PostgreSQL
  Proyecto: Plataforma eSports - Migración a Oracle
  Fecha: Marzo/2026
============================================================================
*/

CREATE OR REPLACE PACKAGE PKG_PERFIL AS

    /*
    =========================================================================
    FUNCIONES DE PERFIL DE USUARIO
    =========================================================================
    */
    
    -- FN1: Obtener perfil de usuario
    -- Retorna información completa del perfil público/privado
    FUNCTION FN_OBTENER_PERFIL(
        p_nickname      IN VARCHAR2,
        p_viewer_id     IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB;
    
    -- FN2: Obtener lista de amigos
    FUNCTION FN_LISTA_AMIGOS(
        p_usuario_id    IN VARCHAR2,
        p_limit         IN NUMBER DEFAULT 50,
        p_offset        IN NUMBER DEFAULT 0
    ) RETURN CLOB;
    
    -- FN3: Obtener vitrina de trofeos
    FUNCTION FN_VITRINA_TROFEOS(
        p_usuario_id    IN VARCHAR2,
        p_limit         IN NUMBER DEFAULT 20
    ) RETURN CLOB;
    
    -- FN4: Obtener logros del usuario
    FUNCTION FN_LOGROS_USUARIO(
        p_usuario_id    IN VARCHAR2
    ) RETURN CLOB;
    
    -- FN5: Obtener estadísticas de juegos
    FUNCTION FN_ESTADISTICAS_JUEGOS(
        p_usuario_id    IN VARCHAR2
    ) RETURN CLOB;
    
    -- FN6: Obtener historial de torneos
    FUNCTION FN_HISTORIAL_TORNEOS(
        p_usuario_id    IN VARCHAR2,
        p_limit         IN NUMBER DEFAULT 20,
        p_offset        IN NUMBER DEFAULT 0
    ) RETURN CLOB;
    
    -- FN7: Obtener redes sociales
    FUNCTION FN_REDES_SOCIALES(
        p_usuario_id    IN VARCHAR2
    ) RETURN CLOB;
    
    -- FN8: Obtener cuentas de juego
    FUNCTION FN_CUENTAS_JUEGO(
        p_usuario_id    IN VARCHAR2
    ) RETURN CLOB;
    
    -- FN9: Obtener equipos del usuario
    FUNCTION FN_EQUIPOS_USUARIO(
        p_usuario_id    IN VARCHAR2
    ) RETURN CLOB;
    
    -- FN10: Obtener perfil completo en JSON
    FUNCTION FN_PERFIL_COMPLETO_JSON(
        p_nickname      IN VARCHAR2,
        p_viewer_id     IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB;

END PKG_PERFIL;
/

PROMPT >>> Especificacion del paquete PKG_PERFIL creada exitosamente <<<
