/**
 * ============================================================================
 * API de Configuración de Usuario
 * 
 * Este archivo contiene todas las funciones para consumir los endpoints
 * de configuración del dashboard de usuario.
 * ============================================================================
 */

import { api } from './client';

// ============================================================================
// TIPOS / INTERFACES
// ============================================================================

// --- Sección Personal ---
export interface GeneroOption {
  id: string;
  valor: string;
}

export interface AvatarInfo {
  id: string | null;
  nombre: string | null;
  url: string | null;
}

export interface ConfigPersonal {
  nickname: string;
  biografia: string | null;
  genero: GeneroOption | null;
  timezone: string | null;
  foto_perfil: string | null;
  avatar: AvatarInfo;
  generos_disponibles: GeneroOption[];
}

export interface UpdateConfigPersonalDto {
  biografia?: string;
  genero_id?: string;
  timezone?: string;
  avatar_id?: string;
}

// --- Sección Social ---
export interface RedSocialConfig {
  id: string;
  plataforma: string;
  enlace: string;
}

export interface ConfigSocial {
  redes_sociales: RedSocialConfig[];
  plataformas_sugeridas: string[];
}

export interface UpsertRedSocialDto {
  plataforma: string;
  enlace: string;
  red_id?: string;
}

// --- Sección Juegos ---
export interface PlataformaJuego {
  id: string;
  valor: string;
}

export interface CuentaJuegoConfig {
  id: string;
  plataforma_id: string;
  plataforma: string;
  identificador: string;
}

export interface ConfigJuegos {
  cuentas_juego: CuentaJuegoConfig[];
  plataformas_disponibles: PlataformaJuego[];
}

export interface UpsertCuentaJuegoDto {
  plataforma_id: string;
  identificador: string;
  cuenta_id?: string;
}

// --- Sección Preferencias ---
export interface ConfigPreferencias {
  desafios_habilitados: boolean;
}

export interface UpdatePreferenciasDto {
  desafios_habilitados: boolean;
}

// --- Sección Cuenta ---
export interface ConfigCuenta {
  correo: string;
  nickname: string;
  creado_en: string;
  ultima_conexion: string | null;
  estado: string;
}

export interface UpdatePasswordDto {
  password_actual: string;
  password_nuevo: string;
  password_confirmacion: string;
}

// --- Sección Seguridad ---
export interface ConfigSeguridad {
  correo_paypal: string | null;
  p_nombre: string | null;
  s_nombre: string | null;
  p_apellido: string | null;
  s_apellido: string | null;
  telefono: string | null;
  direccion: string | null;
  ciudad: string | null;
  estado: string | null;
  codigo_postal: string | null;
  pais: string | null;
  divisa: string | null;
  divisas_disponibles: string[];
}

export interface UpdateSeguridadDto {
  correo_paypal?: string;
  p_nombre?: string;
  s_nombre?: string;
  p_apellido?: string;
  s_apellido?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  estado?: string;
  codigo_postal?: string;
  pais?: string;
  divisa?: string;
}

// --- Sección Retiro ---
export interface ConfigRetiro {
  saldo_disponible: string;
  creditos: number;
  correo_paypal: string | null;
  paypal_configurado: boolean;
  historial_retiros: any[];
  mensaje: string;
}

// --- Configuración Completa ---
export interface ConfiguracionCompleta {
  personal: ConfigPersonal;
  social: ConfigSocial;
  juegos: ConfigJuegos;
  preferencias: ConfigPreferencias;
  cuenta: ConfigCuenta;
  seguridad: ConfigSeguridad;
  retiro: ConfigRetiro;
}

// --- Respuestas ---
export interface ConfigSuccessResponse {
  success: boolean;
  message: string;
}

export interface UpsertSocialResponse extends ConfigSuccessResponse {
  red_id: string;
}

export interface UpsertCuentaJuegoResponse extends ConfigSuccessResponse {
  cuenta_id: string;
}

export interface UpdatePreferenciasResponse extends ConfigSuccessResponse {
  desafios_habilitados: boolean;
}

// ============================================================================
// FUNCIONES DE API - Configuración Completa
// ============================================================================

/**
 * Obtiene TODA la configuración del usuario en una sola llamada.
 * Útil para cargar el dashboard completo de configuración.
 */
export async function obtenerConfiguracionCompleta(): Promise<ConfiguracionCompleta> {
  return api.get<ConfiguracionCompleta>('/usuario/configuracion');
}

// ============================================================================
// FUNCIONES DE API - Sección Personal
// ============================================================================

