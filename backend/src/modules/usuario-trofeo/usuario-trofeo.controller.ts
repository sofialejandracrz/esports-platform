import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuarioTrofeoService } from './usuario-trofeo.service';
import { CreateUsuarioTrofeoDto } from './dto/create-usuario-trofeo.dto';
import { UpdateUsuarioTrofeoDto } from './dto/update-usuario-trofeo.dto';

@Controller('usuario-trofeo')
export class UsuarioTrofeoController {
  constructor(private readonly usuarioTrofeoService: UsuarioTrofeoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUsuarioTrofeoDto: CreateUsuarioTrofeoDto) {
    return this.usuarioTrofeoService.create(createUsuarioTrofeoDto);
  }

  @Get()
  findAll() {
    return this.usuarioTrofeoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioTrofeoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioTrofeoDto: UpdateUsuarioTrofeoDto) {
    return this.usuarioTrofeoService.update(id, updateUsuarioTrofeoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usuarioTrofeoService.remove(id);
  }
}
