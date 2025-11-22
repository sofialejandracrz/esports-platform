import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { EquipoMiembroService } from './equipo-miembro.service';
import { CreateEquipoMiembroDto } from './dto/create-equipo-miembro.dto';
import { UpdateEquipoMiembroDto } from './dto/update-equipo-miembro.dto';

@Controller('equipo-miembro')
export class EquipoMiembroController {
  constructor(private readonly equipoMiembroService: EquipoMiembroService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEquipoMiembroDto: CreateEquipoMiembroDto) {
    return this.equipoMiembroService.create(createEquipoMiembroDto);
  }

  @Get()
  findAll() {
    return this.equipoMiembroService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipoMiembroService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEquipoMiembroDto: UpdateEquipoMiembroDto) {
    return this.equipoMiembroService.update(id, updateEquipoMiembroDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.equipoMiembroService.remove(id);
  }
}
