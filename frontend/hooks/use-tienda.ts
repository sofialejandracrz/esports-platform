import { useState, useCallback } from 'react';
import { tiendaApi } from '@/lib/api/tienda';
import type {
  CatalogoTienda,
  CrearOrdenRequest,
  CrearOrdenResponse,
  CrearOrdenPayPalResponse,
  CapturarPagoResponse,
  ComprarConSaldoRequest,
  HistorialComprasResponse,
  VerificarNicknameResponse,
  SolicitudesSoporteResponse,
  SolicitudSoporte,
  ResolverSolicitudRequest,
} from '@/types/tienda';

interface UseTiendaState {
  catalogo: CatalogoTienda | null;
  historial: HistorialComprasResponse | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook para gestionar la tienda
 * Conecta con los 10 procedimientos almacenados del backend:
 * 
 * 1. tienda_obtener_catalogo -> fetchCatalogo()
 * 2. tienda_crear_orden -> crearOrden()
 * 3. tienda_registrar_pago_paypal -> (interno en iniciarCompraPayPal)
 * 4. tienda_confirmar_compra -> completarCompraPayPal()
 * 5. tienda_cancelar_orden -> cancelarOrden()
 * 6. tienda_historial_compras -> fetchHistorial()
 * 7. tienda_verificar_nickname -> verificarNickname()
 * 8. tienda_obtener_solicitudes_soporte -> (useTiendaAdmin)
 * 9. tienda_resolver_solicitud_soporte -> (useTiendaAdmin)
 * 10. tienda_comprar_con_saldo -> comprarConSaldo()
 */
export function useTienda() {
  const [state, setState] = useState<UseTiendaState>({
    catalogo: null,
    historial: null,
    isLoading: false,
    error: null,
  });

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading, error: isLoading ? null : prev.error }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  };

  // ============================================
  // 1. PROCEDIMIENTO: tienda_obtener_catalogo
  // ============================================
  
  /**
   * Obtener catálogo de tienda (público o con usuario)
   * Llama al procedimiento: tienda_obtener_catalogo
   */
  const fetchCatalogo = useCallback(async (conUsuario = false): Promise<CatalogoTienda | null> => {
    setLoading(true);
    try {
      const data = conUsuario 
        ? await tiendaApi.getCatalogoUsuario()
        : await tiendaApi.getCatalogo();
      setState(prev => ({ ...prev, catalogo: data, isLoading: false }));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el catálogo');
      return null;
    }
  }, []);

  // ============================================
  // 2. PROCEDIMIENTO: tienda_crear_orden
  // ============================================
  
  /**
   * Crear una orden de compra (sin PayPal)
   * Llama al procedimiento: tienda_crear_orden
   */
  const crearOrden = useCallback(async (data: CrearOrdenRequest): Promise<CrearOrdenResponse | null> => {
    setLoading(true);
    try {
      const response = await tiendaApi.crearOrden(data);
      setState(prev => ({ ...prev, isLoading: false }));
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la orden');
      return null;
    }
  }, []);

  // ============================================
  // 2+3. PROCEDIMIENTOS: tienda_crear_orden + tienda_registrar_pago_paypal
  // ============================================
  
  /**
   * Iniciar compra con PayPal
   * Llama a: tienda_crear_orden + tienda_registrar_pago_paypal
   * Retorna la URL de aprobación para redirigir al usuario
   */
  const iniciarCompraPayPal = useCallback(async (data: CrearOrdenRequest): Promise<CrearOrdenPayPalResponse | null> => {
    setLoading(true);
    try {
      const response = await tiendaApi.crearOrdenPayPal(data);
      setState(prev => ({ ...prev, isLoading: false }));
      
      // Guardar el orden_id en localStorage para recuperarlo después
      if (response.orden_id && response.paypal?.orderId) {
        localStorage.setItem('tienda_orden_pendiente', JSON.stringify({
          ordenId: response.orden_id,
          paypalOrderId: response.paypal.orderId,
          timestamp: Date.now(),
        }));
      }
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la orden');
      return null;
    }
  }, []);

  // ============================================
  // 3+4. PROCEDIMIENTOS: tienda_registrar_pago_paypal + tienda_confirmar_compra
  // ============================================
  
  /**
   * Completar compra con PayPal (después de que el usuario aprueba)
   * Llama a: tienda_registrar_pago_paypal + tienda_confirmar_compra
   */
  const completarCompraPayPal = useCallback(async (ordenId: string, paypalOrderId: string): Promise<CapturarPagoResponse | null> => {
    setLoading(true);
    try {
      const response = await tiendaApi.capturarPagoPayPal({ ordenId, paypalOrderId });
      setState(prev => ({ ...prev, isLoading: false }));
      
      // Limpiar la orden pendiente
      localStorage.removeItem('tienda_orden_pendiente');
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago');
      return null;
    }
  }, []);

  // ============================================
  // 5. PROCEDIMIENTO: tienda_cancelar_orden
  // ============================================
  
  /**
   * Cancelar orden pendiente
   * Llama al procedimiento: tienda_cancelar_orden
   */
  const cancelarOrden = useCallback(async (ordenId: string): Promise<{ success: boolean; message: string } | null> => {
    setLoading(true);
    try {
      const response = await tiendaApi.cancelarOrden(ordenId);
      setState(prev => ({ ...prev, isLoading: false }));
      localStorage.removeItem('tienda_orden_pendiente');
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cancelar la orden');
      return null;
    }
  }, []);

  // ============================================
  // 6. PROCEDIMIENTO: tienda_historial_compras
  // ============================================
  
  /**
   * Obtener historial de compras
   * Llama al procedimiento: tienda_historial_compras
   */
  const fetchHistorial = useCallback(async (limit = 20, offset = 0): Promise<HistorialComprasResponse | null> => {
    setLoading(true);
    try {
      const data = await tiendaApi.getHistorial(limit, offset);
      setState(prev => ({ ...prev, historial: data, isLoading: false }));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el historial');
      return null;
    }
  }, []);

  // ============================================
  // 7. PROCEDIMIENTO: tienda_verificar_nickname
  // ============================================
  
  /**
   * Verificar disponibilidad de nickname
   * Llama al procedimiento: tienda_verificar_nickname
   */
  const verificarNickname = useCallback(async (nickname: string): Promise<VerificarNicknameResponse | null> => {
    try {
      return await tiendaApi.verificarNickname(nickname);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar nickname');
      return null;
    }
  }, []);

  // ============================================
  // 10. PROCEDIMIENTO: tienda_comprar_con_saldo
  // ============================================
  
  /**
   * Comprar con saldo del usuario
   * Llama al procedimiento: tienda_comprar_con_saldo
   */
  const comprarConSaldo = useCallback(async (data: ComprarConSaldoRequest): Promise<CapturarPagoResponse | null> => {
    setLoading(true);
    try {
      const response = await tiendaApi.comprarConSaldo(data);
      setState(prev => ({ ...prev, isLoading: false }));
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la compra');
      return null;
    }
  }, []);

  // ============================================
  // UTILIDADES
  // ============================================

  /**
   * Recuperar orden pendiente (para cuando el usuario vuelve de PayPal)
   */
  const getOrdenPendiente = useCallback((): { ordenId: string; paypalOrderId: string } | null => {
    const stored = localStorage.getItem('tienda_orden_pendiente');
    if (!stored) return null;
    
    try {
      const data = JSON.parse(stored);
      // Verificar que no haya expirado (30 minutos)
      if (Date.now() - data.timestamp > 30 * 60 * 1000) {
        localStorage.removeItem('tienda_orden_pendiente');
        return null;
      }
      return { ordenId: data.ordenId, paypalOrderId: data.paypalOrderId };
    } catch {
      return null;
    }
  }, []);

  /**
   * Obtener detalles de una orden específica
   */
  const getOrden = useCallback(async (ordenId: string) => {
    setLoading(true);
    try {
      const data = await tiendaApi.getOrden(ordenId);
      setState(prev => ({ ...prev, isLoading: false }));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener la orden');
      return null;
    }
  }, []);

  /**
   * Obtener mis solicitudes de soporte
   */
  const getMisSolicitudes = useCallback(async (): Promise<SolicitudSoporte[] | null> => {
    setLoading(true);
    try {
      const data = await tiendaApi.getMisSolicitudes();
      setState(prev => ({ ...prev, isLoading: false }));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener solicitudes');
      return null;
    }
  }, []);

  /**
   * Limpiar error
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // Estado
    catalogo: state.catalogo,
    historial: state.historial,
    isLoading: state.isLoading,
    error: state.error,
    
    // Acciones - Procedimientos 1-7 y 10
    fetchCatalogo,         // 1. tienda_obtener_catalogo
    crearOrden,            // 2. tienda_crear_orden
    iniciarCompraPayPal,   // 2+3. tienda_crear_orden + tienda_registrar_pago_paypal
    completarCompraPayPal, // 3+4. tienda_registrar_pago_paypal + tienda_confirmar_compra
    cancelarOrden,         // 5. tienda_cancelar_orden
    fetchHistorial,        // 6. tienda_historial_compras
    verificarNickname,     // 7. tienda_verificar_nickname
    comprarConSaldo,       // 10. tienda_comprar_con_saldo
    
    // Utilidades
    getOrdenPendiente,
    getOrden,
    getMisSolicitudes,
    clearError,
  };
}

export default useTienda;
