import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// DTOs para CREAR TORNEO (torneo_crear)
// ============================================================================

/**
 * Red social para el torneo
 */
export class RedSocialTorneoDto {
  @IsNotEmpty({ message: 'La plataforma es requerida' })
  @IsString()
  plataforma: string; // 'twitch', 'discord', 'youtube', 'facebook', 'x'

  @IsNotEmpty({ message: 'La URL es requerida' })
  @IsString()
  url: string;
}

/**
 * DTO para crear un nuevo torneo usando la función almacenada torneo_crear
 */
export class CrearTorneoFuncionDto {
  // === Paso 1: Información básica ===
  @IsNotEmpty({ message: 'El título es requerido' })
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  fecha_inicio_registro?: string; // ISO timestamp

  @IsOptional()
  @IsString()
  fecha_fin_registro?: string;

  @IsOptional()
  @IsString()
  fecha_inicio_torneo?: string;

  // === Paso 2: Detalles del torneo ===
  @IsOptional()
  @IsUUID('4', { message: 'El juego_id debe ser un UUID válido' })
  juego_id?: string;

  @IsOptional()
  @IsUUID('4', { message: 'La plataforma_id debe ser un UUID válido' })
  plataforma_id?: string;

  @IsOptional()
  @IsUUID('4', { message: 'El modo_juego_id debe ser un UUID válido' })
  modo_juego_id?: string;

  @IsOptional()
  @IsUUID('4', { message: 'La region_id debe ser un UUID válido' })
  region_id?: string;

  @IsOptional()
  @IsUUID('4', { message: 'El tipo_torneo_id debe ser un UUID válido' })
  tipo_torneo_id?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(7)
  al_mejor_de?: number; // 1, 3, 5, 7

  @IsOptional()
  @IsString()
  formato?: string; // '1v1', '2v2', '3v3', '4v4', '5v5'

  @IsOptional()
  @IsBoolean()
  cerrado?: boolean;

  @IsOptional()
  @IsString()
  reglas?: string;

  @IsOptional()
  @IsBoolean()
  jugadores_pc_permitidos?: boolean;

  @IsOptional()
  @IsBoolean()
  requiere_transmision?: boolean;

  @IsOptional()
  @IsBoolean()
  requiere_camara?: boolean;

  @IsOptional()
  @IsUUID('4', { message: 'El tipo_entrada_id debe ser un UUID válido' })
  tipo_entrada_id?: string;

  @IsOptional()
  @IsInt()
  @Min(2)
  capacidad?: number;

  // === Paso 3: Premios ===
  @IsOptional()
  @IsInt()
  @Min(0)
  cuota?: number; // Créditos por jugador

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  comision_porcentaje?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  ganador1_porcentaje?: number; // Default 70

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  ganador2_porcentaje?: number; // Default 30

  // === Paso 4: Detalles del anfitrión ===
  @IsOptional()
  @IsString()
  contacto_anfitrion?: string;

  @IsOptional()
  @IsString()
  discord_servidor?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RedSocialTorneoDto)
  redes_sociales?: RedSocialTorneoDto[];

  // === Paso 5: Gráficos ===
  @IsOptional()
  @IsString()
  banner_url?: string;

  @IsOptional()
  @IsString()
  miniatura_url?: string;
}

// ============================================================================
// DTOs para ACTUALIZAR TORNEO (torneo_actualizar)
// ============================================================================

/**
 * DTO para actualizar un torneo existente
 */
export class ActualizarTorneoFuncionDto {
  // === Información básica ===
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  fecha_inicio_registro?: string;

  @IsOptional()
  @IsString()
  fecha_fin_registro?: string;

  @IsOptional()
  @IsString()
  fecha_inicio_torneo?: string;

  // === Detalles del torneo ===
  @IsOptional()
  @IsUUID('4')
  juego_id?: string;

  @IsOptional()
  @IsUUID('4')
  plataforma_id?: string;

  @IsOptional()
  @IsUUID('4')
  modo_juego_id?: string;

  @IsOptional()
  @IsUUID('4')
  region_id?: string;

  @IsOptional()
  @IsUUID('4')
  tipo_torneo_id?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(7)
  al_mejor_de?: number;

  @IsOptional()
  @IsString()
  formato?: string;

  @IsOptional()
  @IsBoolean()
  cerrado?: boolean;

  @IsOptional()
  @IsString()
  reglas?: string;

  @IsOptional()
  @IsBoolean()
  jugadores_pc_permitidos?: boolean;

