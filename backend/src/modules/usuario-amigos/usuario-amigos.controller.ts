import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuarioAmigosService } from './usuario-amigos.service';
import { CreateUsuarioAmigoDto } from './dto/create-usuario-amigo.dto';
import { UpdateUsuarioAmigoDto } from './dto/update-usuario-amigo.dto';

@Controller('usuario-amigos')
export class UsuarioAmigosController {
  constructor(private readonly usuarioAmigosService: UsuarioAmigosService) {}

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
