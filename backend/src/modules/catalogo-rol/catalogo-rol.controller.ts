import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CatalogoRolService } from './catalogo-rol.service';
import { CreateCatalogoRolDto } from './dto/create-catalogo-rol.dto';
import { UpdateCatalogoRolDto } from './dto/update-catalogo-rol.dto';

@Controller('catalogo-rol')
export class CatalogoRolController {
  constructor(private readonly catalogoRolService: CatalogoRolService) {}

  @Post()
  create(@Body() createCatalogoRolDto: CreateCatalogoRolDto) {
    return this.catalogoRolService.create(createCatalogoRolDto);
  }

  @Get()
  findAll() {
    return this.catalogoRolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogoRolService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatalogoRolDto: UpdateCatalogoRolDto) {
    return this.catalogoRolService.update(id, updateCatalogoRolDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.catalogoRolService.remove(id);
  }
}
