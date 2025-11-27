/**
 * API de Torneos - Funciones para consumir el backend
 * Usa el cliente API centralizado con autenticación
 */

import { api, apiFetch } from './client';

// ============================================================================
// TIPOS
// ============================================================================

/**
 * Respuesta completa de la función torneo_obtener_catalogos
 * El SQL devuelve: { success: true, catalogos: {...} }
 */
interface TorneoCatalogosResponse {
  success: boolean;
  catalogos?: TorneoCatalogos;
  error?: string;
}

/**
 * Estructura de los catálogos para el formulario de torneos.
 * NOTA: Los campos usan "valor" porque así los devuelve el SQL.
 */
export interface TorneoCatalogos {
  juegos: Array<{
    id: string;
    nombre: string;
    imagen_url?: string;
    // SQL devuelve plataformas con "valor" no "nombre"
    plataformas: Array<{ id: string; valor: string }>;
    modos_juego: Array<{ id: string; nombre: string; max_jugadores?: number }>;
  }>;
  // SQL devuelve regiones con "valor" no "nombre"
  regiones: Array<{ id: string; valor: string }>;
  tipos_torneo: Array<{
    id: string;
    valor: string;
    descripcion?: string;
    tipo_trofeo?: string;
  }>;
  // SQL devuelve tipos_entrada con "valor" no "nombre"
  tipos_entrada: Array<{ id: string; valor: string }>;
  al_mejor_de?: number[];
  formatos?: string[];
  redes_sociales?: string[];
}

/**
 * Datos para crear un torneo.
 * Los nombres de campos DEBEN coincidir con CrearTorneoFuncionDto del backend.
 */
export interface CrearTorneoData {
  // Paso 1: Información básica
  titulo: string;
  descripcion?: string;
  fecha_inicio_registro?: string; // ISO timestamp
  fecha_fin_registro?: string;
  fecha_inicio_torneo?: string;

  // Paso 2: Detalles del torneo
  juego_id?: string;
  plataforma_id?: string;
  modo_juego_id?: string;
  region_id?: string;
  tipo_torneo_id?: string;
  al_mejor_de?: number; // 1, 3, 5, 7
  formato?: string; // '1v1', '2v2', etc.
  cerrado?: boolean;
  reglas?: string;
  jugadores_pc_permitidos?: boolean;
  requiere_transmision?: boolean;
  requiere_camara?: boolean;
  tipo_entrada_id?: string;
  capacidad?: number;

  // Paso 3: Premios
  cuota?: number; // Créditos por jugador (costo de inscripción)
  comision_porcentaje?: number;
  ganador1_porcentaje?: number; // Default 70
  ganador2_porcentaje?: number; // Default 30

  // Paso 4: Detalles del anfitrión
  contacto_anfitrion?: string;
  discord_servidor?: string;
  redes_sociales?: Array<{ plataforma: string; url: string }>;

  // Paso 5: Gráficos
  banner_url?: string;
  miniatura_url?: string;
}

export interface TorneoCreado {
  success: boolean;
  torneo_id?: string;
  codigo?: string;
  estado?: string;
  message?: string;
}

export interface TorneoListItem {
  id: string;
  titulo: string;
  codigo: string;
  estado: string;
  juego: string;
  plataforma: string;
  region: string;
  max_participantes: number;
  inscripciones: number;
  inscripcion_inicio: string;
  fecha_inicio: string;
  fondo_premios: number;
  costo_inscripcion: number;
  miniatura_url?: string;
  anfitrion: string;
}

export interface ListarTorneosResponse {
  success: boolean;
  total: number;
  limit: number;
  offset: number;
  torneos: TorneoListItem[];
}

// ============================================================================
// FUNCIONES DE API
// ============================================================================

/**
 * Obtiene los catálogos necesarios para el formulario de creación.
 * No requiere autenticación.
 * 
 * El backend devuelve: { success: true, catalogos: {...} }
 * Esta función extrae solo el objeto catalogos.
 */
export async function obtenerCatalogos(): Promise<TorneoCatalogos> {
  const response = await apiFetch<TorneoCatalogosResponse>('/torneos/catalogos', { requireAuth: false });
  
  if (!response.success || !response.catalogos) {
    throw new Error(response.error || 'Error al obtener catálogos');
  }
  
  return response.catalogos;
}

/**
 * Lista torneos con filtros opcionales.
 * No requiere autenticación.
 */
