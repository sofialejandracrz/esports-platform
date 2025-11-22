import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CatalogoGeneroService } from './catalogo-genero.service';
import { CreateCatalogoGeneroDto } from './dto/create-catalogo-genero.dto';
import { UpdateCatalogoGeneroDto } from './dto/update-catalogo-genero.dto';

@Controller('catalogo-genero')
export class CatalogoGeneroController {
  constructor(private readonly catalogoGeneroService: CatalogoGeneroService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCatalogoGeneroDto: CreateCatalogoGeneroDto) {
    return this.catalogoGeneroService.create(createCatalogoGeneroDto);
  }

  @Get()
  findAll() {
    return this.catalogoGeneroService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogoGeneroService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatalogoGeneroDto: UpdateCatalogoGeneroDto) {
    return this.catalogoGeneroService.update(id, updateCatalogoGeneroDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.catalogoGeneroService.remove(id);
  }
}
