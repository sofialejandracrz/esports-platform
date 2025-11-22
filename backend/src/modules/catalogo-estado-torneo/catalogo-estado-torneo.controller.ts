import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CatalogoEstadoTorneoService } from './catalogo-estado-torneo.service';
import { CreateCatalogoEstadoTorneoDto } from './dto/create-catalogo-estado-torneo.dto';
import { UpdateCatalogoEstadoTorneoDto } from './dto/update-catalogo-estado-torneo.dto';

@Controller('catalogo-estado-torneo')
export class CatalogoEstadoTorneoController {
  constructor(private readonly catalogoEstadoTorneoService: CatalogoEstadoTorneoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCatalogoEstadoTorneoDto: CreateCatalogoEstadoTorneoDto) {
    return this.catalogoEstadoTorneoService.create(createCatalogoEstadoTorneoDto);
  }

  @Get()
  findAll() {
    return this.catalogoEstadoTorneoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogoEstadoTorneoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatalogoEstadoTorneoDto: UpdateCatalogoEstadoTorneoDto) {
    return this.catalogoEstadoTorneoService.update(id, updateCatalogoEstadoTorneoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.catalogoEstadoTorneoService.remove(id);
  }
}
