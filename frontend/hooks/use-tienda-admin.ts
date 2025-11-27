import { useState, useCallback } from 'react';
import { tiendaApi } from '@/lib/api/tienda';
import type {
  SolicitudesSoporteResponse,
  SolicitudSoporte,
  ResolverSolicitudRequest,
} from '@/types/tienda';

interface UseTiendaAdminState {
  solicitudes: SolicitudesSoporteResponse | null;
  solicitudActual: SolicitudSoporte | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook para administradores de la tienda
 * Conecta con los procedimientos almacenados de admin:
 * 
 * 8. tienda_obtener_solicitudes_soporte -> fetchSolicitudes()
 * 9. tienda_resolver_solicitud_soporte -> resolverSolicitud()
 */
export function useTiendaAdmin() {
  const [state, setState] = useState<UseTiendaAdminState>({
    solicitudes: null,
    solicitudActual: null,
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
  // 8. PROCEDIMIENTO: tienda_obtener_solicitudes_soporte
  // ============================================
  
  /**
   * Obtener todas las solicitudes de soporte (ADMIN)
   * Llama al procedimiento: tienda_obtener_solicitudes_soporte
   * 
   * @param estado - Filtrar por estado: 'pendiente', 'en_revision', 'aprobado', 'rechazado'
   * @param limit - Límite de resultados (default 20)
   * @param offset - Offset para paginación (default 0)
   */
  const fetchSolicitudes = useCallback(async (
    estado?: string, 
    limit = 20, 
    offset = 0
  ): Promise<SolicitudesSoporteResponse | null> => {
    setLoading(true);
    try {
      const data = await tiendaApi.getSolicitudesSoporte(estado, limit, offset);
      setState(prev => ({ ...prev, solicitudes: data, isLoading: false }));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar solicitudes');
      return null;
    }
  }, []);

  /**
   * Obtener detalle de una solicitud específica (ADMIN)
   */
  const getSolicitudDetalle = useCallback(async (solicitudId: string): Promise<SolicitudSoporte | null> => {
    setLoading(true);
    try {
      const data = await tiendaApi.getSolicitudDetalle(solicitudId);
      setState(prev => ({ ...prev, solicitudActual: data, isLoading: false }));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener solicitud');
      return null;
    }
  }, []);

  // ============================================
  // 9. PROCEDIMIENTO: tienda_resolver_solicitud_soporte
  // ============================================
  
  /**
   * Resolver una solicitud de soporte (ADMIN)
   * Llama al procedimiento: tienda_resolver_solicitud_soporte
   * 
   * @param data - { solicitudId, aprobar, notas? }
   */
  const resolverSolicitud = useCallback(async (
    data: ResolverSolicitudRequest
  ): Promise<{ success: boolean; message: string; nickname_asignado?: string } | null> => {
    setLoading(true);
    try {
      const response = await tiendaApi.resolverSolicitud(data);
      setState(prev => ({ ...prev, isLoading: false }));
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al resolver solicitud');
      return null;
    }
  }, []);

  /**
   * Aprobar una solicitud (helper)
   */
  const aprobarSolicitud = useCallback(async (
    solicitudId: string, 
    notas?: string
  ): Promise<{ success: boolean; message: string; nickname_asignado?: string } | null> => {
    return resolverSolicitud({ solicitudId, aprobar: true, notas });
  }, [resolverSolicitud]);

  /**
   * Rechazar una solicitud (helper)
   */
  const rechazarSolicitud = useCallback(async (
    solicitudId: string, 
    notas?: string
  ): Promise<{ success: boolean; message: string } | null> => {
    return resolverSolicitud({ solicitudId, aprobar: false, notas });
  }, [resolverSolicitud]);

  /**
   * Limpiar error
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Limpiar solicitud actual
   */
  const clearSolicitudActual = useCallback(() => {
    setState(prev => ({ ...prev, solicitudActual: null }));
  }, []);

  return {
    // Estado
    solicitudes: state.solicitudes,
    solicitudActual: state.solicitudActual,
    isLoading: state.isLoading,
    error: state.error,
    
    // Acciones - Procedimientos 8 y 9
    fetchSolicitudes,      // 8. tienda_obtener_solicitudes_soporte
    getSolicitudDetalle,   // (detalle de solicitud)
    resolverSolicitud,     // 9. tienda_resolver_solicitud_soporte
    aprobarSolicitud,      // Helper para aprobar
    rechazarSolicitud,     // Helper para rechazar
    
    // Utilidades
    clearError,
    clearSolicitudActual,
  };
}

export default useTiendaAdmin;
