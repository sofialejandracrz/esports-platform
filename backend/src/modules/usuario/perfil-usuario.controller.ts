import {
  Controller,
  Get,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PerfilUsuarioService } from './perfil-usuario.service';
import { Public } from '../../common/decorators/public.decorator';
import {
  PerfilCompletoDto,
  AmigoDto,
  TrofeoDto,
  LogroDto,
  EstadisticaJuegoDto,
  HistorialTorneoDto,
  RedSocialDto,
  CuentaJuegoDto,
  EquipoDto,
} from './dto/perfil-usuario.dto';

/**
 * ============================================================================
 * PerfilUsuarioController
 * 
 * Controlador que expone los endpoints para consultar perfiles de usuario.
 * 
 * IMPORTANTE: La mayoría de endpoints son PÚBLICOS (cualquiera puede ver
 * perfiles), pero si el usuario está autenticado, se pasa su ID para:
 * 1. Mostrar datos personales si ve su propio perfil
 * 2. Mostrar el estado de amistad entre el viewer y el usuario del perfil
 * ============================================================================
 */
@Controller('perfil')
export class PerfilUsuarioController {
  constructor(private readonly perfilUsuarioService: PerfilUsuarioService) {}

  /**
   * ============================================================================
   * GET /perfil/:nickname
   * 
   * ENDPOINT PRINCIPAL - Obtiene TODO el perfil de un usuario.
   * 
   * Este es el endpoint que usarás desde el frontend para cargar la página
   * de perfil. Retorna toda la información en una sola llamada.
   * 
   * @param nickname - El nickname del usuario cuyo perfil se quiere ver
   * @param req - Request para obtener el viewer (usuario logueado)
   * @returns PerfilCompletoDto - Toda la información del perfil
   * 
   * Ejemplo de uso desde frontend:
   * const response = await fetch(`/api/perfil/${nickname}`, {
   *   headers: { 'Authorization': `Bearer ${token}` } // Opcional
   * });
   * ============================================================================
   */
  @Public() // Permite acceso sin autenticación
  @Get(':nickname')
  @HttpCode(HttpStatus.OK)
  async obtenerPerfilCompleto(
    @Param('nickname') nickname: string,
    @Req() req: Request,
  ): Promise<PerfilCompletoDto> {
    // Obtener el ID del usuario que está viendo el perfil (si está logueado)
    const viewerId = (req as any).user?.userId || null;
    
    return this.perfilUsuarioService.obtenerPerfilCompleto(nickname, viewerId);
  }

  /**
   * ============================================================================
   * GET /perfil/:nickname/amigos
   * 
   * Obtiene la lista de amigos con paginación.
   * Útil para implementar scroll infinito o paginación en la lista de amigos.
   * 
   * @param nickname - Nickname del usuario
   * @param limit - Cantidad de amigos a retornar (default: 20)
   * @param offset - Desde qué posición empezar (default: 0)
   * ============================================================================
   */
  @Public()
  @Get(':nickname/amigos')
  @HttpCode(HttpStatus.OK)
  async obtenerAmigos(
    @Param('nickname') nickname: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<AmigoDto[]> {
    return this.perfilUsuarioService.obtenerListaAmigos(
      nickname,
      limit || 20,
      offset || 0,
    );
  }

  /**
   * ============================================================================
   * GET /perfil/:nickname/trofeos
   * 
   * Obtiene la vitrina de trofeos con paginación.
   * ============================================================================
   */
  @Public()
  @Get(':nickname/trofeos')
  @HttpCode(HttpStatus.OK)
  async obtenerTrofeos(
    @Param('nickname') nickname: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<TrofeoDto[]> {
    return this.perfilUsuarioService.obtenerVitrinaTrofeos(
      nickname,
      limit || 50,
      offset || 0,
    );
  }

  /**
   * ============================================================================
   * GET /perfil/:nickname/logros
   * 
   * Obtiene los logros desbloqueados con paginación.
   * ============================================================================
   */
  @Public()
  @Get(':nickname/logros')
  @HttpCode(HttpStatus.OK)
  async obtenerLogros(
    @Param('nickname') nickname: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<LogroDto[]> {
    return this.perfilUsuarioService.obtenerLogros(
      nickname,
      limit || 50,
      offset || 0,
    );
  }

  /**
   * ============================================================================
   * GET /perfil/:nickname/estadisticas-juegos
   * 
   * Obtiene las estadísticas por juego del usuario.
   * ============================================================================
   */
  @Public()
  @Get(':nickname/estadisticas-juegos')
  @HttpCode(HttpStatus.OK)
  async obtenerEstadisticasJuegos(
    @Param('nickname') nickname: string,
  ): Promise<EstadisticaJuegoDto[]> {
    return this.perfilUsuarioService.obtenerEstadisticasJuegos(nickname);
  }

  /**
   * ============================================================================
   * GET /perfil/:nickname/historial-torneos
   * 
   * Obtiene el historial de participación en torneos con paginación.
   * ============================================================================
   */
  @Public()
  @Get(':nickname/historial-torneos')
  @HttpCode(HttpStatus.OK)
  async obtenerHistorialTorneos(
    @Param('nickname') nickname: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<HistorialTorneoDto[]> {
    return this.perfilUsuarioService.obtenerHistorialTorneos(
      nickname,
      limit || 20,
      offset || 0,
    );
  }

  /**
   * ============================================================================
   * GET /perfil/:nickname/redes-sociales
   * 
   * Obtiene las redes sociales del usuario.
   * ============================================================================
   */
  @Public()
  @Get(':nickname/redes-sociales')
  @HttpCode(HttpStatus.OK)
  async obtenerRedesSociales(
    @Param('nickname') nickname: string,
  ): Promise<RedSocialDto[]> {
    return this.perfilUsuarioService.obtenerRedesSociales(nickname);
  }

  /**
   * ============================================================================
   * GET /perfil/:nickname/cuentas-juego
   * 
   * Obtiene las cuentas de plataformas de juego del usuario.
   * ============================================================================
   */
  @Public()
  @Get(':nickname/cuentas-juego')
  @HttpCode(HttpStatus.OK)
  async obtenerCuentasJuego(
    @Param('nickname') nickname: string,
  ): Promise<CuentaJuegoDto[]> {
    return this.perfilUsuarioService.obtenerCuentasJuego(nickname);
  }

  /**
   * ============================================================================
   * GET /perfil/:nickname/equipos
   * 
   * Obtiene los equipos a los que pertenece el usuario.
   * ============================================================================
   */
  @Public()
  @Get(':nickname/equipos')
  @HttpCode(HttpStatus.OK)
  async obtenerEquipos(
    @Param('nickname') nickname: string,
  ): Promise<EquipoDto[]> {
    return this.perfilUsuarioService.obtenerEquipos(nickname);
  }
}
