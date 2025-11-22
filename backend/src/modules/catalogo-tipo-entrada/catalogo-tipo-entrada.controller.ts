import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CatalogoTipoEntradaService } from './catalogo-tipo-entrada.service';
import { CreateCatalogoTipoEntradaDto } from './dto/create-catalogo-tipo-entrada.dto';
import { UpdateCatalogoTipoEntradaDto } from './dto/update-catalogo-tipo-entrada.dto';

@Controller('catalogo-tipo-entrada')
export class CatalogoTipoEntradaController {
  constructor(private readonly catalogoTipoEntradaService: CatalogoTipoEntradaService) {}

  @Post()
  create(@Body() createCatalogoTipoEntradaDto: CreateCatalogoTipoEntradaDto) {
    return this.catalogoTipoEntradaService.create(createCatalogoTipoEntradaDto);
  }

  @Get()
  findAll() {
    return this.catalogoTipoEntradaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogoTipoEntradaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatalogoTipoEntradaDto: UpdateCatalogoTipoEntradaDto) {
    return this.catalogoTipoEntradaService.update(id, updateCatalogoTipoEntradaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.catalogoTipoEntradaService.remove(id);
  }
}
