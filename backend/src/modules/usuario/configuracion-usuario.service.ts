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

/**
 * ============================================================================
 * ConfiguracionUsuarioService
 * 
 * Este servicio ejecuta las funciones almacenadas de PostgreSQL para manejar
 * la configuración del usuario en el dashboard.
 * 
 * Secciones cubiertas:
 * - Personal: nickname, biografía, género, timezone, avatar
 * - Social: redes sociales (Twitter, Twitch, etc.)
 * - Juegos: cuentas de plataformas de juego
 * - Preferencias: desafíos habilitados
 * - Cuenta: correo, contraseña
 * - Seguridad: datos de pago (PayPal, dirección)
 * - Retiro: placeholder para integración futura
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
   * Útil para cargar el dashboard completo de configuración.
   * 
   * @param usuarioId - UUID del usuario autenticado
   */
  async obtenerConfiguracionCompleta(
    usuarioId: string,
  ): Promise<ConfigCompletaResponseDto> {
    try {
      const result = await this.dataSource.query(
        `SELECT config_get_completa($1) as config`,
        [usuarioId],
      );

      if (!result?.[0]?.config) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return result[0].config as ConfigCompletaResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // SECCIÓN: Personal
  // ============================================================================

  /**
   * Obtiene la configuración personal del usuario.
   */
  async obtenerConfigPersonal(usuarioId: string): Promise<ConfigPersonalResponseDto> {
    try {
      const result = await this.dataSource.query(
        `SELECT config_get_personal($1) as config`,
        [usuarioId],
      );

      if (!result?.[0]?.config) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return result[0].config as ConfigPersonalResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  /**
   * Actualiza la configuración personal del usuario.
   */
  async actualizarConfigPersonal(
    usuarioId: string,
    dto: UpdateConfigPersonalDto,
  ): Promise<ConfigSuccessResponseDto> {
    try {
      const result = await this.dataSource.query(
        `SELECT config_update_personal($1, $2, $3, $4, $5) as resultado`,
        [
          usuarioId,
          dto.biografia ?? null,
          dto.genero_id ?? null,
          dto.timezone ?? null,
          dto.avatar_id ?? null,
        ],
      );

      return result[0].resultado as ConfigSuccessResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // SECCIÓN: Social (Redes Sociales)
  // ============================================================================

  /**
   * Obtiene las redes sociales configuradas del usuario.
   */
  async obtenerConfigSocial(usuarioId: string): Promise<ConfigSocialResponseDto> {
    try {
      const result = await this.dataSource.query(
        `SELECT config_get_social($1) as config`,
        [usuarioId],
      );

      if (!result?.[0]?.config) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return result[0].config as ConfigSocialResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  /**
   * Crea o actualiza una red social del usuario.
   */
  async upsertRedSocial(
    usuarioId: string,
    dto: UpsertRedSocialDto,
  ): Promise<UpsertSocialSuccessDto> {
    try {
      const result = await this.dataSource.query(
        `SELECT config_upsert_social($1, $2, $3, $4) as resultado`,
        [usuarioId, dto.plataforma, dto.enlace, dto.red_id ?? null],
      );

      return result[0].resultado as UpsertSocialSuccessDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  /**
   * Elimina una red social del usuario.
   */
  async eliminarRedSocial(
    usuarioId: string,
    redId: string,
  ): Promise<ConfigSuccessResponseDto> {
    try {
      const result = await this.dataSource.query(
        `SELECT config_delete_social($1, $2) as resultado`,
        [usuarioId, redId],
      );

      return result[0].resultado as ConfigSuccessResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // SECCIÓN: Juegos (Cuentas de Plataformas)
  // ============================================================================

  /**
   * Obtiene las cuentas de juego configuradas del usuario.
   */
  async obtenerConfigJuegos(usuarioId: string): Promise<ConfigJuegosResponseDto> {
    try {
      const result = await this.dataSource.query(
        `SELECT config_get_juegos($1) as config`,
        [usuarioId],
      );

      if (!result?.[0]?.config) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return result[0].config as ConfigJuegosResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  /**
   * Crea o actualiza una cuenta de juego del usuario.
   */
  async upsertCuentaJuego(
    usuarioId: string,
    dto: UpsertCuentaJuegoDto,
  ): Promise<UpsertCuentaJuegoSuccessDto> {
    try {
      const result = await this.dataSource.query(
        `SELECT config_upsert_cuenta_juego($1, $2, $3, $4) as resultado`,
        [usuarioId, dto.plataforma_id, dto.identificador, dto.cuenta_id ?? null],
      );

      return result[0].resultado as UpsertCuentaJuegoSuccessDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  /**
   * Elimina una cuenta de juego del usuario.
   */
  async eliminarCuentaJuego(
    usuarioId: string,
    cuentaId: string,
  ): Promise<ConfigSuccessResponseDto> {
    try {
      const result = await this.dataSource.query(
        `SELECT config_delete_cuenta_juego($1, $2) as resultado`,
        [usuarioId, cuentaId],
      );

      return result[0].resultado as ConfigSuccessResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // SECCIÓN: Preferencias
  // ============================================================================

  /**
   * Obtiene las preferencias del usuario.
   */
  async obtenerConfigPreferencias(
    usuarioId: string,
  ): Promise<ConfigPreferenciasResponseDto> {
    try {
      const result = await this.dataSource.query(
        `SELECT config_get_preferencias($1) as config`,
        [usuarioId],
      );

      if (!result?.[0]?.config) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return result[0].config as ConfigPreferenciasResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  /**
   * Actualiza las preferencias del usuario.
   */
  async actualizarPreferencias(
    usuarioId: string,
    dto: UpdatePreferenciasDto,
  ): Promise<UpdatePreferenciasSuccessDto> {
    try {
      const result = await this.dataSource.query(
        `SELECT config_update_preferencias($1, $2) as resultado`,
        [usuarioId, dto.desafios_habilitados],
      );

      return result[0].resultado as UpdatePreferenciasSuccessDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // SECCIÓN: Cuenta
  // ============================================================================

  /**
   * Obtiene la información de cuenta del usuario.
   */
  async obtenerConfigCuenta(usuarioId: string): Promise<ConfigCuentaResponseDto> {
    try {
      const result = await this.dataSource.query(
        `SELECT config_get_cuenta($1) as config`,
        [usuarioId],
      );

      if (!result?.[0]?.config) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return result[0].config as ConfigCuentaResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  /**
   * Cambia la contraseña del usuario.
   * Valida la contraseña actual antes de actualizar.
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
      where: { id: usuarioId },
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
      const result = await this.dataSource.query(
        `SELECT config_update_password($1, $2) as resultado`,
        [usuarioId, nuevoHash],
      );

      return result[0].resultado as ConfigSuccessResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // SECCIÓN: Seguridad (Datos de Pago)
  // ============================================================================

  /**
   * Obtiene la información de seguridad/pago del usuario.
   */
  async obtenerConfigSeguridad(
    usuarioId: string,
  ): Promise<ConfigSeguridadResponseDto> {
    try {
      const result = await this.dataSource.query(
        `SELECT config_get_seguridad($1) as config`,
        [usuarioId],
      );

      if (!result?.[0]?.config) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return result[0].config as ConfigSeguridadResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  /**
   * Actualiza la información de seguridad/pago del usuario.
   */
  async actualizarSeguridad(
    usuarioId: string,
    dto: UpdateSeguridadDto,
  ): Promise<ConfigSuccessResponseDto> {
    try {
      const result = await this.dataSource.query(
        `SELECT config_update_seguridad($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) as resultado`,
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

      return result[0].resultado as ConfigSuccessResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // SECCIÓN: Retiro (Placeholder)
  // ============================================================================

  /**
   * Obtiene la información de retiro del usuario.
   */
  async obtenerConfigRetiro(usuarioId: string): Promise<ConfigRetiroResponseDto> {
    try {
      const result = await this.dataSource.query(
        `SELECT config_get_retiro($1) as config`,
        [usuarioId],
      );

      if (!result?.[0]?.config) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return result[0].config as ConfigRetiroResponseDto;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // UTILIDADES
  // ============================================================================

  /**
   * Maneja errores de la base de datos de forma consistente.
   */
  private handleDatabaseError(error: any): never {
    // Errores de RAISE EXCEPTION en PostgreSQL
    if (error.message?.includes('no encontrado')) {
      throw new NotFoundException(error.message);
    }
    if (error.message?.includes('no válid')) {
      throw new BadRequestException(error.message);
    }
    if (error.message?.includes('requerid')) {
      throw new BadRequestException(error.message);
    }
    if (error.message?.includes('no disponible')) {
      throw new BadRequestException(error.message);
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
