import { getToken } from '@/lib/auth-storage';
import { env } from '@/config/env';

const API_URL = env.NEXT_PUBLIC_API_URL;

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Cliente HTTP con soporte para autenticación JWT
 */
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requireAuth = true, headers: customHeaders, ...restOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  // Agregar token de autenticación si es requerido
  if (requireAuth) {
    const token = getToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...restOptions,
    headers,
  });

  // Si el token expiró o es inválido, redirigir al login
  if (response.status === 401 && requireAuth) {
    // Limpiar el storage y redirigir
    if (typeof window !== 'undefined') {
      localStorage.removeItem('esports_auth_token');
      localStorage.removeItem('esports_user');
      window.location.href = '/auth/login';
    }
    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
  }

  // Manejar respuestas sin contenido (204 No Content)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    if (!response.ok) {
      throw new Error('Error en la solicitud');
    }
    return undefined as T;
  }

  // Intentar parsear JSON, manejar respuestas vacías
  let data: T;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const text = await response.text();
    data = text ? JSON.parse(text) : undefined;
  } else {
    data = undefined as T;
  }

  if (!response.ok) {
    throw new Error((data as any)?.message || 'Error en la solicitud');
  }

  return data as T;
}

/**
 * Métodos HTTP helpers
 */
export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};
