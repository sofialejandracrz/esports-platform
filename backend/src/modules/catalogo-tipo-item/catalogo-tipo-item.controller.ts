import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CatalogoTipoItemService } from './catalogo-tipo-item.service';
import { CreateCatalogoTipoItemDto } from './dto/create-catalogo-tipo-item.dto';
import { UpdateCatalogoTipoItemDto } from './dto/update-catalogo-tipo-item.dto';

@Controller('catalogo-tipo-item')
export class CatalogoTipoItemController {
  constructor(private readonly catalogoTipoItemService: CatalogoTipoItemService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCatalogoTipoItemDto: CreateCatalogoTipoItemDto) {
    return this.catalogoTipoItemService.create(createCatalogoTipoItemDto);
  }

  @Get()
  findAll() {
    return this.catalogoTipoItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogoTipoItemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatalogoTipoItemDto: UpdateCatalogoTipoItemDto) {
    return this.catalogoTipoItemService.update(id, updateCatalogoTipoItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.catalogoTipoItemService.remove(id);
  }
}
