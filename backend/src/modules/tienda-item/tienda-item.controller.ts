import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TiendaItemService } from './tienda-item.service';
import { CreateTiendaItemDto } from './dto/create-tienda-item.dto';
import { UpdateTiendaItemDto } from './dto/update-tienda-item.dto';

@Controller('tienda-item')
export class TiendaItemController {
  constructor(private readonly tiendaItemService: TiendaItemService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTiendaItemDto: CreateTiendaItemDto) {
    return this.tiendaItemService.create(createTiendaItemDto);
  }

  @Get()
  findAll() {
    return this.tiendaItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiendaItemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTiendaItemDto: UpdateTiendaItemDto) {
    return this.tiendaItemService.update(id, updateTiendaItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.tiendaItemService.remove(id);
  }
}
