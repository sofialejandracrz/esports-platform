/**
 * ============================================================================
 * API de Perfil de Usuario
 * 
 * Este archivo contiene todas las funciones para consumir los endpoints
 * del perfil de usuario desde el frontend.
 * ============================================================================
 */

import { api } from './client';

// ============================================================================
// TIPOS / INTERFACES
// ============================================================================

export interface UsuarioBasico {
  id: string;
  nickname: string;
  xp: number;
  saldo: number;
  creditos: number;
  foto_perfil: string | null;
  biografia: string | null;
  estado: string;
  ultima_conexion: string | null;
  desafios_habilitados: boolean;
  creado_en: string;
  avatar_url: string | null;
  avatar_nombre: string | null;
  rol: string;
}

export interface DatosPersonales {
  nombre_completo?: string;
  correo?: string;
  fecha_nacimiento?: string;
  pais: string | null;
  ciudad: string | null;
}

export interface EstadisticasGlobales {
  total_amigos: number;
  total_seguidores: number;
  total_siguiendo: number;
  total_trofeos: number;
  total_logros: number;
  total_torneos_participados: number;
  total_victorias_torneos: number;
  total_derrotas_global: number;
  dinero_total_ganado: number;
}

export interface EstadoAmistad {
  estado: string | null;
  solicitud_id: string | null;
  puede_agregar: boolean;
}

export interface Amigo {
  id: string;
  nickname: string;
  foto_perfil: string | null;
  avatar_url: string | null;
  estado: string;
  ultima_conexion: string | null;
  xp: number;
  fecha_amistad: string;
}

export interface Trofeo {
  id: string;
  tipo: string;
  ganado_en: string;
  torneo_id: string | null;
  torneo_titulo: string | null;
  torneo_juego: string | null;
  posicion: number | null;
}

export interface Logro {
  id: string;
  nombre: string;
  descripcion: string;
  fecha_obtenido: string;
}

export interface EstadisticaJuego {
  juego_id: string;
  juego_nombre: string;
  victorias: number;
  derrotas: number;
  empates: number;
  porcentaje_victorias: number;
  nivel_rango: string | null;
  horas_jugadas: number;
}

export interface HistorialTorneo {
  torneo_id: string;
  titulo: string;
  juego: string | null;
  fecha_inicio: string;
  fecha_inscripcion: string;
  estado_inscripcion: string;
  posicion_final: number | null;
  premio_ganado: number;
  trofeo: string | null;
}

export interface RedSocial {
  id: string;
  plataforma: string;
  enlace: string;
}

export interface CuentaJuego {
  id: string;
  plataforma: string;
  identificador: string;
}

export interface Equipo {
  id: string;
  nombre: string;
  descripcion: string | null;
  avatar_url: string | null;
  rol: string;
  fecha_ingreso: string;
  total_miembros: number;
}

// Tipo completo del perfil
export interface PerfilCompleto {
  usuario: UsuarioBasico;
  datos_personales: DatosPersonales;
  estadisticas_globales: EstadisticasGlobales;
  estado_amistad: EstadoAmistad;
  amigos: Amigo[];
  trofeos: Trofeo[];
  logros: Logro[];
  estadisticas_juegos: EstadisticaJuego[];
  historial_torneos: HistorialTorneo[];
  redes_sociales: RedSocial[];
  cuentas_juego: CuentaJuego[];
  equipos: Equipo[];
}

// ============================================================================
// FUNCIONES DE API
// ============================================================================

/**
 * Obtiene el perfil completo de un usuario.
 * 
 * Este es el endpoint principal que retorna TODA la información del perfil
 * en una sola llamada. Es el que deberías usar para cargar la página de perfil.
 * 
 * @param nickname - El nickname del usuario a consultar
 * @param requireAuth - Si es true, envía el token JWT (para ver datos privados)
 * @returns PerfilCompleto - Toda la información del perfil
 * 
 * @example
 * // Cargar perfil sin autenticación (solo datos públicos)
 * const perfil = await obtenerPerfilCompleto('jugador123', false);
 * 
 * @example
 * // Cargar perfil con autenticación (incluye datos privados si es tu perfil)
 * const perfil = await obtenerPerfilCompleto('jugador123', true);
 */
export async function obtenerPerfilCompleto(
  nickname: string,
  requireAuth: boolean = true
): Promise<PerfilCompleto> {
  return api.get<PerfilCompleto>(`/perfil/${nickname}`, { requireAuth });
}

/**
 * Obtiene la lista de amigos de un usuario con paginación.
 * Útil para implementar "Ver más" o scroll infinito en la lista de amigos.
 * 
 * @param nickname - El nickname del usuario
 * @param limit - Cantidad de amigos a obtener (default: 20)
 * @param offset - Desde qué posición empezar (default: 0)
 */
export async function obtenerAmigos(
  nickname: string,
  limit: number = 20,
  offset: number = 0
): Promise<Amigo[]> {
  return api.get<Amigo[]>(
    `/perfil/${nickname}/amigos?limit=${limit}&offset=${offset}`,
    { requireAuth: false }
  );
}

