import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuarioLogroService } from './usuario-logro.service';
import { CreateUsuarioLogroDto } from './dto/create-usuario-logro.dto';
import { UpdateUsuarioLogroDto } from './dto/update-usuario-logro.dto';

@Controller('usuario-logro')
export class UsuarioLogroController {
  constructor(private readonly usuarioLogroService: UsuarioLogroService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUsuarioLogroDto: CreateUsuarioLogroDto) {
    return this.usuarioLogroService.create(createUsuarioLogroDto);
  }

  @Get()
  findAll() {
    return this.usuarioLogroService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioLogroService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioLogroDto: UpdateUsuarioLogroDto) {
    return this.usuarioLogroService.update(id, updateUsuarioLogroDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usuarioLogroService.remove(id);
  }
}
