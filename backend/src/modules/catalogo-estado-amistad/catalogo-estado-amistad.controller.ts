import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CatalogoEstadoAmistadService } from './catalogo-estado-amistad.service';
import { CreateCatalogoEstadoAmistadDto } from './dto/create-catalogo-estado-amistad.dto';
import { UpdateCatalogoEstadoAmistadDto } from './dto/update-catalogo-estado-amistad.dto';

@Controller('catalogo-estado-amistad')
export class CatalogoEstadoAmistadController {
  constructor(private readonly catalogoEstadoAmistadService: CatalogoEstadoAmistadService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCatalogoEstadoAmistadDto: CreateCatalogoEstadoAmistadDto) {
    return this.catalogoEstadoAmistadService.create(createCatalogoEstadoAmistadDto);
  }

  @Get()
  findAll() {
    return this.catalogoEstadoAmistadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogoEstadoAmistadService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatalogoEstadoAmistadDto: UpdateCatalogoEstadoAmistadDto) {
    return this.catalogoEstadoAmistadService.update(id, updateCatalogoEstadoAmistadDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.catalogoEstadoAmistadService.remove(id);
  }
}
