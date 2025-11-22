import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TorneoInscripcionService } from './torneo-inscripcion.service';
import { CreateTorneoInscripcionDto } from './dto/create-torneo-inscripcion.dto';
import { UpdateTorneoInscripcionDto } from './dto/update-torneo-inscripcion.dto';

@Controller('torneo-inscripcion')
export class TorneoInscripcionController {
  constructor(private readonly torneoInscripcionService: TorneoInscripcionService) {}

  @Post()
  create(@Body() createTorneoInscripcionDto: CreateTorneoInscripcionDto) {
    return this.torneoInscripcionService.create(createTorneoInscripcionDto);
  }

  @Get()
  findAll() {
    return this.torneoInscripcionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.torneoInscripcionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTorneoInscripcionDto: UpdateTorneoInscripcionDto) {
    return this.torneoInscripcionService.update(id, updateTorneoInscripcionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.torneoInscripcionService.remove(id);
  }
}