/**
 * Obtiene la configuración personal del usuario.
 */
export async function obtenerConfigPersonal(): Promise<ConfigPersonal> {
  return api.get<ConfigPersonal>('/usuario/configuracion/personal');
}

/**
 * Actualiza la configuración personal del usuario.
 */
export async function actualizarConfigPersonal(
  data: UpdateConfigPersonalDto
): Promise<ConfigSuccessResponse> {
  return api.put<ConfigSuccessResponse>('/usuario/configuracion/personal', data);
}

// ============================================================================
// FUNCIONES DE API - Sección Social
// ============================================================================

/**
 * Obtiene las redes sociales configuradas del usuario.
 */
export async function obtenerConfigSocial(): Promise<ConfigSocial> {
  return api.get<ConfigSocial>('/usuario/configuracion/social');
}

/**
 * Crea o actualiza una red social.
 * Si se envía red_id, actualiza la existente; si no, crea una nueva.
 */
export async function upsertRedSocial(
  data: UpsertRedSocialDto
): Promise<UpsertSocialResponse> {
  return api.post<UpsertSocialResponse>('/usuario/configuracion/social', data);
}

/**
 * Elimina una red social por su ID.
 */
export async function eliminarRedSocial(redId: string): Promise<ConfigSuccessResponse> {
  return api.delete<ConfigSuccessResponse>(`/usuario/configuracion/social/${redId}`);
}

// ============================================================================
// FUNCIONES DE API - Sección Juegos
// ============================================================================

/**
 * Obtiene las cuentas de juego configuradas del usuario.
 */
export async function obtenerConfigJuegos(): Promise<ConfigJuegos> {
  return api.get<ConfigJuegos>('/usuario/configuracion/juegos');
}

/**
 * Crea o actualiza una cuenta de juego.
 * Si se envía cuenta_id, actualiza la existente; si no, crea una nueva.
 */
export async function upsertCuentaJuego(
  data: UpsertCuentaJuegoDto
): Promise<UpsertCuentaJuegoResponse> {
  return api.post<UpsertCuentaJuegoResponse>('/usuario/configuracion/juegos', data);
}

/**
 * Elimina una cuenta de juego por su ID.
 */
export async function eliminarCuentaJuego(cuentaId: string): Promise<ConfigSuccessResponse> {
  return api.delete<ConfigSuccessResponse>(`/usuario/configuracion/juegos/${cuentaId}`);
}

// ============================================================================
// FUNCIONES DE API - Sección Preferencias
// ============================================================================

/**
 * Obtiene las preferencias del usuario.
 */
export async function obtenerConfigPreferencias(): Promise<ConfigPreferencias> {
  return api.get<ConfigPreferencias>('/usuario/configuracion/preferencias');
}

/**
 * Actualiza las preferencias del usuario.
 */
export async function actualizarPreferencias(
  data: UpdatePreferenciasDto
): Promise<UpdatePreferenciasResponse> {
  return api.put<UpdatePreferenciasResponse>('/usuario/configuracion/preferencias', data);
}

// ============================================================================
// FUNCIONES DE API - Sección Cuenta
// ============================================================================

/**
 * Obtiene la información de cuenta del usuario.
 */
export async function obtenerConfigCuenta(): Promise<ConfigCuenta> {
  return api.get<ConfigCuenta>('/usuario/configuracion/cuenta');
}

/**
 * Cambia la contraseña del usuario.
 */
export async function cambiarPassword(
  data: UpdatePasswordDto
): Promise<ConfigSuccessResponse> {
  return api.put<ConfigSuccessResponse>('/usuario/configuracion/cuenta/password', data);
}

// ============================================================================
// FUNCIONES DE API - Sección Seguridad
// ============================================================================

/**
 * Obtiene los datos de seguridad/pago del usuario.
 */
export async function obtenerConfigSeguridad(): Promise<ConfigSeguridad> {
  return api.get<ConfigSeguridad>('/usuario/configuracion/seguridad');
}

/**
 * Actualiza los datos de seguridad/pago del usuario.
 */
export async function actualizarSeguridad(
  data: UpdateSeguridadDto
): Promise<ConfigSuccessResponse> {
  return api.put<ConfigSuccessResponse>('/usuario/configuracion/seguridad', data);
}

// ============================================================================
// FUNCIONES DE API - Sección Retiro
// ============================================================================

/**
 * Obtiene la información de retiro del usuario.
 */
export async function obtenerConfigRetiro(): Promise<ConfigRetiro> {
  return api.get<ConfigRetiro>('/usuario/configuracion/retiro');
}