export async function listarTorneos(params?: {
  estado?: string;
  juego_id?: string;
  region_id?: string;
  anfitrion_id?: string;
  busqueda?: string;
  limit?: number;
  offset?: number;
}): Promise<ListarTorneosResponse> {
  const searchParams = new URLSearchParams();
  if (params?.estado) searchParams.set('estado', params.estado);
  if (params?.juego_id) searchParams.set('juego_id', params.juego_id);
  if (params?.region_id) searchParams.set('region_id', params.region_id);
  if (params?.anfitrion_id) searchParams.set('anfitrion_id', params.anfitrion_id);
  if (params?.busqueda) searchParams.set('busqueda', params.busqueda);
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.offset) searchParams.set('offset', params.offset.toString());

  const query = searchParams.toString();
  return apiFetch<ListarTorneosResponse>(`/torneos${query ? `?${query}` : ''}`, { requireAuth: false });
}

/**
 * Obtiene el detalle completo de un torneo.
 * No requiere autenticación.
 */
export async function obtenerDetalleTorneo(torneoId: string): Promise<{
  success: boolean;
  torneo?: any;
  error?: string;
}> {
  return apiFetch(`/torneos/${torneoId}`, { requireAuth: false });
}

/**
 * Crea un nuevo torneo.
 * Requiere autenticación JWT.
 */
export async function crearTorneo(data: CrearTorneoData): Promise<TorneoCreado> {
  return api.post<TorneoCreado>('/torneos', data);
}

/**
 * Actualiza un torneo existente.
 * Requiere autenticación JWT y ser el anfitrión.
 */
export async function actualizarTorneo(torneoId: string, data: Partial<CrearTorneoData>) {
  return api.put(`/torneos/${torneoId}`, data);
}

/**
 * Cambia el estado de un torneo.
 */
export async function cambiarEstadoTorneo(torneoId: string, nuevoEstado: string) {
  return api.put(`/torneos/${torneoId}/estado`, { nuevo_estado: nuevoEstado });
}

/**
 * Agrega o actualiza una red social del torneo.
 */
export async function upsertRedSocial(
  torneoId: string,
  data: { plataforma: string; url: string; red_id?: string }
) {
  return api.post(`/torneos/${torneoId}/redes`, data);
}

/**
 * Elimina una red social del torneo.
 */
export async function eliminarRedSocial(torneoId: string, redId: string) {
  return api.delete(`/torneos/${torneoId}/redes/${redId}`);
}

/**
 * Finaliza un torneo y distribuye premios.
 */
export async function finalizarTorneo(
  torneoId: string,
  data: { ganador_id: string; segundo_lugar_id: string }
) {
  return api.post(`/torneos/${torneoId}/finalizar`, data);
}

/**
 * Lista los torneos donde el usuario es anfitrión.
 */
export async function misTorneos(params?: { estado?: string; limit?: number; offset?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.estado) searchParams.set('estado', params.estado);
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.offset) searchParams.set('offset', params.offset.toString());

  const query = searchParams.toString();
  return apiFetch<ListarTorneosResponse>(`/torneos/mis/torneos${query ? `?${query}` : ''}`);
}

// ============================================================================
// INSCRIPCIONES
// ============================================================================

export interface InscripcionResponse {
  id: string;
  fecha: string;
  torneo: any;
  usuario: any;
  estado: {
    id: string;
    valor: string;
  };
}

export interface MiInscripcionResponse {
  inscrito: boolean;
  inscripcion?: {
    id: string;
    estado: {
      id: string;
      valor: string;
    };
  };
}

/**
 * Inscribirse a un torneo (formato 1v1 - individual)
 * Requiere autenticación JWT.
 */
export async function inscribirseTorneo(torneoId: string): Promise<InscripcionResponse> {
  return api.post<InscripcionResponse>(`/torneo-inscripcion/torneo/${torneoId}/inscribir`, {});
}

/**
 * Inscribirse a un torneo con equipo (formatos 2v2 o superior)
 * Requiere autenticación JWT.
 */
export async function inscribirseTorneoConEquipo(torneoId: string, equipoId: string): Promise<InscripcionResponse> {
  return api.post<InscripcionResponse>(`/torneo-inscripcion/torneo/${torneoId}/inscribir-equipo/${equipoId}`, {});
}

/**
 * Cancelar inscripción a un torneo
 * Requiere autenticación JWT.
 */
export async function cancelarInscripcion(torneoId: string): Promise<{ message: string }> {
  return api.delete(`/torneo-inscripcion/torneo/${torneoId}/cancelar`);
}

/**
 * Verificar si el usuario está inscrito en un torneo
 * Requiere autenticación JWT.
 */
export async function verificarInscripcion(torneoId: string): Promise<MiInscripcionResponse> {
  return apiFetch<MiInscripcionResponse>(`/torneo-inscripcion/torneo/${torneoId}/mi-inscripcion`);
}

/**
 * Obtener los participantes inscritos en un torneo
 * No requiere autenticación.
 */
export async function obtenerInscritosTorneo(torneoId: string): Promise<InscripcionResponse[]> {
  return apiFetch<InscripcionResponse[]>(`/torneo-inscripcion/torneo/${torneoId}/inscritos`, { requireAuth: false });
}
