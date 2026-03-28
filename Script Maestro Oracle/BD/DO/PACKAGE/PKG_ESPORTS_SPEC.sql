/*
============================================================================
  Script: PKG_ESPORTS_SPEC.sql
  Descripcion: Especificacion del paquete PKG_ESPORTS
               Contiene 5 procedimientos almacenados y 2 funciones
  Proyecto: Plataforma eSports - Base de datos OLTP
  Fecha: 16/Marzo/2026
============================================================================
*/

CREATE OR REPLACE PACKAGE PKG_ESPORTS AS

    /*
    =========================================================================
    PROCEDIMIENTOS ALMACENADOS (5)
    =========================================================================
    */
    
    -- SP1: Registrar un nuevo usuario con su persona asociada
    -- Parametros de entrada: datos personales y de usuario
    -- Parametro de salida: p_usuario_id (ID del usuario creado)
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
    );
    
    -- SP2: Inscribir usuario en un torneo
    -- Valida que el torneo exista, no este cerrado y que el usuario no este ya inscrito
    PROCEDURE SP_INSCRIBIR_EN_TORNEO(
        p_torneo_id     IN NUMBER,
        p_usuario_id    IN NUMBER,
        p_resultado      OUT VARCHAR2
    );
    
    -- SP3: Procesar una compra en la tienda
    -- Crea la orden, actualiza saldo/creditos del usuario y registra la transaccion
    PROCEDURE SP_PROCESAR_COMPRA(
        p_usuario_id    IN NUMBER,
        p_item_id       IN NUMBER,
        p_paypal_id     IN VARCHAR2,
        p_resultado     OUT VARCHAR2
    );
    
    -- SP4: Actualizar estadisticas de juego de un usuario
    -- Si no existen, las crea; si existen, las actualiza
    PROCEDURE SP_ACTUALIZAR_ESTADISTICAS(
        p_usuario_id    IN NUMBER,
        p_juego_id      IN NUMBER,
        p_victorias     IN NUMBER,
        p_derrotas      IN NUMBER,
        p_empates       IN NUMBER,
        p_horas         IN NUMBER,
        p_rango         IN VARCHAR2
    );
    
    -- SP5: Finalizar un torneo y registrar resultados
    -- Cambia el estado del torneo, registra al ganador y otorga trofeo
    PROCEDURE SP_FINALIZAR_TORNEO(
        p_torneo_id     IN NUMBER,
        p_ganador_id    IN NUMBER,
        p_segundo_id    IN NUMBER,
        p_resultado     OUT VARCHAR2
    );
    
    /*
    =========================================================================
    FUNCIONES (2)
    =========================================================================
    */
    
    -- FN1: Calcular el nivel de un usuario basado en su XP
    -- Retorna el nombre del nivel (Bronce, Plata, Oro, etc.)
    FUNCTION FN_CALCULAR_NIVEL(
        p_usuario_id    IN NUMBER
    ) RETURN VARCHAR2;
    
    -- FN2: Obtener el total de ingresos de la tienda en un rango de fechas
    -- Retorna el monto total de las ordenes completadas
    FUNCTION FN_INGRESOS_TIENDA(
        p_fecha_inicio  IN DATE,
        p_fecha_fin     IN DATE
    ) RETURN NUMBER;

END PKG_ESPORTS;
/

PROMPT >>> Especificacion del paquete PKG_ESPORTS creada exitosamente <<<
