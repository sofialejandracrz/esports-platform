import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuarioMembresiaService } from './usuario-membresia.service';
import { CreateUsuarioMembresiaDto } from './dto/create-usuario-membresia.dto';
import { UpdateUsuarioMembresiaDto } from './dto/update-usuario-membresia.dto';

@Controller('usuario-membresia')
export class UsuarioMembresiaController {
  constructor(private readonly usuarioMembresiaService: UsuarioMembresiaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUsuarioMembresiaDto: CreateUsuarioMembresiaDto) {
    return this.usuarioMembresiaService.create(createUsuarioMembresiaDto);
  }

  @Get()
  findAll() {
    return this.usuarioMembresiaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioMembresiaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioMembresiaDto: UpdateUsuarioMembresiaDto) {
    return this.usuarioMembresiaService.update(id, updateUsuarioMembresiaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usuarioMembresiaService.remove(id);
  }
}
