import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CatalogoPlataformaService } from './catalogo-plataforma.service';
import { CreateCatalogoPlataformaDto } from './dto/create-catalogo-plataforma.dto';
import { UpdateCatalogoPlataformaDto } from './dto/update-catalogo-plataforma.dto';

@Controller('catalogo-plataforma')
export class CatalogoPlataformaController {
  constructor(private readonly catalogoPlataformaService: CatalogoPlataformaService) {}

  @Post()
  create(@Body() createCatalogoPlataformaDto: CreateCatalogoPlataformaDto) {
    return this.catalogoPlataformaService.create(createCatalogoPlataformaDto);
  }

  @Get()
  findAll() {
    return this.catalogoPlataformaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogoPlataformaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatalogoPlataformaDto: UpdateCatalogoPlataformaDto) {
    return this.catalogoPlataformaService.update(id, updateCatalogoPlataformaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.catalogoPlataformaService.remove(id);
  }
}