/**
 * Obtiene los trofeos de un usuario con paginación.
 */
export async function obtenerTrofeos(
  nickname: string,
  limit: number = 50,
  offset: number = 0
): Promise<Trofeo[]> {
  return api.get<Trofeo[]>(
    `/perfil/${nickname}/trofeos?limit=${limit}&offset=${offset}`,
    { requireAuth: false }
  );
}

/**
 * Obtiene los logros de un usuario con paginación.
 */
export async function obtenerLogros(
  nickname: string,
  limit: number = 50,
  offset: number = 0
): Promise<Logro[]> {
  return api.get<Logro[]>(
    `/perfil/${nickname}/logros?limit=${limit}&offset=${offset}`,
    { requireAuth: false }
  );
}

/**
 * Obtiene las estadísticas de juego de un usuario.
 */
export async function obtenerEstadisticasJuegos(
  nickname: string
): Promise<EstadisticaJuego[]> {
  return api.get<EstadisticaJuego[]>(
    `/perfil/${nickname}/estadisticas-juegos`,
    { requireAuth: false }
  );
}

/**
 * Obtiene el historial de torneos de un usuario con paginación.
 */
export async function obtenerHistorialTorneos(
  nickname: string,
  limit: number = 20,
  offset: number = 0
): Promise<HistorialTorneo[]> {
  return api.get<HistorialTorneo[]>(
    `/perfil/${nickname}/historial-torneos?limit=${limit}&offset=${offset}`,
    { requireAuth: false }
  );
}

/**
 * Obtiene las redes sociales de un usuario.
 */
export async function obtenerRedesSociales(
  nickname: string
): Promise<RedSocial[]> {
  return api.get<RedSocial[]>(
    `/perfil/${nickname}/redes-sociales`,
    { requireAuth: false }
  );
}

/**
 * Obtiene las cuentas de juego de un usuario.
 */
export async function obtenerCuentasJuego(
  nickname: string
): Promise<CuentaJuego[]> {
  return api.get<CuentaJuego[]>(
    `/perfil/${nickname}/cuentas-juego`,
    { requireAuth: false }
  );
}

/**
 * Obtiene los equipos de un usuario.
 */
export async function obtenerEquipos(nickname: string): Promise<Equipo[]> {
  return api.get<Equipo[]>(
    `/perfil/${nickname}/equipos`,
    { requireAuth: false }
  );
}

// ============================================================================
// FUNCIONES DE AMISTAD
// ============================================================================

export interface SolicitudAmistad {
  id: string;
  usuario1: {
    id: string;
    nickname: string;
    fotoPerfil?: string;
    avatar?: { url: string };
  };
  usuario2: {
    id: string;
    nickname: string;
    fotoPerfil?: string;
    avatar?: { url: string };
  };
  estado: {
    valor: string;
  };
  creadoEn: string;
}

/**
 * Enviar solicitud de amistad a un usuario
 * @param destinatarioId - UUID del usuario al que se envía la solicitud
 */
export async function enviarSolicitudAmistad(destinatarioId: string): Promise<SolicitudAmistad> {
  return api.post<SolicitudAmistad>(`/usuario-amigos/solicitud/${destinatarioId}`);
}

/**
 * Aceptar una solicitud de amistad recibida
 * @param solicitudId - UUID de la solicitud
 */
export async function aceptarSolicitudAmistad(solicitudId: string): Promise<SolicitudAmistad> {
  return api.patch<SolicitudAmistad>(`/usuario-amigos/aceptar/${solicitudId}`);
}

/**
 * Rechazar una solicitud de amistad recibida
 * @param solicitudId - UUID de la solicitud
 */
export async function rechazarSolicitudAmistad(solicitudId: string): Promise<void> {
  return api.delete<void>(`/usuario-amigos/rechazar/${solicitudId}`);
}

/**
 * Cancelar una solicitud de amistad que yo envié
 * @param solicitudId - UUID de la solicitud
 */
export async function cancelarSolicitudAmistad(solicitudId: string): Promise<void> {
  return api.delete<void>(`/usuario-amigos/cancelar/${solicitudId}`);
}

/**
 * Eliminar un amigo (romper amistad)
 * @param amistadId - UUID de la relación de amistad
 */
export async function eliminarAmigo(amistadId: string): Promise<void> {
  return api.delete<void>(`/usuario-amigos/eliminar/${amistadId}`);
}

/**
 * Obtener mis solicitudes de amistad pendientes recibidas
 */
export async function obtenerSolicitudesRecibidas(): Promise<SolicitudAmistad[]> {
  return api.get<SolicitudAmistad[]>('/usuario-amigos/solicitudes/recibidas');
}

/**
 * Obtener mis solicitudes de amistad pendientes enviadas
 */
export async function obtenerSolicitudesEnviadas(): Promise<SolicitudAmistad[]> {
  return api.get<SolicitudAmistad[]>('/usuario-amigos/solicitudes/enviadas');
}
