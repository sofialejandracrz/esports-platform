import { api } from './client';
import type {
  CatalogoTienda,
  CrearOrdenRequest,
  CrearOrdenResponse,
  CrearOrdenPayPalResponse,
  CapturarPagoRequest,
  CapturarPagoResponse,
  ComprarConSaldoRequest,
  HistorialComprasResponse,
  VerificarNicknameResponse,
  SolicitudesSoporteResponse,
  ResolverSolicitudRequest,
  SolicitudSoporte,
} from '@/types/tienda';

// Prefijo base para la API de tienda
const BASE_PATH = '/tienda';

/**
 * API de Tienda
 * Consume los procedimientos almacenados de tienda.sql:
 * 1. tienda_obtener_catalogo
 * 2. tienda_crear_orden
 * 3. tienda_registrar_pago_paypal
 * 4. tienda_confirmar_compra
 * 5. tienda_cancelar_orden
 * 6. tienda_historial_compras
 * 7. tienda_verificar_nickname
 * 8. tienda_obtener_solicitudes_soporte
 * 9. tienda_resolver_solicitud_soporte
 * 10. tienda_comprar_con_saldo
 */
export const tiendaApi = {
  // ============================================
  // CATÁLOGO (tienda_obtener_catalogo)
  // ============================================

  /**
   * Obtener catálogo público de la tienda
   * Procedimiento: tienda_obtener_catalogo(NULL)
   */
  getCatalogo: () =>
    api.get<CatalogoTienda>(`${BASE_PATH}/catalogo`, { requireAuth: false }),

  /**
   * Obtener catálogo con información del usuario autenticado
   * Procedimiento: tienda_obtener_catalogo(usuario_id)
   */
  getCatalogoUsuario: () =>
    api.get<CatalogoTienda>(`${BASE_PATH}/catalogo/usuario`),

  // ============================================
  // VERIFICACIÓN DE NICKNAME (tienda_verificar_nickname)
  // ============================================

  /**
   * Verificar disponibilidad de un nickname
   * Procedimiento: tienda_verificar_nickname(nickname)
   */
  verificarNickname: (nickname: string) =>
    api.get<VerificarNicknameResponse>(`${BASE_PATH}/verificar-nickname/${encodeURIComponent(nickname)}`, { 
      requireAuth: false 
    }),

  // ============================================
  // ÓRDENES (tienda_crear_orden, tienda_registrar_pago_paypal, tienda_confirmar_compra)
  // ============================================

  /**
   * Crear orden simple (sin PayPal)
   * Procedimiento: tienda_crear_orden(usuario_id, item_id, metadata)
   */
  crearOrden: (data: CrearOrdenRequest) =>
    api.post<CrearOrdenResponse>(`${BASE_PATH}/orden`, data),

  /**
   * Crear orden e iniciar pago con PayPal
   * Procedimientos: tienda_crear_orden + tienda_registrar_pago_paypal
   * Retorna la URL de aprobación de PayPal
   */
  crearOrdenPayPal: (data: CrearOrdenRequest) =>
    api.post<CrearOrdenPayPalResponse>(`${BASE_PATH}/orden/paypal`, data),

  /**
   * Capturar pago de PayPal (después de aprobación del usuario)
   * Procedimientos: tienda_registrar_pago_paypal + tienda_confirmar_compra
   */
  capturarPagoPayPal: (data: CapturarPagoRequest) =>
    api.post<CapturarPagoResponse>(`${BASE_PATH}/orden/paypal/capture`, data),

  /**
   * Comprar usando saldo del usuario (sin PayPal)
   * Procedimiento: tienda_comprar_con_saldo(usuario_id, item_id, metadata)
   */
  comprarConSaldo: (data: ComprarConSaldoRequest) =>
    api.post<CapturarPagoResponse>(`${BASE_PATH}/orden/saldo`, data),

  /**
   * Cancelar una orden pendiente
   * Procedimiento: tienda_cancelar_orden(orden_id, usuario_id)
   */
  cancelarOrden: (ordenId: string) =>
    api.post<{ success: boolean; message: string }>(`${BASE_PATH}/orden/${ordenId}/cancelar`),

  /**
   * Obtener detalles de una orden
   */
  getOrden: (ordenId: string) =>
    api.get<any>(`${BASE_PATH}/orden/${ordenId}`),

  // ============================================
  // HISTORIAL (tienda_historial_compras)
  // ============================================

  /**
   * Obtener historial de compras del usuario
   * Procedimiento: tienda_historial_compras(usuario_id, limit, offset)
   */
  getHistorial: (limit = 20, offset = 0) =>
    api.get<HistorialComprasResponse>(`${BASE_PATH}/historial?limit=${limit}&offset=${offset}`),

  // ============================================
  // SOLICITUDES DE SOPORTE (Usuario)
  // ============================================

  /**
   * Obtener mis solicitudes de soporte
   */
  getMisSolicitudes: () =>
    api.get<SolicitudSoporte[]>(`${BASE_PATH}/soporte/mis-solicitudes`),

  // ============================================
  // ADMIN (tienda_obtener_solicitudes_soporte, tienda_resolver_solicitud_soporte)
  // ============================================

  /**
   * Obtener todas las solicitudes de soporte (ADMIN)
   * Procedimiento: tienda_obtener_solicitudes_soporte(estado, limit, offset)
   */
  getSolicitudesSoporte: (estado?: string, limit = 20, offset = 0) => {
    const params = new URLSearchParams();
    if (estado) params.append('estado', estado);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    return api.get<SolicitudesSoporteResponse>(`${BASE_PATH}/admin/soporte?${params}`);
  },

  /**
   * Resolver solicitud de soporte (ADMIN)
   * Procedimiento: tienda_resolver_solicitud_soporte(solicitud_id, admin_id, aprobar, notas)
   */
  resolverSolicitud: (data: ResolverSolicitudRequest) =>
    api.post<{ success: boolean; message: string; nickname_asignado?: string }>(
      `${BASE_PATH}/admin/soporte/resolver`,
      data
    ),

  /**
   * Obtener detalle de solicitud (ADMIN)
   */
  getSolicitudDetalle: (solicitudId: string) =>
    api.get<SolicitudSoporte>(`${BASE_PATH}/admin/soporte/${solicitudId}`),
};

export default tiendaApi;
