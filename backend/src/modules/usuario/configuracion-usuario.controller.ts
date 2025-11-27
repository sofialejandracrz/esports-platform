import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfiguracionUsuarioService } from './configuracion-usuario.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
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
 * ConfiguracionUsuarioController
 * 
 * Controlador para el dashboard de configuración del usuario.
 * 
 * IMPORTANTE: Todos los endpoints requieren autenticación JWT.
 * El usuario solo puede ver/editar SU PROPIA configuración.
 * 
 * Rutas:
 * - GET  /usuario/configuracion           → Toda la configuración
 * - GET  /usuario/configuracion/personal  → Sección personal
 * - PUT  /usuario/configuracion/personal  → Actualizar personal
 * - GET  /usuario/configuracion/social    → Redes sociales
 * - POST /usuario/configuracion/social    → Agregar/actualizar red social
 * - DELETE /usuario/configuracion/social/:id → Eliminar red social
 * - GET  /usuario/configuracion/juegos    → Cuentas de juego
 * - POST /usuario/configuracion/juegos    → Agregar/actualizar cuenta
 * - DELETE /usuario/configuracion/juegos/:id → Eliminar cuenta
 * - GET  /usuario/configuracion/preferencias → Preferencias
 * - PUT  /usuario/configuracion/preferencias → Actualizar preferencias
 * - GET  /usuario/configuracion/cuenta    → Info de cuenta
 * - PUT  /usuario/configuracion/cuenta/password → Cambiar contraseña
 * - GET  /usuario/configuracion/seguridad → Datos de pago
 * - PUT  /usuario/configuracion/seguridad → Actualizar datos de pago
 * - GET  /usuario/configuracion/retiro    → Info de retiro (placeholder)
 * ============================================================================
 */
@Controller('usuario/configuracion')
@UseGuards(JwtAuthGuard)
export class ConfiguracionUsuarioController {
  constructor(
    private readonly configuracionService: ConfiguracionUsuarioService,
  ) {}

  /**
   * Obtiene el ID del usuario autenticado desde el request.
   */
  private getUsuarioId(req: Request): string {
    return (req as any).user?.userId;
  }

  // ============================================================================
  // ENDPOINT PRINCIPAL: Toda la configuración
  // ============================================================================

  /**
   * GET /usuario/configuracion
   * 
   * Obtiene TODA la configuración del usuario en una sola llamada.
   * Ideal para cargar el dashboard completo de configuración.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async obtenerConfiguracionCompleta(
    @Req() req: Request,
  ): Promise<ConfigCompletaResponseDto> {
    const usuarioId = this.getUsuarioId(req);
    return this.configuracionService.obtenerConfiguracionCompleta(usuarioId);
  }

  // ============================================================================
  // SECCIÓN: Personal
  // ============================================================================

  /**
   * GET /usuario/configuracion/personal
   * 
   * Obtiene la configuración personal: nickname, biografía, género, timezone, avatar.
   */
  @Get('personal')
  @HttpCode(HttpStatus.OK)
  async obtenerConfigPersonal(
    @Req() req: Request,
  ): Promise<ConfigPersonalResponseDto> {
    const usuarioId = this.getUsuarioId(req);
    return this.configuracionService.obtenerConfigPersonal(usuarioId);
  }

  /**
   * PUT /usuario/configuracion/personal
   * 
   * Actualiza la configuración personal.
   * Campos: biografia, genero_id, timezone, avatar_id
   */
  @Put('personal')
  @HttpCode(HttpStatus.OK)
  async actualizarConfigPersonal(
    @Req() req: Request,
    @Body() dto: UpdateConfigPersonalDto,
  ): Promise<ConfigSuccessResponseDto> {
    const usuarioId = this.getUsuarioId(req);
    return this.configuracionService.actualizarConfigPersonal(usuarioId, dto);
  }

  // ============================================================================
  // SECCIÓN: Social (Redes Sociales)
  // ============================================================================

  /**
   * GET /usuario/configuracion/social
   * 
   * Obtiene las redes sociales configuradas y las plataformas sugeridas.
   */
  @Get('social')
  @HttpCode(HttpStatus.OK)
  async obtenerConfigSocial(
    @Req() req: Request,
  ): Promise<ConfigSocialResponseDto> {
    const usuarioId = this.getUsuarioId(req);
    return this.configuracionService.obtenerConfigSocial(usuarioId);
  }

  /**
   * POST /usuario/configuracion/social
   * 
   * Crea o actualiza una red social.
   * Si se envía red_id, actualiza la existente; si no, crea una nueva.
   */
  @Post('social')
  @HttpCode(HttpStatus.OK)
  async upsertRedSocial(
    @Req() req: Request,
    @Body() dto: UpsertRedSocialDto,
  ): Promise<UpsertSocialSuccessDto> {
    const usuarioId = this.getUsuarioId(req);
    return this.configuracionService.upsertRedSocial(usuarioId, dto);
  }

  /**
   * DELETE /usuario/configuracion/social/:id
   * 
   * Elimina una red social por su ID.
   */
  @Delete('social/:id')
  @HttpCode(HttpStatus.OK)
  async eliminarRedSocial(
    @Req() req: Request,
    @Param('id') redId: string,
  ): Promise<ConfigSuccessResponseDto> {
    const usuarioId = this.getUsuarioId(req);
    return this.configuracionService.eliminarRedSocial(usuarioId, redId);
  }

  // ============================================================================
  // SECCIÓN: Juegos (Cuentas de Plataformas)
  // ============================================================================

