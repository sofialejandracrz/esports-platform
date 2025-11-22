import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TorneoResultadoService } from './torneo-resultado.service';
import { CreateTorneoResultadoDto } from './dto/create-torneo-resultado.dto';
import { UpdateTorneoResultadoDto } from './dto/update-torneo-resultado.dto';

@Controller('torneo-resultado')
export class TorneoResultadoController {
  constructor(private readonly torneoResultadoService: TorneoResultadoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTorneoResultadoDto: CreateTorneoResultadoDto) {
    return this.torneoResultadoService.create(createTorneoResultadoDto);
  }

  @Get()
  findAll() {
    return this.torneoResultadoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.torneoResultadoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTorneoResultadoDto: UpdateTorneoResultadoDto) {
    return this.torneoResultadoService.update(id, updateTorneoResultadoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.torneoResultadoService.remove(id);
  }
}
