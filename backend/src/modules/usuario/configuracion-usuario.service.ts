import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import {
  ConfigCompletaResponseDto,
  ConfigPersonalResponseDto,
  ConfigSocialResponseDto,
  ConfigJuegosResponseDto,
  ConfigPreferenciasResponseDto,
  ConfigCuentaResponseDto,
  ConfigSeguridadResponseDto,
  ConfigRetiroResponseDto,
  ConfigSuccessResponseDto,
  UpsertSocialSuccessDto,
  UpsertCuentaJuegoSuccessDto,
  UpdatePreferenciasSuccessDto,
  UpdateConfigPersonalDto,
  UpsertRedSocialDto,
  UpsertCuentaJuegoDto,
  UpdatePreferenciasDto,
  UpdatePasswordDto,
  UpdateSeguridadDto,
} from './dto/configuracion-usuario.dto';
import { OracleFunctionHelper } from '../../common/helpers/oracle-function.helper';

/**
 * ============================================================================
 * ConfiguracionUsuarioService
 * 
 * Servicio que ejecuta las funciones almacenadas para manejar la configuración
 * del usuario. Compatible con PostgreSQL y Oracle.
 * 
 * PostgreSQL: funciones independientes (config_get_personal, config_update_personal, etc.)
 * Oracle: funciones empaquetadas en PKG_CONFIG (FN_GET_PERSONAL, FN_UPDATE_PERSONAL, etc.)
 * ============================================================================
 */
