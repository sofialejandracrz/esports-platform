/**
 * ============================================================================
 * DTOs para el perfil de usuario
 * Estos DTOs representan la estructura de datos que retornan las funciones
 * almacenadas en PostgreSQL
 * ============================================================================
 */

// DTO para la información básica del usuario
export class UsuarioBasicoDto {
  id: string;
  nickname: string;
  xp: number;
  saldo: number;
  creditos: number;
  foto_perfil: string | null;
  biografia: string | null;
  estado: string;
  ultima_conexion: Date | null;
  desafios_habilitados: boolean;
  creado_en: Date;
  avatar_url: string | null;
  avatar_nombre: string | null;
  rol: string;
}

// DTO para datos personales (solo visible para el propio usuario)
export class DatosPersonalesDto {
  nombre_completo?: string;
  correo?: string;
  fecha_nacimiento?: Date;
  pais: string | null;
  ciudad: string | null;
}

// DTO para estadísticas globales
export class EstadisticasGlobalesDto {
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

// DTO para estado de amistad
export class EstadoAmistadDto {
  estado: string | null;
  solicitud_id: string | null;
  puede_agregar: boolean;
}

// DTO para amigo
export class AmigoDto {
  id: string;
  nickname: string;
  foto_perfil: string | null;
  avatar_url: string | null;
  estado: string;
  ultima_conexion: Date | null;
  xp: number;
  fecha_amistad: Date;
}

// DTO para trofeo
export class TrofeoDto {
  id: string;
  tipo: string;
  ganado_en: Date;
  torneo_id: string | null;
  torneo_titulo: string | null;
  torneo_juego: string | null;
  posicion: number | null;
}

// DTO para logro
export class LogroDto {
  id: string;
  nombre: string;
  descripcion: string;
  fecha_obtenido: Date;
}

// DTO para estadísticas de juego
export class EstadisticaJuegoDto {
  juego_id: string;
  juego_nombre: string;
  victorias: number;
  derrotas: number;
  empates: number;
  porcentaje_victorias: number;
  nivel_rango: string | null;
  horas_jugadas: number;
}

// DTO para historial de torneo
export class HistorialTorneoDto {
  torneo_id: string;
  titulo: string;
  juego: string | null;
  fecha_inicio: Date;
  fecha_inscripcion: Date;
  estado_inscripcion: string;
  posicion_final: number | null;
  premio_ganado: number;
  trofeo: string | null;
}

// DTO para red social
export class RedSocialDto {
  id: string;
  plataforma: string;
  enlace: string;
}

// DTO para cuenta de juego
export class CuentaJuegoDto {
  id: string;
  plataforma: string;
  identificador: string;
}

// DTO para equipo
export class EquipoDto {
  id: string;
  nombre: string;
  descripcion: string | null;
  avatar_url: string | null;
  rol: string;
  fecha_ingreso: Date;
  total_miembros: number;
}

// DTO completo del perfil (estructura que retorna obtener_perfil_completo_json)
export class PerfilCompletoDto {
  usuario: UsuarioBasicoDto;
  datos_personales: DatosPersonalesDto;
  estadisticas_globales: EstadisticasGlobalesDto;
  estado_amistad: EstadoAmistadDto;
  amigos: AmigoDto[];
  trofeos: TrofeoDto[];
  logros: LogroDto[];
  estadisticas_juegos: EstadisticaJuegoDto[];
  historial_torneos: HistorialTorneoDto[];
  redes_sociales: RedSocialDto[];
  cuentas_juego: CuentaJuegoDto[];
  equipos: EquipoDto[];
}

// DTO para parámetros de consulta paginada
export class PaginacionQueryDto {
  limit?: number;
  offset?: number;
}

// DTOs para respuestas de funciones individuales (para endpoints específicos)
export class ListaAmigosResponseDto {
  amigos: AmigoDto[];
  total: number;
  limit: number;
  offset: number;
}

export class VitrinaTrofeosResponseDto {
  trofeos: TrofeoDto[];
  total: number;
  limit: number;
  offset: number;
}

export class LogrosResponseDto {
  logros: LogroDto[];
  total: number;
  limit: number;
  offset: number;
}

export class HistorialTorneosResponseDto {
  torneos: HistorialTorneoDto[];
  total: number;
  limit: number;
  offset: number;
}
