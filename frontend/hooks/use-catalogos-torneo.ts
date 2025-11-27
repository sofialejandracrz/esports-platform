'use client';

import { useState, useEffect, useCallback } from 'react';
import { obtenerCatalogos, TorneoCatalogos } from '@/lib/api/torneos';

interface UseCatalogosReturn {
  catalogos: TorneoCatalogos | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  // Helpers para obtener datos específicos
  getJuegoById: (id: string) => TorneoCatalogos['juegos'][0] | undefined;
  getPlataformasDeJuego: (juegoId: string) => TorneoCatalogos['juegos'][0]['plataformas'];
  getModosDeJuego: (juegoId: string) => TorneoCatalogos['juegos'][0]['modos_juego'];
  getRegionById: (id: string) => TorneoCatalogos['regiones'][0] | undefined;
  getTipoTorneoById: (id: string) => TorneoCatalogos['tipos_torneo'][0] | undefined;
}

/**
 * Hook para cargar y manejar los catálogos del formulario de torneos.
 * Los catálogos se cargan automáticamente al montar el componente.
 * 
 * NOTA: Los campos de catálogos usan "valor" (no "nombre") porque así
 * los devuelve el procedimiento SQL torneo_obtener_catalogos.
 */
export function useCatalogosTorneo(): UseCatalogosReturn {
  const [catalogos, setCatalogos] = useState<TorneoCatalogos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalogos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerCatalogos();
      setCatalogos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar catálogos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalogos();
  }, [fetchCatalogos]);

  // Helper: Obtener juego por ID
  const getJuegoById = useCallback(
    (id: string) => {
      return catalogos?.juegos?.find((j) => j.id === id);
    },
    [catalogos]
  );

  // Helper: Obtener plataformas de un juego específico
  const getPlataformasDeJuego = useCallback(
    (juegoId: string) => {
      const juego = getJuegoById(juegoId);
      return juego?.plataformas || [];
    },
    [getJuegoById]
  );

  // Helper: Obtener modos de juego de un juego específico
  const getModosDeJuego = useCallback(
    (juegoId: string) => {
      const juego = getJuegoById(juegoId);
      return juego?.modos_juego || [];
    },
    [getJuegoById]
  );

  // Helper: Obtener región por ID
  const getRegionById = useCallback(
    (id: string) => {
      return catalogos?.regiones?.find((r) => r.id === id);
    },
    [catalogos]
  );

  // Helper: Obtener tipo de torneo por ID
  const getTipoTorneoById = useCallback(
    (id: string) => {
      return catalogos?.tipos_torneo?.find((t) => t.id === id);
    },
    [catalogos]
  );

  return {
    catalogos,
    loading,
    error,
    refetch: fetchCatalogos,
    getJuegoById,
    getPlataformasDeJuego,
    getModosDeJuego,
    getRegionById,
    getTipoTorneoById,
  };
}
