import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsuarioAmigosService } from './usuario-amigos.service';
import { CreateUsuarioAmigoDto } from './dto/create-usuario-amigo.dto';
import { UpdateUsuarioAmigoDto } from './dto/update-usuario-amigo.dto';

@Controller('usuario-amigos')
export class UsuarioAmigosController {
  constructor(private readonly usuarioAmigosService: UsuarioAmigosService) {}

  /**
   * POST /usuario-amigos/solicitud/:destinatarioId
   * Enviar solicitud de amistad a un usuario
   */
  @Post('solicitud/:destinatarioId')
  @HttpCode(HttpStatus.CREATED)
  enviarSolicitud(
    @Param('destinatarioId') destinatarioId: string,
    @Req() req: Request,
  ) {
    const solicitanteId = (req as any).user?.userId;
    return this.usuarioAmigosService.enviarSolicitud(solicitanteId, destinatarioId);
  }

  /**
   * PATCH /usuario-amigos/aceptar/:solicitudId
   * Aceptar una solicitud de amistad recibida
   */
  @Patch('aceptar/:solicitudId')
  @HttpCode(HttpStatus.OK)
  aceptarSolicitud(
    @Param('solicitudId') solicitudId: string,
    @Req() req: Request,
  ) {
    const usuarioId = (req as any).user?.userId;
    return this.usuarioAmigosService.aceptarSolicitud(solicitudId, usuarioId);
  }

  /**
   * DELETE /usuario-amigos/rechazar/:solicitudId
   * Rechazar una solicitud de amistad recibida
   */
  @Delete('rechazar/:solicitudId')
  @HttpCode(HttpStatus.NO_CONTENT)
  rechazarSolicitud(
    @Param('solicitudId') solicitudId: string,
    @Req() req: Request,
  ) {
    const usuarioId = (req as any).user?.userId;
    return this.usuarioAmigosService.rechazarSolicitud(solicitudId, usuarioId);
  }

  /**
   * DELETE /usuario-amigos/cancelar/:solicitudId
   * Cancelar una solicitud de amistad que yo envié
   */
  @Delete('cancelar/:solicitudId')
  @HttpCode(HttpStatus.NO_CONTENT)
  cancelarSolicitud(
    @Param('solicitudId') solicitudId: string,
    @Req() req: Request,
  ) {
    const usuarioId = (req as any).user?.userId;
    return this.usuarioAmigosService.cancelarSolicitud(solicitudId, usuarioId);
  }

  /**
   * DELETE /usuario-amigos/eliminar/:amistadId
   * Eliminar un amigo (romper amistad)
   */
  @Delete('eliminar/:amistadId')
  @HttpCode(HttpStatus.NO_CONTENT)
  eliminarAmigo(
    @Param('amistadId') amistadId: string,
    @Req() req: Request,
  ) {
    const usuarioId = (req as any).user?.userId;
    return this.usuarioAmigosService.eliminarAmigo(amistadId, usuarioId);
  }

  /**
   * GET /usuario-amigos/solicitudes/recibidas
   * Obtener mis solicitudes de amistad pendientes recibidas
   */
  @Get('solicitudes/recibidas')
  obtenerSolicitudesRecibidas(@Req() req: Request) {
    const usuarioId = (req as any).user?.userId;
    return this.usuarioAmigosService.obtenerSolicitudesRecibidas(usuarioId);
  }

  /**
   * GET /usuario-amigos/solicitudes/enviadas
   * Obtener mis solicitudes de amistad pendientes enviadas
   */
  @Get('solicitudes/enviadas')
  obtenerSolicitudesEnviadas(@Req() req: Request) {
    const usuarioId = (req as any).user?.userId;
    return this.usuarioAmigosService.obtenerSolicitudesEnviadas(usuarioId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUsuarioAmigoDto: CreateUsuarioAmigoDto) {
    return this.usuarioAmigosService.create(createUsuarioAmigoDto);
  }

  @Get()
  findAll() {
    return this.usuarioAmigosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioAmigosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioAmigoDto: UpdateUsuarioAmigoDto) {
    return this.usuarioAmigosService.update(id, updateUsuarioAmigoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usuarioAmigosService.remove(id);
  }
}
