import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TorneoService } from './torneo.service';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';

@Controller('torneo')
export class TorneoController {
  constructor(private readonly torneoService: TorneoService) {}

  @Post()
  create(@Body() createTorneoDto: CreateTorneoDto) {
    return this.torneoService.create(createTorneoDto);
  }

  @Get()
  findAll() {
    return this.torneoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.torneoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTorneoDto: UpdateTorneoDto) {
    return this.torneoService.update(id, updateTorneoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.torneoService.remove(id);
  }
}
