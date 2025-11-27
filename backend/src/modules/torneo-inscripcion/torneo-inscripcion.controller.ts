import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  HttpCode, 
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TorneoInscripcionService } from './torneo-inscripcion.service';
import { CreateTorneoInscripcionDto } from './dto/create-torneo-inscripcion.dto';
import { UpdateTorneoInscripcionDto } from './dto/update-torneo-inscripcion.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('inscripciones')
@Controller('torneo-inscripcion')
export class TorneoInscripcionController {
  constructor(private readonly torneoInscripcionService: TorneoInscripcionService) {}

  // ============================================================================
  // RUTAS ESPECÍFICAS DE TORNEO (DEBEN IR PRIMERO para evitar conflicto con :id)
  // ============================================================================

  /**
   * Inscribe al usuario autenticado a un torneo (formato 1v1).
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Inscribirse a un torneo (1v1)' })
  @Post('torneo/:torneoId/inscribir')
  @HttpCode(HttpStatus.CREATED)
  inscribirse(@Request() req, @Param('torneoId') torneoId: string) {
    const usuarioId = req.user.userId;
    return this.torneoInscripcionService.inscribirUsuario(torneoId, usuarioId);
  }

  /**
   * Inscribe al usuario autenticado con un equipo a un torneo.
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Inscribirse a un torneo con equipo (2v2+)' })
  @Post('torneo/:torneoId/inscribir-equipo/:equipoId')
  @HttpCode(HttpStatus.CREATED)
  inscribirseConEquipo(
    @Request() req,
    @Param('torneoId') torneoId: string,
    @Param('equipoId') equipoId: string,
  ) {
    const usuarioId = req.user.userId;
    return this.torneoInscripcionService.inscribirUsuarioConEquipo(torneoId, usuarioId, equipoId);
  }

  /**
   * Verifica si el usuario está inscrito en un torneo.
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar inscripción en un torneo' })
  @Get('torneo/:torneoId/mi-inscripcion')
  verificarInscripcion(@Request() req, @Param('torneoId') torneoId: string) {
    const usuarioId = req.user.userId;
    return this.torneoInscripcionService.verificarInscripcion(torneoId, usuarioId);
  }

  /**
   * Cancela la inscripción del usuario en un torneo.
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar inscripción en un torneo' })
  @Delete('torneo/:torneoId/cancelar')
  @HttpCode(HttpStatus.OK)
  cancelarInscripcion(@Request() req, @Param('torneoId') torneoId: string) {
    const usuarioId = req.user.userId;
    return this.torneoInscripcionService.cancelarInscripcion(torneoId, usuarioId);
  }

  /**
   * Obtiene todos los inscritos de un torneo.
   */
  @Public()
  @ApiOperation({ summary: 'Listar inscritos de un torneo' })
  @Get('torneo/:torneoId/inscritos')
  obtenerInscritosTorneo(@Param('torneoId') torneoId: string) {
    return this.torneoInscripcionService.obtenerInscritosTorneo(torneoId);
  }

  // ============================================================================
  // CRUD BÁSICO (Las rutas con :id deben ir AL FINAL)
  // ============================================================================

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear inscripción manualmente' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTorneoInscripcionDto: CreateTorneoInscripcionDto) {
    return this.torneoInscripcionService.create(createTorneoInscripcionDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas las inscripciones' })
  @Get()
  findAll() {
    return this.torneoInscripcionService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener una inscripción por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.torneoInscripcionService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar inscripción' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTorneoInscripcionDto: UpdateTorneoInscripcionDto) {
    return this.torneoInscripcionService.update(id, updateTorneoInscripcionDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar inscripción' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.torneoInscripcionService.remove(id);
  }
}
