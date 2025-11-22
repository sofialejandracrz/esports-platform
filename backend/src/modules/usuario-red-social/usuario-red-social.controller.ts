import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuarioRedSocialService } from './usuario-red-social.service';
import { CreateUsuarioRedSocialDto } from './dto/create-usuario-red-social.dto';
import { UpdateUsuarioRedSocialDto } from './dto/update-usuario-red-social.dto';

@Controller('usuario-red-social')
export class UsuarioRedSocialController {
  constructor(private readonly usuarioRedSocialService: UsuarioRedSocialService) {}

  @Post()
  create(@Body() createUsuarioRedSocialDto: CreateUsuarioRedSocialDto) {
    return this.usuarioRedSocialService.create(createUsuarioRedSocialDto);
  }

  @Get()
  findAll() {
    return this.usuarioRedSocialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioRedSocialService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioRedSocialDto: UpdateUsuarioRedSocialDto) {
    return this.usuarioRedSocialService.update(id, updateUsuarioRedSocialDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usuarioRedSocialService.remove(id);
  }
}
