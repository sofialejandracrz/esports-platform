/**
 * ============================================================================
 * Hook useConfiguracion
 * 
 * Hook personalizado para manejar la configuración del usuario.
 * Proporciona estado, funciones de actualización y manejo de errores.
 * ============================================================================
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import {
  // Tipos
  ConfiguracionCompleta,
  ConfigPersonal,
  ConfigSocial,
  ConfigJuegos,
  ConfigPreferencias,
  ConfigCuenta,
  ConfigSeguridad,
  ConfigRetiro,
  UpdateConfigPersonalDto,
  UpsertRedSocialDto,
  UpsertCuentaJuegoDto,
  UpdatePreferenciasDto,
  UpdatePasswordDto,
  UpdateSeguridadDto,
  // Funciones API
  obtenerConfiguracionCompleta,
  obtenerConfigPersonal,
  actualizarConfigPersonal,
  obtenerConfigSocial,
  upsertRedSocial,
  eliminarRedSocial,
  obtenerConfigJuegos,
  upsertCuentaJuego,
  eliminarCuentaJuego,
  obtenerConfigPreferencias,
  actualizarPreferencias,
  obtenerConfigCuenta,
  cambiarPassword,
  obtenerConfigSeguridad,
  actualizarSeguridad,
  obtenerConfigRetiro,
} from '@/lib/api/configuracion';

// ============================================================================
// HOOK PRINCIPAL - Configuración Completa
// ============================================================================

export function useConfiguracionCompleta() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<ConfiguracionCompleta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const config = await obtenerConfiguracionCompleta();
      setData(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar configuración');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  return { data, loading, error, cargar };
}

// ============================================================================
// HOOK - Configuración Personal
// ============================================================================

export function useConfigPersonal() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<ConfigPersonal | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const config = await obtenerConfigPersonal();
      setData(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar configuración personal');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  const guardar = useCallback(async (dto: UpdateConfigPersonalDto) => {
    setSaving(true);
    setError(null);

    try {
      await actualizarConfigPersonal(dto);
      // Recargar datos actualizados
      const config = await obtenerConfigPersonal();
      setData(config);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { data, loading, saving, error, cargar, guardar };
}

// ============================================================================
// HOOK - Configuración Social
// ============================================================================

export function useConfigSocial() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<ConfigSocial | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const config = await obtenerConfigSocial();
      setData(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar redes sociales');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  const guardarRed = useCallback(async (dto: UpsertRedSocialDto) => {
    setSaving(true);
    setError(null);

    try {
      await upsertRedSocial(dto);
      // Recargar datos
      const config = await obtenerConfigSocial();
      setData(config);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar red social');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const eliminarRed = useCallback(async (redId: string) => {
    setSaving(true);
    setError(null);

    try {
      await eliminarRedSocial(redId);
      // Recargar datos
      const config = await obtenerConfigSocial();
      setData(config);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar red social');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { data, loading, saving, error, cargar, guardarRed, eliminarRed };
}

// ============================================================================
// HOOK - Configuración Juegos
// ============================================================================

export function useConfigJuegos() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<ConfigJuegos | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const config = await obtenerConfigJuegos();
      setData(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar cuentas de juego');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  const guardarCuenta = useCallback(async (dto: UpsertCuentaJuegoDto) => {
    setSaving(true);
    setError(null);

    try {
      await upsertCuentaJuego(dto);
      // Recargar datos
      const config = await obtenerConfigJuegos();
      setData(config);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar cuenta de juego');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const eliminarCuenta = useCallback(async (cuentaId: string) => {
    setSaving(true);
    setError(null);

    try {
      await eliminarCuentaJuego(cuentaId);
      // Recargar datos
      const config = await obtenerConfigJuegos();
      setData(config);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar cuenta de juego');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { data, loading, saving, error, cargar, guardarCuenta, eliminarCuenta };
}

// ============================================================================
// HOOK - Configuración Preferencias
// ============================================================================

export function useConfigPreferencias() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<ConfigPreferencias | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const config = await obtenerConfigPreferencias();
      setData(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar preferencias');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  const guardar = useCallback(async (dto: UpdatePreferenciasDto) => {
    setSaving(true);
    setError(null);

    try {
      await actualizarPreferencias(dto);
      // Recargar datos
      const config = await obtenerConfigPreferencias();
      setData(config);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar preferencias');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { data, loading, saving, error, cargar, guardar };
}

// ============================================================================
// HOOK - Configuración Cuenta
// ============================================================================

export function useConfigCuenta() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<ConfigCuenta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const config = await obtenerConfigCuenta();
      setData(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar información de cuenta');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  const cambiarContrasena = useCallback(async (dto: UpdatePasswordDto) => {
    setSaving(true);
    setError(null);

    try {
      await cambiarPassword(dto);
      // Cerrar sesión después de cambiar contraseña
      logout();
      router.push('/auth/login');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar contraseña');
      return false;
    } finally {
      setSaving(false);
    }
  }, [logout, router]);

  return { data, loading, saving, error, cargar, cambiarContrasena };
}

// ============================================================================
// HOOK - Configuración Seguridad
// ============================================================================

export function useConfigSeguridad() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<ConfigSeguridad | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const config = await obtenerConfigSeguridad();
      setData(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos de seguridad');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  const guardar = useCallback(async (dto: UpdateSeguridadDto) => {
    setSaving(true);
    setError(null);

    try {
      await actualizarSeguridad(dto);
      // Recargar datos
      const config = await obtenerConfigSeguridad();
      setData(config);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar datos de seguridad');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { data, loading, saving, error, cargar, guardar };
}

// ============================================================================
// HOOK - Configuración Retiro
// ============================================================================

export function useConfigRetiro() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<ConfigRetiro | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const config = await obtenerConfigRetiro();
      setData(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar información de retiro');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  return { data, loading, error, cargar };
}

// ============================================================================
// HOOK GENÉRICO - useConfiguracion (carga todas las secciones)
// ============================================================================

export function useConfiguracion() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [configuracion, setConfiguracion] = useState<ConfiguracionCompleta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarTodo = useCallback(async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const config = await obtenerConfiguracionCompleta();
      setConfiguracion(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar configuración');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  // Cargar al montar
  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  // Función para refrescar una sección específica
  const refreshSection = useCallback(async (section: 'personal' | 'social' | 'juegos' | 'preferencias' | 'cuenta' | 'seguridad' | 'retiro') => {
    try {
      let updatedData: Partial<ConfiguracionCompleta> = {};
      
      switch (section) {
        case 'personal':
          updatedData.personal = await obtenerConfigPersonal();
          break;
        case 'social':
          updatedData.social = await obtenerConfigSocial();
          break;
        case 'juegos':
          updatedData.juegos = await obtenerConfigJuegos();
          break;
        case 'preferencias':
          updatedData.preferencias = await obtenerConfigPreferencias();
          break;
        case 'cuenta':
          updatedData.cuenta = await obtenerConfigCuenta();
          break;
        case 'seguridad':
          updatedData.seguridad = await obtenerConfigSeguridad();
          break;
        case 'retiro':
          updatedData.retiro = await obtenerConfigRetiro();
          break;
      }

      setConfiguracion(prev => prev ? { ...prev, ...updatedData } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error al refrescar ${section}`);
    }
  }, []);

  return { configuracion, isLoading, error, refreshSection, reload: cargarTodo };
}
