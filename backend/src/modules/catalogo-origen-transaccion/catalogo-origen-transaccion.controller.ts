import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CatalogoOrigenTransaccionService } from './catalogo-origen-transaccion.service';
import { CreateCatalogoOrigenTransaccionDto } from './dto/create-catalogo-origen-transaccion.dto';
import { UpdateCatalogoOrigenTransaccionDto } from './dto/update-catalogo-origen-transaccion.dto';

@Controller('catalogo-origen-transaccion')
export class CatalogoOrigenTransaccionController {
  constructor(private readonly catalogoOrigenTransaccionService: CatalogoOrigenTransaccionService) {}

  @Post()
  create(@Body() createCatalogoOrigenTransaccionDto: CreateCatalogoOrigenTransaccionDto) {
    return this.catalogoOrigenTransaccionService.create(createCatalogoOrigenTransaccionDto);
  }

  @Get()
  findAll() {
    return this.catalogoOrigenTransaccionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogoOrigenTransaccionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatalogoOrigenTransaccionDto: UpdateCatalogoOrigenTransaccionDto) {
    return this.catalogoOrigenTransaccionService.update(id, updateCatalogoOrigenTransaccionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.catalogoOrigenTransaccionService.remove(id);
  }
}
