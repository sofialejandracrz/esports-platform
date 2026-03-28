/*
============================================================================
  Script: PKG_CONFIG_SPEC.sql
  Descripcion: Especificacion del paquete PKG_CONFIG
               Funciones de configuración de usuario migradas de PostgreSQL
  Proyecto: Plataforma eSports - Migración a Oracle
  Fecha: Marzo/2026
============================================================================
*/

CREATE OR REPLACE PACKAGE PKG_CONFIG AS

    /*
    =========================================================================
    FUNCIONES DE CONFIGURACIÓN DE USUARIO (16 funciones)
    Rutas cubiertas: /usuario/configuracion/*
    =========================================================================
    */
    
    -- SECCIÓN 1: Personal
    FUNCTION FN_GET_PERSONAL(p_usuario_id IN VARCHAR2) RETURN CLOB;
    FUNCTION FN_UPDATE_PERSONAL(
        p_usuario_id    IN VARCHAR2,
        p_biografia     IN VARCHAR2 DEFAULT NULL,
        p_genero_id     IN VARCHAR2 DEFAULT NULL,
        p_timezone      IN VARCHAR2 DEFAULT NULL,
        p_avatar_id     IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB;
    
    -- SECCIÓN 2: Social (Redes Sociales)
    FUNCTION FN_GET_SOCIAL(p_usuario_id IN VARCHAR2) RETURN CLOB;
    FUNCTION FN_UPSERT_SOCIAL(
        p_usuario_id    IN VARCHAR2,
        p_plataforma    IN VARCHAR2,
        p_enlace        IN VARCHAR2,
        p_red_id        IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB;
    FUNCTION FN_DELETE_SOCIAL(
        p_usuario_id    IN VARCHAR2,
        p_red_id        IN VARCHAR2
    ) RETURN CLOB;
    
    -- SECCIÓN 3: Juegos (Cuentas de plataformas)
    FUNCTION FN_GET_JUEGOS(p_usuario_id IN VARCHAR2) RETURN CLOB;
    FUNCTION FN_UPSERT_CUENTA_JUEGO(
        p_usuario_id    IN VARCHAR2,
        p_plataforma_id IN VARCHAR2,
        p_identificador IN VARCHAR2,
        p_cuenta_id     IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB;
    FUNCTION FN_DELETE_CUENTA_JUEGO(
        p_usuario_id    IN VARCHAR2,
        p_cuenta_id     IN VARCHAR2
    ) RETURN CLOB;
    
    -- SECCIÓN 4: Preferencias
    FUNCTION FN_GET_PREFERENCIAS(p_usuario_id IN VARCHAR2) RETURN CLOB;
    FUNCTION FN_UPDATE_PREFERENCIAS(
        p_usuario_id            IN VARCHAR2,
        p_desafios_habilitados  IN NUMBER DEFAULT NULL
    ) RETURN CLOB;
    
    -- SECCIÓN 5: Cuenta
    FUNCTION FN_GET_CUENTA(p_usuario_id IN VARCHAR2) RETURN CLOB;
    FUNCTION FN_UPDATE_PASSWORD(
        p_usuario_id        IN VARCHAR2,
        p_password_actual   IN VARCHAR2,
        p_password_nuevo    IN VARCHAR2
    ) RETURN CLOB;
    
    -- SECCIÓN 6: Seguridad
    FUNCTION FN_GET_SEGURIDAD(p_usuario_id IN VARCHAR2) RETURN CLOB;
    FUNCTION FN_UPDATE_SEGURIDAD(
        p_usuario_id    IN VARCHAR2,
        p_correo        IN VARCHAR2 DEFAULT NULL,
        p_correo_paypal IN VARCHAR2 DEFAULT NULL,
        p_telefono      IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB;
    
    -- SECCIÓN 7: Retiro (placeholder)
    FUNCTION FN_GET_RETIRO(p_usuario_id IN VARCHAR2) RETURN CLOB;
    
    -- Configuración Completa
    FUNCTION FN_GET_COMPLETA(p_usuario_id IN VARCHAR2) RETURN CLOB;

END PKG_CONFIG;
/

PROMPT >>> Especificacion del paquete PKG_CONFIG creada exitosamente <<<
