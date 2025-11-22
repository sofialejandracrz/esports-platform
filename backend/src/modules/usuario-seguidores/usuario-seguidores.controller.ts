import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuarioSeguidoresService } from './usuario-seguidores.service';
import { CreateUsuarioSeguidoreDto } from './dto/create-usuario-seguidore.dto';
import { UpdateUsuarioSeguidoreDto } from './dto/update-usuario-seguidore.dto';

@Controller('usuario-seguidores')
export class UsuarioSeguidoresController {
  constructor(private readonly usuarioSeguidoresService: UsuarioSeguidoresService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUsuarioSeguidoreDto: CreateUsuarioSeguidoreDto) {
    return this.usuarioSeguidoresService.create(createUsuarioSeguidoreDto);
  }

  @Get()
  findAll() {
    return this.usuarioSeguidoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioSeguidoresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioSeguidoreDto: UpdateUsuarioSeguidoreDto) {
    return this.usuarioSeguidoresService.update(id, updateUsuarioSeguidoreDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usuarioSeguidoresService.remove(id);
  }
}