  /**
   * GET /usuario/configuracion/juegos
   * 
   * Obtiene las cuentas de juego configuradas y las plataformas disponibles.
   */
  @Get('juegos')
  @HttpCode(HttpStatus.OK)
  async obtenerConfigJuegos(
    @Req() req: Request,
  ): Promise<ConfigJuegosResponseDto> {
    const usuarioId = this.getUsuarioId(req);
    return this.configuracionService.obtenerConfigJuegos(usuarioId);
  }

  /**
   * POST /usuario/configuracion/juegos
   * 
   * Crea o actualiza una cuenta de juego.
   * Si se envía cuenta_id, actualiza la existente; si no, crea una nueva.
   */
  @Post('juegos')
  @HttpCode(HttpStatus.OK)
  async upsertCuentaJuego(
    @Req() req: Request,
    @Body() dto: UpsertCuentaJuegoDto,
  ): Promise<UpsertCuentaJuegoSuccessDto> {
    const usuarioId = this.getUsuarioId(req);
    return this.configuracionService.upsertCuentaJuego(usuarioId, dto);
  }

  /**
   * DELETE /usuario/configuracion/juegos/:id
   * 
   * Elimina una cuenta de juego por su ID.
   */
  @Delete('juegos/:id')
  @HttpCode(HttpStatus.OK)
  async eliminarCuentaJuego(
    @Req() req: Request,
    @Param('id') cuentaId: string,
  ): Promise<ConfigSuccessResponseDto> {
    const usuarioId = this.getUsuarioId(req);
    return this.configuracionService.eliminarCuentaJuego(usuarioId, cuentaId);
  }

  // ============================================================================
  // SECCIÓN: Preferencias
  // ============================================================================

  /**
   * GET /usuario/configuracion/preferencias
   * 
   * Obtiene las preferencias del usuario (desafíos habilitados).
   */
  @Get('preferencias')
  @HttpCode(HttpStatus.OK)
  async obtenerConfigPreferencias(
    @Req() req: Request,
  ): Promise<ConfigPreferenciasResponseDto> {
    const usuarioId = this.getUsuarioId(req);
    return this.configuracionService.obtenerConfigPreferencias(usuarioId);
  }

  /**
   * PUT /usuario/configuracion/preferencias
   * 
   * Actualiza las preferencias del usuario.
   */
  @Put('preferencias')
  @HttpCode(HttpStatus.OK)
  async actualizarPreferencias(
    @Req() req: Request,
    @Body() dto: UpdatePreferenciasDto,
  ): Promise<UpdatePreferenciasSuccessDto> {
    const usuarioId = this.getUsuarioId(req);
    return this.configuracionService.actualizarPreferencias(usuarioId, dto);
  }

  // ============================================================================
  // SECCIÓN: Cuenta
  // ============================================================================

  /**
   * GET /usuario/configuracion/cuenta
   * 
   * Obtiene la información de la cuenta (correo, nickname, fechas, estado).
   */
  @Get('cuenta')
  @HttpCode(HttpStatus.OK)
  async obtenerConfigCuenta(
    @Req() req: Request,
  ): Promise<ConfigCuentaResponseDto> {
    const usuarioId = this.getUsuarioId(req);
    return this.configuracionService.obtenerConfigCuenta(usuarioId);
  }

  /**
   * PUT /usuario/configuracion/cuenta/password
   * 
   * Cambia la contraseña del usuario.
   * Requiere: password_actual, password_nuevo, password_confirmacion
   */
  @Put('cuenta/password')
  @HttpCode(HttpStatus.OK)
  async cambiarPassword(
    @Req() req: Request,
    @Body() dto: UpdatePasswordDto,
  ): Promise<ConfigSuccessResponseDto> {
    const usuarioId = this.getUsuarioId(req);
    return this.configuracionService.cambiarPassword(usuarioId, dto);
  }

  // ============================================================================
  // SECCIÓN: Seguridad (Datos de Pago)
  // ============================================================================

  /**
   * GET /usuario/configuracion/seguridad
   * 
   * Obtiene los datos de seguridad/pago (PayPal, dirección, etc.).
   */
  @Get('seguridad')
  @HttpCode(HttpStatus.OK)
  async obtenerConfigSeguridad(
    @Req() req: Request,
  ): Promise<ConfigSeguridadResponseDto> {
    const usuarioId = this.getUsuarioId(req);
    return this.configuracionService.obtenerConfigSeguridad(usuarioId);
  }

  /**
   * PUT /usuario/configuracion/seguridad
   * 
   * Actualiza los datos de seguridad/pago.
   */
  @Put('seguridad')
  @HttpCode(HttpStatus.OK)
  async actualizarSeguridad(
    @Req() req: Request,
    @Body() dto: UpdateSeguridadDto,
  ): Promise<ConfigSuccessResponseDto> {
    const usuarioId = this.getUsuarioId(req);
    return this.configuracionService.actualizarSeguridad(usuarioId, dto);
  }

  // ============================================================================
  // SECCIÓN: Retiro (Placeholder)
  // ============================================================================

  /**
   * GET /usuario/configuracion/retiro
   * 
   * Obtiene información sobre retiros (placeholder para integración futura).
   */
  @Get('retiro')
  @HttpCode(HttpStatus.OK)
  async obtenerConfigRetiro(
    @Req() req: Request,
  ): Promise<ConfigRetiroResponseDto> {
    const usuarioId = this.getUsuarioId(req);
    return this.configuracionService.obtenerConfigRetiro(usuarioId);
  }
}
