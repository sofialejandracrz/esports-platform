import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuarioCuentaJuegoService } from './usuario-cuenta-juego.service';
import { CreateUsuarioCuentaJuegoDto } from './dto/create-usuario-cuenta-juego.dto';
import { UpdateUsuarioCuentaJuegoDto } from './dto/update-usuario-cuenta-juego.dto';

@Controller('usuario-cuenta-juego')
export class UsuarioCuentaJuegoController {
  constructor(private readonly usuarioCuentaJuegoService: UsuarioCuentaJuegoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUsuarioCuentaJuegoDto: CreateUsuarioCuentaJuegoDto) {
    return this.usuarioCuentaJuegoService.create(createUsuarioCuentaJuegoDto);
  }

  @Get()
  findAll() {
    return this.usuarioCuentaJuegoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioCuentaJuegoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioCuentaJuegoDto: UpdateUsuarioCuentaJuegoDto) {
    return this.usuarioCuentaJuegoService.update(id, updateUsuarioCuentaJuegoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usuarioCuentaJuegoService.remove(id);
  }
}
