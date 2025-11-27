/**
 * ============================================================================
 * Hook: usePerfil
 * 
 * Hook personalizado para cargar y manejar el estado del perfil de usuario.
 * Facilita el uso del perfil en componentes React.
 * ============================================================================
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  obtenerPerfilCompleto,
  obtenerAmigos,
  obtenerTrofeos,
  obtenerLogros,
  obtenerHistorialTorneos,
  PerfilCompleto,
  Amigo,
  Trofeo,
  Logro,
  HistorialTorneo,
} from '@/lib/api/perfil';

interface UsePerfilOptions {
  /**
   * Si es true, carga el perfil automáticamente al montar el componente.
   * Default: true
   */
  autoLoad?: boolean;
  /**
   * Si es true, envía el token JWT para ver datos privados.
   * Default: true
   */
  requireAuth?: boolean;
}

interface UsePerfilReturn {
  /** Datos del perfil completo */
  perfil: PerfilCompleto | null;
  /** Estado de carga inicial */
  loading: boolean;
  /** Mensaje de error si ocurrió alguno */
  error: string | null;
  /** Función para recargar el perfil */
  recargar: () => Promise<void>;
  /** Funciones para cargar más datos (paginación) */
  cargarMasAmigos: (offset: number, limit?: number) => Promise<Amigo[]>;
  cargarMasTrofeos: (offset: number, limit?: number) => Promise<Trofeo[]>;
  cargarMasLogros: (offset: number, limit?: number) => Promise<Logro[]>;
  cargarMasTorneos: (offset: number, limit?: number) => Promise<HistorialTorneo[]>;
}

/**
 * Hook para manejar el perfil de usuario.
 * 
 * @param nickname - El nickname del usuario cuyo perfil se quiere cargar
 * @param options - Opciones de configuración
 * 
 * @example
 * // Uso básico
 * const { perfil, loading, error } = usePerfil('jugador123');
 * 
 * @example
 * // Con opciones
 * const { perfil, loading, error, recargar } = usePerfil('jugador123', {
 *   autoLoad: true,
 *   requireAuth: true,
 * });
 * 
 * @example
 * // Cargar más amigos (paginación)
 * const { perfil, cargarMasAmigos } = usePerfil('jugador123');
 * const nuevosAmigos = await cargarMasAmigos(10); // offset=10
 */
export function usePerfil(
  nickname: string | undefined,
  options: UsePerfilOptions = {}
): UsePerfilReturn {
  const { autoLoad = true, requireAuth = true } = options;

  const [perfil, setPerfil] = useState<PerfilCompleto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar el perfil completo
  const cargarPerfil = useCallback(async () => {
    if (!nickname) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await obtenerPerfilCompleto(nickname, requireAuth);
      setPerfil(data);
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al cargar el perfil';
      setError(mensaje);
      setPerfil(null);
    } finally {
      setLoading(false);
    }
  }, [nickname, requireAuth]);

  // Cargar perfil automáticamente si autoLoad está habilitado
  useEffect(() => {
    if (autoLoad && nickname) {
      cargarPerfil();
    }
  }, [autoLoad, nickname, cargarPerfil]);

  // Funciones para paginación
  const cargarMasAmigos = useCallback(
    async (offset: number, limit: number = 20): Promise<Amigo[]> => {
      if (!nickname) return [];
      return obtenerAmigos(nickname, limit, offset);
    },
    [nickname]
  );

  const cargarMasTrofeos = useCallback(
    async (offset: number, limit: number = 50): Promise<Trofeo[]> => {
      if (!nickname) return [];
      return obtenerTrofeos(nickname, limit, offset);
    },
    [nickname]
  );

  const cargarMasLogros = useCallback(
    async (offset: number, limit: number = 50): Promise<Logro[]> => {
      if (!nickname) return [];
      return obtenerLogros(nickname, limit, offset);
    },
    [nickname]
  );

  const cargarMasTorneos = useCallback(
    async (offset: number, limit: number = 20): Promise<HistorialTorneo[]> => {
      if (!nickname) return [];
      return obtenerHistorialTorneos(nickname, limit, offset);
    },
    [nickname]
  );

  return {
    perfil,
    loading,
    error,
    recargar: cargarPerfil,
    cargarMasAmigos,
    cargarMasTrofeos,
    cargarMasLogros,
    cargarMasTorneos,
  };
}

export default usePerfil;
