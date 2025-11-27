import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TorneoFuncionesService } from './torneo-funciones.service';
import {
  CrearTorneoFuncionDto,
  ActualizarTorneoFuncionDto,
  CambiarEstadoTorneoDto,
  UpsertRedSocialTorneoDto,
  ListarTorneosQueryDto,
  FinalizarTorneoDto,
} from './dto/torneo-funciones.dto';
import { Public } from '../../common/decorators/public.decorator';

/**
 * ============================================================================
 * TorneoFuncionesController
 * 
 * Controlador que expone endpoints para las funciones almacenadas de torneos.
 * Todos los endpoints que modifican datos requieren autenticación JWT.
 * ============================================================================
 */
@ApiTags('torneos')
@Controller('torneos')
export class TorneoFuncionesController {
  constructor(private readonly torneoFuncionesService: TorneoFuncionesService) {}

  // ============================================================================
  // CATÁLOGOS (Sin autenticación)
  // ============================================================================

  /**
   * Obtiene todos los catálogos necesarios para el formulario de creación.
   * 
   * Retorna:
   * - juegos (con plataformas y modos de juego)
   * - regiones
   * - tipos de torneo
   * - tipos de entrada
   * - opciones de "al mejor de"
   * - formatos disponibles
   * - plataformas de redes sociales
   */
  @Public()
  @ApiOperation({ summary: 'Obtener catálogos para el formulario de torneos' })
  @Get('catalogos')
  obtenerCatalogos() {
    return this.torneoFuncionesService.obtenerCatalogos();
  }

  // ============================================================================
  // LISTAR TORNEOS (Sin autenticación)
  // ============================================================================

  /**
   * Lista torneos con filtros opcionales.
   */
  @Public()
  @ApiOperation({ summary: 'Listar torneos con filtros' })
  @ApiQuery({ name: 'estado', required: false, description: 'Filtrar por estado: proximamente, en_curso, terminado, cancelado' })
  @ApiQuery({ name: 'juego_id', required: false, description: 'Filtrar por juego (UUID)' })
  @ApiQuery({ name: 'region_id', required: false, description: 'Filtrar por región (UUID)' })
  @ApiQuery({ name: 'anfitrion_id', required: false, description: 'Filtrar por anfitrión (UUID)' })
  @ApiQuery({ name: 'busqueda', required: false, description: 'Búsqueda por título' })
  @ApiQuery({ name: 'limit', required: false, description: 'Límite de resultados (default: 20, max: 100)' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset para paginación (default: 0)' })
  @Get()
  listarTorneos(@Query() query: ListarTorneosQueryDto) {
    return this.torneoFuncionesService.listarTorneos(query);
  }

  // ============================================================================
  // MIS TORNEOS (Requiere autenticación) - DEBE IR ANTES DE :id
  // ============================================================================

  /**
   * Lista los torneos donde el usuario es anfitrión.
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar mis torneos (como anfitrión)' })
  @ApiQuery({ name: 'estado', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @Get('mis/torneos')
  misTorneos(@Request() req, @Query() query: ListarTorneosQueryDto) {
    const anfitrionId = req.user.userId;
    return this.torneoFuncionesService.listarTorneos({
      ...query,
      anfitrion_id: anfitrionId,
    });
  }

  // ============================================================================
  // DETALLE DEL TORNEO (Sin autenticación)
  // ============================================================================

  /**
   * Obtiene toda la información detallada de un torneo.
   */
  @Public()
  @ApiOperation({ summary: 'Obtener detalle completo de un torneo' })
  @Get(':id')
  obtenerDetalle(@Param('id') id: string) {
    return this.torneoFuncionesService.obtenerDetalle(id);
  }

  // ============================================================================
  // CREAR TORNEO (Requiere autenticación)
  // ============================================================================

  /**
   * Crea un nuevo torneo.
   * El usuario autenticado será el anfitrión.
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo torneo' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  crearTorneo(@Request() req, @Body() dto: CrearTorneoFuncionDto) {
    const anfitrionId = req.user.userId; // UUID del usuario autenticado (de JwtStrategy)
    return this.torneoFuncionesService.crearTorneo(anfitrionId, dto);
  }

  // ============================================================================
  // ACTUALIZAR TORNEO (Requiere autenticación - solo anfitrión)
  // ============================================================================

  /**
   * Actualiza un torneo existente.
   * Solo el anfitrión puede modificar su torneo.
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un torneo (solo anfitrión)' })
  @Put(':id')
  actualizarTorneo(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: ActualizarTorneoFuncionDto,
  ) {
    const anfitrionId = req.user.userId;
    return this.torneoFuncionesService.actualizarTorneo(id, anfitrionId, dto);
  }

  // ============================================================================
  // CAMBIAR ESTADO (Requiere autenticación - solo anfitrión)
  // ============================================================================

  /**
   * Cambia el estado de un torneo.
   * Estados: proximamente, en_curso, terminado, cancelado
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar estado del torneo (solo anfitrión)' })
  @Put(':id/estado')
  cambiarEstado(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: CambiarEstadoTorneoDto,
  ) {
    const anfitrionId = req.user.userId;
    return this.torneoFuncionesService.cambiarEstado(id, anfitrionId, dto);
  }

  // ============================================================================
  // REDES SOCIALES DEL TORNEO (Requiere autenticación - solo anfitrión)
  // ============================================================================

  /**
   * Crea o actualiza una red social del torneo.
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agregar/actualizar red social del torneo' })
  @Post(':id/redes')
  @HttpCode(HttpStatus.OK)
  upsertRedSocial(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpsertRedSocialTorneoDto,
  ) {
    const anfitrionId = req.user.userId;
    return this.torneoFuncionesService.upsertRedSocial(id, anfitrionId, dto);
  }

  /**
   * Elimina una red social del torneo.
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar red social del torneo' })
  @Delete(':id/redes/:redId')
  @HttpCode(HttpStatus.OK)
  eliminarRedSocial(
    @Request() req,
    @Param('id') id: string,
    @Param('redId') redId: string,
  ) {
    const anfitrionId = req.user.userId;
    return this.torneoFuncionesService.eliminarRedSocial(id, anfitrionId, redId);
  }

  // ============================================================================
  // FINALIZAR TORNEO (Requiere autenticación - solo anfitrión)
  // ============================================================================

  /**
   * Finaliza un torneo, registra resultados, asigna trofeos y distribuye premios.
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Finalizar torneo y distribuir premios' })
  @Post(':id/finalizar')
  @HttpCode(HttpStatus.OK)
  finalizarTorneo(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: FinalizarTorneoDto,
  ) {
    const anfitrionId = req.user.userId;
    return this.torneoFuncionesService.finalizarTorneo(id, anfitrionId, dto);
  }
}
