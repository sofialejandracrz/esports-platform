import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuarioEstadisticaJuegoService } from './usuario-estadistica-juego.service';
import { CreateUsuarioEstadisticaJuegoDto } from './dto/create-usuario-estadistica-juego.dto';
import { UpdateUsuarioEstadisticaJuegoDto } from './dto/update-usuario-estadistica-juego.dto';

@Controller('usuario-estadistica-juego')
export class UsuarioEstadisticaJuegoController {
  constructor(private readonly usuarioEstadisticaJuegoService: UsuarioEstadisticaJuegoService) {}

  @Post()
  create(@Body() createUsuarioEstadisticaJuegoDto: CreateUsuarioEstadisticaJuegoDto) {
    return this.usuarioEstadisticaJuegoService.create(createUsuarioEstadisticaJuegoDto);
  }

  @Get()
  findAll() {
    return this.usuarioEstadisticaJuegoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioEstadisticaJuegoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioEstadisticaJuegoDto: UpdateUsuarioEstadisticaJuegoDto) {
    return this.usuarioEstadisticaJuegoService.update(id, updateUsuarioEstadisticaJuegoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usuarioEstadisticaJuegoService.remove(id);
  }
}
