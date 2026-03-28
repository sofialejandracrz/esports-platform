/*
============================================================================
  Script: PKG_TORNEO_SPEC.sql
  Descripcion: Especificacion del paquete PKG_TORNEO
               Funciones de torneos migradas de PostgreSQL
  Proyecto: Plataforma eSports - Migración a Oracle
  Fecha: Marzo/2026
============================================================================
*/

CREATE OR REPLACE PACKAGE PKG_TORNEO AS

    /*
    =========================================================================
    FUNCIONES DE TORNEOS (10 funciones migradas de PostgreSQL)
    =========================================================================
    */
    
    -- FN1: Crear torneo
    FUNCTION FN_CREAR(
        p_anfitrion_id              IN VARCHAR2,
        p_titulo                    IN VARCHAR2,
        p_descripcion               IN CLOB DEFAULT NULL,
        p_fecha_inicio_registro     IN TIMESTAMP DEFAULT NULL,
        p_fecha_fin_registro        IN TIMESTAMP DEFAULT NULL,
        p_fecha_inicio_torneo       IN TIMESTAMP DEFAULT NULL,
        p_juego_id                  IN VARCHAR2 DEFAULT NULL,
        p_plataforma_id             IN VARCHAR2 DEFAULT NULL,
        p_modo_juego_id             IN VARCHAR2 DEFAULT NULL,
        p_region_id                 IN VARCHAR2 DEFAULT NULL,
        p_tipo_torneo_id            IN VARCHAR2 DEFAULT NULL,
        p_al_mejor_de               IN NUMBER DEFAULT 1,
        p_formato                   IN VARCHAR2 DEFAULT '1v1',
        p_cerrado                   IN NUMBER DEFAULT 0,
        p_reglas                    IN CLOB DEFAULT NULL,
        p_jugadores_pc_permitidos   IN NUMBER DEFAULT 1,
        p_requiere_transmision      IN NUMBER DEFAULT 0,
        p_requiere_camara           IN NUMBER DEFAULT 0,
        p_tipo_entrada_id           IN VARCHAR2 DEFAULT NULL,
        p_capacidad                 IN NUMBER DEFAULT NULL,
        p_cuota                     IN NUMBER DEFAULT 0,
        p_comision_porcentaje       IN NUMBER DEFAULT 0,
        p_ganador1_porcentaje       IN NUMBER DEFAULT 70,
        p_ganador2_porcentaje       IN NUMBER DEFAULT 30,
        p_contacto_anfitrion        IN VARCHAR2 DEFAULT NULL,
        p_discord_servidor          IN VARCHAR2 DEFAULT NULL,
        p_banner_url                IN VARCHAR2 DEFAULT NULL,
        p_miniatura_url             IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB;
    
    -- FN2: Actualizar torneo
    FUNCTION FN_ACTUALIZAR(
        p_torneo_id                 IN VARCHAR2,
        p_anfitrion_id              IN VARCHAR2,
        p_titulo                    IN VARCHAR2 DEFAULT NULL,
        p_descripcion               IN CLOB DEFAULT NULL,
        p_fecha_inicio_registro     IN TIMESTAMP DEFAULT NULL,
        p_fecha_fin_registro        IN TIMESTAMP DEFAULT NULL,
        p_fecha_inicio_torneo       IN TIMESTAMP DEFAULT NULL,
        p_juego_id                  IN VARCHAR2 DEFAULT NULL,
        p_plataforma_id             IN VARCHAR2 DEFAULT NULL,
        p_modo_juego_id             IN VARCHAR2 DEFAULT NULL,
        p_region_id                 IN VARCHAR2 DEFAULT NULL,
        p_tipo_torneo_id            IN VARCHAR2 DEFAULT NULL,
        p_al_mejor_de               IN NUMBER DEFAULT NULL,
        p_formato                   IN VARCHAR2 DEFAULT NULL,
        p_cerrado                   IN NUMBER DEFAULT NULL,
        p_reglas                    IN CLOB DEFAULT NULL,
        p_jugadores_pc_permitidos   IN NUMBER DEFAULT NULL,
        p_requiere_transmision      IN NUMBER DEFAULT NULL,
        p_requiere_camara           IN NUMBER DEFAULT NULL,
        p_tipo_entrada_id           IN VARCHAR2 DEFAULT NULL,
        p_capacidad                 IN NUMBER DEFAULT NULL,
        p_cuota                     IN NUMBER DEFAULT NULL,
        p_comision_porcentaje       IN NUMBER DEFAULT NULL,
        p_ganador1_porcentaje       IN NUMBER DEFAULT NULL,
        p_ganador2_porcentaje       IN NUMBER DEFAULT NULL,
        p_contacto_anfitrion        IN VARCHAR2 DEFAULT NULL,
        p_discord_servidor          IN VARCHAR2 DEFAULT NULL,
        p_banner_url                IN VARCHAR2 DEFAULT NULL,
        p_miniatura_url             IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB;
    
    -- FN3: Cambiar estado del torneo
    FUNCTION FN_CAMBIAR_ESTADO(
        p_torneo_id     IN VARCHAR2,
        p_anfitrion_id  IN VARCHAR2,
        p_nuevo_estado  IN VARCHAR2
    ) RETURN CLOB;
    
    -- FN4: Obtener detalle del torneo
    FUNCTION FN_OBTENER_DETALLE(
        p_torneo_id     IN VARCHAR2
    ) RETURN CLOB;
    
    -- FN5: Listar torneos con filtros
    FUNCTION FN_LISTAR(
        p_estado        IN VARCHAR2 DEFAULT NULL,
        p_juego_id      IN VARCHAR2 DEFAULT NULL,
        p_region_id     IN VARCHAR2 DEFAULT NULL,
        p_anfitrion_id  IN VARCHAR2 DEFAULT NULL,
        p_busqueda      IN VARCHAR2 DEFAULT NULL,
        p_limit         IN NUMBER DEFAULT 20,
        p_offset        IN NUMBER DEFAULT 0
    ) RETURN CLOB;
    
    -- FN6: Obtener catálogos para formulario
    FUNCTION FN_OBTENER_CATALOGOS RETURN CLOB;
    
    -- FN7: Agregar/actualizar red social del torneo
    FUNCTION FN_UPSERT_RED_SOCIAL(
        p_torneo_id     IN VARCHAR2,
        p_anfitrion_id  IN VARCHAR2,
        p_plataforma    IN VARCHAR2,
        p_url           IN VARCHAR2,
        p_red_id        IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB;
    
    -- FN8: Eliminar red social del torneo
    FUNCTION FN_ELIMINAR_RED_SOCIAL(
        p_torneo_id     IN VARCHAR2,
        p_anfitrion_id  IN VARCHAR2,
        p_red_id        IN VARCHAR2
    ) RETURN CLOB;
    
    -- FN9: Finalizar torneo
    FUNCTION FN_FINALIZAR(
        p_torneo_id     IN VARCHAR2,
        p_anfitrion_id  IN VARCHAR2,
        p_ganador_id    IN VARCHAR2,
        p_segundo_id    IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB;

END PKG_TORNEO;
/

PROMPT >>> Especificacion del paquete PKG_TORNEO creada exitosamente <<<
