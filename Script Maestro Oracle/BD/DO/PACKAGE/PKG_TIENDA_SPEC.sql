/*
============================================================================
  Script: PKG_TIENDA_SPEC.sql
  Descripcion: Especificacion del paquete PKG_TIENDA
               Funciones migradas de PostgreSQL para la tienda
  Proyecto: Plataforma eSports - Migración a Oracle
  Fecha: Marzo/2026
============================================================================
*/

CREATE OR REPLACE PACKAGE PKG_TIENDA AS

    /*
    =========================================================================
    FUNCIONES DE TIENDA (10 funciones migradas de PostgreSQL)
    =========================================================================
    */
    
    -- FN1: Obtener catálogo de tienda
    -- Retorna JSON con categorías de items (créditos, membresías, servicios)
    FUNCTION FN_OBTENER_CATALOGO(
        p_usuario_id    IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB;
    
    -- FN2: Crear orden de compra
    -- Crea una orden pendiente para un item de la tienda
    FUNCTION FN_CREAR_ORDEN(
        p_usuario_id    IN VARCHAR2,
        p_item_id       IN VARCHAR2,
        p_metadata      IN CLOB DEFAULT '{}'
    ) RETURN CLOB;
    
    -- FN3: Registrar pago PayPal
    -- Actualiza la orden con los datos del pago de PayPal
    FUNCTION FN_REGISTRAR_PAGO_PAYPAL(
        p_orden_id          IN VARCHAR2,
        p_paypal_order_id   IN VARCHAR2,
        p_paypal_capture_id IN VARCHAR2 DEFAULT NULL,
        p_paypal_payer_id   IN VARCHAR2 DEFAULT NULL,
        p_paypal_payer_email IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB;
    
    -- FN4: Confirmar compra
    -- Procesa la compra: otorga créditos/membresía/servicio según el tipo
    FUNCTION FN_CONFIRMAR_COMPRA(
        p_orden_id          IN VARCHAR2,
        p_paypal_capture_id IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB;
    
    -- FN5: Cancelar orden
    -- Cancela una orden pendiente
    FUNCTION FN_CANCELAR_ORDEN(
        p_orden_id      IN VARCHAR2,
        p_usuario_id    IN VARCHAR2
    ) RETURN CLOB;
    
    -- FN6: Historial de compras
    -- Retorna el historial de compras de un usuario
    FUNCTION FN_HISTORIAL_COMPRAS(
        p_usuario_id    IN VARCHAR2,
        p_limit         IN NUMBER DEFAULT 20,
        p_offset        IN NUMBER DEFAULT 0
    ) RETURN CLOB;
    
    -- FN7: Verificar nickname
    -- Verifica si un nickname está disponible para compra/reclamo
    FUNCTION FN_VERIFICAR_NICKNAME(
        p_nickname      IN VARCHAR2
    ) RETURN CLOB;
    
    -- FN8: Comprar con saldo
    -- Realiza una compra usando el saldo del usuario
    FUNCTION FN_COMPRAR_CON_SALDO(
        p_usuario_id    IN VARCHAR2,
        p_item_id       IN VARCHAR2,
        p_metadata      IN CLOB DEFAULT '{}'
    ) RETURN CLOB;
    
    -- FN9: Obtener solicitudes de soporte (Admin)
    -- Retorna lista de solicitudes de soporte para el panel de administración
    FUNCTION FN_OBTENER_SOLICITUDES_SOPORTE(
        p_estado        IN VARCHAR2 DEFAULT NULL,
        p_limit         IN NUMBER DEFAULT 20,
        p_offset        IN NUMBER DEFAULT 0
    ) RETURN CLOB;
    
    -- FN10: Resolver solicitud de soporte (Admin)
    -- Permite a un admin aprobar o rechazar solicitudes de soporte
    FUNCTION FN_RESOLVER_SOLICITUD_SOPORTE(
        p_solicitud_id  IN VARCHAR2,
        p_admin_id      IN VARCHAR2,
        p_aprobar       IN NUMBER,
        p_notas         IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB;

END PKG_TIENDA;
/

PROMPT >>> Especificacion del paquete PKG_TIENDA creada exitosamente <<<
