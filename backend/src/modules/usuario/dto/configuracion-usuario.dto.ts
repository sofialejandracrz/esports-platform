// ============================================================================
// DTOs para Configuración de Usuario
// Estos DTOs definen la estructura de datos para las respuestas y requests
// de los endpoints de configuración del dashboard de usuario.
// ============================================================================

import { IsBoolean, IsEmail, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

// ============================================================================
// SECCIÓN: /usuario/configuracion/personal
// ============================================================================

export class GeneroDto {
  id: string;
  valor: string;
}

export class AvatarDto {
  id: string | null;
  nombre: string | null;
  url: string | null;
}

export class ConfigPersonalResponseDto {
  nickname: string;
  biografia: string | null;
  genero: GeneroDto | null;
  timezone: string | null;
  foto_perfil: string | null;
  avatar: AvatarDto;
  generos_disponibles: GeneroDto[];
}

export class UpdateConfigPersonalDto {
  @IsOptional()
  @IsString()
  @MaxLength(300, { message: 'La biografía no puede tener más de 300 caracteres' })
  biografia?: string;

  @IsOptional()
  @IsUUID('4', { message: 'El ID del género debe ser un UUID válido' })
  genero_id?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsUUID('4', { message: 'El ID del avatar debe ser un UUID válido' })
  avatar_id?: string;
}

// ============================================================================
// SECCIÓN: /usuario/configuracion/social
// ============================================================================

export class RedSocialConfigDto {
  id: string;
  plataforma: string;
  enlace: string;
}

export class ConfigSocialResponseDto {
  redes_sociales: RedSocialConfigDto[];
  plataformas_sugeridas: string[];
}

export class UpsertRedSocialDto {
  @IsString({ message: 'La plataforma es requerida' })
  @MinLength(1, { message: 'La plataforma no puede estar vacía' })
  @MaxLength(50, { message: 'El nombre de la plataforma es demasiado largo' })
  plataforma: string;

  @IsString({ message: 'El enlace es requerido' })
  @MinLength(1, { message: 'El enlace no puede estar vacío' })
  @MaxLength(500, { message: 'El enlace es demasiado largo' })
  enlace: string;

  @IsOptional()
  @IsUUID('4', { message: 'El ID de la red social debe ser un UUID válido' })
  red_id?: string;
}

export class DeleteRedSocialDto {
  @IsUUID('4', { message: 'El ID de la red social debe ser un UUID válido' })
  red_id: string;
}

// ============================================================================
// SECCIÓN: /usuario/configuracion/juegos
// ============================================================================

export class PlataformaJuegoDto {
  id: string;
  valor: string;
}

export class CuentaJuegoConfigDto {
  id: string;
  plataforma_id: string;
  plataforma: string;
  identificador: string;
}

export class ConfigJuegosResponseDto {
  cuentas_juego: CuentaJuegoConfigDto[];
  plataformas_disponibles: PlataformaJuegoDto[];
}

export class UpsertCuentaJuegoDto {
  @IsUUID('4', { message: 'El ID de la plataforma debe ser un UUID válido' })
  plataforma_id: string;

  @IsString({ message: 'El identificador es requerido' })
  @MinLength(1, { message: 'El identificador no puede estar vacío' })
  @MaxLength(100, { message: 'El identificador es demasiado largo' })
  identificador: string;

  @IsOptional()
  @IsUUID('4', { message: 'El ID de la cuenta debe ser un UUID válido' })
  cuenta_id?: string;
}

export class DeleteCuentaJuegoDto {
  @IsUUID('4', { message: 'El ID de la cuenta debe ser un UUID válido' })
  cuenta_id: string;
}

// ============================================================================
// SECCIÓN: /usuario/configuracion/preferencias
// ============================================================================

export class ConfigPreferenciasResponseDto {
  desafios_habilitados: boolean;
}

export class UpdatePreferenciasDto {
  @IsBoolean({ message: 'desafios_habilitados debe ser un booleano' })
  desafios_habilitados: boolean;
}

// ============================================================================
// SECCIÓN: /usuario/configuracion/cuenta
// ============================================================================

export class ConfigCuentaResponseDto {
  correo: string;
  nickname: string;
  creado_en: Date;
  ultima_conexion: Date | null;
  estado: string;
}

export class UpdatePasswordDto {
  @IsString({ message: 'La contraseña actual es requerida' })
  @MinLength(1, { message: 'La contraseña actual no puede estar vacía' })
  password_actual: string;

  @IsString({ message: 'La nueva contraseña es requerida' })
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
  @MaxLength(100, { message: 'La nueva contraseña es demasiado larga' })
  password_nuevo: string;

  @IsString({ message: 'La confirmación de contraseña es requerida' })
  password_confirmacion: string;
}

// ============================================================================
// SECCIÓN: /usuario/configuracion/seguridad
// ============================================================================

export class ConfigSeguridadResponseDto {
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

export class UpdateSeguridadDto {
  @IsOptional()
  @IsEmail({}, { message: 'El correo de PayPal debe ser válido' })
  correo_paypal?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  p_nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  s_nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  p_apellido?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  s_apellido?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  direccion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  ciudad?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  estado?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  codigo_postal?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  pais?: string;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  divisa?: string;
}

// ============================================================================
// SECCIÓN: /usuario/configuracion/retiro
// ============================================================================

export class ConfigRetiroResponseDto {
  saldo_disponible: string;
  creditos: number;
  correo_paypal: string | null;
  paypal_configurado: boolean;
  historial_retiros: any[];
  mensaje: string;
}

// ============================================================================
// SECCIÓN: Configuración completa (todas las secciones)
// ============================================================================

export class ConfigCompletaResponseDto {
  personal: ConfigPersonalResponseDto;
  social: ConfigSocialResponseDto;
  juegos: ConfigJuegosResponseDto;
  preferencias: ConfigPreferenciasResponseDto;
  cuenta: ConfigCuentaResponseDto;
  seguridad: ConfigSeguridadResponseDto;
  retiro: ConfigRetiroResponseDto;
}

// ============================================================================
// DTOs de respuesta genérica
// ============================================================================

export class ConfigSuccessResponseDto {
  success: boolean;
  message: string;
}

export class UpsertSocialSuccessDto extends ConfigSuccessResponseDto {
  red_id: string;
}

export class UpsertCuentaJuegoSuccessDto extends ConfigSuccessResponseDto {
  cuenta_id: string;
}

export class UpdatePreferenciasSuccessDto extends ConfigSuccessResponseDto {
  desafios_habilitados: boolean;
}
