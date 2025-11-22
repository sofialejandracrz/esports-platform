import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CatalogoTransaccionTipoService } from './catalogo-transaccion-tipo.service';
import { CreateCatalogoTransaccionTipoDto } from './dto/create-catalogo-transaccion-tipo.dto';
import { UpdateCatalogoTransaccionTipoDto } from './dto/update-catalogo-transaccion-tipo.dto';

@Controller('catalogo-transaccion-tipo')
export class CatalogoTransaccionTipoController {
  constructor(private readonly catalogoTransaccionTipoService: CatalogoTransaccionTipoService) {}

  @Post()
  create(@Body() createCatalogoTransaccionTipoDto: CreateCatalogoTransaccionTipoDto) {
    return this.catalogoTransaccionTipoService.create(createCatalogoTransaccionTipoDto);
  }

  @Get()
  findAll() {
    return this.catalogoTransaccionTipoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogoTransaccionTipoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatalogoTransaccionTipoDto: UpdateCatalogoTransaccionTipoDto) {
    return this.catalogoTransaccionTipoService.update(id, updateCatalogoTransaccionTipoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.catalogoTransaccionTipoService.remove(id);
  }
}
