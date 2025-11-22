import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CatalogoRegionService } from './catalogo-region.service';
import { CreateCatalogoRegionDto } from './dto/create-catalogo-region.dto';
import { UpdateCatalogoRegionDto } from './dto/update-catalogo-region.dto';

@Controller('catalogo-region')
export class CatalogoRegionController {
  constructor(private readonly catalogoRegionService: CatalogoRegionService) {}

  @Post()
  create(@Body() createCatalogoRegionDto: CreateCatalogoRegionDto) {
    return this.catalogoRegionService.create(createCatalogoRegionDto);
  }

  @Get()
  findAll() {
    return this.catalogoRegionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogoRegionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatalogoRegionDto: UpdateCatalogoRegionDto) {
    return this.catalogoRegionService.update(id, updateCatalogoRegionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.catalogoRegionService.remove(id);
  }
}
