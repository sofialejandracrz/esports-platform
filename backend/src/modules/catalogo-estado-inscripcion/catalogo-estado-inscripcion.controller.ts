import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CatalogoEstadoInscripcionService } from './catalogo-estado-inscripcion.service';
import { CreateCatalogoEstadoInscripcionDto } from './dto/create-catalogo-estado-inscripcion.dto';
import { UpdateCatalogoEstadoInscripcionDto } from './dto/update-catalogo-estado-inscripcion.dto';

@Controller('catalogo-estado-inscripcion')
export class CatalogoEstadoInscripcionController {
  constructor(private readonly catalogoEstadoInscripcionService: CatalogoEstadoInscripcionService) {}

  @Post()
  create(@Body() createCatalogoEstadoInscripcionDto: CreateCatalogoEstadoInscripcionDto) {
    return this.catalogoEstadoInscripcionService.create(createCatalogoEstadoInscripcionDto);
  }

  @Get()
  findAll() {
    return this.catalogoEstadoInscripcionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogoEstadoInscripcionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatalogoEstadoInscripcionDto: UpdateCatalogoEstadoInscripcionDto) {
    return this.catalogoEstadoInscripcionService.update(id, updateCatalogoEstadoInscripcionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.catalogoEstadoInscripcionService.remove(id);
  }
}