  @IsOptional()
  @IsBoolean()
  requiere_transmision?: boolean;

  @IsOptional()
  @IsBoolean()
  requiere_camara?: boolean;

  @IsOptional()
  @IsUUID('4')
  tipo_entrada_id?: string;

  @IsOptional()
  @IsInt()
  @Min(2)
  capacidad?: number;

  // === Premios ===
  @IsOptional()
  @IsInt()
  @Min(0)
  cuota?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  comision_porcentaje?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  ganador1_porcentaje?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  ganador2_porcentaje?: number;

  // === Detalles del anfitrión ===
  @IsOptional()
  @IsString()
  contacto_anfitrion?: string;

  @IsOptional()
  @IsString()
  discord_servidor?: string;

  // === Gráficos ===
  @IsOptional()
  @IsString()
  banner_url?: string;

  @IsOptional()
  @IsString()
  miniatura_url?: string;
}

// ============================================================================
// DTOs para CAMBIAR ESTADO (torneo_cambiar_estado)
// ============================================================================

export class CambiarEstadoTorneoDto {
  @IsNotEmpty({ message: 'El nuevo estado es requerido' })
  @IsString()
  nuevo_estado: 'proximamente' | 'en_curso' | 'terminado' | 'cancelado';
}

// ============================================================================
// DTOs para REDES SOCIALES DEL TORNEO
// ============================================================================

export class UpsertRedSocialTorneoDto {
  @IsNotEmpty({ message: 'La plataforma es requerida' })
  @IsString()
  plataforma: string;

  @IsNotEmpty({ message: 'La URL es requerida' })
  @IsString()
  url: string;

  @IsOptional()
  @IsUUID('4')
  red_id?: string; // Para actualizar existente
}

// ============================================================================
// DTOs para LISTAR TORNEOS (torneo_listar)
// ============================================================================

export class ListarTorneosQueryDto {
  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsUUID('4')
  juego_id?: string;

  @IsOptional()
  @IsUUID('4')
  region_id?: string;

  @IsOptional()
  @IsUUID('4')
  anfitrion_id?: string;

  @IsOptional()
  @IsString()
  busqueda?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}

// ============================================================================
// DTOs para FINALIZAR TORNEO (torneo_finalizar)
// ============================================================================

export class ResultadoTorneoDto {
  @IsNotEmpty()
  @IsUUID('4')
  usuario_id: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  posicion: number;
}

export class FinalizarTorneoDto {
  @IsNotEmpty({ message: 'Los resultados son requeridos' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResultadoTorneoDto)
  resultados: ResultadoTorneoDto[];
}

// ============================================================================
// DTOs de RESPUESTA
// ============================================================================

export interface TorneoCrearResponse {
  success: boolean;
  torneo_id?: string;
  message: string;
  estado?: string;
  datos?: {
    titulo: string;
    anfitrion_id: string;
    capacidad: number;
    cuota: number;
    fecha_inicio_torneo: string;
  };
  error?: string;
  code?: string;
}

export interface TorneoActualizarResponse {
  success: boolean;
  torneo_id?: string;
  message: string;
  error?: string;
  code?: string;
}

export interface TorneoCambiarEstadoResponse {
  success: boolean;
  torneo_id?: string;
  estado_anterior?: string;
  estado_nuevo?: string;
  message: string;
  error?: string;
  code?: string;
}

export interface TorneoRedSocialResponse {
  success: boolean;
  red_id?: string;
  message: string;
  error?: string;
  code?: string;
}

export interface TorneoDetalleResponse {
  success: boolean;
  torneo?: any;
  error?: string;
  code?: string;
}

export interface TorneoListarResponse {
  success: boolean;
  total?: number;
  limit?: number;
  offset?: number;
  torneos?: any[];
  error?: string;
  code?: string;
}

export interface TorneoCatalogosResponse {
  success: boolean;
  catalogos?: {
    juegos: any[];
    regiones: any[];
    tipos_torneo: any[];
    tipos_entrada: any[];
    al_mejor_de: number[];
    formatos: string[];
    redes_sociales: string[];
  };
  error?: string;
  code?: string;
}

export interface TorneoFinalizarResponse {
  success: boolean;
  torneo_id?: string;
  message: string;
  premios_distribuidos?: {
    primer_lugar: { usuario_id: string; monto: number };
    segundo_lugar: { usuario_id: string; monto: number };
  };
  error?: string;
  code?: string;
}