@Injectable()
export class ConfiguracionUsuarioService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // ============================================================================
  // MÉTODO PRINCIPAL: Obtener toda la configuración
  // ============================================================================

  /**
   * Obtiene TODA la configuración del usuario en una sola llamada.
   * PG: config_get_completa
   * Oracle: PKG_CONFIG.FN_GET_COMPLETA
   */
  async obtenerConfiguracionCompleta(
    usuarioId: string,
  ): Promise<ConfigCompletaResponseDto> {
    try {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'config_get_completa',
        'PKG_CONFIG.FN_GET_COMPLETA',
        [usuarioId],
      );

      if (!result) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return result as ConfigCompletaResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // SECCIÓN: Personal
  // ============================================================================

  /**
   * Obtiene la configuración personal del usuario.
   * PG: config_get_personal
   * Oracle: PKG_CONFIG.FN_GET_PERSONAL
   */
  async obtenerConfigPersonal(usuarioId: string): Promise<ConfigPersonalResponseDto> {
    try {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'config_get_personal',
        'PKG_CONFIG.FN_GET_PERSONAL',
        [usuarioId],
      );

      if (!result) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return result as ConfigPersonalResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  /**
   * Actualiza la configuración personal del usuario.
   * PG: config_update_personal
   * Oracle: PKG_CONFIG.FN_UPDATE_PERSONAL
   */
  async actualizarConfigPersonal(
    usuarioId: string,
    dto: UpdateConfigPersonalDto,
  ): Promise<ConfigSuccessResponseDto> {
    try {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'config_update_personal',
        'PKG_CONFIG.FN_UPDATE_PERSONAL',
        [
          usuarioId,
          dto.biografia ?? null,
          dto.genero_id ?? null,
          dto.timezone ?? null,
          dto.avatar_id ?? null,
        ],
      );

      return result as ConfigSuccessResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // SECCIÓN: Social (Redes Sociales)
  // ============================================================================

  /**
   * Obtiene las redes sociales configuradas del usuario.
   * PG: config_get_social
   * Oracle: PKG_CONFIG.FN_GET_SOCIAL
   */
  async obtenerConfigSocial(usuarioId: string): Promise<ConfigSocialResponseDto> {
    try {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'config_get_social',
        'PKG_CONFIG.FN_GET_SOCIAL',
        [usuarioId],
      );

      if (!result) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return result as ConfigSocialResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  /**
   * Crea o actualiza una red social del usuario.
   * PG: config_upsert_social
   * Oracle: PKG_CONFIG.FN_UPSERT_SOCIAL
   */
  async upsertRedSocial(
    usuarioId: string,
    dto: UpsertRedSocialDto,
  ): Promise<UpsertSocialSuccessDto> {
    try {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'config_upsert_social',
        'PKG_CONFIG.FN_UPSERT_SOCIAL',
        [usuarioId, dto.plataforma, dto.enlace, dto.red_id ?? null],
      );

      return result as UpsertSocialSuccessDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  /**
   * Elimina una red social del usuario.
   * PG: config_delete_social
   * Oracle: PKG_CONFIG.FN_DELETE_SOCIAL
   */
  async eliminarRedSocial(
    usuarioId: string,
    redId: string,
  ): Promise<ConfigSuccessResponseDto> {
    try {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'config_delete_social',
        'PKG_CONFIG.FN_DELETE_SOCIAL',
        [usuarioId, redId],
      );

      return result as ConfigSuccessResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // SECCIÓN: Juegos (Cuentas de Plataformas)
  // ============================================================================

  /**
   * Obtiene las cuentas de juego configuradas del usuario.
   * PG: config_get_juegos
   * Oracle: PKG_CONFIG.FN_GET_JUEGOS
   */
  async obtenerConfigJuegos(usuarioId: string): Promise<ConfigJuegosResponseDto> {
    try {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'config_get_juegos',
        'PKG_CONFIG.FN_GET_JUEGOS',
        [usuarioId],
      );

      if (!result) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return result as ConfigJuegosResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  /**
   * Crea o actualiza una cuenta de juego del usuario.
   * PG: config_upsert_cuenta_juego
   * Oracle: PKG_CONFIG.FN_UPSERT_CUENTA_JUEGO
   */
  async upsertCuentaJuego(
    usuarioId: string,
    dto: UpsertCuentaJuegoDto,
  ): Promise<UpsertCuentaJuegoSuccessDto> {
    try {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'config_upsert_cuenta_juego',
        'PKG_CONFIG.FN_UPSERT_CUENTA_JUEGO',
        [usuarioId, dto.plataforma_id, dto.identificador, dto.cuenta_id ?? null],
      );

      return result as UpsertCuentaJuegoSuccessDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  /**
   * Elimina una cuenta de juego del usuario.
   * PG: config_delete_cuenta_juego
   * Oracle: PKG_CONFIG.FN_DELETE_CUENTA_JUEGO
   */
  async eliminarCuentaJuego(
    usuarioId: string,
    cuentaId: string,
  ): Promise<ConfigSuccessResponseDto> {
    try {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'config_delete_cuenta_juego',
        'PKG_CONFIG.FN_DELETE_CUENTA_JUEGO',
        [usuarioId, cuentaId],
      );

      return result as ConfigSuccessResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // SECCIÓN: Preferencias
  // ============================================================================

  /**
   * Obtiene las preferencias del usuario.
   * PG: config_get_preferencias
   * Oracle: PKG_CONFIG.FN_GET_PREFERENCIAS
   */
  async obtenerConfigPreferencias(
    usuarioId: string,
  ): Promise<ConfigPreferenciasResponseDto> {
    try {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'config_get_preferencias',
        'PKG_CONFIG.FN_GET_PREFERENCIAS',
        [usuarioId],
      );

      if (!result) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return result as ConfigPreferenciasResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  /**
   * Actualiza las preferencias del usuario.
   * PG: config_update_preferencias
   * Oracle: PKG_CONFIG.FN_UPDATE_PREFERENCIAS
   */
  async actualizarPreferencias(
    usuarioId: string,
    dto: UpdatePreferenciasDto,
  ): Promise<UpdatePreferenciasSuccessDto> {
    try {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'config_update_preferencias',
        'PKG_CONFIG.FN_UPDATE_PREFERENCIAS',
        [usuarioId, dto.desafios_habilitados],
      );

      return result as UpdatePreferenciasSuccessDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // SECCIÓN: Cuenta
  // ============================================================================

  /**
   * Obtiene la información de cuenta del usuario.
   * PG: config_get_cuenta
   * Oracle: PKG_CONFIG.FN_GET_CUENTA
   */
  async obtenerConfigCuenta(usuarioId: string): Promise<ConfigCuentaResponseDto> {
    try {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'config_get_cuenta',
        'PKG_CONFIG.FN_GET_CUENTA',
        [usuarioId],
      );

      if (!result) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return result as ConfigCuentaResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  /**
   * Cambia la contraseña del usuario.
   * Valida la contraseña actual antes de actualizar.
   * PG: config_update_password
   * Oracle: PKG_CONFIG.FN_UPDATE_PASSWORD
   */
  async cambiarPassword(
    usuarioId: string,
    dto: UpdatePasswordDto,
  ): Promise<ConfigSuccessResponseDto> {
    // Validar que las contraseñas nuevas coincidan
    if (dto.password_nuevo !== dto.password_confirmacion) {
      throw new BadRequestException('Las contraseñas nuevas no coinciden');
    }

    // Obtener el usuario con su contraseña actual
    const usuario = await this.usuarioRepository.findOne({
      where: { id: +usuarioId },
      select: ['id', 'password'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Validar la contraseña actual
    const passwordValido = await bcrypt.compare(dto.password_actual, usuario.password);
    if (!passwordValido) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    // Hash de la nueva contraseña
    const nuevoHash = await bcrypt.hash(dto.password_nuevo, 10);

    try {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'config_update_password',
        'PKG_CONFIG.FN_UPDATE_PASSWORD',
        [usuarioId, nuevoHash],
      );

      return result as ConfigSuccessResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // SECCIÓN: Seguridad (Datos de Pago)
  // ============================================================================

  /**
   * Obtiene la información de seguridad/pago del usuario.
   * PG: config_get_seguridad
   * Oracle: PKG_CONFIG.FN_GET_SEGURIDAD
   */
  async obtenerConfigSeguridad(
    usuarioId: string,
  ): Promise<ConfigSeguridadResponseDto> {
    try {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'config_get_seguridad',
        'PKG_CONFIG.FN_GET_SEGURIDAD',
        [usuarioId],
      );

      if (!result) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return result as ConfigSeguridadResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  /**
   * Actualiza la información de seguridad/pago del usuario.
   * PG: config_update_seguridad
   * Oracle: PKG_CONFIG.FN_UPDATE_SEGURIDAD
   */
  async actualizarSeguridad(
    usuarioId: string,
    dto: UpdateSeguridadDto,
  ): Promise<ConfigSuccessResponseDto> {
    try {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'config_update_seguridad',
        'PKG_CONFIG.FN_UPDATE_SEGURIDAD',
        [
          usuarioId,
          dto.correo_paypal ?? null,
          dto.p_nombre ?? null,
          dto.s_nombre ?? null,
          dto.p_apellido ?? null,
          dto.s_apellido ?? null,
          dto.telefono ?? null,
          dto.direccion ?? null,
          dto.ciudad ?? null,
          dto.estado ?? null,
          dto.codigo_postal ?? null,
          dto.pais ?? null,
          dto.divisa ?? null,
        ],
      );

      return result as ConfigSuccessResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // SECCIÓN: Retiro (Placeholder)
  // ============================================================================

  /**
   * Obtiene la información de retiro del usuario.
   * PG: config_get_retiro
   * Oracle: PKG_CONFIG.FN_GET_RETIRO
   */
  async obtenerConfigRetiro(usuarioId: string): Promise<ConfigRetiroResponseDto> {
    try {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'config_get_retiro',
        'PKG_CONFIG.FN_GET_RETIRO',
        [usuarioId],
      );

      if (!result) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return result as ConfigRetiroResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // UTILIDADES
  // ============================================================================

  /**
   * Maneja errores de la base de datos de forma consistente.
   * Compatible con errores de PostgreSQL (RAISE EXCEPTION) y Oracle (RAISE_APPLICATION_ERROR).
   */
  private handleDatabaseError(error: any): never {
    // Errores de RAISE EXCEPTION (PostgreSQL) o RAISE_APPLICATION_ERROR (Oracle)
    const errorMsg = error.message || '';
    
    if (errorMsg.includes('no encontrado') || errorMsg.includes('ORA-20404')) {
      throw new NotFoundException(errorMsg);
    }
    if (errorMsg.includes('no válid') || errorMsg.includes('ORA-20400')) {
      throw new BadRequestException(errorMsg);
    }
    if (errorMsg.includes('requerid')) {
      throw new BadRequestException(errorMsg);
    }
    if (errorMsg.includes('no disponible')) {
      throw new BadRequestException(errorMsg);
    }

    // Si es un error ya manejado por NestJS, re-lanzarlo
    if (error instanceof NotFoundException || 
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException) {
      throw error;
    }

    // Error genérico
    console.error('Error en ConfiguracionUsuarioService:', error);
    throw new BadRequestException('Error al procesar la solicitud');
  }
}
